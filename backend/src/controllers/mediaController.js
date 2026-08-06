import { createController } from './baseController.js'
import { mediaService } from '../services/mediaService.js'

export const mediaController = createController(mediaService)
