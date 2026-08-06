const sanitizeSchema = (schema) => {
  schema.pre('save', function (next) {
    for (const key in this) {
      if (typeof this[key] === 'string') {
        this[key] = this[key].replace(/[^\w\s@.\-]/g, '')
      }
    }
    next()
  })
  return schema
}

export default sanitizeSchema