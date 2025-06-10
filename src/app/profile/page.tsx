'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import TopBar from '@/components/TopBar';
import Navbar from '@/components/Navbar';
import AvatarSelector from '@/components/AvatarSelector';
import { Avatar } from '@/data/avatars';
import Image from 'next/image';
import {
  UserIcon,
  EnvelopeIcon,
  CalendarIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  ShoppingBagIcon,
  StarIcon,
  PencilIcon,
  EyeIcon,
  EyeSlashIcon,
  CameraIcon
} from '@heroicons/react/24/outline';

interface User {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  role: string;
  status: string;
  verified: boolean;
  balance: number;
  avatar?: string;
  createdAt: string;
}

interface UserStats {
  totalOrders: number;
  totalSpent: number;
  averageRating: number;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showBalance, setShowBalance] = useState(false);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    avatar: ''
  });

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    console.log('Token:', token);
    console.log('User data from localStorage:', userData);
    
    if (!token || !userData) {
      router.push('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      console.log('Parsed user:', parsedUser);
      
      // ID'yi normalize et
      const normalizedUser = {
        ...parsedUser,
        id: parsedUser.id || parsedUser._id
      };
      
      console.log('Normalized user:', normalizedUser);
      console.log('User ID to use:', normalizedUser.id);
      
      setUser(normalizedUser);
      setEditForm({
        name: normalizedUser.name,
        email: normalizedUser.email,
        avatar: normalizedUser.avatar || ''
      });
      fetchUserDetails(normalizedUser.id, token);
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push('/login');
    }
  }, [router]);

  const fetchUserDetails = async (userId: string, token: string) => {
    try {
      // Fetch detailed user info
      const userResponse = await fetch(`/api/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (userResponse.ok) {
        const userData = await userResponse.json();
        if (userData.success && userData.user) {
          // ID'yi normalize et
          const normalizedUser = {
            ...userData.user,
            id: userData.user.id || userData.user._id
          };
          setUser(normalizedUser);
          setEditForm({
            name: normalizedUser.name,
            email: normalizedUser.email,
            avatar: normalizedUser.avatar || ''
          });
        }
      }

      // Fetch user statistics (mock data for now)
      setUserStats({
        totalOrders: 12,
        totalSpent: 2450,
        averageRating: 4.8
      });

    } catch (error) {
      console.error('Error fetching user details:', error);
      setError('Kullanıcı bilgileri yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (isEditing && user) {
      // Reset form if canceling
      setEditForm({
        name: user.name,
        email: user.email,
        avatar: user.avatar || ''
      });
    }
  };

  const handleAvatarClick = () => {
    if (isEditing) {
      setShowAvatarSelector(true);
    }
  };

  const handleAvatarSelect = (avatar: Avatar) => {
    setEditForm(prev => ({ ...prev, avatar: avatar.imageUrl }));
  };

  const handleSaveProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token || !user) return;

    // User ID'yi kontrol et ve doğru alanı kullan
    console.log('Current user object:', user);
    console.log('user.id:', user.id);
    console.log('user._id:', user._id);
    
    const userId = user.id || user._id;
    if (!userId) {
      console.error('No user ID found in user object:', user);
      alert('Kullanıcı ID bulunamadı. Lütfen tekrar giriş yapın.');
      return;
    }

    console.log('Updating user with ID:', userId);
    console.log('Update data:', editForm);

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      });

      const data = await response.json();

      if (response.ok) {
        const updatedUser = { ...user, ...editForm };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setIsEditing(false);
        alert('Profil başarıyla güncellendi!');
      } else {
        throw new Error(data.error || 'Profil güncellenirken hata oluştu');
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      alert(error.message || 'Profil güncellenirken hata oluştu');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
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
              <div className="bg-gray-800 rounded-lg h-64 mb-6"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-gray-800 rounded-lg h-32"></div>
                ))}
              </div>
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
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">Profilim</h1>
            <p className="text-gray-400 mt-2">Hesap bilgilerinizi görüntüleyin ve düzenleyin</p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 shadow-2xl mb-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div 
                    className={`bg-orange-500 rounded-full p-4 w-20 h-20 flex items-center justify-center overflow-hidden ${
                      isEditing ? 'cursor-pointer hover:bg-orange-600 transition-colors' : ''
                    }`}
                    onClick={handleAvatarClick}
                  >
                    {user.avatar || editForm.avatar ? (
                      (editForm.avatar || user.avatar)?.startsWith('data:image/svg+xml') ? (
                        <img 
                          src={editForm.avatar || user.avatar} 
                          alt="Avatar" 
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <Image 
                          src={editForm.avatar || user.avatar || '/default-avatar.png'} 
                          alt="Avatar" 
                          width={80}
                          height={80}
                          className="w-full h-full object-cover rounded-full"
                        />
                      )
                    ) : (
                      <UserIcon className="h-12 w-12 text-white" />
                    )}
                    {isEditing && (
                      <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <CameraIcon className="h-6 w-6 text-white" />
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                  <p className="text-gray-400">{user.email}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                      Kullanıcı
                    </span>
                    {user.verified && (
                      <span className="flex items-center px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
                        <ShieldCheckIcon className="h-3 w-3 mr-1" />
                        Doğrulanmış
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleEditToggle}
                className="flex items-center space-x-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
              >
                <PencilIcon className="h-4 w-4" />
                <span>{isEditing ? 'İptal' : 'Düzenle'}</span>
              </button>
            </div>

            {isEditing && (
              <div className="border-t border-gray-700 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Ad Soyad
                    </label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      E-posta
                    </label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-6">
                  <button
                    onClick={handleSaveProfile}
                    className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                  >
                    Kaydet
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="flex items-center space-x-3">
                <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-400">E-posta</p>
                  <p className="text-white">{user.email}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <CalendarIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-400">Üyelik Tarihi</p>
                  <p className="text-white">{formatDate(user.createdAt || new Date().toISOString())}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <CreditCardIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-400">Bakiye</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-white">
                      {showBalance ? formatCurrency(user.balance || 0) : '••••••'}
                    </p>
                    <button
                      onClick={() => setShowBalance(!showBalance)}
                      className="text-gray-400 hover:text-white"
                    >
                      {showBalance ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {userStats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Toplam Sipariş</p>
                    <p className="text-2xl font-bold text-white">{userStats.totalOrders}</p>
                  </div>
                  <ShoppingBagIcon className="h-8 w-8 text-blue-500" />
                </div>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Toplam Harcama</p>
                    <p className="text-2xl font-bold text-white">{formatCurrency(userStats.totalSpent)}</p>
                  </div>
                  <CreditCardIcon className="h-8 w-8 text-red-500" />
                </div>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Değerlendirmelerim</p>
                    <div className="flex items-center space-x-1">
                      <p className="text-2xl font-bold text-white">{userStats.averageRating}</p>
                      <StarIcon className="h-5 w-5 text-yellow-400 fill-current" />
                    </div>
                  </div>
                  <StarIcon className="h-8 w-8 text-yellow-500" />
                </div>
              </div>
            </div>
          )}

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-6">Hızlı İşlemler</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={() => router.push('/orders')}
                className="flex items-center space-x-3 p-4 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-colors"
              >
                <ShoppingBagIcon className="h-6 w-6 text-blue-500" />
                <span className="text-white">Siparişlerim</span>
              </button>
              
              <button
                onClick={() => router.push('/balance')}
                className="flex items-center space-x-3 p-4 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-colors"
              >
                <CreditCardIcon className="h-6 w-6 text-green-500" />
                <span className="text-white">Bakiye Yükle</span>
              </button>
              
              <button
                onClick={() => router.push('/transactions')}
                className="flex items-center space-x-3 p-4 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-colors"
              >
                <CalendarIcon className="h-6 w-6 text-purple-500" />
                <span className="text-white">İşlem Geçmişi</span>
              </button>
              
              <button
                onClick={() => router.push('/settings')}
                className="flex items-center space-x-3 p-4 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-colors"
              >
                <UserIcon className="h-6 w-6 text-orange-500" />
                <span className="text-white">Ayarlar</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Avatar Selector Modal */}
      <AvatarSelector
        isOpen={showAvatarSelector}
        onClose={() => setShowAvatarSelector(false)}
        onSelect={handleAvatarSelect}
        currentAvatar={editForm.avatar}
      />
    </div>
  );
} 