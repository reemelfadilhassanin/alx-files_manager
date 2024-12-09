// eslint-disable-next-line linebreak-style
import redisClient from './utils/redis';

(async () => {
    // eslint-disable-next-line indent
console.log(redisClient.isAlive());  // Check if Redis is connected
  console.log(await redisClient.get('myKey'));  // Should return null initially (no value for 'myKey')

  await redisClient.set('myKey', 12, 5);  // Set 'myKey' with value 12 and expiration of 5 seconds
    console.log(await redisClient.get('myKey'));  // Should return 12

    setTimeout(async () => {
        console.log(await redisClient.get('myKey'));  // After 10 seconds, should return null (expired)
    }, 1000 * 10);
})();
