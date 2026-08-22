import express from 'express'
import { body } from 'express-validator'
import validate from '../middleware/validation.js'
import { login, register, getMe, updateProfile, logout, refreshToken } from '../controllers/authController.js'
import auth from '../middleware/auth.js'

const router = express.Router()

router.post('/login', [
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], (req, res, next) => {
  if (!req.body.email && !req.body.identifier) {
    return res.status(400).json({ success: false, message: 'Valid email, Student ID, or Teacher ID is required' })
  }
  next()
}, validate, login)

router.post('/register', [
  body('name.bn').notEmpty().withMessage('Bengali name is required'),
  body('name.en').notEmpty().withMessage('English name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['super_admin', 'admin', 'teacher', 'student', 'editor', 'moderator']).optional()
], validate, register)

router.post('/logout', logout)
router.post('/refresh', refreshToken)
router.get('/me', auth, getMe)
router.put('/profile', auth, updateProfile)

// Force seed default admin user (useful for first-time Railway/Vercel deploy)
router.get('/seed-admin', async (req, res) => {
  try {
    const bcrypt = await import('bcryptjs')
    const Admin = (await import('../models/Admin.js')).default

    const adminPassword = await bcrypt.default.hash('admin123', 12)
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

    const teacherPassword = await bcrypt.default.hash('teacher123', 12)
    await Admin.findOneAndUpdate(
      { email: 'teacher@cmhs.edu.bd' },
      {
        name: { en: 'Demo Teacher', bn: 'ডেমো শিক্ষক' },
        email: 'teacher@cmhs.edu.bd',
        password: teacherPassword,
        role: 'teacher',
        teacherId: 'T-101',
        status: 'active'
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    )

    const studentPassword = await bcrypt.default.hash('student123', 12)
    await Admin.findOneAndUpdate(
      { email: 'student@cmhs.edu.bd' },
      {
        name: { en: 'Demo Student', bn: 'ডেমো ছাত্র' },
        email: 'student@cmhs.edu.bd',
        password: studentPassword,
        role: 'student',
        studentId: 'S-1001',
        rollNumber: '1001',
        status: 'active'
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    )

    return res.json({
      success: true,
      message: 'Default users seeded successfully',
      credentials: {
        admin: { email: 'admin@cmhs.edu.bd', password: 'admin123' },
        teacher: { email: 'teacher@cmhs.edu.bd', password: 'teacher123' },
        student: { email: 'student@cmhs.edu.bd', password: 'student123' }
      }
    })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
})

export default router
