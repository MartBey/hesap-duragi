'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  PuzzlePieceIcon, 
  TrashIcon,
  MinusIcon,
  PlusIcon,
  ShoppingCartIcon
} from '@heroicons/react/24/outline';
import { useCart } from '@/contexts/CartContext';
import CartIcon from '@/components/CartIcon';
import TopBar from '@/components/TopBar';
import Navbar from '@/components/Navbar';

export default function CartPage() {
  const router = useRouter();
  const { state, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();
  const [isClearing, setIsClearing] = useState(false);

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(id);
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  const handleClearCart = () => {
    setIsClearing(true);
    setTimeout(() => {
      clearCart();
      setIsClearing(false);
    }, 300);
  };

  const handleCheckout = () => {
    if (state.items.length === 0) return;
    router.push('/checkout');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* TopBar and Navbar */}
      <TopBar />
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Sepetim</h1>
          <p className="text-gray-400">
            {state.items.length > 0 ? `${state.items.length} ürün` : 'Sepetiniz boş'}
          </p>
        </div>

        {state.items.length === 0 ? (
          <div className="text-center">
            {/* Content Below Header */}
            <div className="mb-8">
              <h3 className="text-3xl font-bold text-white mb-4">Maalesef sepetiniz boş</h3>
              <p className="text-gray-400 mb-8 text-lg max-w-md mx-auto">
                Henüz sepetinize ürün eklemediniz. En iyi oyun hesaplarını keşfetmek için alışverişe başlayın!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Link
                  href="/products"
                  className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold text-base"
                >
                  🛒 Alışverişe Başla
                </Link>
                <Link
                  href="/categories"
                  className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:border-orange-500 hover:text-white transition-colors font-semibold text-base"
                >
                  🎮 Kategorileri Gör
                </Link>
              </div>
            </div>
            
            {/* Custom Empty Cart Image */}
            <div className="mb-8">
              <img 
                src="/images/emptyCartPage.png" 
                alt="Boş Sepet" 
                className="w-[672px] h-[672px] mx-auto opacity-80"
              />
            </div>
            
            {/* Popular Categories */}
            <div className="mt-12">
              <h4 className="text-xl font-semibold text-white mb-6">Popüler Kategoriler</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                <Link href="/products?game=Valorant" className="bg-gray-800/50 p-4 rounded-lg hover:bg-gray-700/50 transition-colors">
                  <div className="text-2xl mb-2">🎯</div>
                  <div className="text-white font-medium">Valorant</div>
                </Link>
                <Link href="/products?game=CS2" className="bg-gray-800/50 p-4 rounded-lg hover:bg-gray-700/50 transition-colors">
                  <div className="text-2xl mb-2">🔫</div>
                  <div className="text-white font-medium">CS2</div>
                </Link>
                <Link href="/products?game=League of Legends" className="bg-gray-800/50 p-4 rounded-lg hover:bg-gray-700/50 transition-colors">
                  <div className="text-2xl mb-2">⚔️</div>
                  <div className="text-white font-medium">LoL</div>
                </Link>
                <Link href="/products?game=Fortnite" className="bg-gray-800/50 p-4 rounded-lg hover:bg-gray-700/50 transition-colors">
                  <div className="text-2xl mb-2">🏗️</div>
                  <div className="text-white font-medium">Fortnite</div>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-gray-800/50 rounded-lg border border-gray-700">
                <div className="p-6 border-b border-gray-700">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white">Sepet Ürünleri</h2>
                    <button
                      onClick={handleClearCart}
                      disabled={isClearing}
                      className="text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
                    >
                      Sepeti Temizle
                    </button>
                  </div>
                </div>

                <div className="divide-y divide-gray-700">
                  {state.items.map((item) => (
                    <div key={item._id} className="p-6">
                      <div className="flex items-center space-x-4">
                        {/* Product Image */}
                        <div className="w-20 h-20 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                          {item.images && item.images.length > 0 ? (
                            <img 
                              src={item.images[0]} 
                              alt={item.title}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <span className="text-2xl">{item.emoji || '🎮'}</span>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-white truncate">
                            {item.title}
                          </h3>
                          <p className="text-gray-400 text-sm">{item.game}</p>
                          <div className="flex items-center mt-1">
                            <span className="px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded-full">
                              {item.category}
                            </span>
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                            className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-white hover:bg-gray-600 transition-colors"
                          >
                            <MinusIcon className="h-4 w-4" />
                          </button>
                          <span className="text-white font-medium w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                            className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-white hover:bg-gray-600 transition-colors"
                          >
                            <PlusIcon className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <div className="text-lg font-bold text-orange-500">
                            ₺{(item.price * item.quantity).toLocaleString()}
                          </div>
                          {item.quantity > 1 && (
                            <div className="text-sm text-gray-400">
                              ₺{item.price.toLocaleString()} x {item.quantity}
                            </div>
                          )}
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="text-red-400 hover:text-red-300 transition-colors p-2"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-6 sticky top-8">
                <h2 className="text-xl font-bold text-white mb-6">Sipariş Özeti</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-300">
                    <span>Ara Toplam ({state.itemCount} ürün)</span>
                    <span>₺{getCartTotal().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Kargo</span>
                    <span className="text-green-400">Ücretsiz</span>
                  </div>
                  <div className="border-t border-gray-600 pt-4">
                    <div className="flex justify-between text-lg font-bold text-white">
                      <span>Toplam</span>
                      <span className="text-orange-500">₺{getCartTotal().toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium"
                >
                  Ödemeye Geç
                </button>

                <Link
                  href="/products"
                  className="block w-full text-center text-gray-400 hover:text-orange-500 transition-colors mt-4"
                >
                  Alışverişe Devam Et
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 