'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  UserIcon, 
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  CogIcon,
  DocumentTextIcon,
  QuestionMarkCircleIcon,
  BellIcon,
  CheckIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface SupportNotification {
  _id: string;
  ticketId: string;
  userName: string;
  subject: string;
  priority: string;
  createdAt: string;
}

export default function AdminNavbar() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [supportNotifications, setSupportNotifications] = useState<SupportNotification[]>([]);
  const [lastNotificationCheck, setLastNotificationCheck] = useState<Date>(new Date());
  const [newNotificationCount, setNewNotificationCount] = useState(0);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [isNotificationAnimating, setIsNotificationAnimating] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);

    // localStorage'dan son kontrol zamanını oku
    const saved = localStorage.getItem('lastNotificationCheck');
    if (saved) {
      setLastNotificationCheck(new Date(saved));
    }
    
    fetchSupportNotifications();
    
    // Destek bildirimleri için polling (her 15 saniyede bir kontrol et)
    const interval = setInterval(() => {
      fetchSupportNotifications();
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      const target = event.target as Element;
      if (showNotificationDropdown && !target.closest('.notification-dropdown')) {
        setShowNotificationDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen, showNotificationDropdown]);

  const fetchSupportNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('/api/admin/support?limit=10&status=open', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        const notifications = data.tickets.slice(0, 10);
        
        // Yeni bildirimleri kontrol et
        const newNotifications = notifications.filter((notification: any) => 
          new Date(notification.createdAt) > lastNotificationCheck
        );
        
        if (newNotifications.length > 0) {
          setNewNotificationCount(prev => prev + newNotifications.length);
          
          // Bildirim animasyonu başlat
          setIsNotificationAnimating(true);
          setTimeout(() => setIsNotificationAnimating(false), 1000);
        }
        
        setSupportNotifications(notifications);
      }
    } catch (error) {
      console.error('Support notifications fetch error:', error);
    }
  };

  const markNotificationsAsRead = () => {
    const now = new Date();
    setLastNotificationCheck(now);
    localStorage.setItem('lastNotificationCheck', now.toISOString());
    setNewNotificationCount(0);
    setShowNotificationDropdown(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500/20 text-red-500';
      case 'high': return 'bg-orange-500/20 text-orange-500';
      case 'medium': return 'bg-yellow-500/20 text-yellow-500';
      case 'low': return 'bg-green-500/20 text-green-500';
      default: return 'bg-gray-500/20 text-gray-500';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'Acil';
      case 'high': return 'Yüksek';
      case 'medium': return 'Orta';
      case 'low': return 'Düşük';
      default: return priority;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsDropdownOpen(false);
    router.push('/');
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  if (isLoading) {
    return (
      <nav className="sticky top-0 z-50 bg-gray-900 border-b border-gray-800 backdrop-blur-sm bg-gray-900/95 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-24">
            <div className="flex items-center justify-between w-full max-w-6xl">
              <Link href="/admin" className="flex items-center">
                <Image
                  src="/images/logo.png"
                  alt="HesapDurağı Admin"
                  width={1000}
                  height={1000}
                  className="h-16 w-auto object-contain hover:scale-105 transition-transform duration-200"
                  priority
                />
              </Link>
              
              <div className="flex items-center space-x-4">
                <div className="animate-pulse bg-gray-700 h-8 w-20 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
          <nav className="sticky top-0 z-50 bg-gray-900 border-b border-gray-800 backdrop-blur-sm bg-gray-900/95 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-24">
          <div className="flex items-center justify-between w-full max-w-6xl">
            <Link href="/admin" className="flex items-center">
              <Image
                src="/images/logo.png"
                alt="HesapDurağı Admin"
                width={1000}
                height={1000}
                className="h-16 w-auto object-contain hover:scale-105 transition-transform duration-200"
                priority
              />
            </Link>

            <div className="flex items-center space-x-4">
              {/* Support Notifications Bell */}
              <div className="relative notification-dropdown" style={{ zIndex: 999999 }}>
                <button 
                  onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
                  className={`p-2 text-gray-400 hover:text-white transition-all duration-300 relative ${
                    isNotificationAnimating ? 'animate-bounce' : ''
                  } ${newNotificationCount > 0 ? 'text-orange-400' : ''}`}
                >
                  <BellIcon className={`h-6 w-6 ${newNotificationCount > 0 ? 'animate-pulse' : ''}`} />
                  {newNotificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse shadow-lg">
                      {newNotificationCount > 99 ? '99+' : newNotificationCount}
                    </span>
                  )}
                  {/* Notification Ring Effect */}
                  {isNotificationAnimating && (
                    <span className="absolute inset-0 rounded-full border-2 border-orange-500 animate-ping"></span>
                  )}
                </button>
                
                {/* Notification Dropdown */}
                {showNotificationDropdown && (
                  <>
                    {/* Overlay */}
                    <div className="notification-dropdown-overlay" onClick={() => setShowNotificationDropdown(false)}></div>
                    {/* Dropdown Content */}
                    <div className="fixed top-16 right-4 w-80 notification-dropdown-content rounded-lg border border-orange-500/30 z-[999999] animate-dropdown-slide-in ring-1 ring-white/10 bg-gray-800/95 backdrop-blur-sm">
                      <div className="p-4 border-b border-gray-600/50">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-semibold text-white flex items-center">
                            <BellIcon className="h-5 w-5 mr-2 text-orange-500" />
                            Destek Bildirimleri
                            {newNotificationCount > 0 && (
                              <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                {newNotificationCount}
                              </span>
                            )}
                          </h3>
                          <button
                            onClick={markNotificationsAsRead}
                            className="text-sm text-orange-500 hover:text-orange-400 transition-colors flex items-center"
                            disabled={newNotificationCount === 0}
                          >
                            <CheckIcon className="h-4 w-4 mr-1" />
                            Tümünü Okundu İşaretle
                          </button>
                        </div>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {supportNotifications.length > 0 ? (
                          supportNotifications.map((notification, index) => {
                            const isNew = new Date(notification.createdAt) > lastNotificationCheck;
                            return (
                              <Link
                                key={notification._id}
                                href="/admin/support"
                                onClick={markNotificationsAsRead}
                                className={`block p-4 hover:bg-gray-700/50 border-b border-gray-600/30 last:border-b-0 transition-all duration-200 ${
                                  isNew ? 'bg-orange-500/10 border-l-4 border-l-orange-500' : ''
                                }`}
                                style={{
                                  animationDelay: `${index * 0.1}s`
                                }}
                              >
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <div className="flex items-center">
                                      <p className="text-white font-medium text-sm">{notification.subject}</p>
                                      {isNew && (
                                        <span className="ml-2 w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                                      )}
                                    </div>
                                    <p className="text-gray-400 text-xs mt-1 flex items-center">
                                      <UserGroupIcon className="h-3 w-3 mr-1" />
                                      {notification.userName} • #{notification.ticketId}
                                    </p>
                                    <p className="text-gray-500 text-xs mt-1">
                                      {new Date(notification.createdAt).toLocaleDateString('tr-TR', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      })}
                                    </p>
                                  </div>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(notification.priority)} shadow-sm`}>
                                    {getPriorityText(notification.priority)}
                                  </span>
                                </div>
                              </Link>
                            );
                          })
                        ) : (
                          <div className="p-8 text-center text-gray-400">
                            <BellIcon className="h-12 w-12 mx-auto mb-3 text-gray-600" />
                            <p className="text-sm">Yeni bildirim yok</p>
                            <p className="text-xs mt-1">Yeni destek biletleri burada görünecek</p>
                          </div>
                        )}
                      </div>
                      <div className="p-4 border-t border-gray-600/50">
                        <Link
                          href="/admin/support"
                          onClick={markNotificationsAsRead}
                          className="block w-full text-center bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-2 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                        >
                          Tüm Destek Biletlerini Görüntüle
                        </Link>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <Link href="/" className="px-4 py-2 text-white border border-orange-500 rounded-lg hover:bg-orange-500 transition-colors">
                Ana Siteye Dön
              </Link>

              {user ? (
                <div className="relative" ref={dropdownRef}>
                  {/* User Menu Button */}
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center space-x-2 text-gray-300 hover:text-white px-3 py-2 rounded-lg transition-colors"
                  >
                    <UserIcon className="h-5 w-5" />
                    <span className="text-base font-semibold">{user.name}</span>
                    <ChevronDownIcon className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-50">
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-gray-700">
                        <p className="text-sm font-medium text-white">{user.name}</p>
                        <p className="text-sm text-gray-400">{user.email}</p>
                        <p className="text-xs text-orange-500 mt-1">Admin</p>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <Link
                          href="/admin/settings"
                          className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <CogIcon className="h-4 w-4 mr-3" />
                          Ayarlar
                        </Link>
                        <Link
                          href="/admin/logs"
                          className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <DocumentTextIcon className="h-4 w-4 mr-3" />
                          Sistem Logları
                        </Link>
                        <Link
                          href="/admin/support"
                          className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <QuestionMarkCircleIcon className="h-4 w-4 mr-3" />
                          Destek Merkezi
                        </Link>
                        <Link
                          href="/admin/cart-tracking"
                          className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <svg className="h-4 w-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9" />
                          </svg>
                          Sepet Takip
                        </Link>
                      </div>

                      {/* Logout */}
                      <div className="border-t border-gray-700 py-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300 transition-colors"
                        >
                          <ArrowRightOnRectangleIcon className="h-4 w-4 mr-3" />
                          Çıkış Yap
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link 
                  href="/login" 
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Giriş Yap
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
} 