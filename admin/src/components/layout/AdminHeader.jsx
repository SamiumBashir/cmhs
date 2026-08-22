import { FiMenu, FiSearch, FiBell, FiSun, FiMoon, FiLogOut, FiGlobe } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { useLanguage } from '../../context/LanguageContext'

const AdminHeader = ({ onMobileMenuClick }) => {
  const { user: _user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { language, toggleLanguage } = useLanguage()

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 gap-2">
        <button
          onClick={onMobileMenuClick}
          className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg flex-shrink-0"
          aria-label="Open menu"
        >
          <FiMenu size={20} />
        </button>

        <div className="hidden md:flex flex-1 max-w-md">
          <div className="relative w-full">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            />
          </div>
        </div>

        <div className="flex-1 md:flex-none" />

        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <a
            href={import.meta.env.VITE_FRONTEND_URL || (window.location.hostname.includes('vercel.app') ? 'https://cmhs-nine.vercel.app' : 'http://localhost:5173')}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 rounded-lg transition-all"
            title="Visit Main Website"
          >
            <FiGlobe size={15} />
            <span className="hidden sm:inline">Visit Site</span>
          </a>
          <button
            onClick={toggleTheme}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <FiMoon size={18} /> : <FiSun size={18} />}
          </button>
          <button
            onClick={toggleLanguage}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            aria-label="Toggle language"
          >
            <span className="text-xs font-medium">{language.toUpperCase()}</span>
          </button>
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg relative hidden sm:block" aria-label="Notifications">
            <FiBell size={18} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          <button
            onClick={logout}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg flex items-center gap-1"
            title="Logout"
          >
            <FiLogOut size={18} className="sm:hidden" />
            <span className="text-sm font-medium hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  )
}

export default AdminHeader
