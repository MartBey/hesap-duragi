'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ChartBarIcon,
  ArrowLeftIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';

interface ReportData {
  dailySales: { date: string; amount: number; orders: number }[];
  monthlySales: { month: string; amount: number; orders: number }[];
  topGames: { game: string; sales: number; revenue: number }[];
  recentTransactions: { 
    id: string; 
    type: 'sale' | 'refund'; 
    amount: number; 
    date: string; 
    description: string 
  }[];
  summary: {
    totalRevenue: number;
    totalOrders: number;
    avgOrderValue: number;
    growthRate: number;
    activeUsers: number;
  };
}

export default function AdminReports() {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7days');
  const [reportType, setReportType] = useState('sales');

  useEffect(() => {
    fetchReportData();
  }, [dateRange, reportType]);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      // Simulated API call
      setTimeout(() => {
        const mockData: ReportData = {
          dailySales: [
            { date: '2024-01-14', amount: 2500, orders: 3 },
            { date: '2024-01-15', amount: 1800, orders: 2 },
            { date: '2024-01-16', amount: 3200, orders: 4 },
            { date: '2024-01-17', amount: 1500, orders: 2 },
            { date: '2024-01-18', amount: 4100, orders: 5 },
            { date: '2024-01-19', amount: 2800, orders: 3 },
            { date: '2024-01-20', amount: 3600, orders: 4 }
          ],
          monthlySales: [
            { month: 'Aralık 2023', amount: 45000, orders: 52 },
            { month: 'Ocak 2024', amount: 52000, orders: 61 }
          ],
          topGames: [
            { game: 'Counter-Strike 2', sales: 15, revenue: 18750 },
            { game: 'Valorant', sales: 12, revenue: 14200 },
            { game: 'League of Legends', sales: 8, revenue: 16800 },
            { game: 'Apex Legends', sales: 6, revenue: 10800 }
          ],
          recentTransactions: [
            { id: 'TXN-001', type: 'sale', amount: 1250, date: '2024-01-20', description: 'CS2 Global Elite Hesabı' },
            { id: 'TXN-002', type: 'sale', amount: 890, date: '2024-01-19', description: 'Valorant Immortal Hesabı' },
            { id: 'TXN-003', type: 'refund', amount: -1800, date: '2024-01-18', description: 'İade - Apex Hesabı' },
            { id: 'TXN-004', type: 'sale', amount: 2100, date: '2024-01-18', description: 'LoL Challenger Hesabı' },
            { id: 'TXN-005', type: 'sale', amount: 1650, date: '2024-01-17', description: 'Fortnite Hesabı' }
          ],
          summary: {
            totalRevenue: 97500,
            totalOrders: 123,
            avgOrderValue: 793,
            growthRate: 15.6,
            activeUsers: 1247
          }
        };
        setReportData(mockData);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching report data:', error);
      setLoading(false);
    }
  };

  const exportReport = (format: 'pdf' | 'excel') => {
    // Simulated export functionality
    alert(`${format.toUpperCase()} raporu indiriliyor...`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-white">Raporlar yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!reportData) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-sm border-b border-orange-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/admin" className="text-gray-400 hover:text-white transition-colors">
                <ArrowLeftIcon className="h-6 w-6" />
              </Link>
              <div className="flex items-center space-x-2">
                <ChartBarIcon className="h-8 w-8 text-orange-500" />
                <h1 className="text-2xl font-bold text-white">Raporlar ve Analitikler</h1>
              </div>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => exportReport('excel')}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <DocumentArrowDownIcon className="h-5 w-5" />
                <span>Excel</span>
              </button>
              <button 
                onClick={() => exportReport('pdf')}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <DocumentArrowDownIcon className="h-5 w-5" />
                <span>PDF</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Rapor Türü</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white"
              >
                <option value="sales">Satış Raporu</option>
                <option value="revenue">Gelir Raporu</option>
                <option value="users">Kullanıcı Raporu</option>
                <option value="games">Oyun Raporu</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Tarih Aralığı</label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white"
              >
                <option value="7days">Son 7 Gün</option>
                <option value="30days">Son 30 Gün</option>
                <option value="3months">Son 3 Ay</option>
                <option value="1year">Son 1 Yıl</option>
              </select>
            </div>
            <div className="flex items-end">
              <button className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2">
                <CalendarIcon className="h-5 w-5" />
                <span>Rapor Oluştur</span>
              </button>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Toplam Gelir</p>
                <p className="text-2xl font-bold text-white">₺{reportData.summary.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="p-3 rounded-full bg-green-500/20">
                <CurrencyDollarIcon className="h-8 w-8 text-green-500" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500 text-sm">+{reportData.summary.growthRate}%</span>
              <span className="text-gray-400 text-sm ml-2">önceki döneme göre</span>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Toplam Sipariş</p>
                <p className="text-2xl font-bold text-white">{reportData.summary.totalOrders}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-500/20">
                <ChartBarIcon className="h-8 w-8 text-blue-500" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500 text-sm">+12.3%</span>
              <span className="text-gray-400 text-sm ml-2">önceki döneme göre</span>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Ortalama Sipariş</p>
                <p className="text-2xl font-bold text-white">₺{reportData.summary.avgOrderValue}</p>
              </div>
              <div className="p-3 rounded-full bg-purple-500/20">
                <CurrencyDollarIcon className="h-8 w-8 text-purple-500" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
              <span className="text-red-500 text-sm">-2.1%</span>
              <span className="text-gray-400 text-sm ml-2">önceki döneme göre</span>
            </div>
          </div>
        </div>

        {/* Charts and Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Daily Sales Chart */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-6">Günlük Satışlar</h3>
            <div className="space-y-4">
              {reportData.dailySales.map((day, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span className="text-gray-300">{new Date(day.date).toLocaleDateString('tr-TR')}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-medium">₺{day.amount.toLocaleString()}</div>
                    <div className="text-gray-400 text-sm">{day.orders} sipariş</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Games */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-6">En Çok Satan Oyunlar</h3>
            <div className="space-y-4">
              {reportData.topGames.map((game, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <span className="text-white font-medium">{game.game}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-white">₺{game.revenue.toLocaleString()}</div>
                    <div className="text-gray-400 text-sm">{game.sales} satış</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-6">Son İşlemler</h3>
          <div className="space-y-4">
            {reportData.recentTransactions.map((transaction, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    transaction.type === 'sale' ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  <div>
                    <div className="text-white text-sm">{transaction.description}</div>
                    <div className="text-gray-400 text-xs">{transaction.id}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-medium ${
                    transaction.amount > 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {transaction.amount > 0 ? '+' : ''}₺{Math.abs(transaction.amount).toLocaleString()}
                  </div>
                  <div className="text-gray-400 text-xs">
                    {new Date(transaction.date).toLocaleDateString('tr-TR')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 