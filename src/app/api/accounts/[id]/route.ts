import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import Account from '@/models/Account';

// Hesap detaylarını getir
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const account = await Account.findById(params.id);

    if (!account) {
      return NextResponse.json(
        { error: 'Hesap bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      account
    });
  } catch (error: any) {
    console.error('Hesap detay getirme hatası:', error);
    return NextResponse.json(
      { error: error.message || 'Bir hata oluştu' },
      { status: 500 }
    );
  }
}

// Hesabı güncelle (sadece admin)
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

    const account = await Account.findById(params.id);
    if (!account) {
      return NextResponse.json(
        { error: 'Hesap bulunamadı' },
        { status: 404 }
      );
    }

    const data = await request.json();
    const updatedAccount = await Account.findByIdAndUpdate(
      params.id,
      { $set: data },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      account: updatedAccount
    });
  } catch (error: any) {
    console.error('Hesap güncelleme hatası:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json(
        { error: 'Geçersiz token' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Bir hata oluştu' },
      { status: 500 }
    );
  }
}

// Hesabı sil (sadece admin)
export async function DELETE(
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

    // Sadece admin silebilir
    if (decoded.role !== 'admin') {
      return NextResponse.json(
        { error: 'Bu işlem için yetkiniz yok' },
        { status: 403 }
      );
    }

    const account = await Account.findById(params.id);
    if (!account) {
      return NextResponse.json(
        { error: 'Hesap bulunamadı' },
        { status: 404 }
      );
    }

    await Account.findByIdAndDelete(params.id);

    return NextResponse.json({
      success: true,
      message: 'Hesap başarıyla silindi'
    });
  } catch (error: any) {
    console.error('Hesap silme hatası:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json(
        { error: 'Geçersiz token' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Bir hata oluştu' },
      { status: 500 }
    );
  }
} 