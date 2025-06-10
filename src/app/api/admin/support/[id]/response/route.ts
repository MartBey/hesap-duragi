import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import Support from '@/models/Support';

// POST - Admin yanıtı ekle
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const jwtSecret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-here-make-it-long-and-complex-123456789';
    const decoded = jwt.verify(token, jwtSecret) as any;

    // Sadece admin yanıt verebilir
    if (decoded.role !== 'admin') {
      return NextResponse.json(
        { error: 'Bu işlem için yetkiniz yok' },
        { status: 403 }
      );
    }

    const { message } = await request.json();

    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Yanıt mesajı gerekli' },
        { status: 400 }
      );
    }

    // Ticket'ı bul ve güncelle
    const ticket = await Support.findByIdAndUpdate(
      params.id,
      {
        adminResponse: message,
        adminId: decoded.userId,
        status: 'in-progress', // Yanıt verildiğinde durumu işlemde yap
        updatedAt: new Date()
      },
      { new: true }
    ).populate('userId', 'name email')
     .populate('adminId', 'name email');

    if (!ticket) {
      return NextResponse.json(
        { error: 'Destek bileti bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Yanıt başarıyla gönderildi',
      ticket
    });

  } catch (error: any) {
    console.error('Admin yanıt gönderme hatası:', error);
    
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