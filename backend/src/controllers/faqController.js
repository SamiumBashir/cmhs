import { createController } from './baseController.js'
import { faqService } from '../services/faqService.js'

export const faqController = createController(faqService)
