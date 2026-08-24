import { NavLink, Link } from 'react-router-dom'
import { FiHome, FiBook, FiUsers, FiPhone, FiImage, FiClipboard, FiCalendar, FiLogOut } from 'react-icons/fi'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const AdminSidebar = ({ mobileOpen, setMobileOpen }) => {
  const [isCollapsed, _setIsCollapsed] = useState(false)

  const menuGroups = [
    {
      label: 'Main',
      items: [
        { path: '/', icon: <FiHome size={20} />, label: 'Dashboard', end: true },
        { path: '/analytics', icon: <FiClipboard size={20} />, label: 'Analytics' }
      ]
    },
    {
      label: 'Management',
      items: [
        { path: '/teachers', icon: <FiUsers size={20} />, label: 'Teachers' }
      ]
    },
    {
      label: 'Academic',
      items: [
        { path: '/results', icon: <FiClipboard size={20} />, label: 'Results' },
        { path: '/routines', icon: <FiCalendar size={20} />, label: 'Routines' },
        { path: '/curriculum', icon: <FiBook size={20} />, label: 'Curriculum' }
      ]
    },
    {
      label: 'Content',
      items: [
        { path: '/cms', icon: <FiClipboard size={20} />, label: 'CMS Engine' },
        { path: '/media', icon: <FiImage size={20} />, label: 'Media Library' },
        { path: '/notices', icon: <FiClipboard size={20} />, label: 'Notices' },
        { path: '/events', icon: <FiCalendar size={20} />, label: 'Events' },
        { path: '/gallery', icon: <FiImage size={20} />, label: 'Gallery' },
        { path: '/contacts', icon: <FiPhone size={20} />, label: 'Contacts' }
      ]
    },
    {
      label: 'System',
      items: [
        { path: '/settings', icon: <FiClipboard size={20} />, label: 'Settings' },
        { path: '/users', icon: <FiUsers size={20} />, label: 'Users' },
        { path: '/profile', icon: <FiHome size={20} />, label: 'Profile' }
      ]
    }
  ]

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
            CM
          </div>
          {!isCollapsed && <span className="font-bold text-lg text-gray-900">Admin Panel</span>}
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-2">
        {menuGroups.map((group) => (
          <div key={group.label} className="mb-4">
            {!isCollapsed && (
              <h3 className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
                {group.label}
              </h3>
            )}
            {group.items.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg mx-2 transition-all ${
                    isActive
                      ? 'text-primary bg-primary/5 border-r-2 border-primary'
                      : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                  }`
                }
              >
                {item.icon}
                {!isCollapsed && <span>{item.label}</span>}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>
    </div>
  )

  return (
    <>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-0 z-50 md:hidden"
          >
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setMobileOpen(false)}
            />
            <div className="absolute left-0 top-0 h-full w-64 bg-white shadow-xl overflow-y-auto">
              {sidebarContent}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <aside className={`hidden md:block h-screen bg-white border-r border-gray-200 transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
        {sidebarContent}
      </aside>
    </>
  )
}

export default AdminSidebar


