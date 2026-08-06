import { createController } from './baseController.js'
import { routineService } from '../services/routineService.js'

const routineController = createController(routineService, {
  populate: ['teacher'],
  sort: { class: 1, day: 1, period: 1 }
})

export { routineController }
