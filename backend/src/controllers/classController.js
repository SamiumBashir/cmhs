import { createController } from '../controllers/baseController.js'
import { classService } from '../services/classService.js'

const classController = createController(classService, {
  populate: ['teacher']
})

export { classController }
