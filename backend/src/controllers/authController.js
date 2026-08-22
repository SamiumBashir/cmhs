import bcrypt from 'bcryptjs'
import Admin from '../models/Admin.js'
import Teacher from '../models/Teacher.js'
import Student from '../models/Student.js'
import { generateToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.js'

/**
 * Serialize user document into a safe response object (no passwords, tokens, internal fields)
 */
export const toSafeUser = (user, role = null) => {
  if (!user) return null
  const obj = user.toObject ? user.toObject() : { ...user }

  delete obj.password
  delete obj.__v
  delete obj.resetPasswordToken
  delete obj.resetPasswordExpire

  return {
    id: obj._id,
    _id: obj._id,
    name: obj.name,
    email: obj.email,
    role: role || obj.role || 'student',
    status: obj.status || 'active',
    phone: obj.phone,
    studentId: obj.studentId,
    teacherId: obj.teacherId,
    staffId: obj.staffId,
    rollNumber: obj.rollNumber,
    class: obj.class,
    section: obj.section,
    group: obj.group,
    gender: obj.gender,
    designation: obj.designation,
    avatar: obj.avatar,
    lastLogin: obj.lastLogin,
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt
  }
}

/**
 * Login Handler
 * Strictly compares password against stored bcrypt hash (no default/demo bypasses).
 */
const login = async (req, res, next) => {
  try {
    const { email, identifier, password, role } = req.body
    const rawLoginId = (identifier || email || '').trim()

    if (!rawLoginId || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid credentials and password',
        code: 'AUTH_MISSING_CREDENTIALS'
      })
    }

    const escapedId = rawLoginId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const searchRegex = new RegExp(`^${escapedId}$`, 'i')

    // 1. Search in Admin/Staff user collection
    let user = await Admin.findOne({
      $or: [
        { email: searchRegex },
        { teacherId: searchRegex },
        { studentId: searchRegex },
        { rollNumber: rawLoginId },
        { phone: rawLoginId }
      ]
    })
    let userRole = user?.role || role || 'admin'

    // 2. Search in Teacher collection fallback
    if (!user) {
      user = await Teacher.findOne({
        $or: [{ email: searchRegex }, { teacherId: searchRegex }, { phone: rawLoginId }]
      })
      if (user) userRole = 'teacher'
    }

    // 3. Search in Student collection fallback
    if (!user) {
      user = await Student.findOne({
        $or: [{ email: searchRegex }, { studentId: searchRegex }, { rollNumber: rawLoginId }]
      })
      if (user) userRole = 'student'
    }

    if (!user || !user.password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email/ID or password',
        code: 'AUTH_INVALID_CREDENTIALS'
      })
    }

    if (user.status && user.status !== 'active') {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated. Please contact school administration.',
        code: 'AUTH_ACCOUNT_INACTIVE'
      })
    }

    // Strict bcrypt verification
    const isMatch = await bcrypt.compare(password, user.password).catch(() => false)

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email/ID or password',
        code: 'AUTH_INVALID_CREDENTIALS'
      })
    }

    const token = generateToken(user._id, userRole)
    const refreshToken = generateRefreshToken(user._id, userRole)

    if (user.lastLogin !== undefined) {
      user.lastLogin = new Date()
      await user.save({ validateBeforeSave: false })
    }

    const isProduction = process.env.NODE_ENV === 'production'
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/'
    }

    res.cookie('token', token, {
      ...cookieOptions,
      maxAge: 30 * 60 * 1000 // 30 minutes
    })

    res.cookie('refreshToken', refreshToken, {
      ...cookieOptions,
      maxAge: 14 * 24 * 60 * 60 * 1000 // 14 days
    })

    const safeUser = toSafeUser(user, userRole)

    return res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        refreshToken,
        user: safeUser
      }
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Public Register Handler
 * Enforces basic 'student' role only to prevent privilege escalation.
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body

    const existingAdmin = await Admin.findOne({ email: email.toLowerCase() })
    const existingStudent = await Student.findOne({ email: email.toLowerCase() })
    const existingTeacher = await Teacher.findOne({ email: email.toLowerCase() })

    if (existingAdmin || existingStudent || existingTeacher) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists',
        code: 'AUTH_USER_EXISTS'
      })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    // Public registration strictly assigns 'student' role (prevents role escalation)
    const newStudent = await Student.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      class: req.body.class || 'N/A',
      rollNumber: req.body.rollNumber || String(Date.now()).slice(-4),
      status: 'active'
    })

    const token = generateToken(newStudent._id, 'student')
    const refreshToken = generateRefreshToken(newStudent._id, 'student')

    const isProduction = process.env.NODE_ENV === 'production'
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/'
    }

    res.cookie('token', token, { ...cookieOptions, maxAge: 30 * 60 * 1000 })
    res.cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: 14 * 24 * 60 * 60 * 1000 })

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        token,
        refreshToken,
        user: toSafeUser(newStudent, 'student')
      }
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Get Current User Profile
 */
