'use client';

import Link from "next/link";
import { PhoneIcon, EnvelopeIcon, MapPinIcon, ClockIcon } from "@heroicons/react/24/outline";
import TopBar from '@/components/TopBar';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ContactPage() {
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
                  <EnvelopeIcon className="h-16 w-16 text-orange-400" />
                </div>
              </div>
              <h1 className="text-4xl font-bold text-white mb-4">
                İletişim
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Sorularınız, önerileriniz veya destek talepleriniz için bizimle iletişime geçin. 
                7/24 müşteri hizmetlerimiz sizin için burada.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-12">
              {/* Contact Form */}
              <div className="lg:col-span-2">
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8 hover:bg-gray-800/70 transition-all duration-300 hover:border-orange-500/50">
                  <h2 className="text-2xl font-bold text-white mb-6">Mesaj Gönder</h2>
                  <form className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Ad Soyad *
                        </label>
                        <input
                          type="text"
                          required
                          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                          placeholder="Adınız ve soyadınız"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          E-posta Adresi *
                        </label>
                        <input
                          type="email"
                          required
                          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                          placeholder="ornek@email.com"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Telefon Numarası
                        </label>
                        <input
                          type="tel"
                          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                          placeholder="+90 5XX XXX XX XX"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Konu *
                        </label>
                        <select required className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all">
                          <option value="">Konu seçin</option>
                          <option value="general">Genel Bilgi</option>
                          <option value="support">Teknik Destek</option>
                          <option value="account">Hesap Sorunu</option>
                          <option value="payment">Ödeme Sorunu</option>
                          <option value="suggestion">Öneri</option>
                          <option value="complaint">Şikayet</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Mesajınız *
                      </label>
                      <textarea
                        required
                        rows={6}
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
                        placeholder="Mesajınızı buraya yazın..."
                      />
                    </div>

                    <div className="flex items-start">
                      <input
                        id="privacy"
                        name="privacy"
                        type="checkbox"
                        required
                        className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-600 rounded bg-gray-800 mt-0.5"
                      />
                      <label htmlFor="privacy" className="ml-2 block text-sm text-gray-300">
                        <Link href="/privacy" className="text-orange-500 hover:text-orange-400">
                          Gizlilik Politikası
                        </Link>
                        &apos;nı okudum ve kişisel verilerimin işlenmesini kabul ediyorum.
                      </label>
                    </div>

                    <div>
                      <button
                        type="submit"
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg transition-colors font-semibold"
                      >
                        Mesajı Gönder
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-8">
                {/* Contact Details */}
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:bg-gray-800/70 transition-all duration-300 hover:border-orange-500/50">
                  <h3 className="text-xl font-bold text-white mb-6">İletişim Bilgileri</h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <PhoneIcon className="h-6 w-6 text-orange-500 mt-1" />
                      <div>
                        <div className="text-white font-medium">Telefon</div>
                        <div className="text-gray-300">+90 212 XXX XX XX</div>
                        <div className="text-gray-300">+90 532 XXX XX XX</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <EnvelopeIcon className="h-6 w-6 text-orange-500 mt-1" />
                      <div>
                        <div className="text-white font-medium">E-posta</div>
                        <div className="text-gray-300">info@hesapduragi.com</div>
                        <div className="text-gray-300">destek@hesapduragi.com</div>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <MapPinIcon className="h-6 w-6 text-orange-500 mt-1" />
                      <div>
                        <div className="text-white font-medium">Adres</div>
                        <div className="text-gray-300">
                          Maslak Mahallesi<br />
                          Büyükdere Caddesi No: 123<br />
                          Sarıyer / İstanbul
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <ClockIcon className="h-6 w-6 text-orange-500 mt-1" />
                      <div>
                        <div className="text-white font-medium">Çalışma Saatleri</div>
                        <div className="text-gray-300">
                          Pazartesi - Cuma: 09:00 - 18:00<br />
                          Cumartesi: 10:00 - 16:00<br />
                          Pazar: Kapalı
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Support */}
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:bg-gray-800/70 transition-all duration-300 hover:border-orange-500/50">
                  <h3 className="text-xl font-bold text-white mb-6">Hızlı Destek</h3>
                  <div className="space-y-4">
                    <Link
                      href="/help"
                      className="block p-4 bg-gray-700/50 rounded-lg hover:bg-gray-600/50 transition-colors border border-gray-600"
                    >
                      <div className="text-white font-medium mb-1">Yardım Merkezi</div>
                      <div className="text-gray-400 text-sm">Sık sorulan sorular ve rehberler</div>
                    </Link>
                    
                    <Link
                      href="/support"
                      className="block p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg hover:bg-orange-500/20 transition-colors"
                    >
                      <div className="text-orange-500 font-medium mb-1">Canlı Destek</div>
                      <div className="text-gray-400 text-sm">Anında yardım alın (7/24)</div>
                    </Link>

                    <Link
                      href="/support"
                      className="block p-4 bg-gray-700/50 rounded-lg hover:bg-gray-600/50 transition-colors border border-gray-600"
                    >
                      <div className="text-white font-medium mb-1">Destek Talebi</div>
                      <div className="text-gray-400 text-sm">Detaylı sorunlar için ticket açın</div>
                    </Link>
                  </div>
                </div>

                {/* Social Media */}
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:bg-gray-800/70 transition-all duration-300 hover:border-orange-500/50">
                  <h3 className="text-xl font-bold text-white mb-6">Sosyal Medya</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <a
                      href="#"
                      className="flex items-center justify-center p-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                      </svg>
                    </a>
                    
                    <a
                      href="#"
                      className="flex items-center justify-center p-3 bg-blue-800 rounded-lg hover:bg-blue-900 transition-colors"
                    >
                      <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </a>

                    <a
                      href="#"
                      className="flex items-center justify-center p-3 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z"/>
                      </svg>
                    </a>

                    <a
                      href="#"
                      className="flex items-center justify-center p-3 bg-pink-600 rounded-lg hover:bg-pink-700 transition-colors"
                    >
                      <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    </div>
  );
} 