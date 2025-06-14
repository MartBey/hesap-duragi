import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Geçerli bir e-posta adresi giriniz.' }, { status: 400 });
    }
    // Burada normalde kullanıcıyı bulup, token üretip, mail gönderimi yapılır.
    // Şimdilik demo amaçlı başarılı response dönüyoruz.
    return NextResponse.json({ success: true, message: 'Şifre sıfırlama bağlantısı gönderildi.' });
  } catch (error) {
    return NextResponse.json({ error: 'Sunucu hatası.' }, { status: 500 });
  }
} 