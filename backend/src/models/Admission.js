import mongoose from 'mongoose'

const admissionSchema = new mongoose.Schema({
  formNumber: { type: String, unique: true, sparse: true },
  studentName: {
    bn: { type: String, required: true },
    en: { type: String, required: true }
  },
  fatherName: {
    bn: String,
    en: String
  },
  motherName: {
    bn: String,
    en: String
  },
  dateOfBirth: Date,
  gender: { type: String, enum: ['male', 'female', 'other'] },
  class: { type: String, required: true },
  section: { type: String, default: 'A' },
  group: String,
  address: {
    bn: String,
    en: String
  },
  phone: String,
  email: { type: String, lowercase: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  documents: [{
    name: String,
    url: String,
    type: String
  }],
  notes: String,
  admittedAt: Date
}, { timestamps: true })

admissionSchema.index({ class: 1 })
admissionSchema.index({ status: 1 })

export default mongoose.model('Admission', admissionSchema)