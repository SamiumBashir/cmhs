import Student from '../models/Student.js'
import BaseService from '../services/baseService.js'

class StudentService extends BaseService {
  constructor() {
    super(Student)
  }
}

const studentService = new StudentService()

export { studentService }
