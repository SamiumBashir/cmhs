import { useState } from 'react'
import { FiUser, FiShield, FiEdit2, FiKey } from 'react-icons/fi'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Card from '../components/ui/Card'
import Avatar from '../components/ui/Avatar'
import Badge from '../components/ui/Badge'

const AdminProfile = () => {
  const [activeTab, setActiveTab] = useState('profile')
  const [isEditing, setIsEditing] = useState(false)

  const user = {
    id: '001',
    name: { en: 'Admin User', bn: 'অ্যাডমিন ইউজার' },
    email: 'admin@cmhs.edu.bd',
    role: 'super_admin',
    phone: '+880 171 123 4567',
    joinDate: '2023-01-15',
    status: 'active',
    permissions: ['students', 'teachers', 'results', 'settings', 'users']
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <Button variant="outline" icon={<FiEdit2 />} onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </Button>
      </div>

      <div className="border-b border-gray-200 mb-6">
        <nav className="flex gap-6">
          {['profile', 'password', 'permissions'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'profile' && (
        <Card>
          <div className="flex items-start gap-6">
            <Avatar src={user.avatar} name={user.name.en} size="xl" />
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Full Name (English)" defaultValue={user.name.en} readOnly={!isEditing} />
                <Input label="Full Name (বাংলা)" defaultValue={user.name.bn} readOnly={!isEditing} />
                <Input label="Email Address" defaultValue={user.email} readOnly={!isEditing} />
                <Input label="Phone Number" defaultValue={user.phone} readOnly={!isEditing} />
                <Input label="Role" defaultValue={user.role} readOnly />
                <Input label="Join Date" defaultValue={user.joinDate} readOnly />
              </div>
              {isEditing && (
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" size="sm">
                    Save Changes
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      {activeTab === 'password' && (
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Change Password</h2>
          <div className="space-y-4">
            <Input label="Current Password" type="password" placeholder="••••••••" />
            <Input label="New Password" type="password" placeholder="••••••••" />
            <Input label="Confirm New Password" type="password" placeholder="••••••••" />
          </div>
          <Button variant="primary" className="mt-4">
            Update Password
          </Button>
        </Card>
      )}

      {activeTab === 'permissions' && (
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Role & Permissions</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Role</label>
              <Badge variant="primary">{user.role}</Badge>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
              <div className="flex flex-wrap gap-2">
                {user.permissions.map((perm) => (
                  <Badge key={perm} variant="info" size="sm">
                    {perm}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}

export default AdminProfile


