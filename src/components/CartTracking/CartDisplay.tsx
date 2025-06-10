import React from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';

interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  total: string;
  addedAt: Date;
  category: string;
  game: string;
  rank: string;
  level: number;
}

interface CartStats {
  totalItems: number;
  totalValue: number;
  oldestItem: number | null;
  categories: string[];
  games: string[];
}

interface CartDisplayProps {
  cartItems: CartItem[];
  selectedUserId: number | null;
  onRemoveItem: (productId: number) => void;
  cartStats?: CartStats | null;
  loading?: boolean;
}

const CartDisplay: React.FC<CartDisplayProps> = ({ 
  cartItems, 
  selectedUserId, 
  onRemoveItem, 
  cartStats, 
  loading 
}) => {
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) return `${diffDays} gün önce`;
    if (diffHours > 0) return `${diffHours} saat önce`;
    return 'Az önce';
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-2xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white flex items-center">
          <span className="mr-2">🛒</span>
          Sepet İçeriği {selectedUserId && `(#${selectedUserId})`}
        </h2>
        {loading && (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-500"></div>
        )}
      </div>
      
      {cartItems.length > 0 ? (
        <div>
          {/* Sepet Özeti - Kompakt */}
          {cartStats && (
            <div className="bg-gray-700/30 rounded-lg p-3 mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-orange-500">{cartStats.totalItems} ürün</span>
                <span className="text-sm font-bold text-orange-500">
                  ₺{cartStats.totalValue.toLocaleString()}
                </span>
              </div>
              
              {cartStats.categories.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {cartStats.categories.map(cat => (
                    <span key={cat} className="bg-orange-500/20 text-orange-300 px-1.5 py-0.5 rounded text-xs">
                      {cat}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
            {cartItems.map(item => (
              <div key={item.productId} className="bg-gray-700/50 rounded-lg p-3 border border-gray-600">
                <div className="flex justify-between items-start mb-1">
                  <div className="flex-1">
                    <h3 className="font-medium text-white text-sm">{item.name}</h3>
                    <div className="text-xs text-gray-400">
                      {item.game} • {item.rank}
                    </div>
                  </div>
                  <button 
                    onClick={() => onRemoveItem(item.productId)}
                    className="text-red-400 hover:text-red-300 transition-colors p-1"
                    title="Sepetten Kaldır"
                  >
                    <TrashIcon className="h-3 w-3" />
                  </button>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    {formatTimeAgo(item.addedAt)}
                  </span>
                  <span className="font-bold text-orange-500 text-sm">
                    ₺{(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="border-t border-gray-600 pt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-white">Toplam:</span>
              <span className="text-xl font-bold text-orange-500">
                ₺{cartStats?.totalValue.toLocaleString() || '0'}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🛒</div>
          <div className="text-gray-400">
            {selectedUserId ? 'Sepet boş' : 'Müşteri seçin'}
          </div>
        </div>
      )}
    </div>
  );
};

export default CartDisplay;