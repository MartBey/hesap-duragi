'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { Wallet, Package, ShoppingBag, Settings } from 'lucide-react';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-secondary-dark p-8">
        <div className="container-width">
          <div className="flex justify-center items-center h-64">
            <div className="loading-spinner" />
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-secondary-dark p-8">
      <div className="container-width">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Hoş Geldiniz, {session.user.name}
          </h1>
          <p className="text-text-muted">
            Hesap yönetimi ve alışverişleriniz için kontrol paneli
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link
            href="/dashboard/balance"
            className="card hover:scale-105 transition-transform"
          >
            <div className="flex items-center gap-4 p-6">
              <Wallet className="w-8 h-8 text-primary" />
              <div>
                <h3 className="text-xl font-semibold mb-1">Bakiye</h3>
                <p className="text-text-muted">Bakiye yükleyin ve yönetin</p>
              </div>
            </div>
          </Link>

          <Link
            href="/dashboard/purchases"
            className="card hover:scale-105 transition-transform"
          >
            <div className="flex items-center gap-4 p-6">
              <ShoppingBag className="w-8 h-8 text-primary" />
              <div>
                <h3 className="text-xl font-semibold mb-1">Satın Alımlar</h3>
                <p className="text-text-muted">Satın aldığınız hesaplar</p>
              </div>
            </div>
          </Link>

          {session.user.role === 'admin' && (
            <Link
              href="/dashboard/accounts"
              className="card hover:scale-105 transition-transform"
            >
              <div className="flex items-center gap-4 p-6">
                <Package className="w-8 h-8 text-primary" />
                <div>
                  <h3 className="text-xl font-semibold mb-1">Hesap Yönetimi</h3>
                  <p className="text-text-muted">Hesapları yönetin</p>
                </div>
              </div>
            </Link>
          )}

          <Link
            href="/dashboard/settings"
            className="card hover:scale-105 transition-transform"
          >
            <div className="flex items-center gap-4 p-6">
              <Settings className="w-8 h-8 text-primary" />
              <div>
                <h3 className="text-xl font-semibold mb-1">Ayarlar</h3>
                <p className="text-text-muted">Hesap ayarlarınızı yönetin</p>
              </div>
            </div>
          </Link>
        </div>

        {session.user.role === 'admin' && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Admin Paneli</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link
                href="/dashboard/admin/users"
                className="card hover:scale-105 transition-transform"
              >
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">Kullanıcı Yönetimi</h3>
                  <p className="text-text-muted">
                    Tüm kullanıcıları görüntüleyin ve yönetin
                  </p>
                </div>
              </Link>

              <Link
                href="/dashboard/admin/accounts"
                className="card hover:scale-105 transition-transform"
              >
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">Hesap Yönetimi</h3>
                  <p className="text-text-muted">
                    Tüm hesapları görüntüleyin ve yönetin
                  </p>
                </div>
              </Link>

              <Link
                href="/dashboard/admin/settings"
                className="card hover:scale-105 transition-transform"
              >
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">Site Ayarları</h3>
                  <p className="text-text-muted">
                    Genel site ayarlarını yapılandırın
                  </p>
                </div>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 