import { createController } from './baseController.js'
import { auditLogService } from '../services/auditLogService.js'

const auditLogController = createController(auditLogService, {
  sort: { createdAt: -1 }
})

export { auditLogController }
