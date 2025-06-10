import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

// GET - Kullanıcı detaylarını getir
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

    // Kullanıcı sadece kendi profilini görebilir (admin hariç)
    if (decoded.userId !== params.id && decoded.role !== 'admin') {
      return NextResponse.json(
        { error: 'Bu profili görüntüleme yetkiniz yok' },
        { status: 403 }
      );
    }

    const user = await User.findById(params.id);
    if (!user) {
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: user
    });

  } catch (error: any) {
    console.error('Kullanıcı getirme hatası:', error);
    
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

// PUT - Kullanıcı profilini güncelle
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

    // Kullanıcı sadece kendi profilini güncelleyebilir (admin hariç)
    if (decoded.userId !== params.id && decoded.role !== 'admin') {
      return NextResponse.json(
        { error: 'Bu profili güncelleme yetkiniz yok' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, email, avatar, phoneNumber } = body;
    
    console.log('Kullanıcı güncelleme isteği:', {
      userId: params.id,
      body: body,
      phoneNumber: phoneNumber
    });

    // Validation
    if (name && (name.length < 2 || name.length > 50)) {
      return NextResponse.json(
        { error: 'İsim 2-50 karakter arasında olmalıdır' },
        { status: 400 }
      );
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Geçerli bir e-posta adresi girin' },
        { status: 400 }
      );
    }

    // E-posta benzersizlik kontrolü
    if (email) {
      const existingUser = await User.findOne({ 
        email: email.toLowerCase(),
        _id: { $ne: params.id }
      });
      
      if (existingUser) {
        return NextResponse.json(
          { error: 'Bu e-posta adresi zaten kullanılıyor' },
          { status: 400 }
        );
      }
    }

    // Güncellenecek alanları hazırla
    const updateData: any = {};
    if (name) updateData.name = name.trim();
    if (email) updateData.email = email.toLowerCase().trim();
    if (avatar !== undefined) updateData.avatar = avatar;
    if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber.trim();

    console.log('Güncellenecek veri:', updateData);
    
    const updatedUser = await User.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true, runValidators: true }
    );

    console.log('Güncellenen kullanıcı:', updatedUser);

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Profil başarıyla güncellendi',
      user: updatedUser
    });

  } catch (error: any) {
    console.error('Profil güncelleme hatası:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json(
        { error: 'Geçersiz token' },
        { status: 401 }
      );
    }

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: messages.join(', ') },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    );
  }
} 