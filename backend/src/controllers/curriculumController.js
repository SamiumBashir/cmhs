import { createController } from './baseController.js'
import { curriculumService } from '../services/curriculumService.js'

const curriculumController = createController(curriculumService, {
  populate: ['teacher'],
  sort: { createdAt: -1 }
})

export { curriculumController }
