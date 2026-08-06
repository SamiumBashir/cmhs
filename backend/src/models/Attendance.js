import mongoose from 'mongoose'

const attendanceSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  class: { type: String, required: true },
  section: { type: String, default: 'A' },
  date: { type: Date, required: true },
  status: { type: String, enum: ['present', 'absent', 'late', 'excused'], required: true },
  remarks: String,
  markedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }
}, { timestamps: true })

attendanceSchema.index({ studentId: 1, date: 1 })
attendanceSchema.index({ class: 1, date: 1 })

export default mongoose.model('Attendance', attendanceSchema)