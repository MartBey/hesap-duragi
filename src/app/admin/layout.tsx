'use client';

import { usePathname } from 'next/navigation';
import AdminProtection from '@/components/AdminProtection';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Login sayfası için koruma uygulama
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }
  
  // Diğer admin sayfaları için koruma uygula
  return (
    <AdminProtection>
      {children}
    </AdminProtection>
  );
} 