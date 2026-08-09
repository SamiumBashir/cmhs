import mongoose from 'mongoose'

const adminSchema = new mongoose.Schema({
  name: {
    bn: { type: String, required: true },
    en: { type: String, required: true }
  },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['super_admin', 'admin', 'teacher', 'student', 'editor', 'moderator'], default: 'admin' },
  teacherId: String,
  studentId: String,
  rollNumber: String,
  phone: String,
  avatar: String,
  joinDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  lastLogin: Date,
  permissions: [{ type: String }]
}, { timestamps: true })

adminSchema.index({ role: 1 })

export default mongoose.model('Admin', adminSchema)