import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import HelpContent from '@/models/HelpContent';

// GET - Admin için tüm help içeriklerini getir
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
    const jwtSecret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-here-make-it-long-and-complex-123456789';
    const decoded = jwt.verify(token, jwtSecret) as any;

    if (decoded.role !== 'admin') {
      return NextResponse.json(
        { error: 'Bu işlem için yetkiniz yok' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    const query: any = {};
    if (type) {
      query.type = type;
    }

    const helpContents = await HelpContent.find(query)
      .sort({ type: 1, order: 1, createdAt: 1 });

    return NextResponse.json({
      success: true,
      data: helpContents
    });

  } catch (error: any) {
    console.error('Admin help content getirme hatası:', error);
    
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

// POST - Yeni help content oluştur
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
    const jwtSecret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-here-make-it-long-and-complex-123456789';
    const decoded = jwt.verify(token, jwtSecret) as any;

    if (decoded.role !== 'admin') {
      return NextResponse.json(
        { error: 'Bu işlem için yetkiniz yok' },
        { status: 403 }
      );
    }

    const { type, key, title, content, category, order, isActive } = await request.json();

    if (!type || !key || !title || !content) {
      return NextResponse.json(
        { error: 'Gerekli alanlar eksik' },
        { status: 400 }
      );
    }

    const helpContent = new HelpContent({
      type,
      key,
      title,
      content,
      category,
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true
    });

    await helpContent.save();

    return NextResponse.json({
      success: true,
      message: 'Help content başarıyla oluşturuldu',
      data: helpContent
    }, { status: 201 });

  } catch (error: any) {
    console.error('Help content oluşturma hatası:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json(
        { error: 'Geçersiz token' },
        { status: 401 }
      );
    }

    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Bu key zaten kullanılıyor' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    );
  }
} 