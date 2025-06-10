'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Cog6ToothIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  BellIcon,
  GlobeAltIcon,
  EnvelopeIcon,
  KeyIcon,
  ServerIcon,
  CloudIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XMarkIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

interface SystemSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  supportEmail: string;
  maintenanceMode: boolean;
  registrationEnabled: boolean;
  emailVerificationRequired: boolean;
  maxFileUploadSize: number;
  sessionTimeout: number;
  defaultCurrency: string;
  commissionRate: number;
  minWithdrawAmount: number;
  autoApproveOrders: boolean;
  enableNotifications: boolean;
  enableSMS: boolean;
  backupFrequency: string;
  logRetentionDays: number;
}

export default function AdminSettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<SystemSettings>({
    siteName: 'HesapDurağı',
    siteDescription: 'Güvenilir oyun hesabı alım satım platformu',
    contactEmail: 'info@hesapduragi.com',
    supportEmail: 'destek@hesapduragi.com',
    maintenanceMode: false,
    registrationEnabled: true,
    emailVerificationRequired: true,
    maxFileUploadSize: 10,
    sessionTimeout: 30,
    defaultCurrency: 'TRY',
    commissionRate: 5,
    minWithdrawAmount: 50,
    autoApproveOrders: false,
    enableNotifications: true,
    enableSMS: false,
    backupFrequency: 'daily',
    logRetentionDays: 30
  });

  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [announcements, setAnnouncements] = useState<string[]>([
    "🔥 Yeni Valorant hesapları stoklarda!",
    "💫 CS:GO Prime hesaplarında %20 indirim!",
    "🎮 League of Legends Elmas hesapları geldi!",
    "🌟 7/24 Canlı Destek hizmetimiz aktif!",
  ]);
  const [announcementsLoading, setAnnouncementsLoading] = useState(false);

  // Slider state'leri
  const [sliderData, setSliderData] = useState<any[]>([]);
  const [sliderLoading, setSliderLoading] = useState(false);

  // Testimonials state'leri
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [testimonialsLoading, setTestimonialsLoading] = useState(false);

  // Popular Categories state'leri
  const [popularCategories, setPopularCategories] = useState<any[]>([]);
  const [popularCategoriesLoading, setPopularCategoriesLoading] = useState(false);

  const tabs = [
    { id: 'general', name: 'Genel Ayarlar', icon: Cog6ToothIcon },
    { id: 'announcements', name: 'Duyurular', icon: BellIcon },
    { id: 'slider', name: 'Ana Sayfa Slider', icon: GlobeAltIcon },
    { id: 'popular-categories', name: 'Popüler Kategoriler', icon: GlobeAltIcon },
    { id: 'testimonials', name: 'Müşteri Yorumları', icon: EnvelopeIcon },
    { id: 'payment', name: 'Ödeme Ayarları', icon: CurrencyDollarIcon },
    { id: 'security', name: 'Güvenlik', icon: ShieldCheckIcon },
    { id: 'notifications', name: 'Bildirimler', icon: BellIcon },
    { id: 'system', name: 'Sistem', icon: ServerIcon },
    { id: 'backup', name: 'Yedekleme', icon: CloudIcon }
  ];

  const handleSave = async () => {
    setLoading(true);
    try {
      // API call to save settings
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
      setSuccess('Ayarlar başarıyla kaydedildi!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Ayarlar kaydedilirken bir hata oluştu!');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (key: keyof SystemSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  // Duyuruları yükle
  const fetchAnnouncements = async () => {
    try {
      const response = await fetch('/api/announcements');
      const data = await response.json();
      if (data.success && data.data) {
        setAnnouncements(data.data);
      }
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };

  // Duyuruları kaydet
  const saveAnnouncements = async () => {
    setAnnouncementsLoading(true);
    try {
      const response = await fetch('/api/announcements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ announcements }),
      });

      const data = await response.json();
      if (data.success) {
        setSuccess('Duyurular başarıyla kaydedildi!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Duyurular kaydedilirken bir hata oluştu!');
        setTimeout(() => setError(''), 3000);
      }
    } catch (error) {
      setError('Duyurular kaydedilirken bir hata oluştu!');
      setTimeout(() => setError(''), 3000);
    } finally {
      setAnnouncementsLoading(false);
    }
  };

  // Duyuru ekle
  const addAnnouncement = () => {
    setAnnouncements(prev => [...prev, '']);
  };

  // Duyuru sil
  const removeAnnouncement = (index: number) => {
    setAnnouncements(prev => prev.filter((_, i) => i !== index));
  };

  // Duyuru güncelle
  const updateAnnouncement = (index: number, value: string) => {
    setAnnouncements(prev => prev.map((item, i) => i === index ? value : item));
  };

  // Slider fonksiyonları
  const fetchSliderData = async () => {
    try {
      const response = await fetch('/api/slider');
      const data = await response.json();
      setSliderData(data);
    } catch (error) {
      console.error('Error fetching slider data:', error);
    }
  };

  const saveSliderData = async () => {
    setSliderLoading(true);
    try {
      const response = await fetch('/api/slider', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sliderData),
      });

      const data = await response.json();
      if (data.success) {
        setSuccess('Slider verileri başarıyla kaydedildi!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Slider verileri kaydedilirken bir hata oluştu!');
        setTimeout(() => setError(''), 3000);
      }
    } catch (error) {
      setError('Slider verileri kaydedilirken bir hata oluştu!');
      setTimeout(() => setError(''), 3000);
    } finally {
      setSliderLoading(false);
    }
  };

  const updateSlideField = (index: number, field: string, value: any) => {
    setSliderData(prev => prev.map((slide, i) => 
      i === index ? { ...slide, [field]: value } : slide
    ));
  };

  const addSlide = () => {
    const newSlide = {
      id: Date.now(),
      title: "YENİ SLIDE",
      subtitle: "Alt Başlık",
      description: "Açıklama metni buraya gelecek",
      buttonText: "Buton Metni",
      link: "/products",
      backgroundColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      backgroundImage: "",
      icons: [
        { type: "gamepad", x: 15, y: 20, rotation: -15 },
        { type: "trophy", x: 85, y: 15, rotation: 25 },
        { type: "star", x: 20, y: 75, rotation: 45 }
      ]
    };
    setSliderData(prev => [...prev, newSlide]);
  };

  const removeSlide = (index: number) => {
    setSliderData(prev => prev.filter((_, i) => i !== index));
  };

  // Testimonials fonksiyonları
  const fetchTestimonials = async () => {
    try {
      const response = await fetch('/api/testimonials');
      const data = await response.json();
      if (data.success) {
        setTestimonials(data.data);
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    }
  };

  const saveTestimonials = async () => {
    setTestimonialsLoading(true);
    try {
      const response = await fetch('/api/testimonials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'update', testimonials }),
      });

      const data = await response.json();
      if (data.success) {
        setSuccess('Müşteri yorumları başarıyla kaydedildi!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Müşteri yorumları kaydedilirken bir hata oluştu!');
        setTimeout(() => setError(''), 3000);
      }
    } catch (error) {
      setError('Müşteri yorumları kaydedilirken bir hata oluştu!');
      setTimeout(() => setError(''), 3000);
    } finally {
      setTestimonialsLoading(false);
    }
  };

  const addTestimonial = () => {
    const newTestimonial = {
      id: Date.now(),
      name: "Yeni Müşteri",
      avatar: "👤",
      rating: 5,
      comment: "Yorum metni buraya gelecek...",
      game: "Oyun Adı",
      date: new Date().toLocaleDateString('tr-TR'),
      verified: true
    };
    setTestimonials(prev => [...prev, newTestimonial]);
  };

  const removeTestimonial = (index: number) => {
    setTestimonials(prev => prev.filter((_, i) => i !== index));
  };

  const updateTestimonialField = (index: number, field: string, value: any) => {
    setTestimonials(prev => prev.map((testimonial, i) => 
      i === index ? { ...testimonial, [field]: value } : testimonial
    ));
  };

  // Popular Categories fonksiyonları
  const fetchPopularCategories = async () => {
    try {
      const response = await fetch('/api/admin/popular-categories');
      const data = await response.json();
      if (data.success) {
        setPopularCategories(data.data);
      }
    } catch (error) {
      console.error('Error fetching popular categories:', error);
    }
  };

  const savePopularCategories = async () => {
    setPopularCategoriesLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      console.log('Kaydedilecek kategoriler:', popularCategories);
      
      const response = await fetch('/api/admin/popular-categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ categories: popularCategories }),
      });

      console.log('API Response Status:', response.status);
      const data = await response.json();
      console.log('API Response Data:', data);
      
      if (data.success) {
        setSuccess('Popüler kategoriler başarıyla kaydedildi!');
        setTimeout(() => setSuccess(''), 3000);
        // Verileri yeniden yükle
        fetchPopularCategories();
      } else {
        setError(data.error || 'Popüler kategoriler kaydedilirken bir hata oluştu!');
        setTimeout(() => setError(''), 3000);
      }
    } catch (error: any) {
      console.error('Save error:', error);
      setError('Popüler kategoriler kaydedilirken bir hata oluştu: ' + (error?.message || 'Bilinmeyen hata'));
      setTimeout(() => setError(''), 3000);
    } finally {
      setPopularCategoriesLoading(false);
    }
  };

  const addPopularCategory = () => {
    const newCategory = {
      title: 'Yeni Kategori',
      description: 'Kategori açıklaması',
      buttonText: 'КУПИТЬ',
      buttonLink: '/products',
      backgroundImage: '/images/category-bg-1.jpg',
      gradientFrom: 'from-orange-600',
      gradientTo: 'to-red-800',
      textColor: 'text-white',
      isActive: true,
      order: popularCategories.length
    };
    setPopularCategories(prev => [...prev, newCategory]);
  };

  const removePopularCategory = (index: number) => {
    setPopularCategories(prev => prev.filter((_, i) => i !== index));
  };

  const updatePopularCategoryField = (index: number, field: string, value: any) => {
    setPopularCategories(prev => prev.map((category, i) => 
      i === index ? { ...category, [field]: value } : category
    ));
  };

  // Component mount olduğunda duyuruları yükle
  useEffect(() => {
    if (activeTab === 'announcements') {
      fetchAnnouncements();
    } else if (activeTab === 'slider') {
      fetchSliderData();
    } else if (activeTab === 'testimonials') {
      fetchTestimonials();
    } else if (activeTab === 'popular-categories') {
      fetchPopularCategories();
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-sm border-b border-orange-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/admin" className="text-gray-400 hover:text-white transition-colors">
                <ArrowLeftIcon className="h-6 w-6" />
              </Link>
              <div className="flex items-center space-x-2">
                <Cog6ToothIcon className="h-8 w-8 text-orange-500" />
                <h1 className="text-2xl font-bold text-white">Sistem Ayarları</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 p-4 bg-green-900 border border-green-700 rounded-lg flex items-center space-x-2">
            <CheckCircleIcon className="h-5 w-5 text-green-400" />
            <span className="text-green-300">{success}</span>
            <button onClick={() => setSuccess('')} className="ml-auto">
              <XMarkIcon className="h-5 w-5 text-green-400" />
            </button>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-900 border border-red-700 rounded-lg flex items-center space-x-2">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
            <span className="text-red-300">{error}</span>
            <button onClick={() => setError('')} className="ml-auto">
              <XMarkIcon className="h-5 w-5 text-red-400" />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Genel Ayarlar</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Site Adı
                    </label>
                    <input
                      type="text"
                      value={settings.siteName}
                      onChange={(e) => handleInputChange('siteName', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Site Açıklaması
                    </label>
                    <textarea
                      value={settings.siteDescription}
                      onChange={(e) => handleInputChange('siteDescription', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      İletişim E-postası
                    </label>
                    <input
                      type="email"
                      value={settings.contactEmail}
                      onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Destek E-postası
                    </label>
                    <input
                      type="email"
                      value={settings.supportEmail}
                      onChange={(e) => handleInputChange('supportEmail', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-sm font-medium text-gray-300">
                        Bakım Modu
                      </label>
                      <p className="text-xs text-gray-400">Site bakım modunda olsun mu?</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.maintenanceMode}
                        onChange={(e) => handleInputChange('maintenanceMode', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-sm font-medium text-gray-300">
                        Kayıt Olma Aktif
                      </label>
                      <p className="text-xs text-gray-400">Yeni kullanıcı kayıtları açık olsun mu?</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.registrationEnabled}
                        onChange={(e) => handleInputChange('registrationEnabled', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                    </label>
                  </div>
                </div>
              )}

              {activeTab === 'announcements' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-white">Duyuru Yönetimi</h3>
                    <button
                      onClick={addAnnouncement}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                    >
                      + Duyuru Ekle
                    </button>
                  </div>
                  
                  <p className="text-gray-400 text-sm">
                    Sayfanın üstünde görünen promosyon yazılarını buradan yönetebilirsiniz. 
                    Duyurular 3 saniyede bir otomatik olarak değişir.
                  </p>

                  <div className="space-y-4">
                    {announcements.map((announcement, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="flex-1">
                          <input
                            type="text"
                            value={announcement}
                            onChange={(e) => updateAnnouncement(index, e.target.value)}
                            placeholder="Duyuru metnini girin..."
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                          />
                        </div>
                        <button
                          onClick={() => removeAnnouncement(index)}
                          disabled={announcements.length <= 1}
                          className="bg-red-500 hover:bg-red-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-3 py-2 rounded-lg transition-colors"
                          title={announcements.length <= 1 ? "En az bir duyuru gereklidir" : "Duyuruyu sil"}
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="bg-gray-700 rounded-lg p-4">
                    <h4 className="text-white font-medium mb-2">Önizleme:</h4>
                    <div className="bg-orange-500 text-white text-center py-2 rounded relative overflow-hidden">
                      {announcements.filter(a => a.trim()).length > 0 ? (
                        <p className="text-sm font-medium">
                          {announcements.find(a => a.trim()) || "Duyuru metni..."}
                        </p>
                      ) : (
                        <p className="text-sm opacity-75">Henüz duyuru eklenmemiş</p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={saveAnnouncements}
                      disabled={announcementsLoading || announcements.filter(a => a.trim()).length === 0}
                      className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
                    >
                      {announcementsLoading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
                      <span>{announcementsLoading ? 'Kaydediliyor...' : 'Duyuruları Kaydet'}</span>
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'slider' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-white">Ana Sayfa Slider Yönetimi</h3>
                    <button
                      onClick={addSlide}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                    >
                      + Slide Ekle
                    </button>
                  </div>
                  
                  <p className="text-gray-400 text-sm">
                    Ana sayfada görünen carousel slider&apos;ı buradan yönetebilirsiniz. 
                    İstediğiniz kadar slide ekleyebilir, görseller, metinler ve bağlantıları düzenleyebilirsiniz.
                    Slider otomatik olarak tüm slide&apos;ları döngüsel şekilde gösterecektir.
                  </p>

                  <div className="space-y-6">
                    {sliderData.map((slide, index) => (
                      <div key={slide.id} className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="text-white font-medium">Slide #{index + 1}</h4>
                          <button
                            onClick={() => removeSlide(index)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition-colors text-sm"
                            title="Slide&apos;ı sil"
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Ana Başlık
                            </label>
                            <input
                              type="text"
                              value={slide.title}
                              onChange={(e) => updateSlideField(index, 'title', e.target.value)}
                              className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:border-orange-500"
                              placeholder="Örn: OYUN HESAPLARI"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Alt Başlık
                            </label>
                            <input
                              type="text"
                              value={slide.subtitle}
                              onChange={(e) => updateSlideField(index, 'subtitle', e.target.value)}
                              className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:border-orange-500"
                              placeholder="Örn: Güvenli Alışveriş"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Açıklama
                            </label>
                            <textarea
                              value={slide.description}
                              onChange={(e) => updateSlideField(index, 'description', e.target.value)}
                              rows={3}
                              className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:border-orange-500"
                              placeholder="Slide açıklaması..."
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Buton Metni
                            </label>
                            <input
                              type="text"
                              value={slide.buttonText}
                              onChange={(e) => updateSlideField(index, 'buttonText', e.target.value)}
                              className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:border-orange-500"
                              placeholder="Örn: Keşfet"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Bağlantı URL&apos;si
                            </label>
                            <input
                              type="text"
                              value={slide.link}
                              onChange={(e) => updateSlideField(index, 'link', e.target.value)}
                              className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:border-orange-500"
                              placeholder="Örn: /products"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Arka Plan Rengi (CSS Gradient)
                            </label>
                            <input
                              type="text"
                              value={slide.backgroundColor}
                              onChange={(e) => updateSlideField(index, 'backgroundColor', e.target.value)}
                              className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:border-orange-500"
                              placeholder="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Arka Plan Görseli URL&apos;si (Opsiyonel)
                            </label>
                            <input
                              type="url"
                              value={slide.backgroundImage}
                              onChange={(e) => updateSlideField(index, 'backgroundImage', e.target.value)}
                              className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:border-orange-500"
                              placeholder="https://example.com/image.jpg"
                            />
                          </div>
                        </div>

                        {/* Slide Preview */}
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Önizleme:
                          </label>
                          <div 
                            className="h-32 rounded-lg flex items-center justify-center text-white relative overflow-hidden"
                            style={{
                              background: slide.backgroundImage 
                                ? `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${slide.backgroundImage})`
                                : slide.backgroundColor,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center'
                            }}
                          >
                            <div className="text-center">
                              <h3 className="text-lg font-bold">{slide.title}</h3>
                              <p className="text-sm opacity-90">{slide.subtitle}</p>
                              <p className="text-xs opacity-75 mt-1">{slide.description}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {sliderData.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      <GlobeAltIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Henüz slide eklenmemiş</p>
                      <button
                        onClick={addSlide}
                        className="mt-2 text-orange-500 hover:text-orange-400 text-sm"
                      >
                        İlk slide&apos;ı ekle
                      </button>
                    </div>
                  )}

                  <div className="flex justify-end">
                    <button
                      onClick={saveSliderData}
                      disabled={sliderLoading}
                      className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
                    >
                      {sliderLoading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
                      <span>{sliderLoading ? 'Kaydediliyor...' : 'Slider Verilerini Kaydet'}</span>
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'payment' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Ödeme Ayarları</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Varsayılan Para Birimi
                    </label>
                    <select
                      value={settings.defaultCurrency}
                      onChange={(e) => handleInputChange('defaultCurrency', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    >
                      <option value="TRY">Türk Lirası (₺)</option>
                      <option value="USD">Amerikan Doları ($)</option>
                      <option value="EUR">Euro (€)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Komisyon Oranı (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={settings.commissionRate}
                      onChange={(e) => handleInputChange('commissionRate', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Minimum Para Çekme Tutarı
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={settings.minWithdrawAmount}
                      onChange={(e) => handleInputChange('minWithdrawAmount', parseInt(e.target.value))}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-sm font-medium text-gray-300">
                        Otomatik Sipariş Onayı
                      </label>
                      <p className="text-xs text-gray-400">Siparişler otomatik olarak onaylansın mı?</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.autoApproveOrders}
                        onChange={(e) => handleInputChange('autoApproveOrders', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                    </label>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Güvenlik Ayarları</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-sm font-medium text-gray-300">
                        E-posta Doğrulaması Zorunlu
                      </label>
                      <p className="text-xs text-gray-400">Kayıt sırasında e-posta doğrulaması gerekli olsun mu?</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.emailVerificationRequired}
                        onChange={(e) => handleInputChange('emailVerificationRequired', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Oturum Zaman Aşımı (dakika)
                    </label>
                    <input
                      type="number"
                      min="5"
                      max="1440"
                      value={settings.sessionTimeout}
                      onChange={(e) => handleInputChange('sessionTimeout', parseInt(e.target.value))}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Maksimum Dosya Yükleme Boyutu (MB)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={settings.maxFileUploadSize}
                      onChange={(e) => handleInputChange('maxFileUploadSize', parseInt(e.target.value))}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Bildirim Ayarları</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-sm font-medium text-gray-300">
                        E-posta Bildirimleri
                      </label>
                      <p className="text-xs text-gray-400">E-posta bildirimleri aktif olsun mu?</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.enableNotifications}
                        onChange={(e) => handleInputChange('enableNotifications', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-sm font-medium text-gray-300">
                        SMS Bildirimleri
                      </label>
                      <p className="text-xs text-gray-400">SMS bildirimleri aktif olsun mu?</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.enableSMS}
                        onChange={(e) => handleInputChange('enableSMS', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                    </label>
                  </div>
                </div>
              )}

              {activeTab === 'system' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Sistem Ayarları</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Log Saklama Süresi (gün)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="365"
                      value={settings.logRetentionDays}
                      onChange={(e) => handleInputChange('logRetentionDays', parseInt(e.target.value))}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'testimonials' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-white">Müşteri Yorumları</h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={addTestimonial}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        + Yeni Yorum Ekle
                      </button>
                      <button
                        onClick={saveTestimonials}
                        disabled={testimonialsLoading}
                        className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                      >
                        {testimonialsLoading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
                        <span>{testimonialsLoading ? 'Kaydediliyor...' : 'Kaydet'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {testimonials.map((testimonial, index) => (
                      <div key={testimonial.id} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Müşteri Adı
                            </label>
                            <input
                              type="text"
                              value={testimonial.name}
                              onChange={(e) => updateTestimonialField(index, 'name', e.target.value)}
                              className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:border-orange-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Avatar (Emoji)
                            </label>
                            <input
                              type="text"
                              value={testimonial.avatar}
                              onChange={(e) => updateTestimonialField(index, 'avatar', e.target.value)}
                              className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:border-orange-500"
                              placeholder="👤"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Puan (1-5)
                            </label>
                            <select
                              value={testimonial.rating}
                              onChange={(e) => updateTestimonialField(index, 'rating', parseInt(e.target.value))}
                              className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:border-orange-500"
                            >
                              <option value={1}>1 Yıldız</option>
                              <option value={2}>2 Yıldız</option>
                              <option value={3}>3 Yıldız</option>
                              <option value={4}>4 Yıldız</option>
                              <option value={5}>5 Yıldız</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Oyun/Ürün
                            </label>
                            <input
                              type="text"
                              value={testimonial.game}
                              onChange={(e) => updateTestimonialField(index, 'game', e.target.value)}
                              className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:border-orange-500"
                              placeholder="PUBG Mobile 660 UC"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Tarih
                            </label>
                            <input
                              type="text"
                              value={testimonial.date}
                              onChange={(e) => updateTestimonialField(index, 'date', e.target.value)}
                              className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:border-orange-500"
                              placeholder="3.6.2025"
                            />
                          </div>

                          <div className="flex items-center">
                            <label className="flex items-center space-x-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={testimonial.verified}
                                onChange={(e) => updateTestimonialField(index, 'verified', e.target.checked)}
                                className="w-4 h-4 text-orange-500 bg-gray-600 border-gray-500 rounded focus:ring-orange-500"
                              />
                              <span className="text-sm text-gray-300">Doğrulanmış</span>
                            </label>
                          </div>
                        </div>

                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Yorum
                          </label>
                          <textarea
                            value={testimonial.comment}
                            onChange={(e) => updateTestimonialField(index, 'comment', e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:border-orange-500"
                            placeholder="Müşteri yorumu buraya gelecek..."
                          />
                        </div>

                        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-600">
                          <div className="flex items-center space-x-2 text-sm text-gray-400">
                            <span>ID: {testimonial.id}</span>
                          </div>
                          <button
                            onClick={() => removeTestimonial(index)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
                          >
                            Sil
                          </button>
                        </div>
                      </div>
                    ))}

                    {testimonials.length === 0 && (
                      <div className="text-center py-8 text-gray-400">
                        <p>Henüz müşteri yorumu bulunmuyor.</p>
                        <p className="text-sm mt-2">Yeni yorum eklemek için yukarıdaki butonu kullanın.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'popular-categories' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-white">Popüler Kategoriler</h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={addPopularCategory}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        + Yeni Kategori Ekle
                      </button>
                      <button
                        onClick={savePopularCategories}
                        disabled={popularCategoriesLoading}
                        className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                      >
                        {popularCategoriesLoading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
                        <span>{popularCategoriesLoading ? 'Kaydediliyor...' : 'Kaydet'}</span>
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-400 text-sm">
                    Anasayfada görünen popüler kategoriler bölümünü buradan yönetebilirsiniz. 
                    Her kategori için başlık, açıklama, buton metni ve görsel ayarlayabilirsiniz.
                  </p>

                  <div className="space-y-6">
                    {popularCategories.map((category, index) => (
                      <div key={category._id} className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Başlık
                            </label>
                            <input
                              type="text"
                              value={category.title}
                              onChange={(e) => updatePopularCategoryField(index, 'title', e.target.value)}
                              className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:border-orange-500"
                              placeholder="ГОРЯЧИЕ НОВИНКИ ИГР"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Açıklama
                            </label>
                            <input
                              type="text"
                              value={category.description}
                              onChange={(e) => updatePopularCategoryField(index, 'description', e.target.value)}
                              className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:border-orange-500"
                              placeholder="Самые популярные игровые аккаунты"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Buton Metni
                            </label>
                            <input
                              type="text"
                              value={category.buttonText}
                              onChange={(e) => updatePopularCategoryField(index, 'buttonText', e.target.value)}
                              className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:border-orange-500"
                              placeholder="КУПИТЬ"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Buton Linki
                            </label>
                            <input
                              type="text"
                              value={category.buttonLink}
                              onChange={(e) => updatePopularCategoryField(index, 'buttonLink', e.target.value)}
                              className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:border-orange-500"
                              placeholder="/products?category=fps"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Arkaplan Görseli URL
                            </label>
                            <input
                              type="text"
                              value={category.backgroundImage}
                              onChange={(e) => updatePopularCategoryField(index, 'backgroundImage', e.target.value)}
                              className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:border-orange-500"
                              placeholder="/images/category-bg-1.jpg"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Sıralama
                            </label>
                            <input
                              type="number"
                              value={category.order}
                              onChange={(e) => updatePopularCategoryField(index, 'order', parseInt(e.target.value))}
                              className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:border-orange-500"
                              min="0"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Gradient Başlangıç
                            </label>
                            <select
                              value={category.gradientFrom}
                              onChange={(e) => updatePopularCategoryField(index, 'gradientFrom', e.target.value)}
                              className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:border-orange-500"
                            >
                              <option value="from-orange-600">Turuncu</option>
                              <option value="from-blue-600">Mavi</option>
                              <option value="from-purple-600">Mor</option>
                              <option value="from-red-600">Kırmızı</option>
                              <option value="from-green-600">Yeşil</option>
                              <option value="from-yellow-600">Sarı</option>
                              <option value="from-pink-600">Pembe</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Gradient Bitiş
                            </label>
                            <select
                              value={category.gradientTo}
                              onChange={(e) => updatePopularCategoryField(index, 'gradientTo', e.target.value)}
                              className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:border-orange-500"
                            >
                              <option value="to-red-800">Koyu Kırmızı</option>
                              <option value="to-blue-800">Koyu Mavi</option>
                              <option value="to-purple-800">Koyu Mor</option>
                              <option value="to-orange-800">Koyu Turuncu</option>
                              <option value="to-green-800">Koyu Yeşil</option>
                              <option value="to-yellow-800">Koyu Sarı</option>
                              <option value="to-pink-800">Koyu Pembe</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Metin Rengi
                            </label>
                            <select
                              value={category.textColor}
                              onChange={(e) => updatePopularCategoryField(index, 'textColor', e.target.value)}
                              className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:border-orange-500"
                            >
                              <option value="text-white">Beyaz</option>
                              <option value="text-black">Siyah</option>
                              <option value="text-gray-100">Açık Gri</option>
                              <option value="text-gray-900">Koyu Gri</option>
                            </select>
                          </div>
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t border-gray-600">
                          <div className="flex items-center space-x-4">
                            <label className="flex items-center space-x-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={category.isActive}
                                onChange={(e) => updatePopularCategoryField(index, 'isActive', e.target.checked)}
                                className="w-4 h-4 text-orange-500 bg-gray-600 border-gray-500 rounded focus:ring-orange-500"
                              />
                              <span className="text-sm text-gray-300">Aktif</span>
                            </label>
                            <span className="text-sm text-gray-400">ID: {category._id || 'Yeni'}</span>
                          </div>
                          <button
                            onClick={() => removePopularCategory(index)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
                          >
                            Sil
                          </button>
                        </div>

                        {/* Preview */}
                        <div className="mt-4 p-4 bg-gray-800 rounded-lg border border-gray-500">
                          <p className="text-sm text-gray-400 mb-2">Önizleme:</p>
                          <div 
                            className={`relative overflow-hidden rounded-lg h-32 bg-gradient-to-r ${category.gradientFrom} ${category.gradientTo}`}
                            style={{
                              backgroundImage: category.backgroundImage ? `url(${category.backgroundImage})` : 'none',
                              backgroundSize: 'cover',
                              backgroundPosition: 'center'
                            }}
                          >
                            <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                            <div className="relative h-full flex flex-col justify-between p-4">
                              <div>
                                <h4 className={`text-lg font-bold ${category.textColor} mb-1`}>
                                  {category.title}
                                </h4>
                                <p className={`${category.textColor} opacity-90 text-sm`}>
                                  {category.description}
                                </p>
                              </div>
                              <div className="flex justify-start">
                                <span className="bg-yellow-500 text-black font-bold px-4 py-1 rounded text-sm">
                                  {category.buttonText}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {popularCategories.length === 0 && (
                      <div className="text-center py-8 text-gray-400">
                        <p>Henüz popüler kategori bulunmuyor.</p>
                        <p className="text-sm mt-2">Yeni kategori eklemek için yukarıdaki butonu kullanın.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'backup' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Yedekleme Ayarları</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Yedekleme Sıklığı
                    </label>
                    <select
                      value={settings.backupFrequency}
                      onChange={(e) => handleInputChange('backupFrequency', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    >
                      <option value="hourly">Saatlik</option>
                      <option value="daily">Günlük</option>
                      <option value="weekly">Haftalık</option>
                      <option value="monthly">Aylık</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-6 border-t border-gray-700">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
                >
                  {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
                  <span>{loading ? 'Kaydediliyor...' : 'Kaydet'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 