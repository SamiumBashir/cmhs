import { StatusCodes } from 'http-status-codes'
import { getRedis } from '../config/redis.js'
import { clearCache } from '../middleware/cache.js'
import { auditLogService } from '../services/auditLogService.js'

const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

const createController = (service, options = {}) => {
  const { populate = [], sort = { createdAt: -1 }, postCreate, postUpdate, cacheKey, resourceName } = options

  const getResourceName = () => resourceName || service.model?.modelName || 'Resource'
  const getCacheName = () => cacheKey || getResourceName().toLowerCase()

  const getAll = asyncHandler(async (req, res) => {
    const { page = 1, limit = 20, ...filters } = req.query
    const cKey = `${getCacheName()}:${req.originalUrl}`

    const redisClient = getRedis()
    if (redisClient) {
      try {
        const cachedData = await redisClient.get(cKey)
        if (cachedData) {
          return res.json(JSON.parse(cachedData))
        }
      } catch (err) {
        // Cache read fallback
      }
    }

    const result = await service.getAllWithPagination(filters, populate, sort, page, limit)
    const payload = { success: true, data: result.data, pagination: result.pagination }

    if (redisClient) {
      try {
        await redisClient.setEx(cKey, 300, JSON.stringify(payload))
      } catch (err) {
        // Cache write fallback
      }
    }

    res.json(payload)
  })

  const getOne = asyncHandler(async (req, res) => {
    const entity = await service.getById(req.params.id, populate)
    if (!entity) {
      return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'Not found' })
    }
    res.json({ success: true, data: entity })
  })

  const create = asyncHandler(async (req, res) => {
    let entity = await service.create(req.body)
    if (postCreate) entity = await postCreate(entity, req)
    if (populate.length) entity = await service.getById(entity._id, populate)

    // Clear Redis Cache
    await clearCache(`${getCacheName()}:*`)

    // Audit Log
    if (req.user) {
      await auditLogService.logAction({
        user: req.user,
        action: 'CREATE',
        resource: getResourceName(),
        recordId: entity._id,
        details: { body: req.body },
        req
      })
    }

    res.status(StatusCodes.CREATED).json({ success: true, data: entity })
  })

  const update = asyncHandler(async (req, res) => {
    let entity = await service.update(req.params.id, req.body)
    if (!entity) {
      return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'Not found' })
    }
    if (postUpdate) entity = await postUpdate(entity, req)
    if (populate.length) entity = await service.getById(entity._id, populate)

    // Clear Redis Cache
    await clearCache(`${getCacheName()}:*`)

    // Audit Log
    if (req.user) {
      await auditLogService.logAction({
        user: req.user,
        action: 'UPDATE',
        resource: getResourceName(),
        recordId: req.params.id,
        details: { body: req.body },
        req
      })
    }

    res.json({ success: true, data: entity })
  })

  const remove = asyncHandler(async (req, res) => {
    const entity = await service.remove(req.params.id)
    if (!entity) {
      return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'Not found' })
    }

    // Clear Redis Cache
    await clearCache(`${getCacheName()}:*`)

    // Audit Log
    if (req.user) {
      await auditLogService.logAction({
        user: req.user,
        action: 'DELETE',
        resource: getResourceName(),
        recordId: req.params.id,
        details: { deletedRecord: entity },
        req
      })
    }

    res.json({ success: true, message: 'Deleted successfully' })
  })

  return { getAll, getOne, create, update, remove }
}

export { asyncHandler, createController }
