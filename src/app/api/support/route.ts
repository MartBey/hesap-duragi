import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import Support from '@/models/Support';
import User from '@/models/User';

// GET - Kullanıcının destek biletlerini getir
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Yetkilendirme token\'ı gerekli' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');

    // Query oluştur
    const query: any = { userId: decoded.userId };
    if (status && status !== 'all') {
      query.status = status;
    }

    // Destek biletlerini getir
    const tickets = await Support.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Support.countDocuments(query);

    return NextResponse.json({
      success: true,
      tickets,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error: any) {
    console.error('Destek biletleri getirme hatası:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json(
        { error: 'Geçersiz token' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    );
  }
}

// POST - Yeni destek bileti oluştur
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Yetkilendirme token\'ı gerekli' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    // Kullanıcı bilgilerini getir
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı' },
        { status: 404 }
      );
    }

    const { subject, message, category, priority } = await request.json();

    // Validasyon
    if (!subject || !message) {
      return NextResponse.json(
        { error: 'Konu ve mesaj alanları zorunludur' },
        { status: 400 }
      );
    }

    if (subject.length > 200) {
      return NextResponse.json(
        { error: 'Konu 200 karakterden uzun olamaz' },
        { status: 400 }
      );
    }

    if (message.length > 2000) {
      return NextResponse.json(
        { error: 'Mesaj 2000 karakterden uzun olamaz' },
        { status: 400 }
      );
    }

    // Yeni destek bileti oluştur
    const supportTicket = new Support({
      userId: decoded.userId,
      userName: user.name,
      userEmail: user.email,
      subject,
      message,
      category: category || 'general',
      priority: priority || 'medium'
    });

    await supportTicket.save();

    return NextResponse.json({
      success: true,
      message: 'Destek bileti başarıyla oluşturuldu',
      ticket: supportTicket
    }, { status: 201 });

  } catch (error: any) {
    console.error('Destek bileti oluşturma hatası:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json(
        { error: 'Geçersiz token' },
        { status: 401 }
      );
    }

    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { error: 'Geçersiz veri formatı' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    );
  }
} 