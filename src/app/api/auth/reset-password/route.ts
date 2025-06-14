import { NextResponse } from 'next/server';

// Demo amaçlı token kontrolü (gerçek projede JWT veya DB token kontrolü yapılmalı)
const DEMO_TOKEN = '123456789';

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();
    if (!token || !password) {
      return NextResponse.json({ error: 'Eksik bilgi.' }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'Şifre en az 8 karakter olmalı.' }, { status: 400 });
    }
    // Demo: Token kontrolü
    if (token !== DEMO_TOKEN) {
      return NextResponse.json({ error: 'Geçersiz veya süresi dolmuş bağlantı.' }, { status: 400 });
    }
    // Burada normalde kullanıcı bulunur ve şifresi güncellenir.
    return NextResponse.json({ success: true, message: 'Şifreniz başarıyla güncellendi.' });
  } catch (error) {
    return NextResponse.json({ error: 'Sunucu hatası.' }, { status: 500 });
  }
} 