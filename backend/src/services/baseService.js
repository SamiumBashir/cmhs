import mongoose from 'mongoose'
import { StatusCodes } from 'http-status-codes'
import ApiError from '../utils/ApiError.js'

class BaseService {
  constructor(model) {
    this.model = model
  }

  async getAll(filter = {}, populate = [], sort = {}, skip = 0, limit = 0) {
    let query = this.model.find(filter).sort(sort)
    if (populate.length) query = query.populate(populate.join(' '))
    if (skip) query = query.skip(skip)
    if (limit) query = query.limit(limit)
    return await query.exec()
  }

  async getById(id, populate = []) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid ID')
    }
    let query = this.model.findById(id)
    if (populate.length) query = query.populate(populate.join(' '))
    return await query.exec()
  }

  async create(data) {
    return await this.model.create(data)
  }

  async update(id, data) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid ID')
    }
    return await this.model.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true }).exec()
  }

  async remove(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid ID')
    }
    return await this.model.findByIdAndDelete(id).exec()
  }

  async count(filter = {}) {
    return await this.model.countDocuments(filter).exec()
  }

  async getAllWithPagination(filter = {}, populate = [], sort = {}, page = 1, limit = 20) {
    const skip = (parseInt(page) - 1) * parseInt(limit)

    const [data, total] = await Promise.all([
      this.getAll(filter, populate, sort, skip, parseInt(limit)),
      this.count(filter)
    ])

    return {
      data,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    }
  }
}

export default BaseService
