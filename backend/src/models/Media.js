import mongoose from 'mongoose'

const mediaSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
  public_id: { type: String },
  folder: { type: String, default: 'general' },
  mimeType: { type: String, default: 'image/jpeg' },
  format: { type: String },
  width: { type: Number },
  height: { type: Number },
  resourceType: { type: String, default: 'image' },
  size: { type: Number, default: 0 },
  tags: [{ type: String }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }
}, { timestamps: true })

mediaSchema.index({ folder: 1 })
mediaSchema.index({ name: 'text', tags: 'text' })

export default mongoose.model('Media', mediaSchema)

