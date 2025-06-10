'use client';


import Link from "next/link";
import { PuzzlePieceIcon, ShieldCheckIcon, UserGroupIcon, ClockIcon, StarIcon } from "@heroicons/react/24/outline";
import TopBar from '@/components/TopBar';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const stats = [
  { label: "Mutlu Müşteri", value: "10,000+", icon: UserGroupIcon },
  { label: "Tamamlanan İşlem", value: "25,000+", icon: ShieldCheckIcon },
  { label: "Ortalama Teslimat", value: "2 Saat", icon: ClockIcon },
  { label: "Müşteri Memnuniyeti", value: "4.9/5", icon: StarIcon },
];



const values = [
  {
    title: "Güvenlik",
    description: "Tüm işlemlerimiz SSL şifreleme ve güvenli ödeme sistemleri ile korunur.",
    icon: ShieldCheckIcon
  },
  {
    title: "Şeffaflık",
    description: "Her hesabın detaylı bilgileri ve doğrulama durumu açık şekilde paylaşılır.",
    icon: "🔍"
  },
  {
    title: "Hızlı Teslimat",
    description: "Ortalama 2 saat içinde hesap bilgileriniz güvenli şekilde teslim edilir.",
    icon: ClockIcon
  },
  {
    title: "Müşteri Odaklılık",
    description: "7/24 müşteri desteği ile her zaman yanınızdayız.",
    icon: UserGroupIcon
  }
];

export default function AboutPage() {
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
      <div className="absolute inset-0 bg-black/50 z-0"></div>
      
      <div className="relative z-10">
        <TopBar />
        <Navbar />
        
        <div className="py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="text-center mb-16">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-orange-500/20 rounded-full">
                  <PuzzlePieceIcon className="h-16 w-16 text-orange-400" />
                </div>
              </div>
              <h1 className="text-4xl font-bold text-white mb-4">
                Hakkımızda
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Türkiye&apos;nin en güvenilir oyun hesabı satış platformu olarak, 
                oyuncuların ihtiyaçlarını karşılamak için buradayız.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {stats.map((stat, index) => (
                <div key={index} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center hover:bg-gray-800/70 transition-all duration-300 hover:border-orange-500/50">
                  <stat.icon className="h-12 w-12 text-orange-400 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-gray-300">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Mission */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8 mb-16">
              <h2 className="text-3xl font-bold text-white mb-6 text-center">Misyonumuz</h2>
              <p className="text-lg text-gray-300 text-center max-w-4xl mx-auto leading-relaxed">
                Oyun dünyasında güvenilir, hızlı ve kaliteli hizmet sunarak oyuncuların 
                hayallerindeki hesaplara ulaşmalarını sağlamak. Her işlemde %100 güvenlik 
                ve müşteri memnuniyetini ön planda tutarak sektörde lider olmak.
              </p>
            </div>

            {/* Values */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-white mb-12 text-center">Değerlerimiz</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {values.map((value, index) => (
                  <div key={index} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:bg-gray-800/70 transition-all duration-300 hover:border-orange-500/50">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        {typeof value.icon === 'string' ? (
                          <div className="text-3xl">{value.icon}</div>
                        ) : (
                          <value.icon className="h-8 w-8 text-orange-400" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">{value.title}</h3>
                        <p className="text-gray-300">{value.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>



            {/* Contact CTA */}
            <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-xl p-8 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Bizimle İletişime Geçin</h2>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                Sorularınız mı var? Özel bir talebin mi var? 
                7/24 müşteri hizmetlerimiz size yardımcı olmaya hazır.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/contact"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg transition-colors font-semibold"
                >
                  İletişime Geç
                </Link>
                <Link 
                  href="/support"
                  className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-3 rounded-lg transition-colors font-semibold"
                >
                  Destek Talebi
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    </div>
  );
} 