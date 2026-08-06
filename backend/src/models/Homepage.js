import mongoose from 'mongoose'

const homepageSchema = new mongoose.Schema({
  heroSlides: [{
    title: { bn: String, en: String },
    subtitle: { bn: String, en: String },
    buttonText: { bn: String, en: String },
    buttonLink: String,
    image: String,
    bgGradient: String,
    enabled: { type: Boolean, default: true }
  }],
  statistics: [{
    label: { bn: String, en: String },
    value: String,
    icon: String,
    color: String
  }],
  testimonials: [{
    name: { bn: String, en: String },
    role: { bn: String, en: String },
    avatar: String,
    message: { bn: String, en: String },
    rating: { type: Number, default: 5 }
  }],
  facilities: [{
    title: { bn: String, en: String },
    description: { bn: String, en: String },
    icon: String,
    image: String
  }],
  partnerLogos: [{
    name: String,
    image: String,
    link: String
  }],
  sectionsOrder: [{
    key: { type: String, required: true },
    label: String,
    enabled: { type: Boolean, default: true },
    order: { type: Number, default: 0 }
  }]
}, { timestamps: true })

export default mongoose.model('Homepage', homepageSchema)
