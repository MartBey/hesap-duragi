import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
  try {
    await connectDB();
    
    // Tüm kullanıcıları getir ve telefon numaralarını kontrol et
    const users = await User.find({}).select('name email phoneNumber');
    
    console.log('Veritabanındaki kullanıcılar ve telefon numaraları:');
    users.forEach(user => {
      console.log(`${user.name} (${user.email}): ${user.phoneNumber || 'YOK'}`);
    });
    
    return NextResponse.json({
      success: true,
      users: users.map(user => ({
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber || 'YOK'
      }))
    });
    
  } catch (error: any) {
    console.error('Test API hatası:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    });
  }
} 