import Result from '../models/Result.js'
import BaseService from '../services/baseService.js'

class ResultService extends BaseService {
  constructor() {
    super(Result)
  }

  async getByStudent(studentId, exam, academicYear) {
    const filter = { studentId }
    if (exam) filter.exam = exam
    if (academicYear) filter.academicYear = academicYear
    return await this.getAll(filter, ['studentId'], { createdAt: -1 })
  }
}

const resultService = new ResultService()

export { resultService }
