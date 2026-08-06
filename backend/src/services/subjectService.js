import Subject from '../models/Subject.js'
import BaseService from './baseService.js'

class SubjectService extends BaseService {
  constructor() {
    super(Subject)
  }
}

const subjectService = new SubjectService()

export { subjectService }
