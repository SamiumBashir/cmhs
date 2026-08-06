import mongoose from 'mongoose'

const staffSchema = new mongoose.Schema({
  name: {
    bn: { type: String, required: true },
    en: { type: String, required: true }
  },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: String,
  role: { type: String, required: true },
  department: String,
  joinDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  avatar: String,
  address: {
    bn: String,
    en: String
  }
}, { timestamps: true })

staffSchema.index({ email: 1 }, { unique: true })
staffSchema.index({ role: 1 })

export default mongoose.model('Staff', staffSchema)