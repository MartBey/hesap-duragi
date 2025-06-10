import Link from "next/link";
import TopBar from '@/components/TopBar';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { DocumentTextIcon } from "@heroicons/react/24/outline";

export default function TermsPage() {
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
              <DocumentTextIcon className="h-12 w-12 text-orange-500 mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Kullanım Şartları
              </h1>
            </div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              HesapDurağı platformunu kullanırken uymanız gereken kurallar ve şartlar
            </p>
            <div className="mt-4 text-sm text-gray-400">
              Son güncelleme: 1 Ocak 2024
            </div>
          </div>

          {/* Terms Content */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-8 space-y-8">
            
            {/* 1. Genel Hükümler */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Genel Hükümler</h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  Bu kullanım şartları ("Şartlar"), HesapDurağı platformu ("Platform", "Site", "Hizmet") 
                  ile sizin aranızdaki yasal sözleşmeyi oluşturur. Platformu kullanarak bu şartları 
                  kabul etmiş sayılırsınız.
                </p>
                <p>
                  HesapDurağı, oyun hesapları ve dijital ürünlerin güvenli alışverişini sağlayan 
                  bir e-ticaret platformudur. Hizmetlerimizi kullanmadan önce lütfen bu şartları 
                  dikkatlice okuyunuz.
                </p>
              </div>
            </section>

            {/* 2. Hesap Oluşturma */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. Hesap Oluşturma ve Kullanım</h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  Platform üzerinde işlem yapabilmek için bir hesap oluşturmanız gerekmektedir. 
                  Hesap oluştururken:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>18 yaşından büyük olmanız gerekmektedir</li>
                  <li>Doğru ve güncel bilgiler vermelisiniz</li>
                  <li>Hesap güvenliğinizden sorumlusunuz</li>
                  <li>Şifrenizi kimseyle paylaşmamalısınız</li>
                  <li>Hesabınızın yetkisiz kullanımını derhal bildirmelisiniz</li>
                </ul>
              </div>
            </section>

            {/* 3. Ürün ve Hizmetler */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. Ürün ve Hizmetler</h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  HesapDurağı platformunda sunulan ürünler ve hizmetler:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Oyun hesapları (FPS, MMORPG, MOBA kategorilerinde)</li>
                  <li>Dijital oyun lisansları</li>
                  <li>Oyun içi para birimleri</li>
                  <li>Hesap güvenlik hizmetleri</li>
                </ul>
                <p>
                  Tüm ürünler orijinal ve yasal yollardan temin edilmiştir. Sahte veya çalıntı 
                  hesaplar kesinlikle satılmamaktadır.
                </p>
              </div>
            </section>

            {/* 4. Ödeme ve Fiyatlandırma */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Ödeme ve Fiyatlandırma</h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  Ödeme işlemleri ile ilgili kurallar:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Tüm fiyatlar Türk Lirası (TL) cinsinden belirtilmiştir</li>
                  <li>KDV dahil fiyatlar gösterilmektedir</li>
                  <li>Ödeme güvenli SSL şifreleme ile korunmaktadır</li>
                  <li>Kredi kartı, banka kartı ve dijital cüzdan ödemeleri kabul edilir</li>
                  <li>Ödeme onaylandıktan sonra hesap bilgileri 24 saat içinde teslim edilir</li>
                </ul>
              </div>
            </section>

            {/* 5. İade ve İptal */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. İade ve İptal Politikası</h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  Dijital ürünlerin özelliği gereği:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Hesap bilgileri teslim edildikten sonra iade kabul edilmez</li>
                  <li>Teknik sorunlar durumunda 7 gün içinde destek talep edebilirsiniz</li>
                  <li>Hesap bilgilerinin hatalı olması durumunda ücretsiz değişim yapılır</li>
                  <li>Ödeme hatası durumunda 3-5 iş günü içinde iade yapılır</li>
                </ul>
              </div>
            </section>

            {/* 6. Yasaklı Kullanımlar */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. Yasaklı Kullanımlar</h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  Platformu kullanırken aşağıdaki faaliyetler kesinlikle yasaktır:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Sahte veya çalıntı hesap satışı</li>
                  <li>Platform güvenliğini tehdit edici faaliyetler</li>
                  <li>Diğer kullanıcıları aldatıcı davranışlar</li>
                  <li>Telif hakkı ihlali</li>
                  <li>Spam veya istenmeyen mesaj gönderimi</li>
                  <li>Kötü amaçlı yazılım yayma</li>
                </ul>
              </div>
            </section>

            {/* 7. Sorumluluk Sınırlaması */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">7. Sorumluluk Sınırlaması</h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  HesapDurağı'nın sorumluluğu:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Satılan hesapların orijinalliği ile sınırlıdır</li>
                  <li>Oyun şirketlerinin politika değişikliklerinden sorumlu değildir</li>
                  <li>Kullanıcıların hesapları nasıl kullandığından sorumlu değildir</li>
                  <li>Üçüncü taraf hizmetlerden kaynaklanan sorunlardan sorumlu değildir</li>
                </ul>
              </div>
            </section>

            {/* 8. Gizlilik */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">8. Gizlilik ve Veri Koruma</h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  Kişisel verilerinizin korunması bizim için önemlidir:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Verileriniz KVKK kapsamında korunmaktadır</li>
                  <li>Ödeme bilgileri şifrelenerek saklanır</li>
                  <li>Kişisel bilgiler üçüncü taraflarla paylaşılmaz</li>
                  <li>Detaylar için Gizlilik Politikamızı inceleyiniz</li>
                </ul>
              </div>
            </section>

            {/* 9. Değişiklikler */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">9. Şartlarda Değişiklik</h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  HesapDurağı bu kullanım şartlarını önceden haber vermeksizin değiştirme hakkını saklı tutar. 
                  Değişiklikler sitede yayınlandığı anda yürürlüğe girer. Platformu kullanmaya devam etmeniz 
                  değişiklikleri kabul ettiğiniz anlamına gelir.
                </p>
              </div>
            </section>

            {/* 10. İletişim */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">10. İletişim</h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  Bu kullanım şartları ile ilgili sorularınız için:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>E-posta: info@hesapduragi.com</li>
                  <li>Telefon: +90 212 XXX XX XX</li>
                  <li>Canlı destek: 7/24 aktif</li>
                  <li>Adres: Maslak Mahallesi, Büyükdere Caddesi No: 123, Sarıyer/İstanbul</li>
                </ul>
              </div>
            </section>

            {/* Son Güncelleme */}
            <div className="border-t border-gray-600 pt-6 mt-8">
              <p className="text-gray-400 text-sm text-center">
                Bu kullanım şartları 1 Ocak 2024 tarihinde güncellenmiştir.
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/privacy"
              className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-center"
            >
              Gizlilik Politikası
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