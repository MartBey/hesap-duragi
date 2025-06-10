import Link from "next/link";
import TopBar from '@/components/TopBar';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ShieldCheckIcon } from "@heroicons/react/24/outline";

export default function PrivacyPage() {
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
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/50 z-0"></div>
      
      {/* Content wrapper */}
      <div className="relative z-10">
        {/* TopBar and Navbar */}
        <TopBar />
        <Navbar />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Page Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <ShieldCheckIcon className="h-12 w-12 text-orange-500 mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Gizlilik Politikası
              </h1>
            </div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Kişisel verilerinizin korunması ve işlenmesi hakkında detaylı bilgiler
            </p>
            <div className="mt-4 text-sm text-gray-400">
              Son güncelleme: 1 Ocak 2024
            </div>
          </div>

          {/* Privacy Content */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-8 space-y-8">
            
            {/* 1. Genel Bilgiler */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Genel Bilgiler</h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  HesapDurağı olarak, kişisel verilerinizin korunması konusunda hassasiyetle 
                  hareket etmekteyiz. Bu gizlilik politikası, 6698 sayılı Kişisel Verilerin 
                  Korunması Kanunu (KVKK) ve ilgili mevzuat kapsamında hazırlanmıştır.
                </p>
              </div>
            </section>

            {/* 2. Veri Sorumlusu */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. Veri Sorumlusu</h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  Kişisel verilerinizin işlenmesinden sorumlu olan veri sorumlusu:
                </p>
                <div className="bg-gray-700/50 p-4 rounded-lg">
                  <p><strong>Şirket:</strong> HesapDurağı Teknoloji A.Ş.</p>
                  <p><strong>Adres:</strong> Maslak Mahallesi, Büyükdere Caddesi No: 123, Sarıyer/İstanbul</p>
                  <p><strong>E-posta:</strong> kvkk@hesapduragi.com</p>
                </div>
              </div>
            </section>

            {/* 3. Toplanan Veriler */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. Toplanan Kişisel Veriler</h2>
              <div className="text-gray-300 space-y-4">
                <p>Platformumuz üzerinden aşağıdaki kişisel veriler toplanmaktadır:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Kimlik bilgileri (ad, soyad, e-posta)</li>
                  <li>İletişim bilgileri</li>
                  <li>Ödeme bilgileri (şifrelenmiş)</li>
                  <li>Teknik veriler (IP adresi, çerezler)</li>
                </ul>
              </div>
            </section>

            {/* 4. Veri İşleme Amaçları */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Veri İşleme Amaçları</h2>
              <div className="text-gray-300 space-y-4">
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Hesap oluşturma ve yönetimi</li>
                  <li>Ürün ve hizmet satışı</li>
                  <li>Müşteri hizmetleri</li>
                  <li>Güvenlik önlemleri</li>
                  <li>Yasal yükümlülükler</li>
                </ul>
              </div>
            </section>

            {/* 5. Haklarınız */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Kişisel Veri Sahibi Hakları</h2>
              <div className="text-gray-300 space-y-4">
                <p>KVKK kapsamında aşağıdaki haklara sahipsiniz:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Verilerinizin işlenip işlenmediğini öğrenme</li>
                  <li>İşlenen veriler hakkında bilgi talep etme</li>
                  <li>Verilerin düzeltilmesini isteme</li>
                  <li>Verilerin silinmesini isteme</li>
                  <li>Zararın giderilmesini talep etme</li>
                </ul>
              </div>
            </section>

            {/* Son Güncelleme */}
            <div className="border-t border-gray-600 pt-6 mt-8">
              <p className="text-gray-400 text-sm text-center">
                Bu gizlilik politikası 1 Ocak 2024 tarihinde güncellenmiştir.
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/terms"
              className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-center"
            >
              Kullanım Şartları
            </Link>
            <Link
              href="/cookies"
              className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-center"
            >
              Çerez Politikası
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-center"
            >
              İletişime Geç
            </Link>
          </div>
        </div>
        
        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
