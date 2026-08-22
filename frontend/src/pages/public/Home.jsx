import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  FiUsers,
  FiBook,
  FiAward,
  FiUserCheck,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiStar,
  FiCheckCircle,
  FiCompass
} from 'react-icons/fi'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import StatCard from '../../components/ui/StatCard'
import { useQuery } from '@tanstack/react-query'
import {
  homepageService,
  noticeService,
  eventService,
  galleryService,
  settingsService
} from '../../services'
import { useLanguage } from '../../context/LanguageContext'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

const Home = () => {
  const { language } = useLanguage()
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)

  const { data: homepageData, isLoading: homepageLoading } = useQuery({
    queryKey: ['homepage'],
    queryFn: () => homepageService.get().then(r => r.data.data)
  })

  const { data: settings, isLoading: settingsLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: () => settingsService.get().then(r => r.data.data)
  })

  const { data: noticesData, isLoading: noticesLoading } = useQuery({
    queryKey: ['notices'],
    queryFn: () => noticeService.getAll({ limit: 5 }).then(r => r.data.data)
  })

  const { data: eventsData, isLoading: eventsLoading } = useQuery({
    queryKey: ['events'],
    queryFn: () => eventService.getAll({ limit: 3 }).then(r => r.data.data)
  })

  const { data: galleryData, isLoading: galleryLoading } = useQuery({
    queryKey: ['gallery'],
    queryFn: () => galleryService.getAll({ limit: 6 }).then(r => r.data.data)
  })

  const notices = noticesData || []
  const events = eventsData || []
  const galleryItems = galleryData || []

  const schoolName = language === 'bn'
    ? (settings?.schoolName?.bn || 'চিলাহাটি মার্চেন্টস হাই স্কুল')
    : (settings?.schoolName?.en || 'Chilahati Merchants High School')

  const getTitle = (obj) => {
    if (!obj) return ''
    if (typeof obj === 'string') return obj
    return language === 'bn' ? (obj.bn || obj.en || '') : (obj.en || obj.bn || '')
  }

  const getContent = (obj) => {
    if (!obj) return ''
    if (typeof obj === 'string') return obj
    return language === 'bn' ? (obj.bn || obj.en || '') : (obj.en || obj.bn || '')
  }

  const heroSlides = (homepageData?.heroSlides || []).filter(s => s.enabled !== false)
  const activeSlide = heroSlides[currentSlideIndex] || heroSlides[0]

  // Auto rotate slides if multiple
  useEffect(() => {
    if (heroSlides.length <= 1) return
    const timer = setInterval(() => {
      setCurrentSlideIndex(prev => (prev + 1) % heroSlides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [heroSlides.length])

  const heroTitle = activeSlide ? getTitle(activeSlide.title) : schoolName
  const heroSubtitle = activeSlide ? getTitle(activeSlide.subtitle) : (language === 'bn'
    ? 'মানসম্মত শিক্ষা, মানবিক মূল্যবোধ এবং সর্বাঙ্গীন সমৃদ্ধির প্রত্যয়ে আমাদের নিরন্তর পথচলা।'
    : 'Empowering students with quality education, holistic development, and a commitment to excellence.')
  const heroButtonText = activeSlide ? getTitle(activeSlide.buttonText) : (language === 'bn' ? 'ভর্তির আবেদন করুন' : 'Apply for Admission')
  const heroButtonLink = activeSlide?.buttonLink || '/admission'
  const heroImage = activeSlide?.image

  const dynamicStats = homepageData?.statistics?.length > 0
    ? homepageData.statistics.map(s => ({
        label: getTitle(s.label),
        value: s.value,
        icon: <FiUsers size={28} />
      }))
    : [
        { label: language === 'bn' ? 'শিক্ষার্থী' : 'Students', value: '1,200+', icon: <FiUsers size={28} /> },
        { label: language === 'bn' ? 'শিক্ষক' : 'Teachers', value: '45+', icon: <FiUserCheck size={28} /> },
        { label: language === 'bn' ? 'কার্যক্রম' : 'Programs', value: '25+', icon: <FiBook size={28} /> },
        { label: language === 'bn' ? 'প্রতিষ্ঠাকাল' : 'Established', value: settings?.established || '1985', icon: <FiAward size={28} /> }
      ]

  const facilities = homepageData?.facilities || []
  const testimonials = homepageData?.testimonials || []
  const partnerLogos = homepageData?.partnerLogos || []

  return (
    <>
      {/* HERO SECTION WITH CLOUDINARY MEDIA SUPPORT */}
      <section className="relative min-h-[85vh] flex items-center bg-gradient-to-br from-primary/5 via-white to-secondary/5 overflow-hidden">
        {/* Abstract blur circles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-12 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content Column */}
            <motion.div
              className={heroImage ? 'lg:col-span-7' : 'lg:col-span-9 max-w-3xl'}
              key={currentSlideIndex}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.5 }}
            >
              {settingsLoading || homepageLoading ? (
                <div className="space-y-4">
                  <div className="h-6 w-36 bg-gray-200 rounded-full animate-pulse" />
                  <div className="h-12 w-3/4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-20 w-full bg-gray-200 rounded animate-pulse" />
                </div>
              ) : (
                <>
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4 border border-primary/20">
                    <FiCompass className="animate-spin-slow" />
                    <span>{language === 'bn' ? 'স্বাগতম' : 'Welcome to Excellence'}</span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4 tracking-tight">
                    {heroTitle}
                  </h1>
                  <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl">
                    {heroSubtitle}
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Link to={heroButtonLink}>
                      <Button variant="primary" size="lg" className="shadow-lg shadow-primary/20 hover:shadow-primary/30">
                        {heroButtonText}
                      </Button>
                    </Link>
                    <Link to="/about">
                      <Button variant="outline" size="lg">
                        {language === 'bn' ? 'আমাদের সম্পর্কে' : 'Learn More'}
                      </Button>
                    </Link>
                  </div>
                </>
              )}
            </motion.div>

            {/* Right Image Column (Cloudinary-backed visual) */}
            {heroImage && (
              <motion.div
                className="lg:col-span-5"
                key={`img-${currentSlideIndex}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white group">
                  <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
                    <img
                      src={heroImage}
                      alt={heroTitle}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="text-xs bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full font-medium inline-block mb-1">
                      {schoolName}
                    </span>
                    <p className="text-sm font-semibold truncate drop-shadow-md">{heroTitle}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Slider pagination dots */}
          {heroSlides.length > 1 && (
            <div className="flex items-center gap-2 mt-8 justify-center lg:justify-start">
              <button
                onClick={() => setCurrentSlideIndex(prev => (prev - 1 + heroSlides.length) % heroSlides.length)}
                className="p-2 rounded-full bg-white/80 hover:bg-white text-gray-700 shadow-sm border border-gray-200 transition-colors"
                aria-label="Previous Slide"
              >
                <FiChevronLeft size={16} />
              </button>
              <div className="flex gap-1.5 px-2">
                {heroSlides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlideIndex(idx)}
                    className={`h-2 rounded-full transition-all ${
                      currentSlideIndex === idx ? 'w-8 bg-primary' : 'w-2 bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
              <button
                onClick={() => setCurrentSlideIndex(prev => (prev + 1) % heroSlides.length)}
                className="p-2 rounded-full bg-white/80 hover:bg-white text-gray-700 shadow-sm border border-gray-200 transition-colors"
                aria-label="Next Slide"
              >
                <FiChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="py-14 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {dynamicStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                {...fadeInUp}
                transition={{ delay: index * 0.1 }}
              >
                <StatCard
                  title={stat.label}
                  value={stat.value}
                  icon={stat.icon}
                  color={index % 4 === 0 ? 'primary' : index % 4 === 1 ? 'secondary' : index % 4 === 2 ? 'accent' : 'primary'}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FACILITIES SECTION (CLOUDINARY POWERED) */}
      {facilities.length > 0 && (
        <section className="py-16 bg-gray-50/70">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {language === 'bn' ? 'আমাদের বিশেষ সুবিধাসমূহ' : 'Campus Facilities'}
              </h2>
              <p className="text-sm text-gray-600 mt-2">
                {language === 'bn'
                  ? 'আধুনিক প্রযুক্তিনির্ভর ল্যাব, সমৃদ্ধ লাইব্রেরি এবং শিক্ষার সর্বোচ্চ পরিবেশ।'
                  : 'State-of-the-art laboratories, expansive library, and modern campus infrastructure.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {facilities.map((fac, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-gray-200 flex flex-col"
                >
                  {fac.image ? (
                    <div className="aspect-[16/9] w-full bg-gray-100 overflow-hidden">
                      <img src={fac.image} alt={getTitle(fac.title)} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                    </div>
                  ) : (
                    <div className="aspect-[16/9] w-full bg-primary/10 flex items-center justify-center text-primary">
                      <FiBook size={40} />
                    </div>
                  )}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{getTitle(fac.title)}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{getContent(fac.description)}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* NOTICES, EVENTS & PHOTO GALLERY GRID */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Notices */}
            <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
              <Card title={language === 'bn' ? 'সর্বশেষ নোটিশ' : 'Latest Notices'} glass>
                <div className="space-y-3">
                  {noticesLoading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="h-12 bg-gray-200 rounded animate-pulse" />
                    ))
                  ) : notices.length > 0 ? (
                    notices.slice(0, 5).map((notice) => (
                      <Link
                        key={notice._id}
                        to={`/notice`}
                        className="block p-3 rounded-lg hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
                      >
                        <h4 className="font-medium text-gray-900 line-clamp-1">
                          {getTitle(notice.title)}
                        </h4>
                        <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                          {getContent(notice.content).substring(0, 80)}
                        </p>
                      </Link>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm py-4">No notices available.</p>
                  )}
                </div>
              </Card>
            </motion.div>

            {/* Upcoming Events */}
            <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
              <Card title={language === 'bn' ? 'আসন্ন ইভেন্টসমূহ' : 'Upcoming Events'} glass>
                <div className="space-y-4">
                  {eventsLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="h-16 bg-gray-200 rounded animate-pulse" />
                    ))
                  ) : events.length > 0 ? (
                    events.slice(0, 4).map((event) => (
                      <div key={event._id} className="flex gap-3 items-center">
                        <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <FiCalendar className="text-primary" size={20} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-medium text-gray-900 truncate">{getTitle(event.title)}</h4>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {new Date(event.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm py-4">No upcoming events.</p>
                  )}
                </div>
                <Link to="/events" className="block text-center mt-4 text-sm text-primary hover:text-primary/80 font-medium">
                  {language === 'bn' ? 'সব ইভেন্ট দেখুন' : 'View All Events'}
                </Link>
              </Card>
            </motion.div>

            {/* Photo Gallery (Cloudinary Images) */}
            <motion.div {...fadeInUp} transition={{ delay: 0.3 }}>
              <Card title={language === 'bn' ? 'ফটো গ্যালারি' : 'Photo Gallery'} glass>
                <div className="grid grid-cols-3 gap-2">
                  {galleryLoading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="aspect-square bg-gray-200 rounded animate-pulse" />
                    ))
                  ) : galleryItems.length > 0 ? (
                    galleryItems.slice(0, 6).map((item) => (
                      <motion.div
                        key={item._id}
                        whileHover={{ scale: 1.05 }}
                        className="aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200"
                      >
                        <img
                          src={item.image}
                          alt={getTitle(item.title)}
                          className="w-full h-full object-cover"
                        />
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm py-4 col-span-3 text-center">No photos available.</p>
                  )}
                </div>
                <Link to="/gallery" className="block text-center mt-4 text-sm text-primary hover:text-primary/80 font-medium">
                  {language === 'bn' ? 'সম্পূর্ণ গ্যালারি দেখুন' : 'View Full Gallery'}
                </Link>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION (CLOUDINARY AVATARS) */}
      {testimonials.length > 0 && (
        <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {language === 'bn' ? 'অভিভাবক ও শিক্ষার্থীদের মতামত' : 'What Our Community Says'}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((testi, index) => (
                <Card key={index} className="p-6 flex flex-col justify-between border border-gray-200 shadow-sm">
                  <div>
                    <div className="flex text-amber-400 gap-1 mb-3">
                      {Array.from({ length: testi.rating || 5 }).map((_, i) => (
                        <FiStar key={i} fill="currentColor" size={16} />
                      ))}
                    </div>
                    <p className="text-gray-600 text-sm italic leading-relaxed mb-4">
                      "{getContent(testi.message)}"
                    </p>
                  </div>
                  <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                    {testi.avatar ? (
                      <img src={testi.avatar} alt={getTitle(testi.name)} className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">
                        {getTitle(testi.name).charAt(0)}
                      </div>
                    )}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">{getTitle(testi.name)}</h4>
                      <p className="text-xs text-gray-500">{getTitle(testi.role)}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PARTNER LOGOS (CLOUDINARY POWERED) */}
      {partnerLogos.length > 0 && (
        <section className="py-10 bg-white border-t border-gray-100">
          <div className="container mx-auto px-4">
            <p className="text-center text-xs font-semibold uppercase tracking-wider text-gray-400 mb-6">
              {language === 'bn' ? 'অনুমোদন ও সহযোগী প্রতিষ্ঠানসমূহ' : 'Affiliations & Recognitions'}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
              {partnerLogos.map((partner, index) => (
                <a
                  key={index}
                  href={partner.link || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="opacity-70 hover:opacity-100 transition-opacity"
                >
                  {partner.image ? (
                    <img src={partner.image} alt={partner.name} className="h-10 md:h-12 object-contain grayscale hover:grayscale-0 transition-all" />
                  ) : (
                    <span className="text-sm font-semibold text-gray-600">{partner.name}</span>
                  )}
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CALL TO ACTION BANNER */}
      <section className="py-20 bg-gradient-to-br from-primary to-secondary text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {language === 'bn' ? 'আগামীর নেতৃত্ব গড়ে তোলাই আমাদের লক্ষ্য' : 'Shaping the Leaders of Tomorrow'}
            </h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Join our community of learners who are passionate about academic excellence,
              creative thinking, and character development.
            </p>
            <Link to="/admission">
              <Button variant="accent" size="lg">
                {language === 'bn' ? 'আজই শুরু করুন' : 'Start Your Journey Today'}
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  )
}

export default Home