const getMe = async (req, res, next) => {
  try {
    let user = await Admin.findById(req.user.id).select('-password')
    let detectedRole = user?.role || 'admin'

    if (!user) {
      user = await Teacher.findById(req.user.id).select('-password')
      if (user) detectedRole = 'teacher'
    }
    if (!user) {
      user = await Student.findById(req.user.id).select('-password')
      if (user) detectedRole = 'student'
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'User account not found' })
    }

    const safeUser = toSafeUser(user, detectedRole || req.user.role)
    return res.json({ success: true, data: safeUser })
  } catch (error) {
    next(error)
  }
}

/**
 * Update Profile
 */
const updateProfile = async (req, res, next) => {
  try {
    // Disallow role or password updates through general profile update
    const allowedUpdates = { ...req.body }
    delete allowedUpdates.role
    delete allowedUpdates.password
    delete allowedUpdates._id

    let user = await Admin.findByIdAndUpdate(req.user.id, { $set: allowedUpdates }, { new: true, runValidators: true }).select('-password')
    let detectedRole = user?.role || 'admin'

    if (!user) {
      user = await Teacher.findByIdAndUpdate(req.user.id, { $set: allowedUpdates }, { new: true, runValidators: true }).select('-password')
      if (user) detectedRole = 'teacher'
    }
    if (!user) {
      user = await Student.findByIdAndUpdate(req.user.id, { $set: allowedUpdates }, { new: true, runValidators: true }).select('-password')
      if (user) detectedRole = 'student'
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'User account not found' })
    }

    return res.json({ success: true, data: toSafeUser(user, detectedRole) })
  } catch (error) {
    next(error)
  }
}

/**
 * Logout Handler
 */
const logout = async (req, res) => {
  const isProduction = process.env.NODE_ENV === 'production'
  const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/'
  }

  res.clearCookie('token', cookieOptions)
  res.clearCookie('refreshToken', cookieOptions)

  return res.json({ success: true, message: 'Logged out successfully' })
}

/**
 * Refresh Token Handler
 * Strictly accepts and validates type: 'refresh' tokens only.
 */
const refreshToken = async (req, res) => {
  try {
    const rawToken = req.body?.refreshToken || req.cookies?.refreshToken
    if (!rawToken) {
      return res.status(401).json({
        success: false,
        message: 'No refresh token provided',
        code: 'AUTH_NO_REFRESH_TOKEN'
      })
    }

    const decoded = verifyRefreshToken(rawToken)

    if (!decoded || !decoded.id || decoded.type !== 'refresh') {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token',
        code: 'AUTH_INVALID_REFRESH_TOKEN'
      })
    }

    // Verify user still exists and is active
    let user = await Admin.findById(decoded.id)
    let userRole = user?.role || decoded.role

    if (!user) {
      user = await Teacher.findById(decoded.id)
      if (user) userRole = 'teacher'
    }
    if (!user) {
      user = await Student.findById(decoded.id)
      if (user) userRole = 'student'
    }

    if (!user || (user.status && user.status !== 'active')) {
      return res.status(401).json({
        success: false,
        message: 'User account is no longer active',
        code: 'AUTH_USER_INACTIVE'
      })
    }

    // Issue rotated access and refresh tokens
    const newToken = generateToken(user._id, userRole)
    const newRefreshToken = generateRefreshToken(user._id, userRole)

    const isProduction = process.env.NODE_ENV === 'production'
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/'
    }

    res.cookie('token', newToken, { ...cookieOptions, maxAge: 30 * 60 * 1000 })
    res.cookie('refreshToken', newRefreshToken, { ...cookieOptions, maxAge: 14 * 24 * 60 * 60 * 1000 })

    return res.json({
      success: true,
      data: {
        token: newToken,
        refreshToken: newRefreshToken,
        user: toSafeUser(user, userRole)
      }
    })
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired refresh token',
      code: 'AUTH_REFRESH_FAILED'
    })
  }
}

export { login, register, getMe, updateProfile, logout, refreshToken }
