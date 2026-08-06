import Gallery from '../models/Gallery.js'
import BaseService from '../services/baseService.js'

class GalleryService extends BaseService {
  constructor() {
    super(Gallery)
  }
}

const galleryService = new GalleryService()

export { galleryService }
