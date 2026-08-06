import { getRedis } from '../config/redis.js'

const cache = (key, ttl = 300) => {
  return async (req, res, next) => {
    try {
      const redisClient = getRedis()
      if (!redisClient) return next()

      const cachedData = await redisClient.get(key)
      if (cachedData) {
        return res.json(JSON.parse(cachedData))
      }
      res.locals.cacheKey = key
      res.locals.cacheTTL = ttl
      next()
    } catch {
      next()
    }
  }
}

const setCache = async (key, data, ttl = 300) => {
  try {
    const redisClient = getRedis()
    if (!redisClient) return
    await redisClient.setEx(key, ttl, JSON.stringify(data))
  } catch (error) {
    console.error('Cache set error:', error.message)
  }
}

const clearCache = async (pattern) => {
  try {
    const redisClient = getRedis()
    if (!redisClient) return
    const keys = await redisClient.keys(pattern)
    if (keys.length > 0) {
      await redisClient.del(keys)
    }
  } catch (error) {
    console.error('Cache clear error:', error.message)
  }
}

const cacheResponse = (req, res, next) => {
  if (res.locals.cacheKey && res.locals.cacheTTL) {
    setCache(res.locals.cacheKey, res.locals.cachedData, res.locals.cacheTTL)
  }
  next()
}

export { cache, setCache, clearCache, cacheResponse }
