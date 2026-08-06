import Page from '../models/Page.js'
import BaseService from './baseService.js'

class PageService extends BaseService {
  constructor() {
    super(Page)
  }
}

export const pageService = new PageService()
