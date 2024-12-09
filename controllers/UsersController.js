const sha1 = require('sha1');
const dbClient = require('../utils/db');

exports.postNew = async (req, res) => {
    const { email, password } = req.body;
    if (!email) return res.status(400).json({ error: 'Missing email' });
    if (!password) return res.status(400).json({ error: 'Missing password' });

    const userExists = await dbClient.db.collection('users').findOne({ email });
    if (userExists) return res.status(400).json({ error: 'Already exist' });

    const hashedPassword = sha1(password);
    const user = await dbClient.db.collection('users').insertOne({ email, password: hashedPassword });
    res.status(201).json({ id: user.insertedId, email });
};
