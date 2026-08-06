import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import AdminHeader from './AdminHeader'
import StudentSidebar from './StudentSidebar'

const StudentLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen flex bg-gray-50">
      <StudentSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader onMobileMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default StudentLayout

