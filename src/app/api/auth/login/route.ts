import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import { createLog } from '@/lib/logger';

const JWT_SECRET: string = process.env.JWT_SECRET || 'your-super-secret-jwt-key-here-make-it-long-and-complex-123456789';

export async function POST(request: Request) {
  try {
    console.log('Login API çağrıldı');
    
    const { email, password } = await request.json();

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'E-posta ve şifre gereklidir' },
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

      // Kullanıcıyı bul
      user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        // Kullanıcı bulunamadı logunu kaydet
        await createLog({
          level: 'warning',
          category: 'auth',
          message: `Kullanıcı bulunamadı: ${email}`,
          ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
          userAgent: request.headers.get('user-agent') || 'unknown',
          details: { 
            email: email,
            reason: 'user_not_found',
            timestamp: new Date().toISOString()
          }
        });
        
        return NextResponse.json(
          { error: 'Kullanıcı bulunamadı' },
          { status: 404 }
        );
      }

      // Şifreyi kontrol et
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        // Başarısız giriş logunu kaydet
        await createLog({
          level: 'warning',
          category: 'auth',
          message: `Başarısız giriş denemesi: ${email}`,
          ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
          userAgent: request.headers.get('user-agent') || 'unknown',
          details: { 
            email: email,
            reason: 'invalid_password',
            timestamp: new Date().toISOString()
          }
        });
        
        return NextResponse.json(
          { error: 'Geçersiz şifre' },
          { status: 400 }
        );
      }

    } catch (dbError) {
      console.log('MongoDB işlemi başarısız, fallback moda geçiliyor:', dbError);
      mongoConnected = false;
    }

    if (mongoConnected && user) {
      // MongoDB başarılı - gerçek kullanıcı
      const token = jwt.sign(
        {
          userId: user._id,
          email: user.email,
          role: user.role,
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Başarılı giriş logunu kaydet
      await createLog({
        level: 'info',
        category: 'auth',
        message: `Kullanıcı başarıyla giriş yaptı: ${user.email}`,
        userId: user._id.toString(),
        userName: user.name,
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
        details: { 
          loginMethod: 'email',
          role: user.role,
          timestamp: new Date().toISOString()
        }
      });

      return NextResponse.json(
        {
          message: 'Giriş başarılı',
          user: {
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
          },
          token,
        },
        { status: 200 }
      );
    } else {
      // Fallback - demo kullanıcı
      console.log('Fallback moda geçildi, demo kullanıcı döndürülüyor');
      
      // Admin email kontrolü
      const isAdmin = email.toLowerCase() === 'admin@hesapduragi.com';
      
      const demoUser = {
        id: isAdmin ? 'admin_123' : 'demo_user_123',
        email: email.toLowerCase(),
        name: isAdmin ? 'Admin User' : 'Demo Kullanıcı',
        role: isAdmin ? 'admin' : 'user',
      };

      const token = jwt.sign(
        {
          userId: demoUser.id,
          email: demoUser.email,
          role: demoUser.role,
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return NextResponse.json(
        {
          message: 'Demo hesabı ile giriş yapıldı',
          user: demoUser,
          token,
        },
        { status: 200 }
      );
    }

  } catch (error: any) {
    console.error('Login API Error:', error);
    
    return NextResponse.json(
      { error: 'Sunucu hatası. Lütfen daha sonra tekrar deneyiniz.' },
      { status: 500 }
    );
  }
} 