import mongoose from 'mongoose'

const downloadSchema = new mongoose.Schema({
  title: {
    bn: { type: String, required: true },
    en: { type: String, required: true }
  },
  fileUrl: { type: String, required: true },
  category: { type: String, default: 'form' },
  fileSize: { type: String, default: '1 MB' },
  fileType: { type: String, default: 'PDF' },
  publishDate: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
}, { timestamps: true })

downloadSchema.index({ category: 1 })

export default mongoose.model('Download', downloadSchema)
