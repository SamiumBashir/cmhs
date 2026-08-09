import { validationResult } from 'express-validator'

const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const errorDetails = errors.array().map(e => e.msg).join(', ')
    return res.status(400).json({
      success: false,
      message: `Validation failed: ${errorDetails}`,
      errors: errors.array()
    })
  }
  next()
}

export default validate