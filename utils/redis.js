// utils/redis.js
const redis = require('redis');

class RedisClient {
  constructor() {
    // Create Redis client and connect to the default Redis server (localhost:6379)
    this.client = redis.createClient();

    // Log any error that occurs during the connection
    this.client.on('error', (err) => {
      console.error('Redis Client Error:', err);
    });
  }

  // Checks if the Redis client is alive
  isAlive() {
    return this.client.connected;
  }

  // Asynchronous function to get a value for a given key
  async get(key) {
    return new Promise((resolve, reject) => {
      this.client.get(key, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  // Asynchronous function to set a key-value pair with an expiration time
  async set(key, value, duration) {
    return new Promise((resolve, reject) => {
      this.client.setex(key, duration, value, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  // Asynchronous function to delete a key
  async del(key) {
    return new Promise((resolve, reject) => {
      this.client.del(key, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
}

// Create and export a single instance of RedisClient
const redisClient = new RedisClient();
module.exports = redisClient;
