import bcrypt from 'bcryptjs'
import Admin from '../models/Admin.js'
import Teacher from '../models/Teacher.js'
import Student from '../models/Student.js'
import { generateToken, generateRefreshToken } from '../utils/jwt.js'

const login = async (req, res, next) => {
  try {
    const { email, identifier, password, role } = req.body
    const loginId = identifier || email

    if (!loginId || !password) {
      return res.status(400).json({ success: false, message: 'Please provide login credentials and password' })
    }

    // Search Admin user collection first by Email, TeacherId, StudentId, Roll, or Phone
    let user = await Admin.findOne({
      $or: [
        { email: loginId },
        { teacherId: loginId },
        { studentId: loginId },
        { rollNumber: loginId },
        { phone: loginId }
      ]
    })

    let userRole = user?.role || role || 'admin'

    // Fallbacks if user exists in legacy Teacher or Student collections
    if (!user) {
      user = await Teacher.findOne({
        $or: [{ email: loginId }, { teacherId: loginId }, { phone: loginId }]
      })
      if (user) userRole = 'teacher'
    }

    if (!user) {
      user = await Student.findOne({
        $or: [{ email: loginId }, { studentId: loginId }, { rollNumber: loginId }]
      })
      if (user) userRole = 'student'
    }

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials or user not found' })
    }

    if (user.status && user.status !== 'active') {
      return res.status(403).json({ success: false, message: 'Account is deactivated' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' })
    }

    const token = generateToken(user._id, userRole)
    const refreshToken = generateRefreshToken(user._id, userRole)

    if (user.lastLogin !== undefined) {
      user.lastLogin = new Date()
      await user.save({ validateBeforeSave: false })
    }

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'strict'
    })

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        refreshToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: userRole,
          studentId: user.studentId,
          teacherId: user.teacherId,
          rollNumber: user.rollNumber,
          class: user.class,
          section: user.section
        }
      }
    })
  } catch (error) {
    next(error)
  }
}

const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body

    const existingAdmin = await Admin.findOne({ email })
    if (existingAdmin) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const admin = await Admin.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'admin'
    })

    const token = generateToken(admin._id, admin.role)

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        token,
        user: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role
        }
      }
    })
  } catch (error) {
    next(error)
  }
}

const getMe = async (req, res, next) => {
  try {
    let user = await Admin.findById(req.user.id).select('-password')
    if (!user) user = await Teacher.findById(req.user.id).select('-password')
    if (!user) user = await Student.findById(req.user.id).select('-password')

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }
    res.json({ success: true, data: user })
  } catch (error) {
    next(error)
  }
}

const updateProfile = async (req, res, next) => {
  try {
    let user = await Admin.findByIdAndUpdate(req.user.id, { $set: req.body }, { new: true, runValidators: true }).select('-password')
    if (!user) user = await Teacher.findByIdAndUpdate(req.user.id, { $set: req.body }, { new: true, runValidators: true }).select('-password')
    if (!user) user = await Student.findByIdAndUpdate(req.user.id, { $set: req.body }, { new: true, runValidators: true }).select('-password')

    res.json({ success: true, data: user })
  } catch (error) {
    next(error)
  }
}

export { login, register, getMe, updateProfile }
