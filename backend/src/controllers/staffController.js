import { createController } from './baseController.js'
import { staffService } from '../services/staffService.js'

const staffController = createController(staffService, {
  populate: [],
  sort: { createdAt: -1 }
})

export { staffController }
