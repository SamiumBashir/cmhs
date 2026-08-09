import { createClient } from 'redis'

let redisClient = null

const connectRedis = async () => {
  try {
    redisClient = createClient({
      url: process.env.REDIS_URL || process.env.REDIS_PRIVATE_URL || process.env.REDISURL || 'redis://127.0.0.1:6379'
    })

    redisClient.on('error', (err) => console.error('Redis Client Error:', err))
    redisClient.on('connect', () => console.log('Redis Connected'))

    await redisClient.connect()
    return redisClient
  } catch (error) {
    console.error('Redis connection failed:', error.message)
    return null
  }
}

const getRedis = () => redisClient

export { connectRedis, getRedis }