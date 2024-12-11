const redisClient = require('../path/to/redisClient'); // Adjust path as needed
const { Redis } = require('ioredis'); // Or whichever Redis client you're using

jest.mock('ioredis'); // Mock Redis module

describe('redisClient', () => {
  let redis;

  beforeEach(() => {
    redis = new Redis();
    redisClient.setClient(redis);
  });

  it('should connect to Redis successfully', async () => {
    const connectSpy = jest.spyOn(redis, 'connect');
    await redisClient.connect();
    expect(connectSpy).toHaveBeenCalled();
  });

  it('should get data from Redis', async () => {
    const mockGet = jest.spyOn(redis, 'get').mockResolvedValue('value');
    const value = await redisClient.get('key');
    expect(value).toBe('value');
  });

  it('should handle errors when Redis is unavailable', async () => {
    jest.spyOn(redis, 'get').mockRejectedValue(new Error('Redis error'));
    await expect(redisClient.get('key')).rejects.toThrow('Redis error');
  });
});
