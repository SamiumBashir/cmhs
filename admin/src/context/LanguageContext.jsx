import { createContext, useContext, useState, useEffect } from 'react'

const LanguageContext = createContext()

const translations = {
  en: {
    nav: {
      home: 'Home',
      about: 'About Us',
      academics: 'Academics',
      admission: 'Admission',
      notice: 'Notices',
      gallery: 'Gallery',
      events: 'Events',
      teachers: 'Teachers',
      staff: 'Staff',
      contact: 'Contact',
      login: 'Login',
      resultPortal: 'Result Portal',
      faq: 'FAQ',
      downloads: 'Downloads'
    },
    common: {
      readMore: 'Read More',
      submit: 'Submit',
      search: 'Search',
      viewAll: 'View All'
    }
  },
  bn: {
    nav: {
      home: 'হোম',
      about: 'আমাদের সম্পর্কে',
      academics: 'শিক্ষা কার্যক্রম',
      admission: 'ভর্তি',
      notice: 'নোটিশ',
      gallery: 'গ্যালারি',
      events: 'ইভেন্ট',
      teachers: 'শিক্ষকরা',
      staff: 'কর্মসহায়ক',
      contact: 'যোগাযোগ',
      login: 'লগইন',
      resultPortal: 'রেজাল্ট পোর্টাল',
      faq: 'প্রায়শই জিজ্ঞাসিত প্রশ্ন',
      downloads: 'ডাউনলোড'
    },
    common: {
      readMore: ' আরও পঢ়ুন',
      submit: 'জমা দিন',
      search: 'অনুসন্ধান',
      viewAll: 'সব দেখুন'
    }
  }
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used within LanguageProvider')
  return context
}

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'en'
  })

  useEffect(() => {
    localStorage.setItem('language', language)
    document.documentElement.lang = language
    document.documentElement.dir = language === 'bn' ? 'ltr' : 'ltr'
  }, [language])

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'bn' : 'en')
  }

  const t = (key) => {
    const keys = key.split('.')
    let value = translations[language]
    for (const k of keys) {
      value = value?.[k]
      if (value === undefined) return key
    }
    return value
  }

  const value = {
    language,
    setLanguage,
    toggleLanguage,
    t,
    translations
  }

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
