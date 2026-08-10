import { createClient } from 'redis'

let redisClient = null

const connectRedis = async () => {
  const rawUrl = process.env.REDIS_URL || process.env.REDIS_PRIVATE_URL || process.env.REDISURL || ''
  const url = String(rawUrl).replace(/^["']|["']$/g, '').trim()

  if (!url && process.env.NODE_ENV === 'production') {
    console.log('ℹ️ No REDIS_URL provided in production. Redis caching is skipped.')
    return null
  }

  const finalUrl = url || 'redis://127.0.0.1:6379'

  try {
    redisClient = createClient({
      url: finalUrl,
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 3) {
            console.warn('⚠️ Redis connection retries exceeded. Disabling Redis client.')
            return new Error('Redis connection failed')
          }
          return Math.min(retries * 500, 2000)
        }
      }
    })

    redisClient.on('error', (err) => {
      if (err.code === 'ECONNREFUSED') {
        console.warn('⚠️ Cannot connect to Redis server:', finalUrl)
      } else {
        console.error('Redis Client Error:', err.message)
      }
    })

    redisClient.on('connect', () => console.log('✅ Redis Connected'))

    await redisClient.connect()
    return redisClient
  } catch (error) {
    console.warn('⚠️ Redis connection skipped:', error.message)
    if (redisClient) {
      try { await redisClient.disconnect() } catch (e) {}
    }
    redisClient = null
    return null
  }
}

const getRedis = () => (redisClient && redisClient.isOpen ? redisClient : null)

export { connectRedis, getRedis }