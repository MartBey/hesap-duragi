'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-black border-t border-orange-500/20 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Logo ve Açıklama */}
          <div className="md:col-span-1">
            <div className="mb-6">
              <Image
                src="/images/logo.png"
                alt="HesapDurağı"
                width={120}
                height={120}
                className="h-16 w-auto object-contain"
                priority
              />
            </div>
            <p className="text-gray-400 mb-4 leading-relaxed">
              Türkiye&apos;nin en güvenilir oyun hesabı alışveriş platformu. 
              Profesyonel hesaplar, güvenli ödeme sistemi ve 7/24 müşteri desteği.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>

          {/* Hızlı Linkler */}
          <div>
            <h5 className="text-white font-bold mb-6 text-lg">Hızlı Linkler</h5>
            <ul className="space-y-3 text-gray-400">
              <li><Link href="/" className="hover:text-orange-500 transition-colors flex items-center">
                <span className="mr-2">🏠</span> Anasayfa
              </Link></li>
              <li><Link href="/products" className="hover:text-orange-500 transition-colors flex items-center">
                <span className="mr-2">🛍️</span> Ürünler
              </Link></li>
              <li><Link href="/categories" className="hover:text-orange-500 transition-colors flex items-center">
                <span className="mr-2">📂</span> Kategoriler
              </Link></li>
              <li><Link href="/haftanin-firsatlari" className="hover:text-orange-500 transition-colors flex items-center">
                <span className="mr-2">🔥</span> Haftanın Fırsatları
              </Link></li>
              <li><Link href="/about" className="hover:text-orange-500 transition-colors flex items-center">
                <span className="mr-2">ℹ️</span> Hakkımızda
              </Link></li>
            </ul>
          </div>

          {/* Müşteri Hizmetleri */}
          <div>
            <h5 className="text-white font-bold mb-6 text-lg">Müşteri Hizmetleri</h5>
            <ul className="space-y-3 text-gray-400">
              <li><Link href="/help" className="hover:text-orange-500 transition-colors flex items-center">
                <span className="mr-2">❓</span> Sıkça Sorulan Sorular
              </Link></li>
              <li><Link href="/contact" className="hover:text-orange-500 transition-colors flex items-center">
                <span className="mr-2">📞</span> İletişim
              </Link></li>
              <li><Link href="/support" className="hover:text-orange-500 transition-colors flex items-center">
                <span className="mr-2">🎧</span> Canlı Destek
              </Link></li>
              <li><Link href="/refund" className="hover:text-orange-500 transition-colors flex items-center">
                <span className="mr-2">💰</span> İade Politikası
              </Link></li>
              <li><Link href="/security" className="hover:text-orange-500 transition-colors flex items-center">
                <span className="mr-2">🔒</span> Güvenlik
              </Link></li>
            </ul>
          </div>

          {/* Hesabım */}
          <div>
            <h5 className="text-white font-bold mb-6 text-lg">Hesabım</h5>
            <ul className="space-y-3 text-gray-400">
              <li><Link href="/login" className="hover:text-orange-500 transition-colors flex items-center">
                <span className="mr-2">🔑</span> Giriş Yap
              </Link></li>
              <li><Link href="/register" className="hover:text-orange-500 transition-colors flex items-center">
                <span className="mr-2">📝</span> Kayıt Ol
              </Link></li>
              <li><Link href="/profile" className="hover:text-orange-500 transition-colors flex items-center">
                <span className="mr-2">👤</span> Profilim
              </Link></li>
              <li><Link href="/orders" className="hover:text-orange-500 transition-colors flex items-center">
                <span className="mr-2">📦</span> Siparişlerim
              </Link></li>
              <li><Link href="/balance" className="hover:text-orange-500 transition-colors flex items-center">
                <span className="mr-2">💳</span> Bakiyem
              </Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-orange-500 mb-1">5000+</div>
              <div className="text-gray-400 text-sm">Mutlu Müşteri</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-500 mb-1">1500+</div>
              <div className="text-gray-400 text-sm">Aktif Hesap</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-500 mb-1">24/7</div>
              <div className="text-gray-400 text-sm">Müşteri Desteği</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-500 mb-1">99.9%</div>
              <div className="text-gray-400 text-sm">Güvenlik Oranı</div>
            </div>
          </div>
        </div>

        {/* Alt Bilgiler */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              <p>&copy; 2024 HesapDurağı. Tüm hakları saklıdır.</p>
            </div>
            <div className="flex space-x-6 text-sm text-gray-400">
              <Link href="/terms" className="hover:text-orange-500 transition-colors">Kullanım Şartları</Link>
              <Link href="/privacy" className="hover:text-orange-500 transition-colors">Gizlilik Politikası</Link>
              <Link href="/cookies" className="hover:text-orange-500 transition-colors">Çerez Politikası</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 