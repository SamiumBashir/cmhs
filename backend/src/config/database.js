import mongoose from 'mongoose'

/**
 * Connect to MongoDB database
 * @param {number} retries
 * @param {number} delayMs
 */
const connectDB = async (retries = 5, delayMs = 3000) => {
  const rawUri = process.env.MONGODB_URI || process.env.MONGO_URL || process.env.DATABASE_URL
  if (!rawUri && process.env.NODE_ENV === 'production') {
    throw new Error('FATAL: MONGODB_URI environment variable is required in production.')
  }

  const uri = String(rawUri || 'mongodb://127.0.0.1:27017/school-management').replace(/^["']|["']$/g, '').trim()

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000
      })
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`)
      return conn
    } catch (error) {
      console.error(`⚠️ MongoDB connection attempt ${attempt}/${retries} failed: ${error.message}`)
      if (attempt === retries) {
        console.error('❌ Failed to connect to MongoDB after maximum retries.')
        if (process.env.NODE_ENV === 'production') {
          process.exit(1)
        }
      }
      await new Promise((res) => setTimeout(res, delayMs))
    }
  }
}

export default connectDB
