import { createController } from './baseController.js'
import { downloadService } from '../services/downloadService.js'

export const downloadController = createController(downloadService)
