import jwt from 'jsonwebtoken'

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'chilahati-super-secret-jwt-key-2024', {
    expiresIn: process.env.JWT_EXPIRY || '7d'
  })
}

const generateRefreshToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.REFRESH_TOKEN_SECRET || 'chilahati-refresh-token-secret', {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '30d'
  })
}

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET || 'chilahati-super-secret-jwt-key-2024')
}

const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET || 'chilahati-refresh-token-secret')
}

export { generateToken, generateRefreshToken, verifyToken, verifyRefreshToken }