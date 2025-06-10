'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  PuzzlePieceIcon, 
  CreditCardIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { useCart } from '@/contexts/CartContext';
import CartIcon from '@/components/CartIcon';
import TopBar from '@/components/TopBar';
import Navbar from '@/components/Navbar';

export default function CheckoutPage() {
  const router = useRouter();
  const { state, clearCart, getCartTotal } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (state.items.length === 0) {
      alert('Sepetiniz boş!');
      return;
    }

    // Form validasyonu
    if (!formData.email || !formData.firstName || !formData.lastName) {
      alert('Lütfen tüm gerekli alanları doldurun.');
      return;
    }

    if (paymentMethod === 'credit-card') {
      if (!formData.cardNumber || !formData.expiryDate || !formData.cvv || !formData.cardName) {
        alert('Lütfen kredi kartı bilgilerini eksiksiz doldurun.');
        return;
      }
    }

    setIsProcessing(true);

    try {
      // Checkout API çağrısı
      const token = localStorage.getItem('token');
      const headers: any = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          items: state.items.map(item => ({
            _id: item._id,
            title: item.title,
            price: item.price,
            quantity: item.quantity
          })),
          paymentMethod,
          customerInfo: {
            email: formData.email,
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone
          },
          paymentInfo: paymentMethod === 'credit-card' ? {
            cardNumber: formData.cardNumber,
            expiryDate: formData.expiryDate,
            cvv: formData.cvv,
            cardName: formData.cardName
          } : undefined
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Ödeme başarılı - sepeti temizle ve başarı sayfasına yönlendir
        clearCart();
        
        // Sipariş bilgilerini localStorage'a kaydet (success sayfasında göstermek için)
        localStorage.setItem('lastOrderData', JSON.stringify({
          orders: data.data.orders,
          totalAmount: data.data.totalAmount,
          customerEmail: data.data.customerEmail
        }));
        
        router.push('/checkout/success');
      } else {
        throw new Error(data.error || 'Ödeme işlemi başarısız oldu');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      alert(error.message || 'Ödeme işlemi başarısız oldu. Lütfen tekrar deneyin.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          {/* Custom Empty Cart Image */}
          <div className="mb-8">
            <img 
              src="/images/emptyCartPage.png" 
              alt="Boş Sepet" 
              className="w-[560px] h-[560px] mx-auto opacity-80"
            />
          </div>
          
          {/* Content Below Image */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Maalesef sepetiniz boş</h2>
            <p className="text-gray-400 mb-8 text-lg max-w-md mx-auto">
              Ödeme yapabilmek için sepetinizde ürün bulunmalıdır. En iyi oyun hesaplarını keşfedin!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/products"
                className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold text-base"
              >
                🛒 Alışverişe Başla
              </Link>
              <Link 
                href="/cart"
                className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:border-orange-500 hover:text-white transition-colors font-semibold text-base"
              >
                🛍️ Sepete Dön
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* TopBar and Navbar */}
      <TopBar />
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Ödeme</h1>
          <p className="text-gray-400">Güvenli ödeme ile siparişinizi tamamlayın</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact Information */}
              <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-6">
                <h2 className="text-xl font-bold text-white mb-4">İletişim Bilgileri</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Ad
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
                      placeholder="Adınız"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Soyad
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
                      placeholder="Soyadınız"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      E-posta
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
                      placeholder="ornek@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Telefon
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
                      placeholder="0555 123 45 67"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-6">
                <h2 className="text-xl font-bold text-white mb-4">Ödeme Yöntemi</h2>
                
                <div className="space-y-4 mb-6">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="credit-card"
                      checked={paymentMethod === 'credit-card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-orange-500"
                    />
                    <CreditCardIcon className="h-5 w-5 text-gray-400" />
                    <span className="text-white">Kredi/Banka Kartı</span>
                  </label>
                </div>

                {paymentMethod === 'credit-card' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Kart Üzerindeki İsim
                      </label>
                      <input
                        type="text"
                        name="cardName"
                        value={formData.cardName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
                        placeholder="JOHN DOE"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Kart Numarası
                      </label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        required
                        maxLength={19}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
                        placeholder="1234 5678 9012 3456"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Son Kullanma Tarihi
                      </label>
                      <input
                        type="text"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        required
                        maxLength={5}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
                        placeholder="MM/YY"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        required
                        maxLength={4}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
                        placeholder="123"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Security Notice */}
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <ShieldCheckIcon className="h-5 w-5 text-green-400" />
                  <span className="text-green-400 font-medium">Güvenli Ödeme</span>
                </div>
                <p className="text-green-300 text-sm mt-1">
                  Tüm ödeme bilgileriniz SSL ile şifrelenir ve güvenli bir şekilde işlenir.
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'İşleniyor...' : `₺${getCartTotal().toLocaleString()} Öde`}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-6 sticky top-8">
              <h2 className="text-xl font-bold text-white mb-6">Sipariş Özeti</h2>
              
              <div className="space-y-4 mb-6">
                {state.items.map((item) => (
                  <div key={item._id} className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                      {item.images && item.images.length > 0 ? (
                        <img 
                          src={item.images[0]} 
                          alt={item.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <span className="text-lg">{item.emoji || '🎮'}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-medium truncate">{item.title}</h4>
                      <p className="text-gray-400 text-sm">Adet: {item.quantity}</p>
                    </div>
                    <div className="text-orange-500 font-medium">
                      ₺{(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-600 pt-4 space-y-2">
                <div className="flex justify-between text-gray-300">
                  <span>Ara Toplam</span>
                  <span>₺{getCartTotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>KDV (%18)</span>
                  <span>₺{Math.round(getCartTotal() * 0.18).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-white pt-2 border-t border-gray-600">
                  <span>Toplam</span>
                  <span className="text-orange-500">₺{Math.round(getCartTotal() * 1.18).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 