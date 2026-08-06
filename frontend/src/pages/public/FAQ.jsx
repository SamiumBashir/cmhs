import { motion } from 'framer-motion'
import { FiHelpCircle } from 'react-icons/fi'
import Card from '../../components/ui/Card'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { faqService } from '../../services'
import { useLanguage } from '../../context/LanguageContext'

const FAQ = () => {
  const { language } = useLanguage()
  const [openIndex, setOpenIndex] = useState(null)

  const { data: faqsData, isLoading } = useQuery({
    queryKey: ['faq'],
    queryFn: () => faqService.getAll({ limit: 50 }).then(r => r.data.data)
  })

  const faqs = faqsData || []

  const getQuestion = (faq) => language === 'bn' ? (faq.question?.bn || faq.question?.en || faq.question) : (faq.question?.en || faq.question?.bn || faq.question)
  const getAnswer = (faq) => language === 'bn' ? (faq.answer?.bn || faq.answer?.en || faq.answer) : (faq.answer?.en || faq.answer?.bn || faq.answer)

  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 to-white min-h-screen">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{language === 'bn' ? 'সাধারণ জিজ্ঞাসাসমূহ' : 'Frequently Asked Questions'}</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about admissions, academics, fees, and more.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-4">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded-xl animate-pulse" />
            ))
          ) : faqs.length > 0 ? (
            faqs.map((faq, index) => {
              const isOpen = openIndex === index
              return (
                <motion.div
                  key={faq._id || index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card>
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      className="w-full flex items-center justify-between text-left p-6"
                    >
                      <span className="font-semibold text-gray-900 flex items-center gap-3">
                        <FiHelpCircle className="text-primary flex-shrink-0" size={20} />
                        {getQuestion(faq)}
                      </span>
                      <motion.span
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        className="text-gray-500"
                      >
                        ▼
                      </motion.span>
                    </button>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-6 pb-4"
                      >
                        <p className="text-gray-600">{getAnswer(faq)}</p>
                      </motion.div>
                    )}
                  </Card>
                </motion.div>
              )
            })
          ) : (
            <Card className="p-8 text-center text-gray-500">No FAQ questions available.</Card>
          )}
        </div>
      </div>
    </section>
  )
}

export default FAQ
