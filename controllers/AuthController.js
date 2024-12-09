const sha1 = require('sha1');
const uuid = require('uuid');
const redisClient = require('../utils/redis');
const dbClient = require('../utils/db');

exports.getConnect = async (req, res) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });

    const [email, password] = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    const hashedPassword = sha1(password);
    const user = await dbClient.db.collection('users').findOne({ email, password: hashedPassword });

    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const token = uuid.v4();
    await redisClient.set(`auth_${token}`, user._id.toString(), 86400); // 24 hours
    res.status(200).json({ token });
};

exports.getDisconnect = async (req, res) => {
    const token = req.headers['x-token'];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    await redisClient.del(`auth_${token}`);
    res.status(204).send();
};
