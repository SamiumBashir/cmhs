import express from 'express'
import { body } from 'express-validator'
import validate from '../middleware/validation.js'
import { login, register, getMe, updateProfile } from '../controllers/authController.js'
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

router.get('/me', auth, getMe)

router.put('/profile', auth, updateProfile)

export default router
