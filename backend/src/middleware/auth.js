import { verifyToken } from '../utils/jwt.js'

const handleAuth = (allowedRoles, req, res, next) => {
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

    if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
      return res.status(403).json({ success: false, message: 'Access denied: insufficient permissions' })
    }

    next()
  } catch {
    return res.status(401).json({ success: false, message: 'Not authorized, token failed' })
  }
}

const auth = (rolesOrReq = [], res, next) => {
  // If invoked directly as Express middleware: router.get('/', auth, handler)
  if (rolesOrReq && rolesOrReq.headers && typeof next === 'function') {
    return handleAuth([], rolesOrReq, res, next)
  }

  // If invoked as a factory function: router.get('/', auth(['admin']), handler) or auth()
  const allowedRoles = Array.isArray(rolesOrReq)
    ? rolesOrReq
    : (typeof rolesOrReq === 'string' ? [rolesOrReq] : [])

  return (req, res, next) => handleAuth(allowedRoles, req, res, next)
}

export default auth

