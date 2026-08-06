import { createController } from './baseController.js'
import { noticeService } from '../services/noticeService.js'

const NoticeControllerObj = createController(noticeService, {
  populate: ['author'],
  sort: { isPinned: -1, publishDate: -1 }
})

const getByCategory = async (req, res, next) => {
  try {
    const { category, page = 1, limit = 20 } = req.query
    const filter = {}
    if (category) filter.category = category
    const result = await noticeService.getAllWithPagination(filter, page, limit)
    res.json({ success: true, data: result.data, pagination: result.pagination })
  } catch (error) {
    next(error)
  }
}

const noticeController = {
  ...NoticeControllerObj,
  getByCategory
}

export { noticeController }
