import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Review from '@/models/Review';

export async function POST(request: NextRequest) {
  try {
    console.log('Review collection temizleme API çağrıldı');
    await connectDB();

    // Tüm review'ları sil
    const deleteResult = await Review.deleteMany({});
    console.log(`${deleteResult.deletedCount} review silindi`);

    // Tüm index'leri sil
    try {
      await Review.collection.dropIndexes();
      console.log('✅ Tüm index\'ler silindi');
    } catch (error: any) {
      console.log('⚠️ Index silme hatası:', error.message);
    }

    // Yeni doğru index'leri oluştur
    try {
      // Unique index: user + account
      await Review.collection.createIndex(
        { user: 1, account: 1 }, 
        { unique: true, name: 'user_1_account_1' }
      );
      console.log('✅ user_1_account_1 index oluşturuldu');

      // Performance index: account + isApproved
      await Review.collection.createIndex(
        { account: 1, isApproved: 1 }, 
        { name: 'account_1_isApproved_1' }
      );
      console.log('✅ account_1_isApproved_1 index oluşturuldu');

    } catch (error: any) {
      console.log('⚠️ Yeni index oluşturma hatası:', error.message);
    }

    // Güncel index'leri listele
    const indexes = await Review.collection.getIndexes();
    console.log('Güncel indexes:', Object.keys(indexes));

    return NextResponse.json({
      success: true,
      message: 'Review collection temizlendi ve index\'ler düzeltildi',
      deletedCount: deleteResult.deletedCount,
      indexes: Object.keys(indexes)
    });

  } catch (error: any) {
    console.error('Review temizleme hatası:', error);
    return NextResponse.json({
      error: 'Temizleme hatası: ' + error.message
    }, { status: 500 });
  }
} 