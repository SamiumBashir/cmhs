import React, { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { FiSearch, FiGlobe, FiMoon, FiSun, FiMenu, FiX } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'
import { useLanguage } from '../../context/LanguageContext'
import { useAuth } from '../../context/AuthContext'
import { useQuery } from '@tanstack/react-query'
import { settingsService, menuService } from '../../services'
import Button from '../ui/Button'
import SearchBar from '../ui/SearchBar'

const defaultNavigation = [
  { path: '/', label: { en: 'Home', bn: 'হোম' } },
  { path: '/academics', label: { en: 'Academics', bn: 'শিক্ষা কার্যক্রম' } },
  { path: '/admission', label: { en: 'Admission', bn: 'ভর্তি' } },
  { path: '/notice', label: { en: 'Notices', bn: 'নোটিশ' } },
  { path: '/events', label: { en: 'Events', bn: 'ইভেন্ট' } },
  { path: '/gallery', label: { en: 'Gallery', bn: 'গ্যালারি' } },
  { path: '/teachers', label: { en: 'Teachers', bn: 'শিক্ষকরা' } },
  { path: '/contact', label: { en: 'Contact', bn: 'যোগাযোগ' } },
  { path: '/about', label: { en: 'About', bn: 'আমাদের সম্পর্কে' } }
]

const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { theme, toggleTheme } = useTheme()
  const { language, toggleLanguage } = useLanguage()
  const { user, isAuthenticated } = useAuth()

  const getDashboardPath = () => {
    if (!user) return '/login'
    if (user.role === 'student') return '/student'
    if (user.role === 'teacher') return '/teacher'
    if (user.role === 'super_admin' || user.role === 'admin') {
      return import.meta.env.VITE_ADMIN_URL || '/login'
    }
    return '/'
  }


  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => settingsService.get().then(r => r.data.data)
  })

  const { data: dynamicMenus } = useQuery({
    queryKey: ['menus-header'],
    queryFn: () => menuService.getAll().then(r => r.data.data)
  })

  const schoolName = language === 'bn'
    ? (settings?.schoolName?.bn || 'চিলাহাটি মার্চেন্টস')
    : (settings?.schoolName?.en || 'Chilahati Merchants')

  const rawList = (dynamicMenus && dynamicMenus.length > 0)
    ? dynamicMenus
    : defaultNavigation

  const navigationList = [...rawList].sort((a, b) => (a.order || 0) - (b.order || 0))

  const getLabel = (item) => language === 'bn'
    ? (item.label?.bn || item.label?.en || item.label)
    : (item.label?.en || item.label?.bn || item.label)

  const navLinkClass = ({ isActive }) =>
    `block px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
      isActive
        ? 'text-primary bg-primary/5'
        : 'text-gray-700 hover:text-primary hover:bg-gray-50'
    }`

  const closeMobileMenu = () => setIsMobileMenuOpen(false)

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-2">
          <Link to="/" className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 md:flex-none">
            <div className="w-9 h-9 sm:w-10 sm:h-10 flex-shrink-0 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg sm:text-xl overflow-hidden">
              {settings?.logo ? (
                <img src={settings.logo} alt="Logo" className="w-full h-full object-cover" />
              ) : 'CM'}
            </div>
            <span className="text-base sm:text-xl font-bold text-gray-900 truncate max-w-[140px] sm:max-w-[200px] md:max-w-xs">
              {schoolName}
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navigationList.map((item) => (
              <NavLink
                key={item.path || item._id}
                to={item.path}
                className={({ isActive }) =>
                  `px-3 xl:px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'text-primary bg-primary/5'
                      : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                  }`
                }
              >
                {getLabel(item)}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Search"
            >
              <FiSearch size={18} />
            </button>
            <button
              onClick={toggleLanguage}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors hidden sm:flex items-center gap-1"
              aria-label="Toggle language"
            >
              <FiGlobe size={18} className="text-primary" />
              <span className="text-xs font-medium">{language === 'bn' ? 'বাং' : 'EN'}</span>
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <FiMoon size={18} /> : <FiSun size={18} />}
            </button>
            {isAuthenticated ? (
              <Link to={getDashboardPath()} className="hidden md:inline-block">
                <Button variant="primary" size="sm">
                  {language === 'bn' ? 'ড্যাশবোর্ড' : 'Dashboard'}
                </Button>
              </Link>
            ) : (
              <Link to="/login" className="hidden md:inline-block">
                <Button variant="primary" size="sm">
                  {language === 'bn' ? 'লগইন' : 'Login'}
                </Button>
              </Link>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="pb-4 overflow-hidden"
            >
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search notices, results, events..."
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-gray-100 bg-white overflow-hidden"
          >
            <nav className="container mx-auto px-4 py-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                {navigationList.map((item) => (
                  <NavLink
                    key={item.path || item._id}
                    to={item.path}
                    className={navLinkClass}
                    onClick={closeMobileMenu}
                  >
                    {getLabel(item)}
                  </NavLink>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-3 mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={() => { toggleLanguage(); closeMobileMenu() }}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 sm:hidden"
                >
                  <FiGlobe size={18} className="text-primary" />
                  {language === 'bn' ? 'Switch to English' : 'বাংলায় দেখুন'}
                </button>
                {isAuthenticated ? (
                  <Link to={getDashboardPath()} className="flex-1" onClick={closeMobileMenu}>
                    <Button variant="primary" className="w-full">
                      {language === 'bn' ? 'ড্যাশবোর্ড' : 'Dashboard'}
                    </Button>
                  </Link>
                ) : (
                  <Link to="/login" className="flex-1" onClick={closeMobileMenu}>
                    <Button variant="primary" className="w-full">
                      {language === 'bn' ? 'লগইন' : 'Login'}
                    </Button>
                  </Link>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Navbar
