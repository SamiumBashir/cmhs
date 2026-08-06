import { motion } from 'framer-motion'
import { FiBookOpen, FiUsers, FiAward, FiCalendar } from 'react-icons/fi'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { Link } from 'react-router-dom'

const classes = ['Play Group', 'Nursery', 'KG', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10']

const subjects = ['English', 'Mathematics', 'Science', 'Social Studies', 'Bangla', 'Islamics', 'Physical Education', 'Art & Craft']

const Academic = () => {
  return (
    <>
      <section className="py-20 bg-gradient-to-br from-primary/5 to-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Academics</h1>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Our comprehensive academic program is designed to foster critical thinking,
              creativity, and a lifelong love of learning.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <Card glass className="text-center p-6">
              <div className="text-primary text-3xl mb-3"><FiBookOpen /></div>
              <h3 className="font-semibold text-gray-900 mb-2">Curriculum</h3>
              <p className="text-sm text-gray-600">Comprehensive Bangladesh Curriculum</p>
            </Card>
            <Card glass className="text-center p-6">
              <div className="text-primary text-3xl mb-3"><FiUsers /></div>
              <h3 className="font-semibold text-gray-900 mb-2">Teachers</h3>
              <p className="text-sm text-gray-600">Highly qualified educators</p>
            </Card>
            <Card glass className="text-center p-6">
              <div className="text-primary text-3xl mb-3"><FiAward /></div>
              <h3 className="font-semibold text-gray-900 mb-2">Achievements</h3>
              <p className="text-sm text-gray-600">100% Board Results</p>
            </Card>
            <Card glass className="text-center p-6">
              <div className="text-primary text-3xl mb-3"><FiCalendar /></div>
              <h3 className="font-semibold text-gray-900 mb-2">Routine</h3>
              <p className="text-sm text-gray-600">Well-structured schedule</p>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Classes Offered</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {classes.map((cls, index) => (
              <motion.div
                key={cls}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="text-center p-4 hover:shadow-xl transition-shadow">
                  <h3 className="font-semibold text-gray-900">{cls}</h3>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Subjects</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {subjects.map((subject, index) => (
              <motion.div
                key={subject}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="bg-white px-6 py-4 rounded-lg shadow-sm text-center">
                  <span className="font-medium text-gray-800">{subject}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Join?</h2>
          <p className="text-gray-600 mb-6">Experience our academic excellence firsthand.</p>
          <Link to="/admission">
            <Button variant="primary" size="lg">Apply Now</Button>
          </Link>
        </div>
      </section>
    </>
  )
}

export default Academic




