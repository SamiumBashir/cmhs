import Routine from '../models/Routine.js'
import BaseService from '../services/baseService.js'

class RoutineService extends BaseService {
  constructor() {
    super(Routine)
  }

  async getAllWithPagination(filter = {}, page = 1, limit = 50) {
    const skip = (parseInt(page) - 1) * parseInt(limit)
    const sort = { class: 1, day: 1, period: 1 }

    const [data, total] = await Promise.all([
      this.getAll(filter, ['teacher'], sort, skip, parseInt(limit)),
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

const routineService = new RoutineService()

export { routineService }
