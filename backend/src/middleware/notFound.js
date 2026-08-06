import { StatusCodes } from 'http-status-codes'

const notFound = (req, res, _next) => {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`
  })
}

export default notFound