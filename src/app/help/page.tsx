'use client';

import { useState, useEffect } from 'react';
import TopBar from '@/components/TopBar';
import Navbar from '@/components/Navbar';
import { 
  QuestionMarkCircleIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
}

interface HelpContent {
  _id: string;
  type: 'faq' | 'general';
  key: string;
  title: string;
  content: string;
  category?: string;
  order: number;
  isActive: boolean;
}

export default function HelpPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [helpContents, setHelpContents] = useState<HelpContent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHelpContents();
  }, []);

  const fetchHelpContents = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/help-content');
      
      if (response.ok) {
        const data = await response.json();
        setHelpContents(data.data || []);
      } else {
        console.error('Help content yüklenemedi');
      }
    } catch (error) {
      console.error('Help content yükleme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  // FAQ'ları help content'ten al veya varsayılan değerleri kullan
  const faqs: FAQ[] = helpContents.length > 0 
    ? helpContents
        .filter(content => content.type === 'faq')
        .map((content, index) => ({
          id: index + 1,
          question: content.title,
          answer: content.content,
          category: content.category || 'Genel'
        }))
    : [
        {
          id: 1,
          question: "Hesap nasıl satın alabilirim?",
          answer: "Hesap satın almak için önce sitemize kayıt olmanız gerekir. Kayıt olduktan sonra istediğiniz hesabı seçip sepete ekleyebilir ve ödeme işlemini tamamlayabilirsiniz. Ödeme sonrası hesap bilgileri size e-posta ile gönderilir.",
          category: "Satın Alma"
        },
        {
          id: 2,
          question: "Hangi ödeme yöntemlerini kabul ediyorsunuz?",
          answer: "Kredi kartı, banka kartı, havale/EFT ve kripto para ile ödeme kabul ediyoruz. Tüm ödemeler güvenli SSL sertifikası ile korunmaktadır.",
          category: "Ödeme"
        },
        {
          id: 3,
          question: "Hesap bilgileri ne zaman teslim edilir?",
          answer: "Ödeme onaylandıktan sonra hesap bilgileri otomatik olarak 5-10 dakika içinde e-posta adresinize gönderilir. Eğer 30 dakika içinde ulaşmazsa destek ekibimizle iletişime geçin.",
          category: "Teslimat"
        },
        {
          id: 4,
          question: "Hesabımda sorun yaşarsam ne yapmalıyım?",
          answer: "Satın aldığınız hesapta herhangi bir sorun yaşarsanız 24 saat içinde destek ekibimizle iletişime geçin. Sorun bizden kaynaklanıyorsa ücretsiz değişim veya iade yapılır.",
          category: "Destek"
        },
        {
          id: 5,
          question: "İade politikanız nedir?",
          answer: "Hesap bilgileri teslim edildikten sonra 24 saat içinde hesapta sorun tespit edilirse iade veya değişim yapılır. Bu süre sonrasında iade kabul edilmez.",
          category: "İade"
        },
        {
          id: 6,
          question: "Hesaplar güvenli mi?",
          answer: "Tüm hesaplar orijinal sahiplerinden satın alınmış veya oluşturulmuş hesaplardır. Hesapların güvenliği için 2FA (iki faktörlü doğrulama) önerilir.",
          category: "Güvenlik"
        },
        {
          id: 7,
          question: "Toplu alım indirimi var mı?",
          answer: "Evet, 5 ve üzeri hesap alımlarında %10, 10 ve üzeri alımlarda %15 indirim uygulanır. Toplu alım için destek ekibimizle iletişime geçin.",
          category: "İndirim"
        },
        {
          id: 8,
          question: "Hesap şifresi değiştirilebilir mi?",
          answer: "Evet, hesabı aldıktan sonra şifrenizi değiştirebilirsiniz. Ancak e-posta adresini değiştirmeden önce bizimle iletişime geçmenizi öneririz.",
          category: "Hesap Yönetimi"
        }
      ];

  // Kategorileri dinamik olarak oluştur
  const categories = ['Tümü', ...Array.from(new Set(faqs.map(faq => faq.category)))];

  // Eğer veritabanından kategori yoksa varsayılan kategorileri kullan
  const defaultCategories = [
    "Tümü",
    "Satın Alma",
    "Ödeme",
    "Teslimat",
    "Destek",
    "İade",
    "Güvenlik",
    "İndirim",
    "Hesap Yönetimi"
  ];

  const finalCategories = categories.length > 1 ? categories : defaultCategories;

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Tümü' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFAQ = (id: number) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

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
            <div className="text-center mb-12">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-orange-500/20 rounded-full">
                  <QuestionMarkCircleIcon className="h-16 w-16 text-orange-400" />
                </div>
              </div>
              <h1 className="text-4xl font-bold text-white mb-4">
                Yardım Merkezi
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Sık sorulan sorular ve destek bilgileri
              </p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center hover:bg-gray-800/70 transition-all duration-300 hover:border-orange-500/50">
                <ChatBubbleLeftRightIcon className="h-12 w-12 text-orange-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Canlı Destek</h3>
                <p className="text-gray-300 mb-4">7/24 canlı destek hizmeti</p>
                <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors">
                  Sohbet Başlat
                </button>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center hover:bg-gray-800/70 transition-all duration-300 hover:border-orange-500/50">
                <DocumentTextIcon className="h-12 w-12 text-orange-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Destek Talebi</h3>
                <p className="text-gray-300 mb-4">Ticket oluştur ve takip et</p>
                <button 
                  onClick={() => window.location.href = '/support'}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Ticket Oluştur
                </button>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center hover:bg-gray-800/70 transition-all duration-300 hover:border-orange-500/50">
                <PhoneIcon className="h-12 w-12 text-orange-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">İletişim</h3>
                <p className="text-gray-300 mb-4">Bizimle iletişime geçin</p>
                <button 
                  onClick={() => window.location.href = '/contact'}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  İletişim
                </button>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center hover:bg-gray-800/70 transition-all duration-300 hover:border-orange-500/50">
                <QuestionMarkCircleIcon className="h-12 w-12 text-orange-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Hakkımızda</h3>
                <p className="text-gray-300 mb-4">Şirket bilgileri ve hikayemiz</p>
                <button 
                  onClick={() => window.location.href = '/about'}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Daha Fazla
                </button>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-8 text-center">
                <span className="text-orange-400">Sık Sorulan</span> Sorular
              </h2>

              {/* Search and Filter */}
              <div className="mb-8 space-y-4">
                {/* Search */}
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Soru ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap gap-2">
                  {finalCategories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedCategory === category
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-orange-300'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* FAQ List */}
              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
                    <p className="text-gray-400">Yükleniyor...</p>
                  </div>
                ) : filteredFAQs.length > 0 ? (
                  filteredFAQs.map((faq) => (
                    <div
                      key={faq.id}
                      className="bg-gray-700/50 border border-gray-600 rounded-lg overflow-hidden hover:border-orange-500/50 transition-all duration-300"
                    >
                      <button
                        onClick={() => toggleFAQ(faq.id)}
                        className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-700/70 transition-colors"
                      >
                        <div>
                          <h3 className="text-lg font-medium text-white mb-1">
                            {faq.question}
                          </h3>
                          <span className="text-sm text-orange-400">
                            {faq.category}
                          </span>
                        </div>
                        {openFAQ === faq.id ? (
                          <ChevronUpIcon className="h-5 w-5 text-gray-400" />
                        ) : (
                          <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                      
                      {openFAQ === faq.id && (
                        <div className="px-6 pb-4">
                          <p className="text-gray-300 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <QuestionMarkCircleIcon className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-400 mb-2">
                      Sonuç bulunamadı
                    </h3>
                    <p className="text-gray-500">
                      Arama kriterlerinizi değiştirip tekrar deneyin.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Info */}
            <div className="mt-12 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                Hala Yardıma İhtiyacınız Var mı?
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-orange-500/20 rounded-lg">
                    <EnvelopeIcon className="h-6 w-6 text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white">E-posta</h3>
                    <p className="text-gray-300">destek@hesapduragi.com</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-orange-500/20 rounded-lg">
                    <ClockIcon className="h-6 w-6 text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white">Çalışma Saatleri</h3>
                    <p className="text-gray-300">7/24 Destek</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 