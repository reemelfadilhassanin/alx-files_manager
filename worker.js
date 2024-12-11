const Bull = require('bull');
const imageThumbnail = require('image-thumbnail');
const fs = require('fs');
const path = require('path');

// Define the queue for file thumbnail processing
const fileQueue = new Bull('fileQueue');

// Process each job in the queue
fileQueue.process(async (job) => {
  const { userId, fileId } = job.data;

  if (!fileId || !userId) {
    throw new Error('Missing fileId or userId');
  }

  const file = getFileFromDB(fileId, userId);  // Fetch file from DB

  if (!file) {
    throw new Error('File not found');
  }

  if (file.type !== 'image') {
    throw new Error('File is not an image');
  }

  const filePath = path.join(__dirname, '/tmp/files_manager/', file.id);  // File location on server

  try {
    // Generate thumbnails with different sizes
    const sizes = [500, 250, 100];
    for (const size of sizes) {
      const thumbnail = await imageThumbnail(filePath, { width: size });
      const thumbnailPath = path.join(__dirname, '/tmp/files_manager/', `${file.id}_${size}`);
      fs.writeFileSync(thumbnailPath, thumbnail);
    }
  } catch (err) {
    throw new Error(`Error generating thumbnail: ${err.message}`);
  }
});

console.log('Worker started...');
