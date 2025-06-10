'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface AdminProtectionProps {
  children: React.ReactNode;
}

export default function AdminProtection({ children }: AdminProtectionProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Sadece client-side'da çalış
    if (typeof window === 'undefined') {
      return;
    }

    const checkAdminAccess = async () => {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        if (!token || !userData) {
          setIsLoading(false);
          router.replace('/admin/login');
          return;
        }
        
        let user;
        try {
          user = JSON.parse(userData);
        } catch (parseError) {
          localStorage.clear();
          setIsLoading(false);
          router.replace('/admin/login');
          return;
        }
        
        if (!user || user.role !== 'admin') {
          setIsLoading(false);
          router.replace('/admin/login');
          return;
        }
        
        setIsAuthorized(true);
        setIsLoading(false);
      } catch (error) {
        console.error('Admin Protection - Error:', error);
        localStorage.clear();
        setIsLoading(false);
        router.replace('/admin/login');
      }
    };

    // Kısa bir delay ile kontrol et
    const timer = setTimeout(checkAdminAccess, 100);
    return () => clearTimeout(timer);
  }, [router]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Yetki kontrolü yapılıyor...</p>
        </div>
      </div>
    );
  }

  // Eğer yetkili değilse hiçbir şey render etme
  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
} 