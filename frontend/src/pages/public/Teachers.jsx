import { motion } from 'framer-motion'
import { FiMail, FiPhone, FiUserCheck } from 'react-icons/fi'
import Avatar from '../../components/ui/Avatar'
import Card from '../../components/ui/Card'
import { useQuery } from '@tanstack/react-query'
import { teacherService } from '../../services'

const Teachers = () => {
  const { data: teachers, isLoading } = useQuery({
    queryKey: ['teachers'],
    queryFn: () => teacherService.getAll({ limit: 20 }).then(r => r.data.data)
  })

  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 to-white min-h-screen">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Teachers</h1>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Meet our dedicated team of experienced and passionate educators who are committed
            to providing the best possible learning experience for our students.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teachers?.map((teacher, index) => (
              <motion.div
                key={teacher._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="text-center p-8" hover>
                  <Avatar
                    src={teacher.avatar}
                    name={`${teacher.name?.en || teacher.name?.bn || 'Teacher'}`}
                    size="lg"
                  />
                  <h3 className="text-xl font-bold text-gray-900 mt-4">
                    {teacher.name?.en || teacher.name?.bn}
                  </h3>
                  <p className="text-primary font-medium mt-1">
                    {Array.isArray(teacher.subject) ? teacher.subject.join(', ') : teacher.subject}
                  </p>
                  <p className="text-gray-600 mt-2">
                    {teacher.qualification || 'Masters in Education'}
                  </p>
                  <div className="mt-4 space-y-2">
                    {teacher.email && (
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                        <FiMail size={14} />
                        <span>{teacher.email}</span>
                      </div>
                    )}
                    {teacher.phone && (
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                        <FiPhone size={14} />
                        <span>{teacher.phone}</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 flex items-center justify-center gap-1 text-sm text-gray-500">
                    <FiUserCheck size={14} />
                    <span>{teacher.experience || 0} years experience</span>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default Teachers




