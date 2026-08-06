import mongoose from 'mongoose'

const eventSchema = new mongoose.Schema({
  title: {
    bn: { type: String, required: true },
    en: { type: String, required: true }
  },
  description: {
    bn: String,
    en: String
  },
  date: { type: Date, required: true },
  startTime: String,
  endTime: String,
  location: {
    bn: String,
    en: String
  },
  category: { type: String, enum: ['cultural', 'sports', 'academic', 'admin'], default: 'cultural' },
  image: String,
  isActive: { type: Boolean, default: true }
}, { timestamps: true })

eventSchema.index({ date: 1 })
eventSchema.index({ category: 1 })

export default mongoose.model('Event', eventSchema)