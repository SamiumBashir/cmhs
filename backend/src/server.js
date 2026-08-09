import express from 'express'
import path from 'path'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import mongoSanitize from 'express-mongo-sanitize'
import xssClean from 'xss-clean'
import hpp from 'hpp'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import { connectRedis, getRedis } from './config/redis.js'
import connectDB from './config/database.js'
import mongoose from 'mongoose'
import errorHandler from './middleware/errorHandler.js'
import notFound from './middleware/notFound.js'
import authRoutes from './routes/authRoutes.js'
import studentRoutes from './routes/studentRoutes.js'
import teacherRoutes from './routes/teacherRoutes.js'
import staffRoutes from './routes/staffRoutes.js'
import noticeRoutes from './routes/noticeRoutes.js'
import galleryRoutes from './routes/galleryRoutes.js'
import admissionRoutes from './routes/admissionRoutes.js'
import resultRoutes from './routes/resultRoutes.js'
import routineRoutes from './routes/routineRoutes.js'
import attendanceRoutes from './routes/attendanceRoutes.js'
import settingsRoutes from './routes/settingsRoutes.js'
import websiteRoutes from './routes/websiteRoutes.js'
import contactRoutes from './routes/contactRoutes.js'
import eventRoutes from './routes/eventRoutes.js'
import curriculumRoutes from './routes/curriculumRoutes.js'
import classRoutes from './routes/classRoutes.js'
import subjectRoutes from './routes/subjectRoutes.js'
import homepageRoutes from './routes/homepageRoutes.js'
import mediaRoutes from './routes/mediaRoutes.js'
import menuRoutes from './routes/menuRoutes.js'
import pageRoutes from './routes/pageRoutes.js'
import faqRoutes from './routes/faqRoutes.js'
import downloadRoutes from './routes/downloadRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import auditLogRoutes from './routes/auditLogRoutes.js'

dotenv.config()

const app = express()

app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:', 'http:'],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      connectSrc: ["'self'", process.env.FRONTEND_URL || '*', process.env.ADMIN_URL || '*'],
      frameSrc: ["'self'"]
    }
  }
}))

const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL,
  ...(process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [])
].filter(Boolean)

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, postman) or localhost in dev
    if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return callback(null, true)
    }
    if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      return callback(null, true)
    }
    return callback(new Error('CORS not allowed for origin: ' + origin))
  },
  credentials: true
}))
app.use(compression())
app.use(morgan('combined'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')))
app.use('/api/uploads', express.static(path.join(process.cwd(), 'uploads')))
app.use(cookieParser())
app.use(mongoSanitize())
app.use(xssClean())
app.use(hpp())

// Rate limiters
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' }
})

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many login attempts. Please try again after 15 minutes.' }
})

app.use('/api/auth/login', loginLimiter)
app.use('/api/', generalLimiter)

app.use('/api/auth', authRoutes)
app.use('/api/students', studentRoutes)
app.use('/api/teachers', teacherRoutes)
app.use('/api/staff', staffRoutes)
app.use('/api/notices', noticeRoutes)
app.use('/api/gallery', galleryRoutes)
app.use('/api/admissions', admissionRoutes)
app.use('/api/results', resultRoutes)
app.use('/api/routines', routineRoutes)
app.use('/api/attendance', attendanceRoutes)
app.use('/api/settings', settingsRoutes)
app.use('/api/website', websiteRoutes)
app.use('/api/contact', contactRoutes)
app.use('/api/events', eventRoutes)
app.use('/api/curriculum', curriculumRoutes)
app.use('/api/classes', classRoutes)
app.use('/api/subjects', subjectRoutes)
app.use('/api/homepage', homepageRoutes)
app.use('/api/media', mediaRoutes)
app.use('/api/menus', menuRoutes)
app.use('/api/pages', pageRoutes)
app.use('/api/faq', faqRoutes)
app.use('/api/downloads', downloadRoutes)
app.use('/api/admin/users', adminRoutes)
app.use('/api/audit-logs', auditLogRoutes)

app.get('/api/health', (req, res) => {
  const mongoStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  const redisClient = getRedis()
  const redisStatus = (redisClient && redisClient.isOpen) ? 'connected' : 'disconnected'

  res.json({
    success: true,
    status: 'ok',
    message: 'School Management API is running',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    services: {
      mongodb: mongoStatus,
      redis: redisStatus
    }
  })
})

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

const startServer = async () => {
  try {
    await connectDB()
    await connectRedis()
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`)
    })

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`\n❌ Error: Port ${PORT} is already in use (EADDRINUSE).`)
        console.error(`👉 If Docker container 'school-backend' is running, stop it with: docker stop school-backend`)
        console.error(`👉 Or change PORT in backend/.env to another port (e.g. PORT=5001).\n`)
        process.exit(1)
      }
    })
  } catch (error) {
    console.error('Failed to start server:', error.message)
    process.exit(1)
  }
}

startServer()

export default app
