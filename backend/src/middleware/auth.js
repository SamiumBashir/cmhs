import { verifyToken } from '../utils/jwt.js'

const auth = (roles = []) => {
  return (req, res, next) => {
    let token = null

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized, no token' })
    }

    try {
      const decoded = verifyToken(token)
      req.user = decoded

      if (roles.length > 0 && !roles.includes(decoded.role)) {
        return res.status(403).json({ success: false, message: 'Access denied: insufficient permissions' })
      }

      next()
    } catch {
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' })
    }
  }
}

export default auth
