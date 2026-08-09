import bcrypt from 'bcryptjs'
import Admin from '../models/Admin.js'
import BaseService from './baseService.js'

class AdminUserService extends BaseService {
  constructor() {
    super(Admin)
  }

  async create(data) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 12)
    }
    return await super.create(data)
  }

  async update(id, data) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 12)
    } else {
      delete data.password
    }
    return await super.update(id, data)
  }
}

const adminUserService = new AdminUserService()

export { adminUserService }
