import mongoose from 'mongoose'

const pageSchema = new mongoose.Schema({
  title: {
    bn: { type: String, required: true },
    en: { type: String, required: true }
  },
  slug: { type: String, required: true, unique: true },
  content: {
    bn: { type: String, default: '' },
    en: { type: String, default: '' }
  },
  bannerImage: { type: String, default: '' },
  status: { type: String, enum: ['published', 'draft'], default: 'published' },
  metaTitle: { type: String, default: '' },
  metaDescription: { type: String, default: '' }
}, { timestamps: true })

pageSchema.index({ slug: 1 })

export default mongoose.model('Page', pageSchema)
