import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Account from '@/models/Account';

// Mock on-sale accounts
const mockOnSaleAccounts = [
  {
    _id: '3',
    title: 'League of Legends Challenger Hesabı',
    description: 'Tüm şampiyonlar, prestige skinler',
    game: 'League of Legends',
    price: 2100,
    originalPrice: 2500,
    discountPercentage: 16,
    category: 'MOBA',
    features: ['Tüm Şampiyonlar', 'Prestige Skinler'],
    emoji: '⚔️',
    images: [],
    status: 'available',
    level: 387,
    rank: 'Challenger',
    rating: 5.0,
    reviews: 12,
    isOnSale: true,
    stock: 1
  },
  {
    _id: '4',
    title: 'World of Warcraft Max Level Hesabı',
    description: 'Max level karakter, epic gear',
    game: 'World of Warcraft',
    price: 1680,
    originalPrice: 2000,
    discountPercentage: 16,
    category: 'MMORPG',
    features: ['Max Level', 'Epic Gear'],
    emoji: '🏰',
    images: [],
    status: 'available',
    level: 80,
    rank: 'Mythic Raider',
    rating: 4.7,
    reviews: 31,
    isOnSale: true,
    stock: 1
  }
];

// GET - İndirimli hesapları listele
export async function GET(request: NextRequest) {
  try {
    console.log('On-sale accounts API çağrıldı');
    
    // Timeout ile MongoDB bağlantısı
    const connectPromise = connectDB();
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('MongoDB bağlantı timeout')), 3000)
    );
    
    await Promise.race([connectPromise, timeoutPromise]);
    console.log('MongoDB bağlantısı başarılı');
    
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '8');

    // İndirimli ve mevcut hesapları getir
    const onSaleAccounts = await Account.find({
      isOnSale: true,
      discountPercentage: { $gt: 0 },
      status: 'available',
      stock: { $gt: 0 }
    })
      .sort({ discountPercentage: -1, createdAt: -1 }) // İndirim oranına göre sırala
      .limit(limit)
      .lean();

    // Eğer veritabanında veri yoksa mock data döndür
    if (onSaleAccounts.length === 0) {
      console.log('Veritabanında on-sale hesap bulunamadı, mock data döndürülüyor');
      return NextResponse.json({
        success: true,
        data: {
          accounts: mockOnSaleAccounts.slice(0, limit).map((account: any) => ({
            ...account,
            seller: { _id: 'admin', name: 'Admin', email: 'admin@example.com' }
          }))
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        accounts: onSaleAccounts.map((account: any) => ({
          ...account,
          _id: account._id.toString(),
          seller: { _id: 'admin', name: 'Admin', email: 'admin@example.com' }
        }))
      }
    });

  } catch (error: any) {
    console.error('Error fetching on-sale accounts:', error);
    
    // Hata durumunda mock data döndür
    console.log('Hata nedeniyle mock on-sale data döndürülüyor');
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '8');
    
    return NextResponse.json({
      success: true,
      data: {
        accounts: mockOnSaleAccounts.slice(0, limit).map((account: any) => ({
          ...account,
          seller: { _id: 'admin', name: 'Admin', email: 'admin@example.com' }
        }))
      }
    });
  }
} 