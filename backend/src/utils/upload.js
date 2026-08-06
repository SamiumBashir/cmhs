import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
import { StatusCodes } from 'http-status-codes'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

const upload = multer({
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed!'), false)
    }
  }
})

const uploadToCloudinary = async (file) => {
  const result = await cloudinary.uploader.upload(file.path, {
    folder: 'school-management',
    quality: 'auto',
    fetch_format: 'auto'
  })
  return result.secure_url
}

const handleUpload = (req, res, next) => {
  if (!req.file) {
    return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: 'No file uploaded' })
  }
  next()
}

export { upload, uploadToCloudinary, handleUpload, cloudinary }
