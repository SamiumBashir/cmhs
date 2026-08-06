import { createController } from './baseController.js'
import { galleryService } from '../services/galleryService.js'

const galleryController = createController(galleryService, {
  populate: [],
  sort: { createdAt: -1 }
})

export { galleryController }
