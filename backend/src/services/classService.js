import Class from '../models/Class.js'
import BaseService from './baseService.js'

class ClassService extends BaseService {
  constructor() {
    super(Class)
  }
}

const classService = new ClassService()

export { classService }
