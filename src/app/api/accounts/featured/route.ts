import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Account from '@/models/Account';

// Mock featured accounts
const mockFeaturedAccounts = [
  {
    _id: '1',
    title: 'Counter-Strike 2 Global Elite Hesabı',
    description: 'Prime Status, tüm operasyonlar tamamlanmış',
    game: 'Counter-Strike 2',
    price: 1250,
    originalPrice: 1500,
    category: 'FPS',
    features: ['Prime Status', 'Tüm Operasyonlar'],
    emoji: '🔫',
    images: [],
    status: 'available',
    level: 40,
    rank: 'Global Elite',
    rating: 4.8,
    reviews: 24,
    isFeatured: true,
    stock: 1
  },
  {
    _id: '2',
    title: 'Valorant Immortal 3 Hesabı',
    description: 'Tüm ajanlar açık, battle pass tamamlanmış',
    game: 'Valorant',
    price: 890,
    originalPrice: 1100,
    category: 'FPS',
    features: ['Tüm Ajanlar', 'Battle Pass'],
    emoji: '🎯',
    images: [],
    status: 'available',
    level: 156,
    rank: 'Immortal 3',
    rating: 4.9,
    reviews: 18,
    isFeatured: true,
    stock: 1
  }
];

// GET - Öne çıkan hesapları listele
export async function GET(request: NextRequest) {
  try {
    console.log('Featured accounts API çağrıldı');
    
    // Timeout ile MongoDB bağlantısı
    const connectPromise = connectDB();
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('MongoDB bağlantı timeout')), 3000)
    );
    
    await Promise.race([connectPromise, timeoutPromise]);
    console.log('MongoDB bağlantısı başarılı');
    
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '8');

    // Öne çıkan ve mevcut hesapları getir
    const featuredAccounts = await Account.find({
      isFeatured: true,
      status: 'available',
      stock: { $gt: 0 }
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    // Eğer veritabanında veri yoksa mock data döndür
    if (featuredAccounts.length === 0) {
      console.log('Veritabanında featured hesap bulunamadı, mock data döndürülüyor');
      return NextResponse.json({
        success: true,
        data: {
          accounts: mockFeaturedAccounts.slice(0, limit).map((account: any) => ({
            ...account,
            seller: { _id: 'admin', name: 'Admin', email: 'admin@example.com' }
          }))
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        accounts: featuredAccounts.map((account: any) => ({
          ...account,
          _id: account._id.toString(),
          seller: { _id: 'admin', name: 'Admin', email: 'admin@example.com' }
        }))
      }
    });

  } catch (error: any) {
    console.error('Error fetching featured accounts:', error);
    
    // Hata durumunda mock data döndür
    console.log('Hata nedeniyle mock featured data döndürülüyor');
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '8');
    
    return NextResponse.json({
      success: true,
      data: {
        accounts: mockFeaturedAccounts.slice(0, limit).map((account: any) => ({
          ...account,
          seller: { _id: 'admin', name: 'Admin', email: 'admin@example.com' }
        }))
      }
    });
  }
} 