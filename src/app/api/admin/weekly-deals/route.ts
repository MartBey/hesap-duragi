import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Account from '@/models/Account';

// Mock weekly deals data
const mockWeeklyDeals = [
  {
    _id: 'weekly1',
    title: 'Valorant Radiant Hesabı',
    description: 'Tüm ajanlar açık, premium skinler',
    game: 'Valorant',
    price: 1500,
    originalPrice: 2000,
    discountPercentage: 25,
    isOnSale: true,
    isWeeklyDeal: true,
    category: 'FPS',
    emoji: '🔫',
    images: [],
    status: 'available',
    level: 'Radiant',
    rank: 'Radiant',
    rating: 4.8,
    reviews: 15,
    stock: 1,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'weekly2',
    title: 'League of Legends Challenger',
    description: 'Tüm şampiyonlar, prestige skinler',
    game: 'League of Legends',
    price: 2100,
    originalPrice: 2500,
    discountPercentage: 16,
    isOnSale: true,
    isWeeklyDeal: true,
    category: 'MOBA',
    emoji: '⚔️',
    images: [],
    status: 'available',
    level: '387',
    rank: 'Challenger',
    rating: 5.0,
    reviews: 12,
    stock: 1,
    createdAt: new Date().toISOString()
  }
];

// GET - Haftanın fırsatlarını getir
export async function GET(request: NextRequest) {
  try {
    console.log('Fetching weekly deals from API...');
    
    // MongoDB bağlantısını dene
    try {
      await connectDB();
      console.log('MongoDB connection successful for weekly deals');
      
      // Haftanın fırsatları olarak işaretlenmiş ürünleri getir
      const weeklyDeals = await Account.find({
        isWeeklyDeal: true,
        status: 'available'
      })
        .sort({ createdAt: -1 })
        .lean();

      console.log('Found weekly deals in DB:', weeklyDeals.length);

      // Eğer veritabanında veri yoksa mock data döndür
      if (weeklyDeals.length === 0) {
        console.log('No weekly deals in DB, returning mock data');
        return NextResponse.json({
          success: true,
          data: {
            deals: mockWeeklyDeals
          }
        });
      }

      return NextResponse.json({
        success: true,
        data: {
          deals: weeklyDeals.map((account: any) => ({
            ...account,
            _id: account._id.toString()
          }))
        }
      });

    } catch (dbError: any) {
      console.error('DB connection failed, using mock data:', dbError);
      return NextResponse.json({
        success: true,
        data: {
          deals: mockWeeklyDeals
        }
      });
    }

  } catch (error) {
    console.error('Haftanın fırsatları getirme hatası:', error);
    return NextResponse.json({
      success: true,
      data: {
        deals: mockWeeklyDeals
      }
    });
  }
}

// POST - Ürünü haftanın fırsatlarına ekle/çıkar
export async function POST(request: NextRequest) {
  try {
    const { accountId, isWeeklyDeal } = await request.json();
    console.log('Weekly deals POST request:', { accountId, isWeeklyDeal });

    if (!accountId) {
      return NextResponse.json(
        { success: false, error: 'Hesap ID gerekli' },
        { status: 400 }
      );
    }

    // MongoDB bağlantısını dene
    try {
      await connectDB();
      console.log('MongoDB connection successful for weekly deals POST');
      
      // Önce hesabın var olup olmadığını kontrol et
      const existingAccount = await Account.findById(accountId);
      if (!existingAccount) {
        console.log('Account not found:', accountId);
        return NextResponse.json(
          { success: false, error: 'Hesap bulunamadı' },
          { status: 404 }
        );
      }

      console.log('Account found, current isWeeklyDeal:', existingAccount.isWeeklyDeal);

      // Hesabı güncelle
      const updatedAccount = await Account.findByIdAndUpdate(
        accountId,
        { isWeeklyDeal: isWeeklyDeal },
        { new: true, runValidators: true }
      );

      console.log('Account updated, new isWeeklyDeal:', updatedAccount?.isWeeklyDeal);

      if (!updatedAccount) {
        return NextResponse.json(
          { success: false, error: 'Hesap güncellenemedi' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: isWeeklyDeal 
          ? 'Ürün haftanın fırsatlarına eklendi' 
          : 'Ürün haftanın fırsatlarından çıkarıldı',
        data: {
          account: {
            ...updatedAccount.toObject(),
            _id: updatedAccount._id.toString()
          }
        }
      });

    } catch (dbError: any) {
      console.error('DB connection failed, simulating success:', dbError);
      
      // MongoDB bağlantısı yoksa başarılı gibi davran (geliştirme amaçlı)
      return NextResponse.json({
        success: true,
        message: isWeeklyDeal 
          ? 'Ürün haftanın fırsatlarına eklendi (simülasyon)' 
          : 'Ürün haftanın fırsatlarından çıkarıldı (simülasyon)',
        data: {
          account: {
            _id: accountId,
            isWeeklyDeal: isWeeklyDeal
          }
        }
      });
    }

  } catch (error) {
    console.error('Haftanın fırsatları güncelleme hatası:', error);
    return NextResponse.json(
      { success: false, error: 'Güncelleme işlemi başarısız' },
      { status: 500 }
    );
  }
} 