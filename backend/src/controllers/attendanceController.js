import { createController } from './baseController.js'
import { attendanceService } from '../services/attendanceService.js'

const attendanceController = createController(attendanceService, {
  populate: [],
  sort: { date: -1 }
})

export { attendanceController }
