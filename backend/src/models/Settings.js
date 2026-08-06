import mongoose from 'mongoose'

const settingsSchema = new mongoose.Schema({
  schoolName: {
    bn: { type: String },
    en: { type: String }
  },
  schoolCode: String,
  established: String,
  principal: {
    bn: String,
    en: String
  },
  address: {
    bn: String,
    en: String
  },
  phone: String,
  email: String,
  website: String,
  logo: String,
  favicon: String,
  primaryColor: { type: String, default: '#0F766E' },
  secondaryColor: { type: String, default: '#2563EB' },
  accentColor: { type: String, default: '#F59E0B' },
  seo: {
    title: String,
    description: String,
    keywords: [String]
  },
  socialLinks: {
    facebook: String,
    youtube: String,
    email: String
  }
}, { timestamps: true })

export default mongoose.model('Settings', settingsSchema)