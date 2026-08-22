import api from './api'

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data)
}

export const studentService = {
  getAll: (params) => api.get('/students', { params }),
  getById: (id) => api.get(`/students/${id}`),
  create: (data) => api.post('/students', data),
  update: (id, data) => api.put(`/students/${id}`, data),
  remove: (id) => api.delete(`/students/${id}`)
}

export const teacherService = {
  getAll: (params) => api.get('/teachers', { params }),
  getById: (id) => api.get(`/teachers/${id}`),
  create: (data) => api.post('/teachers', data),
  update: (id, data) => api.put(`/teachers/${id}`, data),
  remove: (id) => api.delete(`/teachers/${id}`)
}

export const staffService = {
  getAll: (params) => api.get('/staff', { params }),
  getById: (id) => api.get(`/staff/${id}`),
  create: (data) => api.post('/staff', data),
  update: (id, data) => api.put(`/staff/${id}`, data),
  remove: (id) => api.delete(`/staff/${id}`)
}

export const noticeService = {
  getAll: (params) => api.get('/notices', { params }),
  getById: (id) => api.get(`/notices/${id}`),
  getByCategory: (category) => api.get(`/notices/category/${category}`),
  create: (data) => api.post('/notices', data),
  update: (id, data) => api.put(`/notices/${id}`, data),
  remove: (id) => api.delete(`/notices/${id}`)
}

export const galleryService = {
  getAll: (params) => api.get('/gallery', { params }),
  getById: (id) => api.get(`/gallery/${id}`),
  create: (data) => api.post('/gallery', data),
  update: (id, data) => api.put(`/gallery/${id}`, data),
  remove: (id) => api.delete(`/gallery/${id}`)
}

export const admissionService = {
  getAll: (params) => api.get('/admissions', { params }),
  getById: (id) => api.get(`/admissions/${id}`),
  create: (data) => api.post('/admissions', data),
  update: (id, data) => api.put(`/admissions/${id}`, data),
  remove: (id) => api.delete(`/admissions/${id}`)
}

export const resultService = {
  getAll: (params) => api.get('/results', { params }),
  getById: (id) => api.get(`/results/${id}`),
  getByStudent: (studentId, params) => api.get(`/results/student/${studentId}`, { params }),
  create: (data) => api.post('/results', data),
  update: (id, data) => api.put(`/results/${id}`, data),
  remove: (id) => api.delete(`/results/${id}`)
}

export const routineService = {
  getAll: (params) => api.get('/routines', { params }),
  getById: (id) => api.get(`/routines/${id}`),
  create: (data) => api.post('/routines', data),
  update: (id, data) => api.put(`/routines/${id}`, data),
  remove: (id) => api.delete(`/routines/${id}`)
}

export const attendanceService = {
  getAll: (params) => api.get('/attendance', { params }),
  getById: (id) => api.get(`/attendance/${id}`),
  create: (data) => api.post('/attendance', data),
  update: (id, data) => api.put(`/attendance/${id}`, data)
}

export const settingsService = {
  get: () => api.get('/settings'),
  update: (data) => api.put('/settings', data)
}

export const homepageService = {
  get: () => api.get('/homepage'),
  update: (data) => api.put('/homepage', data)
}

export const mediaService = {
  getAll: (params) => api.get('/media', { params }),
  getById: (id) => api.get(`/media/${id}`),
  upload: (formData) => api.post('/media/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  uploadDirect: (data) => api.post('/media/upload-direct', data),
  getCloudinaryAssets: (params) => api.get('/media/cloudinary', { params }),
  getCloudinaryStatus: () => api.get('/media/cloudinary/status'),
  create: (data) => api.post('/media', data),
  update: (id, data) => api.put(`/media/${id}`, data),
  remove: (id) => api.delete(`/media/${id}`)
}


export const menuService = {
  getAll: (params) => api.get('/menus', { params }),
  getById: (id) => api.get(`/menus/${id}`),
  create: (data) => api.post('/menus', data),
  update: (id, data) => api.put(`/menus/${id}`, data),
  remove: (id) => api.delete(`/menus/${id}`)
}

export const pageService = {
  getAll: (params) => api.get('/pages', { params }),
  getById: (id) => api.get(`/pages/${id}`),
  create: (data) => api.post('/pages', data),
  update: (id, data) => api.put(`/pages/${id}`, data),
  remove: (id) => api.delete(`/pages/${id}`)
}

export const faqService = {
  getAll: (params) => api.get('/faq', { params }),
  getById: (id) => api.get(`/faq/${id}`),
  create: (data) => api.post('/faq', data),
  update: (id, data) => api.put(`/faq/${id}`, data),
  remove: (id) => api.delete(`/faq/${id}`)
}

export const downloadService = {
  getAll: (params) => api.get('/downloads', { params }),
  getById: (id) => api.get(`/downloads/${id}`),
  create: (data) => api.post('/downloads', data),
  update: (id, data) => api.put(`/downloads/${id}`, data),
  remove: (id) => api.delete(`/downloads/${id}`)
}

export const websiteService = {
  getInfo: () => api.get('/website/info'),
  getNavigation: () => api.get('/website/navigation')
}

export const contactService = {
  getAll: (params) => api.get('/contact', { params }),
  getById: (id) => api.get(`/contact/${id}`),
  create: (data) => api.post('/contact', data),
  update: (id, data) => api.put(`/contact/${id}`, data),
  remove: (id) => api.delete(`/contact/${id}`)
}

export const eventService = {
  getAll: (params) => api.get('/events', { params }),
  getById: (id) => api.get(`/events/${id}`),
  create: (data) => api.post('/events', data),
  update: (id, data) => api.put(`/events/${id}`, data),
  remove: (id) => api.delete(`/events/${id}`)
}

export const classService = {
  getAll: (params) => api.get('/classes', { params }),
  getById: (id) => api.get(`/classes/${id}`),
  create: (data) => api.post('/classes', data),
  update: (id, data) => api.put(`/classes/${id}`, data),
  remove: (id) => api.delete(`/classes/${id}`)
}

export const subjectService = {
  getAll: (params) => api.get('/subjects', { params }),
  getById: (id) => api.get(`/subjects/${id}`),
  create: (data) => api.post('/subjects', data),
  update: (id, data) => api.put(`/subjects/${id}`, data),
  remove: (id) => api.delete(`/subjects/${id}`)
}

export const curriculumService = {
  getAll: (params) => api.get('/curriculum', { params }),
  getById: (id) => api.get(`/curriculum/${id}`),
  create: (data) => api.post('/curriculum', data),
  update: (id, data) => api.put(`/curriculum/${id}`, data),
  remove: (id) => api.delete(`/curriculum/${id}`)
}

export const adminService = {
  getAll: (params) => api.get('/admin/users', { params }),
  getById: (id) => api.get(`/admin/users/${id}`),
  create: (data) => api.post('/admin/users', data),
  update: (id, data) => api.put(`/admin/users/${id}`, data),
  remove: (id) => api.delete(`/admin/users/${id}`)
}

export default {
  authService,
  adminService,
  studentService,
  teacherService,
  staffService,
  noticeService,
  galleryService,
  admissionService,
  resultService,
  routineService,
  attendanceService,
  settingsService,
  homepageService,
  mediaService,
  menuService,
  pageService,
  faqService,
  downloadService,
  websiteService,
  contactService,
  eventService,
  curriculumService,
  classService,
  subjectService
}
