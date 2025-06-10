'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  UserIcon, 
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  CogIcon,
  ShoppingBagIcon,
  CreditCardIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  QuestionMarkCircleIcon,
  HomeIcon,
  FireIcon,
  TagIcon,
  InformationCircleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import CartIcon from '@/components/CartIcon';
import Logo from '@/components/Logo';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  if (isLoading) {
    return (
      <nav className="sticky top-8 md:top-10 z-40 bg-gray-900 border-b border-gray-800 backdrop-blur-sm bg-gray-900/95 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 md:h-20">
            {/* Logo - Sol taraf */}
            <div className="flex-1 flex items-center">
              <Link href="/" className="flex items-center space-x-3">
                <img 
                  src="/images/logo.png" 
                  alt="HesapDurağı Logo" 
                  className="h-8 md:h-12 w-auto"
                />
              </Link>
            </div>
            
            {/* Navigation Links - Orta (1/3) */}
            <div className="flex-1 flex justify-center">
                          <div className="hidden md:flex items-center space-x-0">
              <Link
                href="/haftanin-firsatlari"
                className="gradient-text-animation hover:text-white transition-colors text-base font-bold flex items-center space-x-2 px-2 py-2 rounded-lg hover:bg-gray-800/50 whitespace-nowrap min-w-[130px] justify-center relative overflow-hidden group"
              >
                <FireIcon className="h-5 w-5 text-[#ff6600] animate-pulse" />
                <span>Haftanın Fırsatları</span>
              </Link>
              <Link
                href="/products"
                className="text-gray-300 hover:text-white transition-colors text-base font-bold flex items-center space-x-2 px-2 py-2 rounded-lg hover:bg-gray-800/50 whitespace-nowrap min-w-[130px] justify-center"
              >
                <ShoppingBagIcon className="h-5 w-5" />
                <span>Ürünler</span>
              </Link>
              <Link
                href="/categories"
                className="text-gray-300 hover:text-white transition-colors text-base font-bold flex items-center space-x-2 px-2 py-2 rounded-lg hover:bg-gray-800/50 whitespace-nowrap min-w-[130px] justify-center"
              >
                <TagIcon className="h-5 w-5" />
                <span>Kategoriler</span>
              </Link>
              <Link
                href="/help"
                className="text-gray-300 hover:text-white transition-colors text-base font-bold flex items-center space-x-2 px-2 py-2 rounded-lg hover:bg-gray-800/50 whitespace-nowrap min-w-[130px] justify-center"
              >
                <QuestionMarkCircleIcon className="h-5 w-5" />
                <span>Yardım</span>
              </Link>
            </div>
            </div>
            
            {/* User Actions - Sağ taraf */}
            <div className="flex justify-end items-center space-x-2 md:space-x-4">
              <div className="animate-pulse bg-gray-700 h-8 w-16 md:w-20 rounded"></div>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-gray-800 border-t border-gray-700">
            <div className="px-4 py-4 space-y-2">
              {/* Navigation Links */}
              <Link
                href="/haftanin-firsatlari"
                className="flex items-center space-x-3 text-gray-300 hover:text-white hover:bg-gray-700 py-3 px-2 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FireIcon className="h-5 w-5 text-orange-500" />
                <span className="font-medium">Haftanın Fırsatları</span>
              </Link>
              <Link
                href="/products"
                className="flex items-center space-x-3 text-gray-300 hover:text-white hover:bg-gray-700 py-3 px-2 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <ShoppingBagIcon className="h-5 w-5" />
                <span className="font-medium">Ürünler</span>
              </Link>
              <Link
                href="/categories"
                className="flex items-center space-x-3 text-gray-300 hover:text-white hover:bg-gray-700 py-3 px-2 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <TagIcon className="h-5 w-5" />
                <span className="font-medium">Kategoriler</span>
              </Link>
              <Link
                href="/help"
                className="flex items-center space-x-3 text-gray-300 hover:text-white hover:bg-gray-700 py-3 px-2 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <QuestionMarkCircleIcon className="h-5 w-5" />
                <span className="font-medium">Yardım</span>
              </Link>
              
              {/* Cart Link for Mobile */}
              <div className="sm:hidden border-t border-gray-700 pt-4 mt-4">
                <Link
                  href="/cart"
                  className="flex items-center space-x-3 text-gray-300 hover:text-white hover:bg-gray-700 py-3 px-2 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <ShoppingBagIcon className="h-5 w-5" />
                  <span className="font-medium">Sepetim</span>
                </Link>
              </div>
              
              {/* User Actions for Mobile */}
              <div className="border-t border-gray-700 pt-4 mt-4 space-y-2">
                {user ? (
                  <>
                    {/* User Info */}
                    <div className="px-2 py-2 bg-gray-700/50 rounded-lg">
                      <p className="text-sm font-medium text-white">{user.name}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                      <p className="text-xs text-orange-500 capitalize">
                        {user.role === 'admin' ? 'Yönetici' : 'Kullanıcı'}
                      </p>
                    </div>
                    
                    {/* User Menu Items */}
                    <Link
                      href="/profile"
                      className="flex items-center space-x-3 text-gray-300 hover:text-white hover:bg-gray-700 py-3 px-2 rounded-lg transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <UserIcon className="h-5 w-5" />
                      <span className="font-medium">Profilim</span>
                    </Link>
                    
                    <Link
                      href="/orders"
                      className="flex items-center space-x-3 text-gray-300 hover:text-white hover:bg-gray-700 py-3 px-2 rounded-lg transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <ShoppingBagIcon className="h-5 w-5" />
                      <span className="font-medium">Siparişlerim</span>
                    </Link>
                    
                    <Link
                      href="/balance"
                      className="flex items-center space-x-3 text-gray-300 hover:text-white hover:bg-gray-700 py-3 px-2 rounded-lg transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <CreditCardIcon className="h-5 w-5" />
                      <span className="font-medium">Bakiyem</span>
                    </Link>
                    
                    <Link
                      href="/settings"
                      className="flex items-center space-x-3 text-gray-300 hover:text-white hover:bg-gray-700 py-3 px-2 rounded-lg transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <CogIcon className="h-5 w-5" />
                      <span className="font-medium">Ayarlar</span>
                    </Link>

                    {user.role === 'admin' && (
                      <Link
                        href="/admin"
                        className="flex items-center space-x-3 text-blue-400 hover:text-blue-300 hover:bg-gray-700 py-3 px-2 rounded-lg transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <ShieldCheckIcon className="h-5 w-5" />
                        <span className="font-medium">Admin Paneli</span>
                      </Link>
                    )}
                    
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center space-x-3 text-red-400 hover:text-red-300 hover:bg-gray-700 py-3 px-2 rounded-lg transition-colors w-full text-left"
                    >
                      <ArrowRightOnRectangleIcon className="h-5 w-5" />
                      <span className="font-medium">Çıkış Yap</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="flex items-center justify-center space-x-2 text-gray-300 hover:text-white hover:bg-gray-700 py-3 px-4 rounded-lg transition-colors border border-gray-600"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <UserIcon className="h-5 w-5" />
                      <span className="font-medium">Giriş Yap</span>
                    </Link>
                    <Link
                      href="/register"
                      className="flex items-center justify-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-lg transition-colors font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span>Kayıt Ol</span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    );
  }

  return (
    <nav className="sticky top-8 md:top-10 z-40 bg-gray-900 border-b border-gray-800 backdrop-blur-sm bg-gray-900/95 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 md:h-20">
          {/* Logo - Sol taraf */}
          <div className="flex-1 flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <img 
                src="/images/logo.png" 
                alt="HesapDurağı Logo" 
                className="h-8 md:h-12 w-auto"
              />
            </Link>
          </div>
          
          {/* Navigation Links - Orta (1/3) */}
          <div className="flex-1 flex justify-center">
            <div className="hidden md:flex items-center space-x-0">
              <Link
                href="/haftanin-firsatlari"
                className="gradient-text-animation hover:text-white transition-colors text-base font-bold flex items-center space-x-2 px-2 py-2 rounded-lg hover:bg-gray-800/50 whitespace-nowrap min-w-[130px] justify-center relative overflow-hidden group"
              >
                <FireIcon className="h-5 w-5 text-[#ff6600] animate-pulse" />
                <span>Haftanın Fırsatları</span>
              </Link>
              <Link
                href="/products"
                className="text-gray-300 hover:text-white transition-colors text-base font-bold flex items-center space-x-2 px-2 py-2 rounded-lg hover:bg-gray-800/50 whitespace-nowrap min-w-[130px] justify-center"
              >
                <ShoppingBagIcon className="h-5 w-5" />
                <span>Ürünler</span>
              </Link>
              <Link
                href="/categories"
                className="text-gray-300 hover:text-white transition-colors text-base font-bold flex items-center space-x-2 px-2 py-2 rounded-lg hover:bg-gray-800/50 whitespace-nowrap min-w-[130px] justify-center"
              >
                <TagIcon className="h-5 w-5" />
                <span>Kategoriler</span>
              </Link>
              <Link
                href="/help"
                className="text-gray-300 hover:text-white transition-colors text-base font-bold flex items-center space-x-2 px-2 py-2 rounded-lg hover:bg-gray-800/50 whitespace-nowrap min-w-[130px] justify-center"
              >
                <QuestionMarkCircleIcon className="h-5 w-5" />
                <span>Yardım</span>
              </Link>
            </div>
          </div>

          {/* User Actions - Sağ taraf */}
          <div className="flex justify-end items-center space-x-2 md:space-x-4">
            <div className="hidden sm:block">
              <CartIcon />
            </div>
            
            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden text-gray-300 hover:text-white p-2 rounded-lg hover:bg-gray-800"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
            
            {user ? (
              <div className="relative" ref={dropdownRef}>
                {/* User Menu Button */}
                <button
                  onClick={toggleDropdown}
                  className="hidden md:flex items-center space-x-2 text-gray-300 hover:text-white px-3 py-2 rounded-lg transition-colors"
                >
                  <UserIcon className="h-5 w-5" />
                  <span className="text-base font-semibold">{user.name}</span>
                  <ChevronDownIcon className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {/* Mobile User Button */}
                <button
                  onClick={toggleDropdown}
                  className="md:hidden text-gray-300 hover:text-white p-2 rounded-lg hover:bg-gray-800"
                >
                  <UserIcon className="h-6 w-6" />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 md:w-64 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-[60] max-w-[calc(100vw-2rem)] md:max-w-none">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-700">
                      <p className="text-sm font-medium text-white">{user.name}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                      <p className="text-xs text-orange-500 capitalize">
                        {user.role === 'admin' ? 'Yönetici' : 'Kullanıcı'}
                      </p>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <Link
                        href="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <UserIcon className="h-4 w-4 mr-3" />
                        Profilim
                      </Link>
                      
                      <Link
                        href="/orders"
                        className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <ShoppingBagIcon className="h-4 w-4 mr-3" />
                        Siparişlerim
                      </Link>
                      
                      <Link
                        href="/balance"
                        className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <CreditCardIcon className="h-4 w-4 mr-3" />
                        Bakiyem
                      </Link>
                      
                      <Link
                        href="/transactions"
                        className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <DocumentTextIcon className="h-4 w-4 mr-3" />
                        İşlem Geçmişi
                      </Link>
                      
                      <Link
                        href="/settings"
                        className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <CogIcon className="h-4 w-4 mr-3" />
                        Ayarlar
                      </Link>

                      <Link
                        href="/support"
                        className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <QuestionMarkCircleIcon className="h-4 w-4 mr-3" />
                        Destek
                      </Link>

                      <Link
                        href="/help"
                        className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <InformationCircleIcon className="h-4 w-4 mr-3" />
                        Yardım
                      </Link>

                      {/* Admin Panel - Only show for admin users */}
                      {user.role === 'admin' && (
                        <>
                          <div className="border-t border-gray-700 my-2"></div>
                          <Link
                            href="/admin"
                            className="flex items-center px-4 py-2 text-sm text-blue-400 hover:bg-gray-700 hover:text-blue-300 transition-colors"
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            <ShieldCheckIcon className="h-4 w-4 mr-3" />
                            Admin Paneli
                          </Link>
                        </>
                      )}
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
              <>
                <Link
                  href="/login"
                  className="hidden md:block text-gray-300 hover:text-white px-3 py-2 rounded-lg text-base font-semibold transition-colors"
                >
                  Giriş Yap
                </Link>
                <Link
                  href="/register"
                  className="hidden md:block bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-base font-semibold transition-colors"
                >
                  Kayıt Ol
                </Link>
              </>
            )}
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-gray-800 border-t border-gray-700">
            <div className="px-4 py-4 space-y-4">
              <Link
                href="/haftanin-firsatlari"
                className="flex items-center space-x-2 text-gray-300 hover:text-white py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FireIcon className="h-5 w-5" />
                <span>Haftanın Fırsatları</span>
              </Link>
              <Link
                href="/products"
                className="flex items-center space-x-2 text-gray-300 hover:text-white py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <ShoppingBagIcon className="h-5 w-5" />
                <span>Ürünler</span>
              </Link>
              <Link
                href="/categories"
                className="flex items-center space-x-2 text-gray-300 hover:text-white py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <TagIcon className="h-5 w-5" />
                <span>Kategoriler</span>
              </Link>
              <Link
                href="/help"
                className="flex items-center space-x-2 text-gray-300 hover:text-white py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <QuestionMarkCircleIcon className="h-5 w-5" />
                <span>Yardım</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
} 