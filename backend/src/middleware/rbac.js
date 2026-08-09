import { StatusCodes } from 'http-status-codes'

const checkPermission = (requiredPermission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ success: false, message: 'Authentication required' })
    }

    // Super Admin and Admin have full permissions by default
    if (req.user.role === 'super_admin' || req.user.role === 'admin') {
      return next()
    }

    // Check specific user permissions if defined
    const userPermissions = req.user.permissions || []
    if (userPermissions.includes(requiredPermission)) {
      return next()
    }

    return res.status(StatusCodes.FORBIDDEN).json({
      success: false,
      message: `Access denied: Missing required permission '${requiredPermission}'`
    })
  }
}

export default checkPermission
