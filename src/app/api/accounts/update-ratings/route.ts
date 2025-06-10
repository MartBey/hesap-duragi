import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Review from '@/models/Review';
import Account from '@/models/Account';

export async function POST(request: NextRequest) {
  try {
    console.log('Account ratings güncelleme API çağrıldı');
    await connectDB();

    // Tüm hesapların rating'lerini güncelle
    const accounts = await Account.find({});
    console.log(`${accounts.length} hesap bulundu, rating'ler güncelleniyor...`);

    let updatedCount = 0;

    for (const account of accounts) {
      // Bu hesap için onaylanmış review'ları al
      const reviews = await Review.find({ 
        account: account._id, 
        isApproved: true 
      });

      if (reviews.length > 0) {
        // Ortalama rating hesapla
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRating / reviews.length;
        const roundedRating = Math.round(averageRating * 10) / 10; // 1 ondalık basamak

        // Account'u güncelle
        await Account.findByIdAndUpdate(account._id, {
          rating: roundedRating,
          reviews: reviews.length
        });

        console.log(`${account.title}: ${reviews.length} review, ortalama ${roundedRating}`);
        updatedCount++;
      } else {
        // Review yoksa default değerler
        await Account.findByIdAndUpdate(account._id, {
          rating: 0,
          reviews: 0
        });
        console.log(`${account.title}: Review yok, rating 0 yapıldı`);
      }
    }

    return NextResponse.json({
      success: true,
      message: `${updatedCount} hesabın rating'i güncellendi`,
      totalAccounts: accounts.length,
      updatedAccounts: updatedCount
    });

  } catch (error: any) {
    console.error('Account ratings güncelleme hatası:', error);
    return NextResponse.json({
      error: 'Rating güncelleme hatası: ' + error.message
    }, { status: 500 });
  }
} 