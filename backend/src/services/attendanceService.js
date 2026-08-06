import Attendance from '../models/Attendance.js'
import BaseService from '../services/baseService.js'

class AttendanceService extends BaseService {
  constructor() {
    super(Attendance)
  }
}

const attendanceService = new AttendanceService()

export { attendanceService }
