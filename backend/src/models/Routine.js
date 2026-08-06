import mongoose from 'mongoose'

const routineSchema = new mongoose.Schema({
  class: { type: String, required: true },
  section: { type: String, default: 'A' },
  day: { type: String, required: true },
  period: { type: Number, required: true },
  subject: { type: String, required: true },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
  startTime: String,
  endTime: String,
  room: String,
  academicYear: { type: String, required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true })

routineSchema.index({ class: 1, day: 1, period: 1 })
routineSchema.index({ academicYear: 1 })

export default mongoose.model('Routine', routineSchema)