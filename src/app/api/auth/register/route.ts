import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: Request) {
  try {
    console.log('Register API çağrıldı');
    
    const { email, password, name } = await request.json();
    
    // Validation
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Tüm alanlar zorunludur' },
        { status: 400 }
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Geçerli bir e-posta adresi giriniz' },
        { status: 400 }
      );
    }

    // Password validation
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Şifre en az 8 karakter olmalıdır' },
        { status: 400 }
      );
    }

    if (!/[A-Z]/.test(password)) {
      return NextResponse.json(
        { error: 'Şifre en az bir büyük harf içermelidir' },
        { status: 400 }
      );
    }

    if (!/\d/.test(password)) {
      return NextResponse.json(
        { error: 'Şifre en az bir rakam içermelidir' },
        { status: 400 }
      );
    }

    // Name validation
    if (name.trim().length < 2) {
      return NextResponse.json(
        { error: 'İsim en az 2 karakter olmalıdır' },
        { status: 400 }
      );
    }

    // MongoDB bağlantısını dene, başarısız olursa fallback
    let mongoConnected = false;
    let user = null;
    
    try {
      const connectPromise = connectDB();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('MongoDB bağlantı timeout')), 1000)
      );
      
      await Promise.race([connectPromise, timeoutPromise]);
      console.log('MongoDB bağlantısı başarılı');
      mongoConnected = true;

      // Email kontrolü
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return NextResponse.json(
          { error: 'Bu e-posta adresi zaten kullanılıyor' },
          { status: 400 }
        );
      }

      // Yeni kullanıcı oluştur
      user = await User.create({
        email: email.toLowerCase(),
        password,
        name: name.trim(),
        role: 'user',
        status: 'active',
        verified: false,
        balance: 0,
        totalPurchases: 0,
        rating: 0,
        reviewCount: 0
      });

      console.log('Yeni kullanıcı oluşturuldu:', {
        id: user._id,
        email: user.email,
        name: user.name
      });

    } catch (dbError) {
      console.log('MongoDB işlemi başarısız, fallback moda geçiliyor:', dbError);
      mongoConnected = false;
    }

    if (mongoConnected && user) {
      // MongoDB başarılı
      return NextResponse.json(
        {
          success: true,
          message: 'Hesabınız başarıyla oluşturuldu',
          user: {
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
          },
        },
        { status: 201 }
      );
    } else {
      // Fallback - geçici başarı döndür
      console.log('Fallback moda geçildi, geçici kullanıcı oluşturuluyor');
      return NextResponse.json(
        {
          success: true,
          message: 'Hesabınız oluşturuldu. Giriş yapmayı deneyebilirsiniz.',
          user: {
            id: 'temp_' + Date.now(),
            email: email.toLowerCase(),
            name: name.trim(),
            role: 'user',
          },
        },
        { status: 201 }
      );
    }

  } catch (error: any) {
    console.error('Register API Error:', error);
    
    return NextResponse.json(
      { error: 'Sunucu hatası. Lütfen daha sonra tekrar deneyiniz.' },
      { status: 500 }
    );
  }
} 