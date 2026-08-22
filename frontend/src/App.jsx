import React, { Suspense, lazy } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import PublicLayout from './components/layout/PublicLayout'
import StudentLayout from './components/layout/StudentLayout'
import TeacherLayout from './components/layout/TeacherLayout'
import AuthLayout from './components/layout/AuthLayout'
import RequireAuth from './components/layout/RequireAuth'
import LoadingSpinner from './components/ui/LoadingSpinner'

const Home = lazy(() => import('./pages/public/Home'))
const About = lazy(() => import('./pages/public/About'))
const Academic = lazy(() => import('./pages/public/Academic'))
const Admission = lazy(() => import('./pages/public/Admission'))
const Notice = lazy(() => import('./pages/public/Notice'))
const Gallery = lazy(() => import('./pages/public/Gallery'))
const Contact = lazy(() => import('./pages/public/Contact'))
const Events = lazy(() => import('./pages/public/Events'))
const Teachers = lazy(() => import('./pages/public/Teachers'))
const Staff = lazy(() => import('./pages/public/Staff'))
const ResultPortal = lazy(() => import('./pages/public/ResultPortal'))
const FAQ = lazy(() => import('./pages/public/FAQ'))
const Downloads = lazy(() => import('./pages/public/Downloads'))
const Facilities = lazy(() => import('./pages/public/Facilities'))
const PrincipalMessage = lazy(() => import('./pages/public/PrincipalMessage'))

const Login = lazy(() => import('./pages/auth/Login'))

const StudentDashboard = lazy(() => import('./pages/student/Dashboard'))
const StudentProfile = lazy(() => import('./pages/student/Profile'))
const StudentRoutine = lazy(() => import('./pages/student/Routine'))
const StudentAttendance = lazy(() => import('./pages/student/Attendance'))
const StudentResults = lazy(() => import('./pages/student/Results'))
const StudentFees = lazy(() => import('./pages/student/Fees'))
const StudentNotices = lazy(() => import('./pages/student/Notices'))
const StudentDownloads = lazy(() => import('./pages/student/Downloads'))

const TeacherDashboard = lazy(() => import('./pages/teacher/Dashboard'))
const TeacherClasses = lazy(() => import('./pages/teacher/MyClasses'))
const TeacherRoutine = lazy(() => import('./pages/teacher/Routine'))
const TeacherAttendance = lazy(() => import('./pages/teacher/Attendance'))
const TeacherStudents = lazy(() => import('./pages/teacher/Students'))
const TeacherResults = lazy(() => import('./pages/teacher/Results'))
const TeacherNotices = lazy(() => import('./pages/teacher/Notices'))

const NotFound = lazy(() => import('./pages/NotFound'))

const AdminRedirect = () => {
  useEffect(() => {
    const adminUrl = import.meta.env.VITE_ADMIN_URL || (window.location.hostname.includes('vercel.app') ? 'https://cmhs-admin-five.vercel.app' : 'http://localhost:5174')
    window.location.href = adminUrl
  }, [])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <LoadingSpinner size="xl" />
    </div>
  )
}

const AdminPortalPage = () => {
  const adminUrl = import.meta.env.VITE_ADMIN_URL

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4 text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">🏫</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Panel</h1>
        <p className="text-gray-600 mb-6">You are logged in as Admin. The Admin Panel is a separate application.</p>
        <div className="space-y-3">
          {adminUrl ? (
            <a
              href={adminUrl}
              className="block w-full py-3 px-4 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors"
            >
              Open Admin Panel →
            </a>
          ) : (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-xl text-sm text-yellow-700">
              Admin Panel URL not configured. Please set <code className="font-mono bg-yellow-100 px-1 rounded">VITE_ADMIN_URL</code> in Vercel environment variables.
            </div>
          )}
          <button
            onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('user'); window.location.href = '/login' }}
            className="block w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}


function App() {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="xl" />
      </div>
    }>
      <Routes>
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="academics" element={<Academic />} />
          <Route path="admission" element={<Admission />} />
          <Route path="notice" element={<Notice />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="contact" element={<Contact />} />
          <Route path="events" element={<Events />} />
          <Route path="teachers" element={<Teachers />} />
          <Route path="staff" element={<Staff />} />
          <Route path="result-portal" element={<ResultPortal />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="downloads" element={<Downloads />} />
          <Route path="facilities" element={<Facilities />} />
          <Route path="principal-message" element={<PrincipalMessage />} />
        </Route>

        <Route path="/login" element={<AuthLayout />}>
          <Route index element={<Login />} />
        </Route>

        <Route path="/admin/*" element={<AdminRedirect />} />
        <Route path="/admin-redirect" element={<AdminPortalPage />} />

        <Route path="/student" element={<RequireAuth allowedRoles={['student']} />}>
          <Route element={<StudentLayout />}>
            <Route index element={<StudentDashboard />} />
            <Route path="profile" element={<StudentProfile />} />
            <Route path="routine" element={<StudentRoutine />} />
            <Route path="attendance" element={<StudentAttendance />} />
            <Route path="results" element={<StudentResults />} />
            <Route path="fees" element={<StudentFees />} />
            <Route path="notices" element={<StudentNotices />} />
            <Route path="downloads" element={<StudentDownloads />} />
          </Route>
        </Route>

        <Route path="/teacher" element={<RequireAuth allowedRoles={['teacher', 'editor', 'moderator']} />}>
          <Route element={<TeacherLayout />}>
            <Route index element={<TeacherDashboard />} />
            <Route path="classes" element={<TeacherClasses />} />
            <Route path="routine" element={<TeacherRoutine />} />
            <Route path="attendance" element={<TeacherAttendance />} />
            <Route path="students" element={<TeacherStudents />} />
            <Route path="results" element={<TeacherResults />} />
            <Route path="notices" element={<TeacherNotices />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}

export default App
