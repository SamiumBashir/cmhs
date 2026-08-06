import Faq from '../models/Faq.js'
import BaseService from './baseService.js'

class FaqService extends BaseService {
  constructor() {
    super(Faq)
  }
}

export const faqService = new FaqService()
