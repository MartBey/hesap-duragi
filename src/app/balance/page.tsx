'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TopBar from '@/components/TopBar';
import Navbar from '@/components/Navbar';
import {
  CreditCardIcon,
  BanknotesIcon,
  ArrowUpIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

interface User {
  id: string;
  name: string;
  email: string;
  balance: number;
}

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  method: string;
  date: string;
}

export default function BalancePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [depositAmount, setDepositAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('credit-card');
  const [isDepositing, setIsDepositing] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      fetchTransactions();
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  const fetchTransactions = () => {
    // Mock transactions for demo
    setTransactions([
      {
        id: '1',
        type: 'deposit',
        amount: 500,
        status: 'completed',
        method: 'Kredi Kartı',
        date: '2024-01-15T10:30:00Z'
      },
      {
        id: '2',
        type: 'deposit',
        amount: 200,
        status: 'pending',
        method: 'Banka Havalesi',
        date: '2024-01-16T14:20:00Z'
      }
    ]);
  };

  const handleDeposit = async () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      alert('Lütfen geçerli bir miktar girin');
      return;
    }

    setIsDepositing(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: 'deposit',
        amount: parseFloat(depositAmount),
        status: 'pending',
        method: selectedMethod === 'credit-card' ? 'Kredi Kartı' : 'Banka Havalesi',
        date: new Date().toISOString()
      };
      
      setTransactions(prev => [newTransaction, ...prev]);
      setDepositAmount('');
      alert('Bakiye yükleme talebi oluşturuldu! İşlem onaylandıktan sonra bakiyenize eklenecektir.');
    } catch (error) {
      console.error('Error depositing:', error);
      alert('Bakiye yüklenirken hata oluştu');
    } finally {
      setIsDepositing(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case 'failed':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Tamamlandı';
      case 'pending':
        return 'Beklemede';
      case 'failed':
        return 'Başarısız';
      default:
        return 'Bilinmiyor';
    }
  };

  if (loading) {
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="animate-pulse">
              <div className="bg-gray-800 rounded-lg h-64 mb-6"></div>
              <div className="bg-gray-800 rounded-lg h-96"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <p className="text-red-400">Kullanıcı bilgileri yüklenemedi</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">Bakiye Yönetimi</h1>
            <p className="text-gray-400 mt-2">Hesabınıza bakiye yükleyin ve işlemlerinizi görüntüleyin</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Balance Card */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-8 text-white shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">Mevcut Bakiye</h2>
                  <BanknotesIcon className="h-8 w-8" />
                </div>
                <p className="text-4xl font-bold mb-2">{formatCurrency(user.balance || 0)}</p>
                <p className="text-orange-100 text-sm">Kullanılabilir bakiye</p>
              </div>

              {/* Deposit Form */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-2xl mt-6">
                <h3 className="text-xl font-bold text-white mb-6">Bakiye Yükle</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Miktar (TL)
                    </label>
                    <input
                      type="number"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      placeholder="0.00"
                      min="1"
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Ödeme Yöntemi
                    </label>
                    <select
                      value={selectedMethod}
                      onChange={(e) => setSelectedMethod(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="credit-card">Kredi Kartı</option>
                      <option value="bank-transfer">Banka Havalesi</option>
                    </select>
                  </div>

                  <button
                    onClick={handleDeposit}
                    disabled={isDepositing || !depositAmount}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isDepositing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        İşleniyor...
                      </>
                    ) : (
                      <>
                        <ArrowUpIcon className="h-5 w-5 mr-2" />
                        Bakiye Yükle
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Transactions */}
            <div className="lg:col-span-2">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-2xl">
                <h3 className="text-xl font-bold text-white mb-6">Son İşlemler</h3>
                
                {transactions.length > 0 ? (
                  <div className="space-y-4">
                    {transactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/50"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="bg-orange-500/20 rounded-lg p-3">
                              <CreditCardIcon className="h-6 w-6 text-orange-500" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-white">
                                {transaction.type === 'deposit' ? 'Bakiye Yükleme' : 'Para Çekme'}
                              </h4>
                              <p className="text-sm text-gray-400">{transaction.method}</p>
                              <p className="text-xs text-gray-500">{formatDate(transaction.date)}</p>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="flex items-center space-x-2 mb-1">
                              {getStatusIcon(transaction.status)}
                              <span className="text-sm text-gray-400">{getStatusText(transaction.status)}</span>
                            </div>
                            <p className="text-lg font-bold text-white">
                              {transaction.type === 'deposit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <CreditCardIcon className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-white mb-2">Henüz işlem yok</h4>
                    <p className="text-gray-400">İlk bakiye yükleme işleminizi yapın</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 