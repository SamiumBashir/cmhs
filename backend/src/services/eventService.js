import Event from '../models/Event.js'
import BaseService from '../services/baseService.js'

class EventService extends BaseService {
  constructor() {
    super(Event)
  }
}

const eventService = new EventService()

export { eventService }
