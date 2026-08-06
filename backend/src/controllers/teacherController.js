import { createController } from './baseController.js'
import { teacherService } from '../services/teacherService.js'

const teacherController = createController(teacherService, {
  populate: [],
  sort: { createdAt: -1 }
})

export { teacherController }
