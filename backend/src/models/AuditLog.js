import mongoose from 'mongoose'

const auditLogSchema = new mongoose.Schema({
  user: {
    id: String,
    email: String,
    role: String
  },
  action: {
    type: String,
    required: true,
    enum: ['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT']
  },
  resource: {
    type: String,
    required: true
  },
  recordId: String,
  details: mongoose.Schema.Types.Mixed,
  ip: String,
  userAgent: String
}, { timestamps: true })

auditLogSchema.index({ createdAt: -1 })
auditLogSchema.index({ 'user.id': 1 })
auditLogSchema.index({ resource: 1 })

export default mongoose.model('AuditLog', auditLogSchema)
