import Teacher from '../models/Teacher.js'
import BaseService from '../services/baseService.js'
import bcrypt from 'bcryptjs'

class TeacherService extends BaseService {
  constructor() {
    super(Teacher)
  }

  async create(data) {
    if (!data.teacherId || data.teacherId === '') {
      data.teacherId = `TCH-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`
    }
    if (!data.employeeId || data.employeeId === '') {
      data.employeeId = data.teacherId
    }
    if (!data.password || data.password === '') {
      data.password = await bcrypt.hash('teacher123', 12)
    } else {
      data.password = await bcrypt.hash(data.password, 12)
    }
    return await super.create(data)
  }

  async update(id, data) {
    if (data && data.teacherId === '') delete data.teacherId
    if (data && data.employeeId === '') delete data.employeeId
    if (data && data.password) {
      data.password = await bcrypt.hash(data.password, 12)
    }
    return await super.update(id, data)
  }
}

const teacherService = new TeacherService()

export { teacherService }
