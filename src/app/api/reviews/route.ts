import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import Review from '@/models/Review';
import User from '@/models/User';
import Account from '@/models/Account';
import Order from '@/models/Order';
import mongoose from 'mongoose';

// Account rating'ini güncelleme fonksiyonu
async function updateAccountRating(accountId: string) {
  const reviews = await Review.find({ 
    account: accountId, 
    isApproved: true 
  });

  if (reviews.length > 0) {
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;
    const roundedRating = Math.round(averageRating * 10) / 10;

    await Account.findByIdAndUpdate(accountId, {
      rating: roundedRating,
      reviews: reviews.length
    });
  } else {
    await Account.findByIdAndUpdate(accountId, {
      rating: 0,
      reviews: 0
    });
  }
}

// GET - Hesap değerlendirmelerini getir
export async function GET(request: NextRequest) {
  try {
    console.log('Reviews GET API çağrıldı');
    await connectDB();

    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get('accountId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    console.log('GET Reviews params:', { accountId, page, limit });

    if (!accountId) {
      console.log('Account ID eksik');
      return NextResponse.json(
        { error: 'Account ID gerekli' },
        { status: 400 }
      );
    }

    // Onaylanmış değerlendirmeleri getir
    console.log('Reviews aranıyor:', { account: accountId, isApproved: true });
    
    // Tüm reviews'ları da kontrol edelim
    const allReviews = await Review.find({ account: accountId });
    console.log('Tüm reviews (onaysız dahil):', allReviews.length);
    console.log('Tüm reviews detay:', allReviews);
    
    // User'ları da kontrol edelim
    const User = require('@/models/User').default;
    const users = await User.find({}).limit(5);
    console.log('Mevcut users:', users.map((u: any) => ({ id: u._id, name: u.name, email: u.email })));
    
    let reviews;
    try {
      reviews = await Review.find({ 
        account: new mongoose.Types.ObjectId(accountId), 
        isApproved: true 
      })
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    } catch (populateError) {
      console.log('Populate hatası, populate olmadan deneniyor:', populateError);
      // Populate başarısız olursa, populate olmadan dene
      reviews = await Review.find({ 
        account: new mongoose.Types.ObjectId(accountId), 
        isApproved: true 
      })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    }

    console.log('Bulunan reviews:', reviews.length);
    console.log('Reviews detay:', reviews);

    const total = await Review.countDocuments({ 
      account: new mongoose.Types.ObjectId(accountId), 
      isApproved: true 
    });

    console.log('Toplam onaylanmış review sayısı:', total);

    // Ortalama rating hesapla
    const avgRating = await Review.aggregate([
      { $match: { account: new mongoose.Types.ObjectId(accountId), isApproved: true } },
      { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
    ]);

    const averageRating = avgRating.length > 0 ? avgRating[0].avgRating : 0;
    const reviewCount = avgRating.length > 0 ? avgRating[0].count : 0;

    return NextResponse.json({
      success: true,
      reviews: reviews.map(review => {
        console.log('Review mapping:', {
          reviewId: review._id,
          isAnonymous: review.isAnonymous,
          user: review.user,
          userName: review.user?.name
        });
        
        return {
          _id: review._id,
          rating: review.rating,
          comment: review.comment,
          userName: review.isAnonymous ? 'Anonim Kullanıcı' : (review.user?.name || 'Bilinmeyen Kullanıcı'),
          createdAt: review.createdAt,
          isAnonymous: review.isAnonymous
        };
      }),
      averageRating: Math.round(averageRating * 10) / 10,
      reviewCount,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error: any) {
    console.error('Reviews getirme hatası:', error);
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    );
  }
}

// POST - Yeni değerlendirme ekle
export async function POST(request: NextRequest) {
  try {
    console.log('Reviews POST API çağrıldı');
    await connectDB();

    const authHeader = request.headers.get('authorization');
    console.log('Auth header:', authHeader ? 'Mevcut' : 'Yok');
    
    // Token kontrolü - daha esnek hale getir
    let userId = null;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
        userId = decoded.userId;
        console.log('User ID from token:', userId);
      } catch (tokenError) {
        console.log('Token doğrulama hatası:', tokenError);
        return NextResponse.json(
          { error: 'Geçersiz token' },
          { status: 401 }
        );
      }
    } else {
      console.log('Token bulunamadı');
      return NextResponse.json(
        { error: 'Giriş yapmanız gerekli' },
        { status: 401 }
      );
    }

    const body = await request.json();
    let { accountId, orderId, rating, comment, isAnonymous } = body;
    console.log('Request body:', { accountId, orderId, rating, comment, isAnonymous });

    // Validasyon
    if (!accountId || !orderId || !rating) {
      return NextResponse.json(
        { error: 'Account ID, Order ID ve rating gerekli' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating 1-5 arasında olmalı' },
        { status: 400 }
      );
    }

    // Kullanıcının bu siparişi olup olmadığını kontrol et
    console.log('Order aranıyor:', { orderId, userId });
    let order = null;
    try {
      order = await Order.findOne({
        _id: orderId,
        'buyer._id': userId,
        status: 'completed'
      });
      console.log('Bulunan order:', order);
    } catch (orderError) {
      console.log('Order arama hatası:', orderError);
    }

    // Mock data için unique order ID oluştur
    let finalOrderId = orderId;
    if (!order) {
      console.log('Order bulunamadı, mock data için unique ID oluşturuluyor');
      // Mock data için benzersiz bir order ID oluştur
      finalOrderId = `mock_${userId}_${accountId}_${Date.now()}`;
      console.log('Mock order ID:', finalOrderId);
    }

    // Daha önce bu hesap için değerlendirme yapılmış mı kontrol et
    try {
      const existingReview = await Review.findOne({
        user: userId,
        account: accountId
      });
      
      if (existingReview) {
        return NextResponse.json(
          { error: 'Bu hesap için zaten değerlendirme yapmışsınız' },
          { status: 400 }
        );
      }
    } catch (reviewCheckError) {
      console.log('Existing review check hatası:', reviewCheckError);
    }

    // Yeni değerlendirme oluştur
    console.log('Yeni review oluşturuluyor:', { userId, accountId, finalOrderId, rating });
    const review = new Review({
      user: userId,
      account: accountId,
      order: finalOrderId,
      rating,
      comment: comment || '',
      isAnonymous: isAnonymous || false,
      isApproved: false // Admin onayı bekliyor
    });

    await review.save();
    console.log('Review başarıyla kaydedildi:', review._id);

    // Review kaydedildikten sonra account rating'ini güncelle (sadece onaylanmış review'lar için)
    if (review.isApproved) {
      try {
        await updateAccountRating(accountId);
        console.log('Account rating güncellendi');
      } catch (ratingError) {
        console.log('Account rating güncelleme hatası:', ratingError);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Değerlendirmeniz başarıyla gönderildi. Admin onayından sonra yayınlanacak.',
      review: {
        _id: review._id,
        rating: review.rating,
        comment: review.comment,
        isAnonymous: review.isAnonymous,
        createdAt: review.createdAt
      }
    });

  } catch (error: any) {
    console.error('Review ekleme hatası:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json(
        { error: 'Geçersiz token' },
        { status: 401 }
      );
    }

    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Bu hesap için zaten değerlendirme yapmışsınız' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Sunucu hatası: ' + error.message },
      { status: 500 }
    );
  }
} 