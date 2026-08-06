import Curriculum from '../models/Curriculum.js'
import BaseService from '../services/baseService.js'

class CurriculumService extends BaseService {
  constructor() {
    super(Curriculum)
  }
}

const curriculumService = new CurriculumService()

export { curriculumService }
