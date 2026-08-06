import mongoose from 'mongoose'

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  subject: String,
  message: { type: String, required: true },
  status: { type: String, enum: ['new', 'read', 'replied'], default: 'new' },
  repliedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  replyMessage: String,
  repliedAt: Date
}, { timestamps: true })

contactSchema.index({ status: 1 })
contactSchema.index({ createdAt: -1 })

export default mongoose.model('Contact', contactSchema)