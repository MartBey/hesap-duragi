import React, { useState } from 'react';
import { BellIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';

interface NotificationState {
  title: string;
  message: string;
  loading: boolean;
  success: boolean;
  error: string | null;
}

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  lastActivity: Date;
  cartItemCount: number;
  cartValue: number;
  registeredAt: Date;
}

interface NotificationPanelProps {
  selectedUserId: number | null;
  onSendNotification: (title: string, message: string) => Promise<void>;
  selectedUser?: User;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ selectedUserId, onSendNotification, selectedUser }) => {
  const [notification, setNotification] = useState<NotificationState>({
    title: 'Sepetinizdeki Ürünler Sizi Bekliyor! 🛒',
    message: 'Sepetinizde bekleyen ürünler var. Hemen tamamlayarak özel indirimlerden yararlanın!',
    loading: false,
    success: false,
    error: null
  });

  const handleSendNotification = async () => {
    if (!selectedUserId) return;
    
    setNotification(prev => ({ ...prev, loading: true, success: false, error: null }));
    
    try {
      await onSendNotification(notification.title, notification.message);
      setNotification(prev => ({ 
        ...prev, 
        loading: false, 
        success: true,
        error: null 
      }));
      
      // 3 saniye sonra success durumunu sıfırla
      setTimeout(() => {
        setNotification(prev => ({ ...prev, success: false }));
      }, 3000);
    } catch (error) {
      setNotification(prev => ({ 
        ...prev, 
        loading: false, 
        success: false,
        error: 'Bildirim gönderilemedi. Lütfen tekrar deneyin.' 
      }));
    }
  };

  const predefinedMessages = [
    {
      title: 'Sepetinizdeki Ürünler Sizi Bekliyor! 🛒',
      message: 'Sepetinizde bekleyen ürünler var. Hemen tamamlayarak özel indirimlerden yararlanın!'
    },
    {
      title: 'Son Şans! ⏰',
      message: 'Sepetinizdeki ürünler için sadece 24 saat kaldı. %15 indirim fırsatını kaçırmayın!'
    },
    {
      title: 'Özel İndirim Fırsatı! 🎯',
      message: 'Sepetinizdeki oyun hesapları için özel %20 indirim. Hemen satın alın!'
    }
  ];

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-2xl">
      <h2 className="text-xl font-bold text-white mb-6 flex items-center">
        <BellIcon className="h-6 w-6 mr-2 text-orange-500" />
        Bildirim Gönder
      </h2>

      {/* Seçili Kullanıcı Bilgisi */}
      {selectedUser && (
        <div className="bg-gray-700/30 rounded-lg p-3 mb-4">
          <div className="flex justify-between items-start">
            <div>
              <div className="font-medium text-white text-sm">{selectedUser.name}</div>
              <div className="text-xs text-gray-400">{selectedUser.email}</div>
            </div>
            {selectedUser.cartItemCount > 0 && (
              <div className="text-xs text-orange-400 text-right">
                {selectedUser.cartItemCount} ürün<br/>
                ₺{selectedUser.cartValue.toLocaleString()}
              </div>
            )}
          </div>
        </div>
      )}
      
              <div className="space-y-4">
          {/* Hazır Mesajlar */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Hazır Mesajlar
            </label>
            <div className="space-y-1">
              {predefinedMessages.map((msg, index) => (
                <button
                  key={index}
                  onClick={() => setNotification(prev => ({ ...prev, title: msg.title, message: msg.message }))}
                  className="w-full text-left p-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg border border-gray-600 transition-colors"
                >
                  <div className="font-medium text-white text-xs">{msg.title}</div>
                  <div className="text-xs text-gray-400 mt-0.5 line-clamp-1">{msg.message.substring(0, 40)}...</div>
                </button>
              ))}
            </div>
          </div>

        {/* Başlık */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Başlık
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
            value={notification.title}
            onChange={(e) => setNotification({...notification, title: e.target.value})}
            placeholder="Bildirim başlığı..."
          />
        </div>
        
        {/* Mesaj */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Mesaj
          </label>
          <textarea
            className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 h-32 resize-none"
            value={notification.message}
            onChange={(e) => setNotification({...notification, message: e.target.value})}
            placeholder="Bildirim mesajı..."
          />
        </div>
        
        {/* Gönder Butonu */}
        <button
          onClick={handleSendNotification}
          disabled={!selectedUserId || notification.loading || !notification.title.trim() || !notification.message.trim()}
          className={`w-full py-3 px-4 rounded-lg text-white font-semibold transition-all duration-200 flex items-center justify-center ${
            notification.loading 
              ? 'bg-orange-400 cursor-not-allowed' 
              : selectedUserId && notification.title.trim() && notification.message.trim()
                ? 'bg-orange-500 hover:bg-orange-600 transform hover:scale-[1.02] active:scale-[0.98]' 
                : 'bg-gray-600 cursor-not-allowed'
          }`}
        >
          {notification.loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Gönderiliyor...
            </>
          ) : (
            <>
              <PaperAirplaneIcon className="h-5 w-5 mr-2" />
              Bildirim Gönder
            </>
          )}
        </button>
        
        {/* Durum Mesajları */}
        {notification.success && (
          <div className="p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
            <p className="text-sm text-green-400 flex items-center">
              <svg className="h-4 w-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Bildirim başarıyla gönderildi!
            </p>
          </div>
        )}
        
        {notification.error && (
          <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
            <p className="text-sm text-red-400 flex items-center">
              <svg className="h-4 w-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {notification.error}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPanel; 
 
 