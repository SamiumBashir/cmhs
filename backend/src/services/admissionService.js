import Admission from '../models/Admission.js'
import BaseService from '../services/baseService.js'

class AdmissionService extends BaseService {
  constructor() {
    super(Admission)
  }

  async create(data) {
    if (!data.formNumber || data.formNumber === '') {
      data.formNumber = `ADM-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`
    }
    return await super.create(data)
  }

  async update(id, data) {
    if (data && data.formNumber === '') {
      delete data.formNumber
    }
    return await super.update(id, data)
  }
}

const admissionService = new AdmissionService()

export { admissionService }
