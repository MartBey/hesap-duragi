import Link from "next/link";
import TopBar from '@/components/TopBar';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CogIcon } from "@heroicons/react/24/outline";

export default function CookiesPage() {
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
              <CogIcon className="h-12 w-12 text-orange-500 mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Çerez Politikası
              </h1>
            </div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Web sitemizde kullanılan çerezler ve veri toplama yöntemleri hakkında bilgiler
            </p>
            <div className="mt-4 text-sm text-gray-400">
              Son güncelleme: 1 Ocak 2024
            </div>
          </div>

          {/* Cookies Content */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-8 space-y-8">
            
            {/* 1. Çerez Nedir */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Çerez Nedir?</h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  Çerezler, web sitelerini ziyaret ettiğinizde cihazınıza (bilgisayar, tablet, telefon) 
                  kaydedilen küçük metin dosyalarıdır. Bu dosyalar, web sitesinin daha iyi çalışmasını 
                  sağlar ve size daha iyi bir kullanıcı deneyimi sunar.
                </p>
                <p>
                  HesapDurağı olarak, web sitemizin işlevselliğini artırmak, kullanıcı deneyimini 
                  iyileştirmek ve hizmetlerimizi geliştirmek amacıyla çerezler kullanmaktayız.
                </p>
              </div>
            </section>

            {/* 2. Çerez Türleri */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. Kullandığımız Çerez Türleri</h2>
              <div className="text-gray-300 space-y-6">
                
                <div className="bg-gray-700/30 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-3">Zorunlu Çerezler</h3>
                  <p className="mb-2">
                    Web sitesinin temel işlevlerini yerine getirmesi için gerekli olan çerezlerdir.
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Oturum yönetimi</li>
                    <li>Güvenlik doğrulaması</li>
                    <li>Alışveriş sepeti işlevselliği</li>
                    <li>Dil ve bölge tercihleri</li>
                  </ul>
                </div>

                <div className="bg-gray-700/30 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-3">Performans Çerezleri</h3>
                  <p className="mb-2">
                    Web sitesinin performansını ölçmek ve iyileştirmek için kullanılır.
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Sayfa yükleme süreleri</li>
                    <li>Hata raporlama</li>
                    <li>Trafik analizi</li>
                    <li>Kullanıcı davranış analizi</li>
                  </ul>
                </div>

                <div className="bg-gray-700/30 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-3">İşlevsellik Çerezleri</h3>
                  <p className="mb-2">
                    Kişiselleştirilmiş deneyim sunmak için kullanılır.
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Kullanıcı tercihleri</li>
                    <li>Önceki aramalar</li>
                    <li>Favori ürünler</li>
                    <li>Görüntüleme geçmişi</li>
                  </ul>
                </div>

                <div className="bg-gray-700/30 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-3">Pazarlama Çerezleri</h3>
                  <p className="mb-2">
                    Size özel reklamlar göstermek için kullanılır (onayınız ile).
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Hedefli reklamlar</li>
                    <li>Sosyal medya entegrasyonu</li>
                    <li>Üçüncü taraf analitik</li>
                    <li>Yeniden pazarlama</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 3. Kullanılan Çerezler */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. Web Sitemizde Kullanılan Çerezler</h2>
              <div className="text-gray-300 space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-600">
                    <thead>
                      <tr className="bg-gray-700">
                        <th className="border border-gray-600 p-3 text-left">Çerez Adı</th>
                        <th className="border border-gray-600 p-3 text-left">Türü</th>
                        <th className="border border-gray-600 p-3 text-left">Süre</th>
                        <th className="border border-gray-600 p-3 text-left">Amaç</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-600 p-3">session_id</td>
                        <td className="border border-gray-600 p-3">Zorunlu</td>
                        <td className="border border-gray-600 p-3">Oturum</td>
                        <td className="border border-gray-600 p-3">Kullanıcı oturumu yönetimi</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-600 p-3">cart_items</td>
                        <td className="border border-gray-600 p-3">Zorunlu</td>
                        <td className="border border-gray-600 p-3">7 gün</td>
                        <td className="border border-gray-600 p-3">Sepet içeriği saklama</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-600 p-3">user_preferences</td>
                        <td className="border border-gray-600 p-3">İşlevsellik</td>
                        <td className="border border-gray-600 p-3">1 yıl</td>
                        <td className="border border-gray-600 p-3">Kullanıcı tercihleri</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-600 p-3">_ga</td>
                        <td className="border border-gray-600 p-3">Performans</td>
                        <td className="border border-gray-600 p-3">2 yıl</td>
                        <td className="border border-gray-600 p-3">Google Analytics</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-600 p-3">marketing_consent</td>
                        <td className="border border-gray-600 p-3">Pazarlama</td>
                        <td className="border border-gray-600 p-3">1 yıl</td>
                        <td className="border border-gray-600 p-3">Pazarlama onayı</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* 4. Üçüncü Taraf Çerezleri */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Üçüncü Taraf Çerezleri</h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  Web sitemizde aşağıdaki üçüncü taraf hizmetlerin çerezleri kullanılmaktadır:
                </p>
                
                <div className="space-y-4">
                  <div className="bg-gray-700/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-white mb-2">Google Analytics</h3>
                    <p>Web sitesi trafiğini analiz etmek için kullanılır.</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Daha fazla bilgi: 
                      <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" 
                         className="text-orange-400 hover:text-orange-300 underline ml-1">
                        Google Gizlilik Politikası
                      </a>
                    </p>
                  </div>

                  <div className="bg-gray-700/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-white mb-2">Facebook Pixel</h3>
                    <p>Sosyal medya reklamları için kullanılır.</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Daha fazla bilgi: 
                      <a href="https://www.facebook.com/privacy/explanation" target="_blank" rel="noopener noreferrer" 
                         className="text-orange-400 hover:text-orange-300 underline ml-1">
                        Facebook Gizlilik Politikası
                      </a>
                    </p>
                  </div>

                  <div className="bg-gray-700/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-white mb-2">Ödeme Sağlayıcıları</h3>
                    <p>Güvenli ödeme işlemleri için kullanılır.</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Visa, Mastercard, PayPal güvenlik çerezleri
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 5. Çerez Yönetimi */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Çerez Tercihlerinizi Yönetme</h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  Çerez tercihlerinizi aşağıdaki yollarla yönetebilirsiniz:
                </p>

                <div className="space-y-4">
                  <div className="bg-gray-700/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-white mb-2">Tarayıcı Ayarları</h3>
                    <p>Tarayıcınızın ayarlar menüsünden çerezleri yönetebilirsiniz:</p>
                    <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                      <li>Chrome: Ayarlar → Gizlilik ve güvenlik → Çerezler</li>
                      <li>Firefox: Ayarlar → Gizlilik ve güvenlik → Çerezler</li>
                      <li>Safari: Tercihler → Gizlilik → Çerezler</li>
                      <li>Edge: Ayarlar → Çerezler ve site izinleri</li>
                    </ul>
                  </div>

                  <div className="bg-gray-700/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-white mb-2">Çerez Tercihleri</h3>
                    <p>
                      Web sitemizde bulunan çerez tercihleri panelinden seçimlerinizi yapabilirsiniz.
                    </p>
                    <button className="mt-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                      Çerez Tercihlerini Yönet
                    </button>
                  </div>
                </div>

                <div className="bg-yellow-900/30 border border-yellow-600 p-4 rounded-lg">
                  <p className="text-yellow-200">
                    <strong>Önemli:</strong> Zorunlu çerezleri devre dışı bırakmanız durumunda 
                    web sitesinin bazı işlevleri düzgün çalışmayabilir.
                  </p>
                </div>
              </div>
            </section>

            {/* 6. Çerez Onayı */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. Çerez Onayı</h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  Web sitemizi ilk ziyaret ettiğinizde, çerez kullanımı hakkında bilgilendirme 
                  yapılır ve onayınız istenir. Onay vermeniz durumunda:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Zorunlu çerezler otomatik olarak aktif olur</li>
                  <li>Seçtiğiniz çerez kategorileri aktif olur</li>
                  <li>Onayınız 1 yıl süreyle geçerli olur</li>
                  <li>İstediğiniz zaman tercihlerinizi değiştirebilirsiniz</li>
                </ul>
              </div>
            </section>

            {/* 7. Veri Güvenliği */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">7. Veri Güvenliği</h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  Çerezler aracılığıyla toplanan veriler güvenli şekilde saklanır:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>SSL şifreleme ile korunur</li>
                  <li>Güvenli sunucularda saklanır</li>
                  <li>Erişim kontrolü uygulanır</li>
                  <li>Düzenli güvenlik denetimleri yapılır</li>
                </ul>
              </div>
            </section>

            {/* 8. İletişim */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">8. İletişim</h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  Çerez politikası ile ilgili sorularınız için:
                </p>
                <div className="bg-gray-700/50 p-4 rounded-lg">
                  <p><strong>E-posta:</strong> privacy@hesapduragi.com</p>
                  <p><strong>Telefon:</strong> +90 212 XXX XX XX</p>
                  <p><strong>Adres:</strong> Maslak Mahallesi, Büyükdere Caddesi No: 123, Sarıyer/İstanbul</p>
                </div>
              </div>
            </section>

            {/* Son Güncelleme */}
            <div className="border-t border-gray-600 pt-6 mt-8">
              <p className="text-gray-400 text-sm text-center">
                Bu çerez politikası 1 Ocak 2024 tarihinde güncellenmiştir.
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
              href="/privacy"
              className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-center"
            >
              Gizlilik Politikası
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
