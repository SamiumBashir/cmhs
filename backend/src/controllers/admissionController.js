import { createController } from './baseController.js'
import { admissionService } from '../services/admissionService.js'

const admissionController = createController(admissionService, {
  populate: [],
  sort: { createdAt: -1 }
})

export { admissionController }
