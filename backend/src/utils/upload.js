import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
import path from 'path'
import fs from 'fs'

const uploadsDir = path.join(process.cwd(), 'uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

const configureCloudinary = () => {
  const cloud_name = process.env.CLOUDINARY_CLOUD_NAME
  const api_key = process.env.CLOUDINARY_API_KEY
  const api_secret = process.env.CLOUDINARY_API_SECRET

  if (cloud_name && api_key && api_secret) {
    cloudinary.config({
      cloud_name,
      api_key,
      api_secret,
      secure: true
    })
  }
}

configureCloudinary()

export const isCloudinaryConfigured = () => {
  const name = process.env.CLOUDINARY_CLOUD_NAME
  const key = process.env.CLOUDINARY_API_KEY
  const secret = process.env.CLOUDINARY_API_SECRET

  return Boolean(
    name &&
    name !== 'your-cloud-name' &&
    key &&
    key !== 'your-api-key' &&
    secret &&
    secret !== 'your-api-secret'
  )
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    const ext = path.extname(file.originalname) || '.jpg'
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`)
  }
})

export const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB max limit
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype.startsWith('image/') ||
      file.mimetype.startsWith('application/pdf') ||
      file.mimetype.includes('document') ||
      file.mimetype.includes('sheet')
    ) {
      cb(null, true)
    } else {
      cb(new Error('Only images, PDFs, and document files are allowed!'), false)
    }
  }
})

/**
 * Upload a file to Cloudinary with fallback to local static storage
 * @param {Object} file - Multer file object
 * @param {Object} options - Upload options (folder, tags, etc.)
 */
export const uploadFile = async (file, options = {}) => {
  if (!file) return null

  configureCloudinary()
  const targetFolder = options.folder || 'school-management/cms'

  if (isCloudinaryConfigured()) {
    try {
      const isPdf = file.mimetype === 'application/pdf'
      const uploadParams = {
        folder: targetFolder,
        resource_type: isPdf ? 'raw' : 'auto',
        tags: options.tags || ['school-cms'],
        quality: isPdf ? undefined : 'auto',
        fetch_format: isPdf ? undefined : 'auto'
      }

      const result = await cloudinary.uploader.upload(file.path, uploadParams)

      // Remove local temporary file after successful Cloudinary upload
      if (fs.existsSync(file.path)) {
        try {
          fs.unlinkSync(file.path)
        } catch {
          // ignore cleanup error
        }
      }

      return {
        url: result.secure_url,
        public_id: result.public_id,
        format: result.format || path.extname(file.originalname).replace('.', ''),
        width: result.width || null,
        height: result.height || null,
        bytes: result.bytes || file.size,
        resource_type: result.resource_type || (isPdf ? 'raw' : 'image')
      }
    } catch (err) {
      console.warn('Cloudinary upload failed, falling back to local file:', err.message)
    }
  }

  // Fallback to local storage URL
  const filename = path.basename(file.path)
  return {
    url: `/uploads/${filename}`,
    public_id: null,
    format: path.extname(file.originalname).replace('.', '') || 'jpg',
    width: null,
    height: null,
    bytes: file.size || 0,
    resource_type: file.mimetype.startsWith('image/') ? 'image' : 'raw'
  }
}

/**
 * Upload a base64 string or remote URL directly to Cloudinary
 */
export const uploadDirectToCloudinary = async (source, options = {}) => {
  if (!source) return null

  configureCloudinary()
  const targetFolder = options.folder || 'school-management/cms'

  if (!isCloudinaryConfigured()) {
    throw new Error('Cloudinary is not configured on the server. Please check your CLOUDINARY_* environment variables.')
  }

  const result = await cloudinary.uploader.upload(source, {
    folder: targetFolder,
    resource_type: options.resource_type || 'auto',
    tags: options.tags || ['school-cms-direct'],
    quality: 'auto',
    fetch_format: 'auto'
  })

  return {
    url: result.secure_url,
    public_id: result.public_id,
    format: result.format,
    width: result.width,
    height: result.height,
    bytes: result.bytes,
    resource_type: result.resource_type
  }
}

/**
 * Delete a file from Cloudinary
 */
export const deleteCloudinaryFile = async (public_id, resource_type = 'image') => {
  if (!public_id || !isCloudinaryConfigured()) return false

  try {
    configureCloudinary()
    const res = await cloudinary.uploader.destroy(public_id, { resource_type })
    return res.result === 'ok'
  } catch (err) {
    console.warn(`Failed to delete asset ${public_id} from Cloudinary:`, err.message)
    return false
  }
}

/**
 * List assets from Cloudinary
 */
export const listCloudinaryResources = async (options = {}) => {
  if (!isCloudinaryConfigured()) {
    return { resources: [], next_cursor: null, configured: false }
  }

  try {
    configureCloudinary()
    const prefix = options.prefix || 'school-management'
    const max_results = options.max_results || 50
    const next_cursor = options.next_cursor || undefined

    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix,
      max_results,
      next_cursor
    })

    return {
      resources: (result.resources || []).map(r => ({
        public_id: r.public_id,
        url: r.secure_url,
        format: r.format,
        width: r.width,
        height: r.height,
        bytes: r.bytes,
        created_at: r.created_at,
        resource_type: r.resource_type,
        folder: r.folder || ''
      })),
      next_cursor: result.next_cursor || null,
      configured: true
    }
  } catch (err) {
    console.error('Error fetching Cloudinary resources:', err.message)
    throw err
  }
}

/**
 * Check Cloudinary status
 */
export const getCloudinaryStatus = async () => {
  const configured = isCloudinaryConfigured()
  if (!configured) {
    return { configured: false, status: 'unconfigured', cloud_name: null }
  }

  try {
    configureCloudinary()
    const ping = await cloudinary.api.ping()
    return {
      configured: true,
      status: ping.status === 'ok' ? 'connected' : 'error',
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME
    }
  } catch (err) {
    return {
      configured: true,
      status: 'error',
      message: err.message,
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME
    }
  }
}

export const handleUpload = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' })
  }
  next()
}

export { cloudinary }

