import mongoose from 'mongoose'

const teacherSchema = new mongoose.Schema({
  name: {
    bn: { type: String, required: true },
    en: { type: String, required: true }
  },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: String,
  subject: [String],
  class: [String],
  qualification: String,
  experience: Number,
  joinDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  avatar: String,
  address: {
    bn: String,
    en: String
  }
}, { timestamps: true })

teacherSchema.index({ email: 1 }, { unique: true })
teacherSchema.index({ 'name.bn': 1 })
teacherSchema.index({ 'name.en': 1 })

export default mongoose.model('Teacher', teacherSchema)