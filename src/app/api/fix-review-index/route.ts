import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Review from '@/models/Review';

export async function POST(request: NextRequest) {
  try {
    console.log('Review index düzeltme API çağrıldı');
    await connectDB();

    // Mevcut index'leri listele
    const indexes = await Review.collection.getIndexes();
    console.log('Mevcut indexes:', Object.keys(indexes));

    // Eski problematik index'i sil
    try {
      await Review.collection.dropIndex('accountId_1_userId_1');
      console.log('✅ Eski accountId_1_userId_1 index silindi');
    } catch (error: any) {
      console.log('⚠️ accountId_1_userId_1 index bulunamadı veya silinemedi:', error.message);
    }

    // Diğer olası problematik index'leri de kontrol et ve sil
    const problematicIndexes = [
      'accountId_1_userId_1',
      'account_1_user_1',
      'user_1_order_1'
    ];

    for (const indexName of problematicIndexes) {
      try {
        await Review.collection.dropIndex(indexName);
        console.log(`✅ ${indexName} index silindi`);
      } catch (error: any) {
        console.log(`⚠️ ${indexName} index bulunamadı:`, error.message);
      }
    }

    // Yeni doğru index'i oluştur
    try {
      await Review.collection.createIndex(
        { user: 1, account: 1 }, 
        { unique: true, name: 'user_1_account_1' }
      );
      console.log('✅ Yeni user_1_account_1 index oluşturuldu');
    } catch (error: any) {
      console.log('⚠️ Yeni index oluşturulamadı:', error.message);
    }

    // Güncel index'leri listele
    const newIndexes = await Review.collection.getIndexes();
    console.log('Güncel indexes:', Object.keys(newIndexes));

    return NextResponse.json({
      success: true,
      message: 'Review index\'leri başarıyla düzeltildi',
      oldIndexes: Object.keys(indexes),
      newIndexes: Object.keys(newIndexes)
    });

  } catch (error: any) {
    console.error('Review index düzeltme hatası:', error);
    return NextResponse.json({
      error: 'Index düzeltme hatası: ' + error.message
    }, { status: 500 });
  }
} 