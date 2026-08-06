import Menu from '../models/Menu.js'
import BaseService from './baseService.js'

class MenuService extends BaseService {
  constructor() {
    super(Menu)
  }

  async getMenusByPosition(position = 'header') {
    return await this.model.find({ position, isActive: true }).sort({ order: 1 }).exec()
  }
}

export const menuService = new MenuService()
