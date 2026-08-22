import jwt from 'jsonwebtoken'
import crypto from 'crypto'

/**
 * Get JWT Access Secret
 */
const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('FATAL: JWT_SECRET environment variable is not defined in production.')
    }
    return 'cmhs-dev-jwt-access-secret-minimum-32-chars!'
  }
  return secret
}

/**
 * Get JWT Refresh Secret
 */
const getRefreshSecret = () => {
  const secret = process.env.REFRESH_TOKEN_SECRET
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('FATAL: REFRESH_TOKEN_SECRET environment variable is not defined in production.')
    }
    return 'cmhs-dev-jwt-refresh-secret-minimum-32-chars!'
  }
  return secret
}

/**
 * Generate standard access token
 * @param {string} id - User ID
 * @param {string} role - User role
 * @param {string} [jti] - Optional session ID
 */
export const generateToken = (id, role, jti = null) => {
  const secret = getJwtSecret()
  const payload = {
    sub: String(id),
    id: String(id),
    role: role || 'student',
    type: 'access',
    jti: jti || crypto.randomUUID()
  }

  return jwt.sign(payload, secret, {
    expiresIn: process.env.JWT_EXPIRY || '30m'
  })
}

/**
 * Generate standard refresh token
 * @param {string} id - User ID
 * @param {string} role - User role
 * @param {string} [jti] - Optional session ID
 */
export const generateRefreshToken = (id, role, jti = null) => {
  const secret = getRefreshSecret()
  const payload = {
    sub: String(id),
    id: String(id),
    role: role || 'student',
    type: 'refresh',
    jti: jti || crypto.randomUUID()
  }

  return jwt.sign(payload, secret, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '14d'
  })
}

/**
 * Verify Access Token
 * @param {string} token
 */
export const verifyToken = (token) => {
  const secret = getJwtSecret()
  const decoded = jwt.verify(token, secret)
  if (decoded.type && decoded.type !== 'access') {
    throw new Error('Invalid token type: expected access token')
  }
  return decoded
}

/**
 * Verify Refresh Token
 * @param {string} token
 */
export const verifyRefreshToken = (token) => {
  const secret = getRefreshSecret()
  const decoded = jwt.verify(token, secret)
  if (decoded.type && decoded.type !== 'refresh') {
    throw new Error('Invalid token type: expected refresh token')
  }
  return decoded
}

export default {
  generateToken,
  generateRefreshToken,
  verifyToken,
  verifyRefreshToken
}