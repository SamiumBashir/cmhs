import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { settingsService } from '../services'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import ImageUploader from '../components/ui/ImageUploader'

const AdminSettings = () => {
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState('general')
  const [settings, setSettings] = useState({})
  const [saveSuccess, setSaveSuccess] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: () => settingsService.get().then(r => r.data.data)
  })

  useEffect(() => {
    if (data) {
      setSettings(data)
    }
  }, [data])

  const mutation = useMutation({
    mutationFn: settingsService.update,
    onSuccess: () => {
      queryClient.invalidateQueries()
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    }
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const updateNestedSetting = (parentKey, childKey, value) => {
    setSettings(prev => ({
      ...prev,
      [parentKey]: {
        ...(prev[parentKey] || {}),
        [childKey]: value
      }
    }))
  }

  const handleSave = async () => {
    await mutation.mutateAsync(settings)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Website Settings</h1>
        {saveSuccess && (
          <span className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-200">
            ✓ Settings saved successfully!
          </span>
        )}
      </div>

      <div className="border-b border-gray-200 mb-6">
        <nav className="flex gap-4">
          {['general', 'seo', 'social', 'colors'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        {activeTab === 'general' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="School Name (English)"
              placeholder="Chilahati Merchants High School"
              value={settings.schoolName?.en || ''}
              onChange={(e) => updateNestedSetting('schoolName', 'en', e.target.value)}
            />
            <Input
              label="School Name (বাংলা)"
              placeholder="চিলাহাটি মার্চেন্টস হাই স্কুল"
              value={settings.schoolName?.bn || ''}
              onChange={(e) => updateNestedSetting('schoolName', 'bn', e.target.value)}
            />
            <Input
              label="School Code"
              placeholder="CMHS-2024"
              value={settings.schoolCode || ''}
              onChange={(e) => updateSetting('schoolCode', e.target.value)}
            />
            <Input
              label="Established"
              placeholder="1985"
              value={settings.established || ''}
              onChange={(e) => updateSetting('established', e.target.value)}
            />
            <Input
              label="Phone"
              placeholder="+880 171 123 4567"
              value={settings.phone || ''}
              onChange={(e) => updateSetting('phone', e.target.value)}
            />
            <Input
              label="Email"
              placeholder="info@cmhs.edu.bd"
              value={settings.email || ''}
              onChange={(e) => updateSetting('email', e.target.value)}
            />
            <Input
              label="Website"
              placeholder="https://cmhs.edu.bd"
              value={settings.website || ''}
              onChange={(e) => updateSetting('website', e.target.value)}
            />
            <div className="md:col-span-2">
              <ImageUploader
                label="School Logo (Select from Computer or Paste Link)"
                value={settings.logo || ''}
                onChange={(newUrl) => updateSetting('logo', newUrl)}
              />
            </div>
            <div className="md:col-span-2 space-y-4">
              <Input
                label="Address (English)"
                placeholder="Full address"
                value={settings.address?.en || ''}
                onChange={(e) => updateNestedSetting('address', 'en', e.target.value)}
              />
              <Input
                label="Address (বাংলা)"
                placeholder="পূর্ণ ঠিকানা"
                value={settings.address?.bn || ''}
                onChange={(e) => updateNestedSetting('address', 'bn', e.target.value)}
              />
            </div>
            <Input
              label="Principal Name (English)"
              placeholder="Dr. Ahmed Hasan"
              value={settings.principal?.en || ''}
              onChange={(e) => updateNestedSetting('principal', 'en', e.target.value)}
            />
            <Input
              label="Principal Name (বাংলা)"
              placeholder="ডা. আহমেদ হাসান"
              value={settings.principal?.bn || ''}
              onChange={(e) => updateNestedSetting('principal', 'bn', e.target.value)}
            />
          </div>
        )}

        {activeTab === 'seo' && (
          <div className="space-y-4">
            <Input
              label="SEO Title"
              placeholder="Meta title for search engines"
              value={settings.seo?.title || ''}
              onChange={(e) => updateNestedSetting('seo', 'title', e.target.value)}
            />
            <Input
              label="SEO Description"
              placeholder="Meta description for search engines"
              value={settings.seo?.description || ''}
              onChange={(e) => updateNestedSetting('seo', 'description', e.target.value)}
            />
            <Input
              label="SEO Keywords"
              placeholder="school, education, Chilahati, ..."
              value={Array.isArray(settings.seo?.keywords) ? settings.seo.keywords.join(', ') : settings.seo?.keywords || ''}
              onChange={(e) => updateNestedSetting('seo', 'keywords', e.target.value.split(',').map(k => k.trim()))}
            />
          </div>
        )}

        {activeTab === 'social' && (
          <div className="space-y-4">
            <Input label="Facebook URL" placeholder="https://facebook.com/..." value={settings.socialLinks?.facebook || ''} onChange={(e) => updateNestedSetting('socialLinks', 'facebook', e.target.value)} />
            <Input label="YouTube URL" placeholder="https://youtube.com/..." value={settings.socialLinks?.youtube || ''} onChange={(e) => updateNestedSetting('socialLinks', 'youtube', e.target.value)} />
            <Input label="Email" placeholder="contact@cmhs.edu.bd" value={settings.socialLinks?.email || ''} onChange={(e) => updateNestedSetting('socialLinks', 'email', e.target.value)} />
          </div>
        )}

        {activeTab === 'colors' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input label="Primary Color" value={settings.primaryColor || '#0F766E'} onChange={(e) => updateSetting('primaryColor', e.target.value)} />
            <Input label="Secondary Color" value={settings.secondaryColor || '#2563EB'} onChange={(e) => updateSetting('secondaryColor', e.target.value)} />
            <Input label="Accent Color" value={settings.accentColor || '#F59E0B'} onChange={(e) => updateSetting('accentColor', e.target.value)} />
          </div>
        )}
      </motion.div>

      <div className="flex justify-end pt-6 border-t border-gray-200">
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  )
}

export default AdminSettings
