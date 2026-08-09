import AuditLog from '../models/AuditLog.js'
import BaseService from './baseService.js'

class AuditLogService extends BaseService {
  constructor() {
    super(AuditLog)
  }

  async logAction({ user, action, resource, recordId, details, req }) {
    try {
      const ip = req?.headers['x-forwarded-for'] || req?.socket?.remoteAddress || req?.ip || ''
      const userAgent = req?.headers['user-agent'] || ''

      return await this.model.create({
        user: user ? { id: user.id || user._id, email: user.email, role: user.role } : null,
        action,
        resource,
        recordId,
        details,
        ip: String(ip),
        userAgent
      })
    } catch (error) {
      console.error('AuditLog error:', error.message)
      return null
    }
  }
}

export const auditLogService = new AuditLogService()
