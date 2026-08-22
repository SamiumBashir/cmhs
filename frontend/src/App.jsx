import React, { Suspense, lazy, useEffect } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import PublicLayout from './components/layout/PublicLayout'
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
const NotFound = lazy(() => import('./pages/NotFound'))

// Direct Redirect to Dedicated Admin Panel
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
        {/* Public Website Routes */}
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

        {/* All login and admin endpoints redirect directly to Admin Panel */}
        <Route path="/login" element={<AdminRedirect />} />
        <Route path="/admin" element={<AdminRedirect />} />
        <Route path="/admin/*" element={<AdminRedirect />} />
        <Route path="/portal" element={<AdminRedirect />} />

        {/* Redirect former teacher/student URLs to homepage */}
        <Route path="/teacher/*" element={<Navigate to="/" replace />} />
        <Route path="/student/*" element={<Navigate to="/" replace />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}

export default App
