import { createController, asyncHandler } from './baseController.js'
import { mediaService } from '../services/mediaService.js'
import {
  uploadFile,
  uploadDirectToCloudinary,
  deleteCloudinaryFile,
  listCloudinaryResources,
  getCloudinaryStatus,
  isCloudinaryConfigured
} from '../utils/upload.js'
import { clearCache } from '../middleware/cache.js'
import { auditLogService } from '../services/auditLogService.js'
import { StatusCodes } from 'http-status-codes'

const uploadMedia = asyncHandler(async (req, res) => {
  if (!req.file && !req.body.image) {
    return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: 'No file or image uploaded' })
  }

  const folder = req.body.folder || 'school-management/cms'
  let uploadResult = null

  if (req.file) {
    uploadResult = await uploadFile(req.file, { folder })
  } else if (req.body.image) {
    if (req.body.image.startsWith('data:') || req.body.image.startsWith('http')) {
      if (isCloudinaryConfigured()) {
        uploadResult = await uploadDirectToCloudinary(req.body.image, { folder })
      } else {
        uploadResult = {
          url: req.body.image,
          public_id: null,
          format: 'jpg',
          width: null,
          height: null,
          bytes: 0,
          resource_type: 'image'
        }
      }
    } else {
      uploadResult = {
        url: req.body.image,
        public_id: null,
        format: 'jpg',
        width: null,
        height: null,
        bytes: 0,
        resource_type: 'image'
      }
    }
  }

  const mediaRecord = await mediaService.create({
    name: req.body.name || (req.file ? req.file.originalname : 'Uploaded Media'),
    url: uploadResult.url,
    public_id: uploadResult.public_id || undefined,
    folder: folder,
    mimeType: req.file ? req.file.mimetype : 'image/jpeg',
    format: uploadResult.format || 'jpg',
    width: uploadResult.width || undefined,
    height: uploadResult.height || undefined,
    resourceType: uploadResult.resource_type || 'image',
    size: uploadResult.bytes || (req.file ? req.file.size : 0),
    createdBy: req.user ? (req.user._id || req.user.id) : null
  })

  await clearCache('media:*')

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: 'Media uploaded successfully to Cloudinary',
    url: uploadResult.url,
    public_id: uploadResult.public_id,
    data: mediaRecord
  })
})

const uploadDirect = asyncHandler(async (req, res) => {
  const { source, name, folder = 'school-management/cms' } = req.body
  if (!source) {
    return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: 'Image source (base64 or URL) is required' })
  }

  const uploadResult = await uploadDirectToCloudinary(source, { folder })

  const mediaRecord = await mediaService.create({
    name: name || 'Direct Upload Media',
    url: uploadResult.url,
    public_id: uploadResult.public_id,
    folder,
    mimeType: 'image/jpeg',
    format: uploadResult.format,
    width: uploadResult.width,
    height: uploadResult.height,
    resourceType: uploadResult.resource_type,
    size: uploadResult.bytes || 0,
    createdBy: req.user ? (req.user._id || req.user.id) : null
  })

  await clearCache('media:*')

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: 'Uploaded directly to Cloudinary',
    url: uploadResult.url,
    public_id: uploadResult.public_id,
    data: mediaRecord
  })
})

const getCloudinaryAssets = asyncHandler(async (req, res) => {
  const { folder, limit, cursor } = req.query
  const data = await listCloudinaryResources({
    prefix: folder || 'school-management',
    max_results: limit ? parseInt(limit, 10) : 50,
    next_cursor: cursor
  })

  res.json({
    success: true,
    data: data.resources,
    next_cursor: data.next_cursor,
    configured: data.configured
  })
})

const getCloudinaryStatusHandler = asyncHandler(async (req, res) => {
  const status = await getCloudinaryStatus()
  res.json({
    success: true,
    data: status
  })
})

const removeMedia = asyncHandler(async (req, res) => {
  const item = await mediaService.getById(req.params.id)
  if (!item) {
    return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'Media item not found' })
  }

  // If stored in Cloudinary, delete from Cloudinary
  if (item.public_id) {
    await deleteCloudinaryFile(item.public_id, item.resourceType || 'image')
  }

  await mediaService.remove(req.params.id)
  await clearCache('media:*')

  if (req.user) {
    await auditLogService.logAction({
      user: req.user,
      action: 'DELETE',
      resource: 'Media',
      recordId: req.params.id,
      details: { deletedRecord: item },
      req
    })
  }

  res.json({
    success: true,
    message: 'Media deleted successfully from database and Cloudinary'
  })
})

const baseCtrl = createController(mediaService, { resourceName: 'Media', cacheKey: 'media' })

export const mediaController = {
  ...baseCtrl,
  uploadMedia,
  uploadDirect,
  getCloudinaryAssets,
  getCloudinaryStatus: getCloudinaryStatusHandler,
  remove: removeMedia
}

export { uploadMedia, uploadDirect, getCloudinaryAssets, getCloudinaryStatusHandler as getCloudinaryStatus, removeMedia }

