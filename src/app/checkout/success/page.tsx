'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  PuzzlePieceIcon, 
  CheckCircleIcon,
  EnvelopeIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface OrderData {
  orders: Array<{
    orderId: string;
    amount: number;
    account: {
      _id: string;
      title: string;
      game: string;
    };
  }>;
  totalAmount: number;
  customerEmail: string;
}

export default function CheckoutSuccessPage() {
  const [orderData, setOrderData] = useState<OrderData | null>(null);

  useEffect(() => {
    // localStorage'dan sipariş bilgilerini al
    const savedOrderData = localStorage.getItem('lastOrderData');
    if (savedOrderData) {
      try {
        const data = JSON.parse(savedOrderData);
        setOrderData(data);
        // Kullanıldıktan sonra temizle
        localStorage.removeItem('lastOrderData');
      } catch (error) {
        console.error('Sipariş verileri parse edilemedi:', error);
      }
    }
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-sm border-b border-orange-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center space-x-2">
              <PuzzlePieceIcon className="h-8 w-8 text-orange-500" />
              <h1 className="text-2xl font-bold text-white">HesapDurağı</h1>
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link href="/products" className="text-gray-300 hover:text-orange-500 transition-colors">
                Ürünler
              </Link>
              <Link href="/categories" className="text-gray-300 hover:text-orange-500 transition-colors">
                Kategoriler
              </Link>
              <Link href="/about" className="text-gray-300 hover:text-orange-500 transition-colors">
                Hakkımızda
              </Link>
            </nav>
            <div className="flex space-x-4">
              <Link 
                href="/login" 
                className="px-4 py-2 text-white border border-orange-500 rounded-lg hover:bg-orange-500 transition-colors"
              >
                Giriş Yap
              </Link>
              <Link 
                href="/register" 
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Kayıt Ol
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          {/* Success Icon */}
          <div className="mx-auto w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-8">
            <CheckCircleIcon className="h-12 w-12 text-green-400" />
          </div>

          {/* Success Message */}
          <h1 className="text-4xl font-bold text-white mb-4">
            Ödeme Başarılı!
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Siparişiniz başarıyla alındı ve işleme konuldu.
          </p>

          {/* Order Details */}
          <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-8 mb-8 text-left max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Sipariş Detayları</h2>
            
            {orderData ? (
              <div className="space-y-6">
                {/* Sipariş Listesi */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Satın Alınan Hesaplar</h3>
                  {orderData.orders.map((order, index) => (
                    <div key={order.orderId} className="bg-gray-700/50 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-white font-medium">{order.account.title}</h4>
                          <p className="text-gray-400 text-sm">{order.account.game}</p>
                          <p className="text-orange-500 text-sm font-mono">#{order.orderId}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-bold">₺{order.amount.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Toplam */}
                <div className="border-t border-gray-600 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-white">Toplam Tutar</span>
                    <span className="text-2xl font-bold text-orange-500">₺{orderData.totalAmount.toLocaleString()}</span>
                  </div>
                </div>

                {/* Bilgilendirme */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <EnvelopeIcon className="h-5 w-5 text-orange-500" />
                      <div>
                        <p className="text-gray-400 text-sm">E-posta Bildirimi</p>
                        <p className="text-white">Hesap bilgileri {orderData.customerEmail} adresine gönderilecek</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <ClockIcon className="h-5 w-5 text-orange-500" />
                      <div>
                        <p className="text-gray-400 text-sm">Teslimat Süresi</p>
                        <p className="text-white">5-15 dakika içinde</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-400 text-sm">Sipariş Sayısı</p>
                      <p className="text-white">{orderData.orders.length} adet hesap</p>
                    </div>
                    
                    <div>
                      <p className="text-gray-400 text-sm">Sipariş Tarihi</p>
                      <p className="text-white">{new Date().toLocaleDateString('tr-TR')}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <EnvelopeIcon className="h-5 w-5 text-orange-500" />
                    <div>
                      <p className="text-gray-400 text-sm">E-posta Bildirimi</p>
                      <p className="text-white">Hesap bilgileri e-postanıza gönderilecek</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <ClockIcon className="h-5 w-5 text-orange-500" />
                    <div>
                      <p className="text-gray-400 text-sm">Teslimat Süresi</p>
                      <p className="text-white">5-15 dakika içinde</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-gray-400 text-sm">Sipariş Numarası</p>
                    <p className="text-white font-mono">#HD{Date.now().toString().slice(-8)}</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-400 text-sm">Sipariş Tarihi</p>
                    <p className="text-white">{new Date().toLocaleDateString('tr-TR')}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Next Steps */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
            <h3 className="text-lg font-bold text-blue-400 mb-3">Sonraki Adımlar</h3>
            <div className="text-left space-y-2 text-blue-300">
              <p>• Hesap bilgileriniz e-posta adresinize gönderilecek</p>
              <p>• Herhangi bir sorun yaşarsanız destek ekibimizle iletişime geçin</p>
              <p>• Hesabınızı aldıktan sonra şifrenizi değiştirmeyi unutmayın</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="px-8 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
            >
              Alışverişe Devam Et
            </Link>
            <Link
              href="/contact"
              className="px-8 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
            >
              Destek
            </Link>
          </div>

          {/* Additional Info */}
          <div className="mt-12 text-center">
            <p className="text-gray-400 text-sm">
              Siparişinizle ilgili herhangi bir sorunuz varsa, 
              <Link href="/contact" className="text-orange-500 hover:text-orange-400 ml-1">
                destek ekibimizle iletişime geçin
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 