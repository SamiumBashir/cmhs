import { FiMail, FiPhone, FiMapPin, FiClock, FiFacebook, FiYoutube } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { settingsService } from '../../services'
import { useLanguage } from '../../context/LanguageContext'

const Footer = () => {
  const { language } = useLanguage()
  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => settingsService.get().then(r => r.data.data)
  })

  const quickLinks = [
    { path: '/about', label: language === 'bn' ? 'আমাদের সম্পর্কে' : 'About Us' },
    { path: '/academics', label: language === 'bn' ? 'শিক্ষা কার্যক্রম' : 'Academics' },
    { path: '/admission', label: language === 'bn' ? 'ভর্তি' : 'Admission' },
    { path: '/notice', label: language === 'bn' ? 'নোটিশ' : 'Notices' },
    { path: '/events', label: language === 'bn' ? 'ইভেন্ট' : 'Events' },
    { path: '/gallery', label: language === 'bn' ? 'গ্যালারি' : 'Gallery' },
    { path: '/contact', label: language === 'bn' ? 'যোগাযোগ' : 'Contact' }
  ]

  const schoolName = language === 'bn'
    ? (settings?.schoolName?.bn || 'চিলাহাটি মার্চেন্টস হাই স্কুল')
    : (settings?.schoolName?.en || 'Chilahati Merchants High School')

  const address = language === 'bn'
    ? (settings?.address?.bn || 'চিলাহাটি, নীলফামারী, বাংলাদেশ')
    : (settings?.address?.en || 'Chilahati, Nilphamari, Bangladesh')

  return (
    <footer className="bg-gray-900 text-gray-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xl mb-4">
              {settings?.logo ? (
                <img src={settings.logo} alt="Logo" className="w-full h-full object-cover rounded-lg" />
              ) : 'CMHS'}
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{schoolName}</h3>
            <p className="text-gray-400 text-sm mb-4">
              Empowering students with quality education since {settings?.established || '1985'}.
            </p>
            <div className="flex gap-3">
              {settings?.socialLinks?.facebook && (
                <a href={settings.socialLinks.facebook} target="_blank" rel="noreferrer" className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                  <FiFacebook size={20} />
                </a>
              )}
              {settings?.socialLinks?.youtube && (
                <a href={settings.socialLinks.youtube} target="_blank" rel="noreferrer" className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                  <FiYoutube size={20} />
                </a>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Contact Info</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <FiMapPin className="text-primary mt-0.5 flex-shrink-0" size={16} />
                <span>{address}</span>
              </li>
              <li className="flex items-center gap-3">
                <FiPhone className="text-primary flex-shrink-0" size={16} />
                <span>{settings?.phone || '+880 171 123 4567'}</span>
              </li>
              <li className="flex items-center gap-3">
                <FiMail className="text-primary flex-shrink-0" size={16} />
                <span>{settings?.email || 'info@cmhs.edu.bd'}</span>
              </li>
              <li className="flex items-center gap-3">
                <FiClock className="text-primary flex-shrink-0" size={16} />
                <span>Sunday - Thursday: 8:00 AM - 4:00 PM</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Newsletter</h4>
            <p className="text-gray-400 text-sm mb-3">Subscribe for latest updates</p>
            <form className="space-y-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your email"
                className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              />
              <button
                type="submit"
                className="w-full px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} {schoolName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
