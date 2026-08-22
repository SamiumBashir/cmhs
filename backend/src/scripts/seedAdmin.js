import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import path from 'path'
import Admin from '../models/Admin.js'

dotenv.config({ path: path.join(process.cwd(), '.env') })

const seedAdmin = async () => {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URL || process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/school-management'
  const email = (process.env.INITIAL_ADMIN_EMAIL || 'admin@cmhs.edu.bd').toLowerCase().trim()
  const password = process.env.INITIAL_ADMIN_PASSWORD || 'admin123'

  try {
    console.log('Connecting to database...')
    await mongoose.connect(uri)
    console.log('Connected to MongoDB.')

    const existingAdmin = await Admin.findOne({ email })
    if (existingAdmin) {
      console.log(`ℹ️ Admin user with email "${email}" already exists. (Skipping overwrite)`)
      await mongoose.disconnect()
      process.exit(0)
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const newAdmin = await Admin.create({
      name: { en: 'Super Admin', bn: 'সুপার এডমিন' },
      email,
      password: hashedPassword,
      role: 'super_admin',
      status: 'active'
    })

    console.log(`✅ Successfully seeded Super Admin: ${newAdmin.email}`)
    await mongoose.disconnect()
    process.exit(0)
  } catch (err) {
    console.error('❌ Failed to seed admin user:', err.message)
    await mongoose.disconnect()
    process.exit(1)
  }
}

seedAdmin()
