import mongoose from 'mongoose'

const menuItemSchema = new mongoose.Schema({
  label: {
    bn: { type: String, required: true },
    en: { type: String, required: true }
  },
  path: { type: String, required: true },
  position: { type: String, enum: ['header', 'footer'], default: 'header' },
  order: { type: Number, default: 0 },
  isExternal: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  children: [{
    label: {
      bn: { type: String, required: true },
      en: { type: String, required: true }
    },
    path: { type: String, required: true },
    isExternal: { type: Boolean, default: false }
  }]
}, { timestamps: true })

menuItemSchema.index({ position: 1, order: 1 })

export default mongoose.model('Menu', menuItemSchema)
