import { createController } from './baseController.js'
import { eventService } from '../services/eventService.js'

const eventController = createController(eventService, {
  populate: [],
  sort: { date: 1 }
})

export { eventController }
