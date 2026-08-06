import { createController } from './baseController.js'
import { contactService } from '../services/contactService.js'

const contactController = createController(contactService, {
  populate: [],
  sort: { createdAt: -1 }
})

export { contactController }
