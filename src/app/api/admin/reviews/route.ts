import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import Review from '@/models/Review';
import User from '@/models/User';
import Account from '@/models/Account';

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

// GET - Admin için tüm değerlendirmeleri getir
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Token kontrolü
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Yetkilendirme token\'ı gerekli' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    let decoded;
    
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    } catch (error) {
      return NextResponse.json(
        { error: 'Geçersiz token' },
        { status: 401 }
      );
    }

    // Admin kontrolü
    const user = await User.findById(decoded.userId);
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin yetkisi gerekli' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status'); // 'pending', 'approved', 'all'
    const search = searchParams.get('search');

    const skip = (page - 1) * limit;

    // Filtre oluştur
    let filter: any = {};
    
    if (status === 'pending') {
      filter.isApproved = false;
    } else if (status === 'approved') {
      filter.isApproved = true;
    }

    if (search) {
      filter.$or = [
        { userName: { $regex: search, $options: 'i' } },
        { comment: { $regex: search, $options: 'i' } },
        { userEmail: { $regex: search, $options: 'i' } }
      ];
    }

    const reviews = await Review.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Review.countDocuments(filter);

    // İstatistikler
    const stats = {
      total: await Review.countDocuments(),
      pending: await Review.countDocuments({ isApproved: false }),
      approved: await Review.countDocuments({ isApproved: true }),
      avgRating: 0
    };

    const avgRatingResult = await Review.aggregate([
      { $match: { isApproved: true } },
      { $group: { _id: null, avgRating: { $avg: '$rating' } } }
    ]);

    if (avgRatingResult.length > 0) {
      stats.avgRating = Math.round(avgRatingResult[0].avgRating * 10) / 10;
    }

    return NextResponse.json({
      reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      stats
    });

  } catch (error) {
    console.error('Admin reviews fetch error:', error);
    return NextResponse.json(
      { error: 'Değerlendirmeler getirilemedi' },
      { status: 500 }
    );
  }
}

// PUT - Değerlendirme durumunu güncelle (onayla/reddet)
export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    // Token kontrolü
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Yetkilendirme token\'ı gerekli' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    let decoded;
    
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    } catch (error) {
      return NextResponse.json(
        { error: 'Geçersiz token' },
        { status: 401 }
      );
    }

    // Admin kontrolü
    const user = await User.findById(decoded.userId);
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin yetkisi gerekli' },
        { status: 403 }
      );
    }

    const { reviewId, isApproved } = await request.json();

    if (!reviewId || typeof isApproved !== 'boolean') {
      return NextResponse.json(
        { error: 'Review ID ve onay durumu gerekli' },
        { status: 400 }
      );
    }

    const review = await Review.findByIdAndUpdate(
      reviewId,
      { isApproved },
      { new: true }
    );

    if (!review) {
      return NextResponse.json(
        { error: 'Değerlendirme bulunamadı' },
        { status: 404 }
      );
    }

    // Review onaylandığında veya onayı kaldırıldığında account rating'ini güncelle
    try {
      await updateAccountRating(review.account.toString());
      console.log('Account rating güncellendi');
    } catch (ratingError) {
      console.log('Account rating güncelleme hatası:', ratingError);
    }

    return NextResponse.json({
      message: `Değerlendirme ${isApproved ? 'onaylandı' : 'reddedildi'}`,
      review
    });

  } catch (error) {
    console.error('Review update error:', error);
    return NextResponse.json(
      { error: 'Değerlendirme güncellenemedi' },
      { status: 500 }
    );
  }
}

// DELETE - Değerlendirme sil
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();

    // Token kontrolü
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Yetkilendirme token\'ı gerekli' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    let decoded;
    
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    } catch (error) {
      return NextResponse.json(
        { error: 'Geçersiz token' },
        { status: 401 }
      );
    }

    // Admin kontrolü
    const user = await User.findById(decoded.userId);
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin yetkisi gerekli' },
        { status: 403 }
      );
    }

    const { reviewId } = await request.json();

    if (!reviewId) {
      return NextResponse.json(
        { error: 'Review ID gerekli' },
        { status: 400 }
      );
    }

    const review = await Review.findByIdAndDelete(reviewId);

    if (!review) {
      return NextResponse.json(
        { error: 'Değerlendirme bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Değerlendirme başarıyla silindi'
    });

  } catch (error) {
    console.error('Review delete error:', error);
    return NextResponse.json(
      { error: 'Değerlendirme silinemedi' },
      { status: 500 }
    );
  }
} 