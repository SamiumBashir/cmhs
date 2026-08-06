import mongoose from 'mongoose'

const faqSchema = new mongoose.Schema({
  question: {
    bn: { type: String, required: true },
    en: { type: String, required: true }
  },
  answer: {
    bn: { type: String, required: true },
    en: { type: String, required: true }
  },
  category: { type: String, default: 'general' },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true })

faqSchema.index({ category: 1, order: 1 })

export default mongoose.model('Faq', faqSchema)
