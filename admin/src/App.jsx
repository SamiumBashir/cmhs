import React, { Suspense, lazy } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import AdminLayout from './components/layout/AdminLayout'
import AuthLayout from './components/layout/AuthLayout'
import RequireAuth from './components/layout/RequireAuth'
import LoadingSpinner from './components/ui/LoadingSpinner'

const Login = lazy(() => import('./pages/Login'))

const AdminDashboard = lazy(() => import('./pages/Dashboard'))
const AdminStudents = lazy(() => import('./pages/Students'))
const AdminTeachers = lazy(() => import('./pages/Teachers'))
const AdminStaff = lazy(() => import('./pages/Staff'))
const AdminNotices = lazy(() => import('./pages/Notices'))
const AdminGallery = lazy(() => import('./pages/Gallery'))
const AdminAdmissions = lazy(() => import('./pages/Admissions'))
const AdminResults = lazy(() => import('./pages/Results'))
const AdminRoutines = lazy(() => import('./pages/Routines'))
const AdminAttendance = lazy(() => import('./pages/Attendance'))
const AdminCurriculum = lazy(() => import('./pages/Curriculum'))
const AdminEvents = lazy(() => import('./pages/Events'))
const AdminContacts = lazy(() => import('./pages/Contacts'))
const AdminSettings = lazy(() => import('./pages/Settings'))
const AdminUsers = lazy(() => import('./pages/Users'))
const AdminProfile = lazy(() => import('./pages/Profile'))
const AdminAnalytics = lazy(() => import('./pages/Analytics'))
const AdminClasses = lazy(() => import('./pages/Classes'))
const AdminSubjects = lazy(() => import('./pages/Subjects'))
const AdminCms = lazy(() => import('./pages/Cms'))
const AdminMedia = lazy(() => import('./pages/Media'))

const NotFound = lazy(() => import('./pages/NotFound'))

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
        <Route path="/login" element={<AuthLayout />}>
          <Route index element={<Login />} />
        </Route>

        <Route path="/" element={<RequireAuth allowedRoles={['super_admin', 'admin', 'editor', 'moderator']} />}>
          <Route element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="students" element={<AdminStudents />} />
            <Route path="teachers" element={<AdminTeachers />} />
            <Route path="staff" element={<AdminStaff />} />
            <Route path="notices" element={<AdminNotices />} />
            <Route path="gallery" element={<AdminGallery />} />
            <Route path="admissions" element={<AdminAdmissions />} />
            <Route path="results" element={<AdminResults />} />
            <Route path="routines" element={<AdminRoutines />} />
            <Route path="attendance" element={<AdminAttendance />} />
            <Route path="curriculum" element={<AdminCurriculum />} />
            <Route path="events" element={<AdminEvents />} />
            <Route path="contacts" element={<AdminContacts />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="profile" element={<AdminProfile />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="classes" element={<AdminClasses />} />
            <Route path="subjects" element={<AdminSubjects />} />
            <Route path="cms" element={<AdminCms />} />
            <Route path="media" element={<AdminMedia />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}

export default App
