import { useState } from 'react'
import { FiCalendar, FiClock, FiMapPin } from 'react-icons/fi'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import { useQuery } from '@tanstack/react-query'
import { routineService } from '../../services'

const StudentRoutine = () => {
  const [selectedDay, setSelectedDay] = useState('monday')

  const { data, isLoading } = useQuery({
    queryKey: ['student-routine'],
    queryFn: () => routineService.getAll({ class: '10', section: 'A', limit: 50 }).then(r => r.data)
  })

  const days = [
    { value: 'monday', label: 'Monday', bn: 'সোমবার' },
    { value: 'tuesday', label: 'Tuesday', bn: 'মঙ্গলবার' },
    { value: 'wednesday', label: 'Wednesday', bn: 'বুধবার' },
    { value: 'thursday', label: 'Thursday', bn: 'বৃহস্পতিবার' },
    { value: 'friday', label: 'Friday', bn: 'শুক্রবার' },
    { value: 'saturday', label: 'Saturday', bn: 'শনিবার' },
    { value: 'sunday', label: 'Sunday', bn: 'রববার' }
  ]

  const dayRoutine = data?.data?.filter(r => r.day === selectedDay) || []

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">My Routine</h1>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {days.map((day) => (
          <button
            key={day.value}
            onClick={() => setSelectedDay(day.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              selectedDay === day.value
                ? 'bg-primary text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {day.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <Card>
          <div className="space-y-3">
            {dayRoutine.length > 0 ? (
              dayRoutine
                .sort((a, b) => (a.period || 0) - (b.period || 0))
                .map((period) => (
                  <div key={period._id} className="flex items-center gap-4 p-4 rounded-lg border border-gray-100">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <span className="text-primary font-bold text-lg">{period.period}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{period.subject}</h3>
                      <p className="text-sm text-gray-500">
                        {period.teacher?.name?.en || period.teacher?.name?.bn || 'N/A'}
                      </p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <FiClock size={14} />
                        <span>{period.startTime} - {period.endTime}</span>
                      </div>
                      {period.room && (
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <FiMapPin size={14} />
                          <span>{period.room}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
            ) : (
              <div className="text-center py-12 text-gray-500">
                No classes scheduled for {days.find(d => d.value === selectedDay)?.label}
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  )
}

export default StudentRoutine

