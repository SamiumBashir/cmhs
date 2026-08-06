import Homepage from '../models/Homepage.js'
import BaseService from './baseService.js'

class HomepageService extends BaseService {
  constructor() {
    super(Homepage)
  }

  async getOrCreate() {
    let homepage = await this.model.findOne().exec()
    if (!homepage) {
      homepage = await this.model.create({
        heroSlides: [
          {
            title: { bn: 'চিলাহাটি মার্চেন্টস হাই স্কুল', en: 'Chilahati Merchants High School' },
            subtitle: { bn: 'মানসম্মত শিক্ষা ও চরিত্র গঠনের অঙ্গীকার নিয়ে ১৯৮৫ সাল থেকে আমরা প্রতিশ্রুতিবদ্ধ।', en: 'Empowering students with quality education, holistic development, and a commitment to excellence.' },
            buttonText: { bn: 'ভর্তির আবেদন করুন', en: 'Apply for Admission' },
            buttonLink: '/admission',
            bgGradient: 'from-primary/5 via-white to-secondary/5',
            enabled: true
          }
        ],
        statistics: [
          { label: { bn: 'শিক্ষার্থী', en: 'Students' }, value: '1,200+', icon: 'FiUsers', color: 'primary' },
          { label: { bn: 'শিক্ষক', en: 'Teachers' }, value: '45+', icon: 'FiUserCheck', color: 'secondary' },
          { label: { bn: 'কার্যক্রম', en: 'Programs' }, value: '25+', icon: 'FiBook', color: 'accent' },
          { label: { bn: 'প্রতিষ্ঠাকাল', en: 'Established' }, value: '1985', icon: 'FiAward', color: 'primary' }
        ],
        sectionsOrder: [
          { key: 'hero', label: 'Hero Banner', enabled: true, order: 1 },
          { key: 'stats', label: 'Statistics', enabled: true, order: 2 },
          { key: 'notices', label: 'Latest Notices', enabled: true, order: 3 },
          { key: 'events', label: 'Upcoming Events', enabled: true, order: 4 },
          { key: 'gallery', label: 'Photo Gallery', enabled: true, order: 5 },
          { key: 'principal', label: "Principal's Message", enabled: true, order: 6 }
        ]
      })
    }
    return homepage
  }

  async updateHomepage(data) {
    const updateData = { ...data }
    delete updateData._id
    delete updateData.createdAt
    delete updateData.updatedAt
    delete updateData.__v

    const homepage = await this.model.findOneAndUpdate(
      {},
      { $set: updateData },
      { new: true, upsert: true, runValidators: true }
    ).exec()
    return homepage
  }
}

export const homepageService = new HomepageService()
