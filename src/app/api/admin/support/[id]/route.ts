import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import Support from '@/models/Support';

// GET - Belirli bir destek biletini getir
export async function GET(
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
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    // Admin veya ticket sahibi erişebilir
    const ticket = await Support.findById(params.id)
      .populate('userId', 'name email')
      .populate('adminId', 'name email');

    if (!ticket) {
      return NextResponse.json(
        { error: 'Destek bileti bulunamadı' },
        { status: 404 }
      );
    }

    // Yetki kontrolü
    if (decoded.role !== 'admin' && ticket.userId.toString() !== decoded.userId) {
      return NextResponse.json(
        { error: 'Bu işlem için yetkiniz yok' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      ticket
    });

  } catch (error: any) {
    console.error('Destek bileti getirme hatası:', error);
    
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

// PUT - Destek biletini güncelle (Admin)
export async function PUT(
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
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    // Sadece admin güncelleyebilir
    if (decoded.role !== 'admin') {
      return NextResponse.json(
        { error: 'Bu işlem için yetkiniz yok' },
        { status: 403 }
      );
    }

    const { status, priority, adminResponse } = await request.json();

    const updateData: any = {};
    
    if (status) updateData.status = status;
    if (priority) updateData.priority = priority;
    if (adminResponse) updateData.adminResponse = adminResponse;
    
    // Admin bilgisini ekle
    updateData.adminId = decoded.userId;
    
    // Eğer çözüldü olarak işaretleniyorsa tarih ekle
    if (status === 'resolved' || status === 'closed') {
      updateData.resolvedAt = new Date();
    }

    const ticket = await Support.findByIdAndUpdate(
      params.id,
      updateData,
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
      message: 'Destek bileti başarıyla güncellendi',
      ticket
    });

  } catch (error: any) {
    console.error('Destek bileti güncelleme hatası:', error);
    
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