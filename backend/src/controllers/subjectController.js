import { createController } from '../controllers/baseController.js'
import { subjectService } from '../services/subjectService.js'

const subjectController = createController(subjectService, {
  populate: ['teacher']
})

export { subjectController }
