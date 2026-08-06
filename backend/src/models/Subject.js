import mongoose from 'mongoose'

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Subject name is required'],
    trim: true
  },
  code: {
    type: String,
    unique: true,
    trim: true,
    required: [true, 'Subject code is required']
  },
  class: {
    type: String,
    required: [true, 'Class is required'],
    trim: true
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher'
  },
  description: {
    type: String,
    trim: true
  },
  creditHours: {
    type: Number,
    default: 1
  },
  isElective: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true })

subjectSchema.index({ code: 1 }, { unique: true })
subjectSchema.index({ class: 1, isElective: 1 })

const Subject = mongoose.model('Subject', subjectSchema)

export default Subject
