import mongoose from 'mongoose'

const gallerySchema = new mongoose.Schema({
  title: {
    bn: { type: String, required: true },
    en: { type: String, required: true }
  },
  image: { type: String, required: true },
  category: { type: String, enum: ['campus', 'classroom', 'laboratory', 'library', 'sports', 'cultural', 'event'], default: 'campus' },
  description: {
    bn: String,
    en: String
  },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true })

gallerySchema.index({ category: 1 })
gallerySchema.index({ isActive: 1 })

export default mongoose.model('Gallery', gallerySchema)