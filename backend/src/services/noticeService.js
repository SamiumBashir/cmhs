import Notice from '../models/Notice.js'
import BaseService from '../services/baseService.js'

class NoticeService extends BaseService {
  constructor() {
    super(Notice)
  }

  async getAllWithPagination(filter = {}, page = 1, limit = 20) {
    const skip = (parseInt(page) - 1) * parseInt(limit)
    const sort = { isPinned: -1, publishDate: -1 }

    const [data, total] = await Promise.all([
      this.getAll(filter, ['author'], sort, skip, parseInt(limit)),
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

const noticeService = new NoticeService()

export { noticeService }
