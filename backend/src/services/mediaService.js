import Media from '../models/Media.js'
import BaseService from './baseService.js'

class MediaService extends BaseService {
  constructor() {
    super(Media)
  }
}

export const mediaService = new MediaService()
