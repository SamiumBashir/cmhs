import mongoose from 'mongoose'

const resultSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  class: { type: String, required: true },
  section: { type: String, default: 'A' },
  exam: { type: String, required: true },
  subject: { type: String, required: true },
  marksObtained: { type: Number, required: true },
  fullMarks: { type: Number, default: 100 },
  grade: String,
  gpa: Number,
  remarks: String,
  academicYear: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true })

resultSchema.index({ studentId: 1, exam: 1 })
resultSchema.index({ class: 1, exam: 1 })
resultSchema.index({ academicYear: 1 })

export default mongoose.model('Result', resultSchema)