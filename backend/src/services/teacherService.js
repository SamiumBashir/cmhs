import Teacher from '../models/Teacher.js'
import BaseService from '../services/baseService.js'

class TeacherService extends BaseService {
  constructor() {
    super(Teacher)
  }
}

const teacherService = new TeacherService()

export { teacherService }
