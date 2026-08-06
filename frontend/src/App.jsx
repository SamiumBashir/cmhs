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
    window.location.href = 'http://localhost:5174'
  }, [])
  return (
    <div className="flex items-center justify-center min-h-screen">
      <LoadingSpinner size="xl" />
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

        <Route path="/teacher" element={<RequireAuth allowedRoles={['teacher']} />}>
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
