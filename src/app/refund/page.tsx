'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RefundPage() {
  const router = useRouter();

  useEffect(() => {
    // Help sayfasına yönlendir
    router.replace('/help');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <p className="text-white">Yardım sayfasına yönlendiriliyorsunuz...</p>
      </div>
    </div>
  );
} 