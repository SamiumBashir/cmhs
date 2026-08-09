import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { homepageService, menuService, faqService, downloadService } from '../services'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Textarea from '../components/ui/Textarea'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import ImageUploader from '../components/ui/ImageUploader'

const AdminCms = () => {
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState('hero')
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Homepage Data
  const { data: homepageData, isLoading: hpLoading } = useQuery({
    queryKey: ['homepage'],
    queryFn: () => homepageService.get().then(r => r.data.data)
  })

  const [homepageState, setHomepageState] = useState(null)

  useEffect(() => {
    if (homepageData) {
      setHomepageState(homepageData)
    }
  }, [homepageData])

  const hpMutation = useMutation({
    mutationFn: homepageService.update,
    onSuccess: () => {
      queryClient.invalidateQueries()
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    }
  })

  // Menu Form State
  const [newMenu, setNewMenu] = useState({ labelBn: '', labelEn: '', path: '/', position: 'header' })
  const { data: menus, isLoading: menuLoading } = useQuery({
    queryKey: ['menus-admin'],
    queryFn: () => menuService.getAll().then(r => r.data.data)
  })

  const createMenuMutation = useMutation({
    mutationFn: (data) => menuService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries()
      setNewMenu({ labelBn: '', labelEn: '', path: '/', position: 'header' })
    }
  })

  const deleteMenuMutation = useMutation({
    mutationFn: (id) => menuService.remove(id),
    onSuccess: () => queryClient.invalidateQueries()
  })

  // FAQ Form State
  const [newFaq, setNewFaq] = useState({ qBn: '', qEn: '', aBn: '', aEn: '' })
  const { data: faqs, isLoading: faqLoading } = useQuery({
    queryKey: ['faq-admin'],
    queryFn: () => faqService.getAll().then(r => r.data.data)
  })

  const createFaqMutation = useMutation({
    mutationFn: (data) => faqService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries()
      setNewFaq({ qBn: '', qEn: '', aBn: '', aEn: '' })
    }
  })

  const deleteFaqMutation = useMutation({
    mutationFn: (id) => faqService.remove(id),
    onSuccess: () => queryClient.invalidateQueries()
  })

  // Download Form State
  const [newDownload, setNewDownload] = useState({ titleBn: '', titleEn: '', fileUrl: '', category: 'General' })
  const { data: downloads, isLoading: dlLoading } = useQuery({
    queryKey: ['downloads-admin'],
    queryFn: () => downloadService.getAll().then(r => r.data.data)
  })

  const createDownloadMutation = useMutation({
    mutationFn: (data) => downloadService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries()
      setNewDownload({ titleBn: '', titleEn: '', fileUrl: '', category: 'General' })
    }
  })

  const deleteDownloadMutation = useMutation({
    mutationFn: (id) => downloadService.remove(id),
    onSuccess: () => queryClient.invalidateQueries()
  })

  if (hpLoading || !homepageState) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const handleSaveHomepage = () => {
    hpMutation.mutate(homepageState)
  }

  const handleAddHeroSlide = () => {
    const newSlide = {
      title: { bn: 'নতুন স্লাইডার', en: 'New Hero Slide' },
      subtitle: { bn: 'বিবরণ লিখুন', en: 'Enter subtitle text' },
      buttonText: { bn: 'আবেদন করুন', en: 'Apply Now' },
      buttonLink: '/admission',
      bgGradient: 'from-primary/5 via-white to-secondary/5',
      enabled: true
    }
    setHomepageState(prev => ({
      ...prev,
      heroSlides: [...(prev.heroSlides || []), newSlide]
    }))
  }

  const handleUpdateHeroSlide = (index, key, lang, val) => {
    setHomepageState(prev => {
      const slides = [...(prev.heroSlides || [])]
      if (lang) {
        slides[index][key] = { ...(slides[index][key] || {}), [lang]: val }
      } else {
        slides[index][key] = val
      }
      return { ...prev, heroSlides: slides }
    })
  }

  const handleRemoveHeroSlide = (index) => {
    setHomepageState(prev => ({
      ...prev,
      heroSlides: prev.heroSlides.filter((_, i) => i !== index)
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Website CMS Engine</h1>
        {saveSuccess && (
          <span className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-200">
            ✓ CMS settings saved live!
          </span>
        )}
      </div>

      <div className="flex gap-3 border-b border-gray-200 overflow-x-auto pb-1">
        {['hero', 'sections', 'menus', 'faqs', 'downloads'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            {tab === 'hero' ? 'Hero Banners' : tab === 'sections' ? 'Homepage Sections' : tab === 'menus' ? 'Navigation Menus' : tab === 'faqs' ? 'FAQs' : 'Downloads'}
          </button>
        ))}
      </div>

      <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        {activeTab === 'hero' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Hero Slider Cards</h2>
              <Button variant="outline" size="sm" onClick={handleAddHeroSlide}>+ Add Slide</Button>
            </div>

            {homepageState.heroSlides?.map((slide, index) => (
              <Card key={index} className="p-6 space-y-4 border border-gray-200">
                <div className="flex justify-between items-center border-b pb-3">
                  <span className="font-bold text-gray-700">Slide #{index + 1}</span>
                  <button onClick={() => handleRemoveHeroSlide(index)} className="text-red-500 hover:text-red-700 text-sm">
                    Remove Slide
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Title (English)"
                    value={slide.title?.en || ''}
                    onChange={(e) => handleUpdateHeroSlide(index, 'title', 'en', e.target.value)}
                  />
                  <Input
                    label="Title (বাংলা)"
                    value={slide.title?.bn || ''}
                    onChange={(e) => handleUpdateHeroSlide(index, 'title', 'bn', e.target.value)}
                  />
                  <Textarea
                    label="Subtitle (English)"
                    rows={2}
                    value={slide.subtitle?.en || ''}
                    onChange={(e) => handleUpdateHeroSlide(index, 'subtitle', 'en', e.target.value)}
                  />
                  <Textarea
                    label="Subtitle (বাংলা)"
                    rows={2}
                    value={slide.subtitle?.bn || ''}
                    onChange={(e) => handleUpdateHeroSlide(index, 'subtitle', 'bn', e.target.value)}
                  />
                  <Input
                    label="Button Text (EN)"
                    value={slide.buttonText?.en || ''}
                    onChange={(e) => handleUpdateHeroSlide(index, 'buttonText', 'en', e.target.value)}
                  />
                  <Input
                    label="Button Text (BN)"
                    value={slide.buttonText?.bn || ''}
                    onChange={(e) => handleUpdateHeroSlide(index, 'buttonText', 'bn', e.target.value)}
                  />
                  <Input
                    label="Button Link URL"
                    value={slide.buttonLink || ''}
                    onChange={(e) => handleUpdateHeroSlide(index, 'buttonLink', null, e.target.value)}
                  />
                  <div className="md:col-span-2">
                    <ImageUploader
                      label="Background Image (Select from Computer or Paste Link)"
                      value={slide.image || ''}
                      onChange={(newUrl) => handleUpdateHeroSlide(index, 'image', null, newUrl)}
                    />
                  </div>
                </div>
              </Card>
            ))}

            <div className="flex justify-end pt-4">
              <Button variant="primary" onClick={handleSaveHomepage} disabled={hpMutation.isPending}>
                {hpMutation.isPending ? 'Saving...' : 'Save Hero Banners'}
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'sections' && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Enable & Order Homepage Sections</h2>
            <Card>
              <div className="space-y-4">
                {homepageState.sectionsOrder?.map((sec, index) => (
                  <div key={sec.key || index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <span className="font-medium text-gray-800">{sec.label || sec.key}</span>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
                        <input
                          type="checkbox"
                          checked={sec.enabled !== false}
                          onChange={(e) => {
                            setHomepageState(prev => {
                              const secArr = [...(prev.sectionsOrder || [])]
                              secArr[index].enabled = e.target.checked
                              return { ...prev, sectionsOrder: secArr }
                            })
                          }}
                          className="rounded text-primary focus:ring-primary h-4 w-4"
                        />
                        Visible
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            <div className="flex justify-end pt-4">
              <Button variant="primary" onClick={handleSaveHomepage} disabled={hpMutation.isPending}>
                {hpMutation.isPending ? 'Saving...' : 'Save Section Settings'}
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'menus' && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Add Navigation Menu Item</h2>
            <Card className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <Input
                  label="Label (BN)"
                  value={newMenu.labelBn}
                  onChange={(e) => setNewMenu({ ...newMenu, labelBn: e.target.value })}
                  placeholder="যেমন: ভর্তি"
                />
                <Input
                  label="Label (EN)"
                  value={newMenu.labelEn}
                  onChange={(e) => setNewMenu({ ...newMenu, labelEn: e.target.value })}
                  placeholder="e.g. Admission"
                />
                <Input
                  label="Path URL"
                  value={newMenu.path}
                  onChange={(e) => setNewMenu({ ...newMenu, path: e.target.value })}
                  placeholder="/admission"
                />
                <Button
                  variant="primary"
                  onClick={() => createMenuMutation.mutate({
                    label: { bn: newMenu.labelBn, en: newMenu.labelEn },
                    path: newMenu.path,
                    position: newMenu.position
                  })}
                  disabled={createMenuMutation.isPending || !newMenu.labelEn}
                >
                  Add Menu Item
                </Button>
              </div>
            </Card>

            <Card>
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-600">
                    <th className="p-4">Label (EN/BN)</th>
                    <th className="p-4">Path</th>
                    <th className="p-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {menuLoading ? (
                    <tr><td colSpan="3" className="p-4 text-center">Loading...</td></tr>
                  ) : (
                    menus?.map(m => (
                      <tr key={m._id} className="border-b border-gray-100">
                        <td className="p-4 font-medium">{m.label?.en} / {m.label?.bn}</td>
                        <td className="p-4 text-gray-600">{m.path}</td>
                        <td className="p-4 text-center">
                          <button onClick={() => deleteMenuMutation.mutate(m._id)} className="text-red-500 hover:text-red-700 text-sm">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </Card>
          </div>
        )}

        {activeTab === 'faqs' && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Add New FAQ Question</h2>
            <Card className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Question (EN)"
                  value={newFaq.qEn}
                  onChange={(e) => setNewFaq({ ...newFaq, qEn: e.target.value })}
                />
                <Input
                  label="Question (BN)"
                  value={newFaq.qBn}
                  onChange={(e) => setNewFaq({ ...newFaq, qBn: e.target.value })}
                />
                <Textarea
                  label="Answer (EN)"
                  value={newFaq.aEn}
                  onChange={(e) => setNewFaq({ ...newFaq, aEn: e.target.value })}
                />
                <Textarea
                  label="Answer (BN)"
                  value={newFaq.aBn}
                  onChange={(e) => setNewFaq({ ...newFaq, aBn: e.target.value })}
                />
              </div>
              <Button
                variant="primary"
                onClick={() => createFaqMutation.mutate({
                  question: { bn: newFaq.qBn, en: newFaq.qEn },
                  answer: { bn: newFaq.aBn, en: newFaq.aEn }
                })}
                disabled={createFaqMutation.isPending || !newFaq.qEn}
              >
                Save FAQ Question
              </Button>
            </Card>

            <Card>
              <div className="divide-y divide-gray-100">
                {faqs?.map(faq => (
                  <div key={faq._id} className="p-4 flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-gray-900">{faq.question?.en} / {faq.question?.bn}</h4>
                      <p className="text-sm text-gray-600 mt-1">{faq.answer?.en}</p>
                    </div>
                    <button onClick={() => deleteFaqMutation.mutate(faq._id)} className="text-red-500 hover:text-red-700 text-sm">
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'downloads' && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Add Download Document</h2>
            <Card className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <Input
                  label="Title (EN)"
                  value={newDownload.titleEn}
                  onChange={(e) => setNewDownload({ ...newDownload, titleEn: e.target.value })}
                />
                <Input
                  label="Title (BN)"
                  value={newDownload.titleBn}
                  onChange={(e) => setNewDownload({ ...newDownload, titleBn: e.target.value })}
                />
                <Input
                  label="File URL"
                  value={newDownload.fileUrl}
                  onChange={(e) => setNewDownload({ ...newDownload, fileUrl: e.target.value })}
                  placeholder="https://... or /docs/file.pdf"
                />
                <Button
                  variant="primary"
                  onClick={() => createDownloadMutation.mutate({
                    title: { bn: newDownload.titleBn, en: newDownload.titleEn },
                    fileUrl: newDownload.fileUrl,
                    category: newDownload.category
                  })}
                  disabled={createDownloadMutation.isPending || !newDownload.titleEn}
                >
                  Add Document
                </Button>
              </div>
            </Card>

            <Card>
              <div className="divide-y divide-gray-100">
                {downloads?.map(dl => (
                  <div key={dl._id} className="p-4 flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold text-gray-900">{dl.title?.en} / {dl.title?.bn}</h4>
                      <a href={dl.fileUrl} target="_blank" rel="noreferrer" className="text-xs text-primary underline">{dl.fileUrl}</a>
                    </div>
                    <button onClick={() => deleteDownloadMutation.mutate(dl._id)} className="text-red-500 hover:text-red-700 text-sm">
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default AdminCms
