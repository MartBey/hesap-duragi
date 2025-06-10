import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Account from '@/models/Account';

export async function GET(request: NextRequest) {
  try {
    console.log('Testing MongoDB connection...');
    await connectDB();
    
    // Hesap sayısını kontrol et
    const accountCount = await Account.countDocuments();
    console.log('Account count:', accountCount);
    
    // Haftanın fırsatlarını kontrol et
    const weeklyDealsCount = await Account.countDocuments({ isWeeklyDeal: true });
    console.log('Weekly deals count:', weeklyDealsCount);
    
    return NextResponse.json({
      success: true,
      message: 'MongoDB bağlantısı başarılı!',
      data: {
        totalAccounts: accountCount,
        weeklyDeals: weeklyDealsCount,
        connectionState: 'connected'
      }
    });
    
  } catch (error: any) {
    console.error('MongoDB test failed:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      data: {
        connectionState: 'failed'
      }
    }, { status: 500 });
  }
} 