import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import Admin from '../models/Admin.js'
import Teacher from '../models/Teacher.js'
import Student from '../models/Student.js'
import Settings from '../models/Settings.js'
import Menu from '../models/Menu.js'
import Faq from '../models/Faq.js'
import Download from '../models/Download.js'

const seedDefaultUsers = async () => {
  try {
    // 1. Seed Admin
    const adminPassword = await bcrypt.hash('admin123', 12)
    await Admin.findOneAndUpdate(
      { email: 'admin@cmhs.edu.bd' },
      {
        name: { en: 'Super Admin', bn: 'সুপার এডমিন' },
        email: 'admin@cmhs.edu.bd',
        password: adminPassword,
        role: 'super_admin',
        status: 'active'
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    )

    // 2. Seed Teacher
    const teacherPassword = await bcrypt.hash('teacher123', 12)
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

    // 3. Seed Student
    const studentPassword = await bcrypt.hash('student123', 12)
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

    // 4. Seed Default Settings
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
    }

    // 5. Seed / Update Navigation Menus
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
    const menuCount = await Menu.countDocuments()
    if (menuCount === 0) {
      await Menu.insertMany(defaultMenus)
    } else {
      // Update order of existing seeded header items
      for (const m of defaultMenus) {
        await Menu.updateOne({ path: m.path }, { $set: { order: m.order, label: m.label } })
      }
    }

    // 6. Seed FAQs if empty
    const faqCount = await Faq.countDocuments()
    if (faqCount === 0) {
      const defaultFaqs = [
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
      ]
      await Faq.insertMany(defaultFaqs)
    }

    // 7. Seed Downloads if empty
    const downloadCount = await Download.countDocuments()
    if (downloadCount === 0) {
      const defaultDownloads = [
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
      ]
      await Download.insertMany(defaultDownloads)
    }
  } catch (err) {
    console.error('Seeding error:', err.message)
  }
}

const connectDB = async (retries = 5, delayMs = 3000) => {
  const rawUri = process.env.MONGODB_URI || process.env.MONGO_URL || process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/school-management'
  const uri = String(rawUri).replace(/^["']|["']$/g, '').trim()
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const conn = await mongoose.connect(uri)
      console.log(`MongoDB Connected: ${conn.connection.host}`)

      try { await mongoose.connection.collection('admissions').dropIndex('formNumber_1') } catch (e) {}
      try { await mongoose.connection.collection('teachers').dropIndex('employeeId_1') } catch (e) {}
      try { await mongoose.connection.collection('teachers').dropIndex('teacherId_1') } catch (e) {}
      try { await mongoose.connection.collection('staffs').dropIndex('employeeId_1') } catch (e) {}
      try { await mongoose.connection.collection('staffs').dropIndex('staffId_1') } catch (e) {}

      await seedDefaultUsers()
      return conn
    } catch (error) {
      console.error(`MongoDB connection attempt ${attempt}/${retries} failed: ${error.message}`)
      if (error.message.includes('bad auth') || error.message.includes('authentication failed')) {
        console.error('\n❌ MONGODB AUTHENTICATION ERROR DETECTED:')
        console.error('1. If your password contains special characters (@, #, $, %, :, /), URL-encode them (e.g. @ -> %40).')
        console.error('2. Verify MONGODB_URI / MONGO_URL in Railway Variables contains the correct database username & password.')
        console.error('3. If using MongoDB Atlas or Railway plugin, ensure authSource=admin is appended: .../school-management?authSource=admin\n')
      }
      if (attempt === retries) {
        console.error('Failed to connect to MongoDB after multiple attempts. Please check your Railway/Atlas database credentials.')
        process.exit(1)
      }
      await new Promise(res => setTimeout(res, delayMs))
    }
  }
}

export default connectDB

