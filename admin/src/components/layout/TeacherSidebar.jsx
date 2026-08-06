import { Outlet } from 'react-router-dom'
import { FiCalendar, FiClipboard, FiUsers, FiFileText, FiBell, FiBarChart2 } from 'react-icons/fi'
import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const navItems = [
  { path: '/teacher', label: 'Dashboard', icon: <FiBarChart2 size={20} /> },
  { path: '/teacher/classes', label: 'My Classes', icon: <FiUsers size={20} /> },
  { path: '/teacher/routine', label: 'Routine', icon: <FiCalendar size={20} /> },
  { path: '/teacher/attendance', label: 'Attendance', icon: <FiClipboard size={20} /> },
  { path: '/teacher/students', label: 'Students', icon: <FiUsers size={20} /> },
  { path: '/teacher/results', label: 'Results', icon: <FiFileText size={20} /> },
  { path: '/teacher/notices', label: 'Notices', icon: <FiBell size={20} /> }
]

const TeacherSidebar = ({ mobileOpen, setMobileOpen }) => {
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
            <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
            <div className="absolute left-0 top-0 h-full w-64 bg-white shadow-xl overflow-y-auto">
              <SidebarContent />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <aside className="hidden md:block h-screen w-64 bg-white border-r border-gray-200 overflow-y-auto">
        <SidebarContent />
      </aside>
    </>
  )
}

const SidebarContent = () => (
  <div className="flex flex-col h-full">
    <div className="p-4 border-b border-gray-200">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
          CM
        </div>
        <span className="font-bold text-lg text-gray-900">Teacher Portal</span>
      </div>
    </div>
    <nav className="flex-1 py-2">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg mx-2 transition-all ${
              isActive
                ? 'text-primary bg-primary/5 border-r-2 border-primary'
                : 'text-gray-700 hover:text-primary hover:bg-gray-50'
            }`
          }
        >
          {item.icon}
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  </div>
)

export default TeacherSidebar


