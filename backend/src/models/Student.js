import mongoose from 'mongoose'

const studentSchema = new mongoose.Schema({
  name: {
    bn: { type: String, required: true },
    en: { type: String, required: true }
  },
  rollNumber: { type: String, required: true },
  class: { type: String, required: true },
  section: { type: String, default: 'A' },
  gender: { type: String, enum: ['male', 'female', 'other'] },
  dateOfBirth: Date,
  bloodGroup: String,
  phone: String,
  email: { type: String, lowercase: true },
  password: { type: String },
  studentId: { type: String, sparse: true },
  parentName: {
    bn: String,
    en: String
  },
  parentPhone: String,
  parentEmail: { type: String, lowercase: true },
  address: {
    bn: String,
    en: String
  },
  admissionDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['active', 'inactive', 'graduated'], default: 'active' },
  avatar: String
}, { timestamps: true })

studentSchema.index({ rollNumber: 1, class: 1 }, { sparse: true })
studentSchema.index({ class: 1 })
studentSchema.index({ 'name.bn': 1 })
studentSchema.index({ 'name.en': 1 })

export default mongoose.model('Student', studentSchema)