'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TopBar from '@/components/TopBar';
import Navbar from '@/components/Navbar';
import {
  CogIcon,
  BellIcon,
  ShieldCheckIcon,
  EyeIcon,
  EyeSlashIcon,
  KeyIcon,
  TrashIcon,
  ExclamationTriangleIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';

interface User {
  id: string;
  name: string;
  email: string;
  verified: boolean;
  phoneNumber?: string;
}

interface Settings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  marketingEmails: boolean;
  twoFactorAuth: boolean;
  profileVisibility: 'public' | 'private';
  language: 'tr' | 'en';
  theme: 'dark' | 'light';
  phoneNumber: string;
}

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<Settings>({
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: true,
    twoFactorAuth: false,
    profileVisibility: 'private',
    language: 'tr',
    theme: 'dark',
    phoneNumber: ''
  });
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isSavingPhone, setIsSavingPhone] = useState(false);
  const [phoneMessage, setPhoneMessage] = useState('');

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      loadSettings(parsedUser);
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  const loadSettings = (userData?: User) => {
    // Load settings from localStorage or API
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        // Kullanıcı telefon numarasını settings'e yükle
        if (userData?.phoneNumber) {
          parsedSettings.phoneNumber = userData.phoneNumber;
        }
        setSettings(parsedSettings);
      } catch (error) {
        console.error('Error parsing settings:', error);
      }
    } else if (userData?.phoneNumber) {
      // Eğer localStorage'da ayar yoksa ama kullanıcının telefon numarası varsa
      setSettings(prev => ({ ...prev, phoneNumber: userData.phoneNumber || '' }));
    }
  };

  const handleSettingChange = async (key: keyof Settings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('userSettings', JSON.stringify(newSettings));
    
    // Telefon numarası değiştiğinde API'ye kaydet
    if (key === 'phoneNumber' && user) {
      await savePhoneNumber(value);
    }
  };

  const savePhoneNumber = async (phoneNumber: string) => {
    setIsSavingPhone(true);
    setPhoneMessage('');
    
    try {
      const token = localStorage.getItem('token');
      if (!token || !user) return;
      
      console.log('Telefon numarası kaydediliyor:', {
        userId: user.id,
        phoneNumber: phoneNumber,
        user: user
      });

      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ phoneNumber })
      });

      const data = await response.json();
      
      console.log('API yanıtı:', data);
      
      if (data.success) {
        // Kullanıcı bilgilerini güncelle
        const updatedUser = { ...user, phoneNumber };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setPhoneMessage('Telefon numarası başarıyla kaydedildi!');
        setTimeout(() => setPhoneMessage(''), 3000);
      } else {
        setPhoneMessage('Hata: ' + data.error);
        setTimeout(() => setPhoneMessage(''), 5000);
      }
    } catch (error) {
      console.error('Telefon numarası kaydetme hatası:', error);
      setPhoneMessage('Telefon numarası kaydedilirken hata oluştu');
      setTimeout(() => setPhoneMessage(''), 5000);
    } finally {
      setIsSavingPhone(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      alert('Lütfen tüm alanları doldurun');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('Yeni şifreler eşleşmiyor');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      alert('Yeni şifre en az 6 karakter olmalıdır');
      return;
    }

    setIsChangingPassword(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      alert('Şifreniz başarıyla değiştirildi!');
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Şifre değiştirilirken hata oluştu');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userSettings');
      
      alert('Hesabınız başarıyla silindi');
      router.push('/');
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Hesap silinirken hata oluştu');
    }
  };

  if (loading) {
    return (
      <div 
        className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative"
        style={{
          backgroundImage: 'url("/public/arka plan 2.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-black/50 z-0"></div>
        <div className="relative z-10">
          <TopBar />
          <Navbar />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="animate-pulse">
              <div className="bg-gray-800 rounded-lg h-32 mb-6"></div>
              <div className="bg-gray-800 rounded-lg h-96"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div 
        className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative"
        style={{
          backgroundImage: 'url("/public/arka plan 2.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-black/50 z-0"></div>
        <div className="relative z-10">
          <TopBar />
          <Navbar />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <p className="text-red-400">Kullanıcı bilgileri yüklenemedi</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative"
      style={{
        backgroundImage: 'url("/public/arka plan 2.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="absolute inset-0 bg-black/50 z-0"></div>
      <div className="relative z-10">
        <TopBar />
        <Navbar />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">Ayarlar</h1>
            <p className="text-gray-400 mt-2">Hesap ayarlarınızı ve tercihlerinizi yönetin</p>
          </div>

          <div className="space-y-8">
            {/* Notification Settings */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-2xl">
              <div className="flex items-center space-x-3 mb-6">
                <BellIcon className="h-6 w-6 text-orange-500" />
                <h2 className="text-xl font-bold text-white">Bildirim Ayarları</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-medium">E-posta Bildirimleri</h3>
                    <p className="text-sm text-gray-400">Önemli güncellemeler için e-posta alın</p>
                  </div>
                  <button
                    onClick={() => handleSettingChange('emailNotifications', !settings.emailNotifications)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.emailNotifications ? 'bg-orange-500' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-medium">SMS Bildirimleri</h3>
                      <p className="text-sm text-gray-400">Acil durumlar için SMS alın</p>
                    </div>
                    <button
                      onClick={() => handleSettingChange('smsNotifications', !settings.smsNotifications)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.smsNotifications ? 'bg-orange-500' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.smsNotifications ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  
                  {settings.smsNotifications && (
                    <div className="ml-4 pl-4 border-l-2 border-orange-500/30">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Telefon Numarası
                      </label>
                      <div className="flex space-x-3">
                        <div className="relative flex-1">
                          <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="tel"
                            value={settings.phoneNumber}
                            onChange={(e) => handleSettingChange('phoneNumber', e.target.value)}
                            placeholder="+90 5XX XXX XX XX"
                            className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          />
                        </div>
                        <button
                          onClick={() => savePhoneNumber(settings.phoneNumber)}
                          disabled={isSavingPhone || !settings.phoneNumber.trim()}
                          className="px-4 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center"
                        >
                          {isSavingPhone ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          ) : (
                            'Kaydet'
                          )}
                        </button>
                      </div>
                      {phoneMessage && (
                        <p className={`text-xs mt-2 ${phoneMessage.includes('Hata') ? 'text-red-400' : 'text-green-400'}`}>
                          {phoneMessage}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        SMS bildirimleri almak için telefon numaranızı girin ve kaydedin
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-medium">Pazarlama E-postaları</h3>
                    <p className="text-sm text-gray-400">Özel teklifler ve kampanyalar</p>
                  </div>
                  <button
                    onClick={() => handleSettingChange('marketingEmails', !settings.marketingEmails)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.marketingEmails ? 'bg-orange-500' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.marketingEmails ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Security Settings */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-2xl">
              <div className="flex items-center space-x-3 mb-6">
                <ShieldCheckIcon className="h-6 w-6 text-orange-500" />
                <h2 className="text-xl font-bold text-white">Güvenlik Ayarları</h2>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-medium">İki Faktörlü Doğrulama</h3>
                    <p className="text-sm text-gray-400">Hesabınız için ekstra güvenlik katmanı</p>
                  </div>
                  <button
                    onClick={() => handleSettingChange('twoFactorAuth', !settings.twoFactorAuth)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.twoFactorAuth ? 'bg-orange-500' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Password Change */}
                <div className="border-t border-gray-700 pt-6">
                  <h3 className="text-white font-medium mb-4">Şifre Değiştir</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Mevcut Şifre
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.current ? 'text' : 'password'}
                          value={passwordForm.currentPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent pr-12"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                        >
                          {showPasswords.current ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Yeni Şifre
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.new ? 'text' : 'password'}
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent pr-12"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                        >
                          {showPasswords.new ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Yeni Şifre (Tekrar)
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.confirm ? 'text' : 'password'}
                          value={passwordForm.confirmPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent pr-12"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                        >
                          {showPasswords.confirm ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={handlePasswordChange}
                      disabled={isChangingPassword}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {isChangingPassword ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Değiştiriliyor...
                        </>
                      ) : (
                        <>
                          <KeyIcon className="h-4 w-4 mr-2" />
                          Şifreyi Değiştir
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-red-900/20 backdrop-blur-sm rounded-2xl p-6 border border-red-700/50 shadow-2xl">
              <div className="flex items-center space-x-3 mb-6">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-500" />
                <h2 className="text-xl font-bold text-white">Tehlikeli Bölge</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-white font-medium mb-2">Hesabı Sil</h3>
                  <p className="text-sm text-gray-400 mb-4">
                    Bu işlem geri alınamaz. Tüm verileriniz kalıcı olarak silinecektir.
                  </p>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center"
                  >
                    <TrashIcon className="h-4 w-4 mr-2" />
                    Hesabı Sil
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Delete Confirmation Modal */}
          {showDeleteModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-gray-800 rounded-2xl p-6 max-w-md w-full mx-4">
                <div className="flex items-center space-x-3 mb-4">
                  <ExclamationTriangleIcon className="h-8 w-8 text-red-500" />
                  <h3 className="text-xl font-bold text-white">Hesabı Sil</h3>
                </div>
                <p className="text-gray-400 mb-6">
                  Bu işlem geri alınamaz. Tüm verileriniz, siparişleriniz ve işlem geçmişiniz kalıcı olarak silinecektir.
                </p>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg transition-colors"
                  >
                    İptal
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition-colors"
                  >
                    Hesabı Sil
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 