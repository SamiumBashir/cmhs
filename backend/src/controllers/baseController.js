import { StatusCodes } from 'http-status-codes'

const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

const createController = (service, options = {}) => {
  const { populate = [], sort = { createdAt: -1 }, postCreate, postUpdate } = options

  const getAll = asyncHandler(async (req, res) => {
    const { page = 1, limit = 20, ...filters } = req.query
    const result = await service.getAllWithPagination(filters, populate, sort, page, limit)
    res.json({ success: true, data: result.data, pagination: result.pagination })
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
    res.status(StatusCodes.CREATED).json({ success: true, data: entity })
  })

  const update = asyncHandler(async (req, res) => {
    let entity = await service.update(req.params.id, req.body)
    if (!entity) {
      return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'Not found' })
    }
    if (postUpdate) entity = await postUpdate(entity, req)
    if (populate.length) entity = await service.getById(entity._id, populate)
    res.json({ success: true, data: entity })
  })

  const remove = asyncHandler(async (req, res) => {
    const entity = await service.remove(req.params.id)
    if (!entity) {
      return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'Not found' })
    }
    res.json({ success: true, message: 'Deleted successfully' })
  })

  return { getAll, getOne, create, update, remove }
}

export { asyncHandler, createController }
