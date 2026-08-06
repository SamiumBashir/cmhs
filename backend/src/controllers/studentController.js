import { createController } from './baseController.js'
import { studentService } from '../services/studentService.js'

const studentController = createController(studentService, {
  populate: [],
  sort: { createdAt: -1 }
})

export { studentController }
