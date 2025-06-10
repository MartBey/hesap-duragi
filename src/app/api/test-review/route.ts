import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Review from '@/models/Review';
import User from '@/models/User';
import Account from '@/models/Account';

export async function POST(request: NextRequest) {
  try {
    console.log('Test Review API çağrıldı');
    await connectDB();

    const { action } = await request.json();

    if (action === 'create-test-user') {
      // Test kullanıcısı oluştur
      const testUser = new User({
        name: 'Test Kullanıcı',
        email: 'test@example.com',
        password: 'test123',
        role: 'user',
        verified: true
      });

      try {
        await testUser.save();
        return NextResponse.json({
          success: true,
          message: 'Test kullanıcısı oluşturuldu',
          userId: testUser._id
        });
      } catch (error: any) {
        if (error.code === 11000) {
          const existingUser = await User.findOne({ email: 'test@example.com' });
          return NextResponse.json({
            success: true,
            message: 'Test kullanıcısı zaten mevcut',
            userId: existingUser?._id
          });
        }
        throw error;
      }
    }

    if (action === 'create-test-review') {
      const { userId, accountId, rating, comment } = await request.json();

      // Test review oluştur
      const testReview = new Review({
        user: userId,
        account: accountId,
        order: `test_order_${Date.now()}`,
        rating: rating || 5,
        comment: comment || 'Bu bir test yorumudur.',
        isAnonymous: false,
        isApproved: true // Test için direkt onaylı
      });

      await testReview.save();

      return NextResponse.json({
        success: true,
        message: 'Test review oluşturuldu',
        reviewId: testReview._id
      });
    }

    if (action === 'list-reviews') {
      const { accountId } = await request.json();
      
      const reviews = await Review.find({ account: accountId })
        .populate('user', 'name email')
        .sort({ createdAt: -1 });

      return NextResponse.json({
        success: true,
        reviews: reviews.map(review => ({
          _id: review._id,
          rating: review.rating,
          comment: review.comment,
          userName: review.user?.name || 'Bilinmeyen',
          userEmail: review.user?.email || '',
          isApproved: review.isApproved,
          createdAt: review.createdAt
        }))
      });
    }

    return NextResponse.json({
      error: 'Geçersiz action'
    }, { status: 400 });

  } catch (error: any) {
    console.error('Test Review API hatası:', error);
    return NextResponse.json({
      error: 'Test API hatası: ' + error.message
    }, { status: 500 });
  }
} 