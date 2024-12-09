import redis from 'redis';

class RedisClient {
  constructor() {
    this.client = redis.createClient();
    this.client.on('error', (err) => {
      console.log('Redis error: ', err);
    });
  }

  isAlive() {
    return this.client.connected;
  }

  async get(key) {
    return new Promise((resolve, reject) => {
      this.client.get(key, (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  }

  async set(key, value, duration) {
    return new Promise((resolve, reject) => {
      this.client.setex(key, duration, value, (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  }

  async del(key) {
    return new Promise((resolve, reject) => {
      this.client.del(key, (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  }
}

// Export an instance of RedisClient
const redisClient = new RedisClient();
export default redisClient;
