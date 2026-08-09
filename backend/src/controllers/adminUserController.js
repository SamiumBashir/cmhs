import { createController } from './baseController.js'
import { adminUserService } from '../services/adminUserService.js'

const adminUserController = createController(adminUserService, {
  populate: [],
  sort: { createdAt: -1 }
})

export { adminUserController }
