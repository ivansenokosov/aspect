const WebSocket = require('ws');
const redis = require('redis');

// Configuration: adapt to your environment
const REDIS_SERVER = "redis://localhost:6379";

// Connect to Redis and subscribe to "app:notifications" channel
var redisClient = redis.createClient(REDIS_SERVER);
redisClient.set('key2','qqq');
