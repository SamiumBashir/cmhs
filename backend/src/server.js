import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import mongoSanitize from 'express-mongo-sanitize'
import xssClean from 'xss-clean'
import hpp from 'hpp'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import path from 'path'
import mongoose from 'mongoose'

import connectDB from './config/database.js'
import { connectRedis, getRedis } from './config/redis.js'
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

// Fail-fast environment validation
const validateEnv = () => {
  const isProduction = process.env.NODE_ENV === 'production'
  const requiredInProduction = ['JWT_SECRET', 'REFRESH_TOKEN_SECRET', 'MONGODB_URI']
  const missing = []

  if (isProduction) {
    for (const key of requiredInProduction) {
      if (!process.env[key] || process.env[key].trim() === '') {
        missing.push(key)
      }
    }

    if (missing.length > 0) {
      console.error(`❌ FATAL CONFIG ERROR: Missing required production environment variables: ${missing.join(', ')}`)
      process.exit(1)
    }
  }
}

validateEnv()

const app = express()

// Security Headers with strict Content Security Policy
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:', 'http:', 'res.cloudinary.com'],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'fonts.googleapis.com'],
      fontSrc: ["'self'", 'fonts.gstatic.com', 'data:'],
      connectSrc: ["'self'", process.env.FRONTEND_URL || '*', process.env.ADMIN_URL || '*'],
      frameSrc: ["'self'"]
    }
  }
}))

app.set('trust proxy', 1)

// Strict CORS Configuration (Phase 2)
const getNormalizedAllowedOrigins = () => {
  const list = [
    process.env.FRONTEND_URL || 'https://cmhs-nine.vercel.app',
    process.env.ADMIN_URL || 'https://cmhs-admin-five.vercel.app',
    'https://cmhs-nine.vercel.app',
    'https://cmhs-admin-five.vercel.app',
    ...(process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [])
  ]
    .map(s => s?.trim().replace(/\/$/, ''))
    .filter(Boolean)

  return new Set(list)
}

const allowedOriginsSet = getNormalizedAllowedOrigins()

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (e.g. mobile apps, server-to-server, curl)
    if (!origin) return callback(null, true)

    const cleanOrigin = origin.replace(/\/$/, '')

    // Development localhost check
    if (process.env.NODE_ENV !== 'production') {
      if (
        cleanOrigin.includes('localhost') ||
        cleanOrigin.includes('127.0.0.1')
      ) {
        return callback(null, true)
      }
    }

    // Explicitly allowed production domains
    if (allowedOriginsSet.has(cleanOrigin)) {
      return callback(null, true)
    }

    // Reject all unauthorized origins
    return callback(new Error('CORS policy: Access from this origin is not permitted.'), false)
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}))

app.use(compression())
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')))
app.use('/api/uploads', express.static(path.join(process.cwd(), 'uploads')))
app.use(cookieParser())
app.use(mongoSanitize())
app.use(xssClean())
app.use(hpp())

// Database Connection Middleware: Return 503 if database is disconnected
app.use((req, res, next) => {
  if (req.path === '/api/health' || req.path === '/api/ready' || req.path === '/') {
    return next()
  }

  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: 'Service Temporarily Unavailable: Database connection is offline. Please try again shortly.',
      code: 'DATABASE_UNAVAILABLE'
    })
  }
  next()
})

// Rate limiters
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' }
})

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30, // 30 login attempts per 15 minutes per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many authentication attempts. Please try again in 15 minutes.' }
})

app.use('/api/auth/login', authLimiter)
app.use('/api/auth/register', authLimiter)
app.use('/api/', generalLimiter)

// Health and Readiness Checks (Phase 19)
app.get(['/', '/api', '/api/health'], (req, res) => {
  res.json({
    success: true,
    status: 'ok',
    service: 'Chilahati Merchants High School API',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime())
  })
})

app.get('/api/ready', (req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1
  const redisClient = getRedis()
  const isRedisConnected = Boolean(redisClient && redisClient.isOpen)

  if (!isDbConnected) {
    return res.status(503).json({
      success: false,
      status: 'not_ready',
      database: 'disconnected',
      message: 'Database is not ready'
    })
  }

  return res.json({
    success: true,
    status: 'ready',
    database: 'connected',
    redis: isRedisConnected ? 'connected' : 'disabled'
  })
})

// API Routes Mount
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

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT ? parseInt(String(process.env.PORT).replace(/^["']|["']$/g, '').trim(), 10) || 5000 : 5000

const startServer = async () => {
  try {
    await connectDB()
    await connectRedis()

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 CMHS Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`)
    })
  } catch (error) {
    console.error('❌ Server startup failure:', error.message)
    process.exit(1)
  }
}

startServer()

export default app
