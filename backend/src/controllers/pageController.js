import { createController } from './baseController.js'
import { pageService } from '../services/pageService.js'

export const pageController = createController(pageService)
