import Staff from '../models/Staff.js'
import BaseService from '../services/baseService.js'

class StaffService extends BaseService {
  constructor() {
    super(Staff)
  }
}

const staffService = new StaffService()

export { staffService }
