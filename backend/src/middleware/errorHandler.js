import { StatusCodes } from 'http-status-codes'

const errorHandler = (err, req, res, _next) => {
  console.error(err)

  let statusCode = err.statusCode || err.status || StatusCodes.INTERNAL_SERVER_ERROR
  let message = err.message || 'Internal Server Error'

  if (err.name === 'CastError') {
    statusCode = StatusCodes.BAD_REQUEST
    message = 'Invalid ID format'
  }

  if (err.code && err.code === 11000) {
    const field = Object.keys(err.keyValue)[0]
    statusCode = StatusCodes.CONFLICT
    message = `${field} already exists`
  }

  if (err.name === 'ValidationError') {
    statusCode = StatusCodes.BAD_REQUEST
    message = 'Validation failed'
  }

  if (err.name === 'JsonWebTokenError') {
    statusCode = StatusCodes.UNAUTHORIZED
    message = 'Invalid token'
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = StatusCodes.UNAUTHORIZED
    message = 'Token expired'
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
}

export default errorHandler
