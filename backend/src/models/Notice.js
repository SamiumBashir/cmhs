import mongoose from 'mongoose'

const noticeSchema = new mongoose.Schema({
  title: {
    bn: { type: String, required: true },
    en: { type: String, required: true }
  },
  content: {
    bn: { type: String, required: true },
    en: { type: String, required: true }
  },
  category: {
    type: String,
    enum: ['general', 'academic', 'admission', 'exam', 'result', 'event', 'holiday', 'admin', 'urgent'],
    default: 'general'
  },
  publishDate: { type: Date, default: Date.now },
  isPinned: { type: Boolean, default: false },
  isUrgent: { type: Boolean, default: false },
  attachments: [{
    name: String,
    url: String,
    type: String
  }],
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  publishedBy: { type: String }
}, { timestamps: true })

noticeSchema.index({ category: 1 })
noticeSchema.index({ publishDate: -1 })
noticeSchema.index({ isPinned: -1 })

export default mongoose.model('Notice', noticeSchema)