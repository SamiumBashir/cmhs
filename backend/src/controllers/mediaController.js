import { createController, asyncHandler } from './baseController.js'
import { mediaService } from '../services/mediaService.js'
import { uploadFile } from '../utils/upload.js'

const uploadMedia = asyncHandler(async (req, res) => {
  if (!req.file && !req.body.image) {
    return res.status(400).json({ success: false, message: 'No file uploaded' })
  }

  let fileUrl = ''
  if (req.file) {
    fileUrl = await uploadFile(req.file)
  } else if (req.body.image) {
    fileUrl = req.body.image
  }

  const mediaRecord = await mediaService.create({
    name: req.file ? req.file.originalname : 'Uploaded Image',
    url: fileUrl,
    fileType: req.file ? req.file.mimetype : 'image/jpeg',
    fileSize: req.file ? `${Math.round(req.file.size / 1024)} KB` : '100 KB',
    uploadedBy: req.user ? (req.user._id || req.user.id) : null
  })

  res.json({
    success: true,
    message: 'Image uploaded successfully',
    url: fileUrl,
    data: mediaRecord
  })
})

export const mediaController = {
  ...createController(mediaService),
  uploadMedia
}
export { uploadMedia }
