// utils/redis.js
import redis from 'redis';

class RedisClient {
  constructor() {
    // Create a new Redis client and handle connection errors
    this.client = redis.createClient();
    this.client.on('error', (err) => {
      console.error('Redis error: ', err);
    });
  }

  // Check if Redis connection is alive
  isAlive() {
    return this.client.connected;
  }

  // Get a value from Redis by key
  async get(key) {
    return new Promise((resolve, reject) => {
      this.client.get(key, (err, reply) => {
        if (err) {
          reject(err);
        } else {
          resolve(reply);
        }
      });
    });
  }

  // Set a value in Redis with an expiration time (in seconds)
  async set(key, value, duration) {
    return new Promise((resolve, reject) => {
      this.client.setex(key, duration, value, (err, reply) => {
        if (err) {
          reject(err);
        } else {
          resolve(reply);
        }
      });
    });
  }

  // Delete a value from Redis by key
  async del(key) {
    return new Promise((resolve, reject) => {
      this.client.del(key, (err, reply) => {
        if (err) {
          reject(err);
        } else {
          resolve(reply);
        }
      });
    });
  }
}

// Create and export an instance of RedisClient
const redisClient = new RedisClient();
export default redisClient;
