import Download from '../models/Download.js'
import BaseService from './baseService.js'

class DownloadService extends BaseService {
  constructor() {
    super(Download)
  }
}

export const downloadService = new DownloadService()
