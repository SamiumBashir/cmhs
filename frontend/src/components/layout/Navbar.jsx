import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMenu, FiX, FiSearch, FiGlobe, FiMoon, FiSun } from 'react-icons/fi'
import { useQuery } from '@tanstack/react-query'
import SearchBar from '../ui/SearchBar'
import { menuService, settingsService } from '../../services'
import { useLanguage } from '../../context/LanguageContext'
import { useTheme } from '../../context/ThemeContext'

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { language, toggleLanguage } = useLanguage()
  const { theme, toggleTheme } = useTheme()

  const { data: menuData } = useQuery({
    queryKey: ['headerMenus'],
    queryFn: () => menuService.getHeader().then(r => r.data.data)
  })

  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => settingsService.get().then(r => r.data.data)
  })

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const defaultNavItems = [
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

  const navigationList = menuData && menuData.length > 0 ? menuData : defaultNavItems

  const getLabel = (item) => {
    if (!item.label) return ''
    if (typeof item.label === 'string') return item.label
    return language === 'bn' ? item.label.bn || item.label.en : item.label.en || item.label.bn
  }

  const closeMobileMenu = () => setIsMobileMenuOpen(false)

  const navLinkClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-all ${
      isActive
        ? 'text-primary bg-primary/5 font-semibold'
        : 'text-gray-700 hover:text-primary hover:bg-gray-50'
    }`

  const schoolName = language === 'bn'
    ? (settings?.schoolName?.bn || 'চিলাহাটি মার্চেন্টস হাই স্কুল')
    : (settings?.schoolName?.en || 'Chilahati Merchants High School')

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md py-2'
          : 'bg-white shadow-sm py-3'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3 flex-shrink-0" onClick={closeMobileMenu}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg shadow-md shadow-primary/20">
              {settings?.logo ? (
                <img src={settings.logo} alt="Logo" className="w-full h-full object-cover rounded-xl" />
              ) : 'CMHS'}
            </div>
            <div className="hidden sm:block">
              <h1 className="text-base font-bold text-gray-900 leading-tight">
                {schoolName}
              </h1>
              <p className="text-xs text-gray-500 font-medium">Est. {settings?.established || '1985'}</p>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navigationList.map((item) => (
              <NavLink
                key={item.path || item._id}
                to={item.path}
                className={({ isActive }) =>
                  `px-3 xl:px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'text-primary bg-primary/5 font-semibold'
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
              <div className="mt-4 pt-4 border-t border-gray-100 sm:hidden">
                <button
                  onClick={() => { toggleLanguage(); closeMobileMenu() }}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 w-full"
                >
                  <FiGlobe size={18} className="text-primary" />
                  {language === 'bn' ? 'Switch to English' : 'বাংলায় দেখুন'}
                </button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Navbar
