import Contact from '../models/Contact.js'
import BaseService from '../services/baseService.js'

class ContactService extends BaseService {
  constructor() {
    super(Contact)
  }
}

const contactService = new ContactService()

export { contactService }
