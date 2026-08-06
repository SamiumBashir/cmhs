import mongoose from 'mongoose'

const curriculumSchema = new mongoose.Schema({
  class: { type: String, required: true },
  subject: { type: String, required: true },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
  syllabus: {
    bn: String,
    en: String
  },
  academicYear: { type: String, required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true })

curriculumSchema.index({ class: 1, subject: 1 })
curriculumSchema.index({ academicYear: 1 })

export default mongoose.model('Curriculum', curriculumSchema)