import { createController } from './baseController.js'
import { menuService } from '../services/menuService.js'

export const menuController = createController(menuService)
