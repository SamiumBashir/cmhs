import Student from '../models/Student.js'
import BaseService from '../services/baseService.js'
import bcrypt from 'bcryptjs'

class StudentService extends BaseService {
  constructor() {
    super(Student)
  }

  async create(data) {
    if (!data.studentId || data.studentId === '') {
      data.studentId = `STD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`
    }
    if (!data.password || data.password === '') {
      data.password = await bcrypt.hash('student123', 12)
    } else {
      data.password = await bcrypt.hash(data.password, 12)
    }
    return await super.create(data)
  }

  async update(id, data) {
    if (data && data.studentId === '') delete data.studentId
    if (data && data.password) {
      data.password = await bcrypt.hash(data.password, 12)
    }
    return await super.update(id, data)
  }
}

const studentService = new StudentService()

export { studentService }
