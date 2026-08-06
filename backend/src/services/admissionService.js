import Admission from '../models/Admission.js'
import BaseService from '../services/baseService.js'

class AdmissionService extends BaseService {
  constructor() {
    super(Admission)
  }
}

const admissionService = new AdmissionService()

export { admissionService }
