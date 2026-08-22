import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import path from 'path'
import Admin from '../models/Admin.js'
import Teacher from '../models/Teacher.js'
import Student from '../models/Student.js'
import Settings from '../models/Settings.js'
import Menu from '../models/Menu.js'
import Faq from '../models/Faq.js'
import Download from '../models/Download.js'

dotenv.config({ path: path.join(process.cwd(), '.env') })

const seedData = async () => {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URL || process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/school-management'

  try {
    console.log('Connecting to database...')
    await mongoose.connect(uri)
    console.log('Connected to MongoDB.')

    // 1. Seed Super Admin
    const adminEmail = (process.env.INITIAL_ADMIN_EMAIL || 'admin@cmhs.edu.bd').toLowerCase().trim()
    const adminPassword = await bcrypt.hash(process.env.INITIAL_ADMIN_PASSWORD || 'admin123', 12)
    await Admin.findOneAndUpdate(
      { email: adminEmail },
      {
        name: { en: 'Super Admin', bn: 'সুপার এডমিন' },
        email: adminEmail,
        password: adminPassword,
        role: 'super_admin',
        status: 'active'
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    )
    console.log(`✅ Admin seeded: ${adminEmail}`)

    // 2. Seed Demo Teacher
    const teacherPassword = await bcrypt.hash(process.env.INITIAL_TEACHER_PASSWORD || 'teacher123', 12)
    await Admin.findOneAndUpdate(
      { email: 'teacher@cmhs.edu.bd' },
      {
        name: { en: 'Demo Teacher', bn: 'ডেমো শিক্ষক' },
        email: 'teacher@cmhs.edu.bd',
        password: teacherPassword,
        role: 'teacher',
        teacherId: 'T-101',
        phone: '01700000001',
        status: 'active'
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    )
    await Teacher.findOneAndUpdate(
      { email: 'teacher@cmhs.edu.bd' },
      {
        name: { en: 'Demo Teacher', bn: 'ডেমো শিক্ষক' },
        email: 'teacher@cmhs.edu.bd',
        password: teacherPassword,
        teacherId: 'T-101',
        phone: '01700000001',
        status: 'active'
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    )
    console.log('✅ Demo Teacher seeded: teacher@cmhs.edu.bd')

    // 3. Seed Demo Student
    const studentPassword = await bcrypt.hash(process.env.INITIAL_STUDENT_PASSWORD || 'student123', 12)
    await Admin.findOneAndUpdate(
      { email: 'student@cmhs.edu.bd' },
      {
        name: { en: 'Demo Student', bn: 'ডেমো ছাত্র' },
        email: 'student@cmhs.edu.bd',
        password: studentPassword,
        role: 'student',
        studentId: 'S-1001',
        rollNumber: '1001',
        phone: '01700000002',
        status: 'active'
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    )
    await Student.findOneAndUpdate(
      { email: 'student@cmhs.edu.bd' },
      {
        name: { en: 'Demo Student', bn: 'ডেমো ছাত্র' },
        email: 'student@cmhs.edu.bd',
        password: studentPassword,
        studentId: 'S-1001',
        rollNumber: '1001',
        class: '10',
        phone: '01700000002',
        status: 'active'
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    )
    console.log('✅ Demo Student seeded: student@cmhs.edu.bd')

    // 4. Seed Settings
    const existingSettings = await Settings.findOne()
    if (!existingSettings || !existingSettings.schoolName?.en) {
      await Settings.findOneAndUpdate(
        {},
        {
          schoolName: { en: 'Chilahati Merchants High School', bn: 'চিলাহাটি মার্চেন্টস হাই স্কুল' },
          schoolCode: 'CMHS-1985',
          established: '1985',
          phone: '+880 171 123 4567',
          email: 'info@cmhs.edu.bd',
          website: 'https://cmhs.edu.bd',
          address: { en: 'Chilahati, Nilphamari, Bangladesh', bn: 'চিলাহাটি, নীলফামারী, বাংলাদেশ' },
          principal: { en: 'Dr. Ahmed Hasan', bn: 'ডা. আহমেদ হাসান' },
          socialLinks: {
            facebook: 'https://facebook.com',
            youtube: 'https://youtube.com',
            email: 'info@cmhs.edu.bd'
          },
          primaryColor: '#0F766E',
          secondaryColor: '#2563EB',
          accentColor: '#F59E0B'
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      )
      console.log('✅ School settings initialized.')
    }

    // 5. Seed Menus
    const defaultMenus = [
      { label: { en: 'Home', bn: 'হোম' }, path: '/', order: 1, position: 'header' },
      { label: { en: 'Academics', bn: 'শিক্ষা কার্যক্রম' }, path: '/academics', order: 2, position: 'header' },
      { label: { en: 'Admission', bn: 'ভর্তি' }, path: '/admission', order: 3, position: 'header' },
      { label: { en: 'Notices', bn: 'নোটিশ' }, path: '/notice', order: 4, position: 'header' },
      { label: { en: 'Events', bn: 'ইভেন্ট' }, path: '/events', order: 5, position: 'header' },
      { label: { en: 'Gallery', bn: 'গ্যালারি' }, path: '/gallery', order: 6, position: 'header' },
      { label: { en: 'Teachers', bn: 'শিক্ষকরা' }, path: '/teachers', order: 7, position: 'header' },
      { label: { en: 'Contact', bn: 'যোগাযোগ' }, path: '/contact', order: 8, position: 'header' },
      { label: { en: 'About', bn: 'আমাদের সম্পর্কে' }, path: '/about', order: 9, position: 'header' }
    ]
    for (const m of defaultMenus) {
      await Menu.findOneAndUpdate({ path: m.path }, { $set: m }, { upsert: true })
    }
    console.log('✅ Navigation menus seeded.')

    // 6. Seed FAQs
    const faqCount = await Faq.countDocuments()
    if (faqCount === 0) {
      await Faq.insertMany([
        {
          question: { en: 'What are the admission requirements?', bn: 'ভর্তির জন্য প্রয়োজনীয় কাগজপত্র কি কি?' },
          answer: { en: 'Birth certificate, previous academic transcript, and 2 passport-size photographs.', bn: 'জন্ম নিবন্ধন সনদ, পূর্ববর্তী ক্লাসের ট্রান্সক্রিপ্ট এবং ২ কপি পাসপোর্ট সাইজের ছবি।' },
          category: 'admission',
          order: 1
        },
        {
          question: { en: 'What are the school operating hours?', bn: 'বিদ্যালয়ের সময়সূচী কি?' },
          answer: { en: 'Sunday to Thursday, 8:00 AM to 4:00 PM.', bn: 'রবিবার থেকে বৃহস্পতিবার সকাল ৮:০০ টা থেকে বিকাল ৪:০০ টা।' },
          category: 'general',
          order: 2
        }
      ])
      console.log('✅ FAQs seeded.')
    }

    // 7. Seed Downloads
    const downloadCount = await Download.countDocuments()
    if (downloadCount === 0) {
      await Download.insertMany([
        {
          title: { en: 'Admission Form 2026', bn: 'ভর্তি ফরম ২০২৬' },
          fileUrl: '/docs/admission-form.pdf',
          category: 'admission',
          fileSize: '520 KB',
          fileType: 'PDF'
        },
        {
          title: { en: 'Academic Calendar 2026', bn: 'একাডেমিক ক্যালেণ্ডার ২০২৬' },
          fileUrl: '/docs/academic-calendar.pdf',
          category: 'academic',
          fileSize: '1.2 MB',
          fileType: 'PDF'
        }
      ])
      console.log('✅ Downloads seeded.')
    }

    console.log('🎉 Seeding completed successfully.')
    await mongoose.disconnect()
    process.exit(0)
  } catch (err) {
    console.error('❌ Seeding error:', err.message)
    await mongoose.disconnect()
    process.exit(1)
  }
}

seedData()
