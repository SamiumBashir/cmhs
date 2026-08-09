import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
import path from 'path'
import fs from 'fs'

const uploadsDir = path.join(process.cwd(), 'uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

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

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('application/pdf')) {
      cb(null, true)
    } else {
      cb(new Error('Only image and PDF files are allowed!'), false)
    }
  }
})

const uploadFile = async (file) => {
  if (!file) return null

  const hasCloudinary = process.env.CLOUDINARY_CLOUD_NAME &&
                        process.env.CLOUDINARY_CLOUD_NAME !== 'your-cloud-name' &&
                        process.env.CLOUDINARY_API_KEY &&
                        process.env.CLOUDINARY_API_KEY !== 'your-api-key'

  if (hasCloudinary) {
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'school-management',
        quality: 'auto',
        fetch_format: 'auto'
      })
      if (fs.existsSync(file.path)) fs.unlinkSync(file.path)
      return result.secure_url
    } catch (err) {
      console.warn('Cloudinary upload failed, using local file URL:', err.message)
    }
  }

  const filename = path.basename(file.path)
  return `/uploads/${filename}`
}

const handleUpload = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' })
  }
  next()
}

export { upload, uploadFile, handleUpload, cloudinary }
