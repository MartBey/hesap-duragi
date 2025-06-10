import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json({
      success: true,
      message: 'MongoDB bağlantısı başarılı',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('MongoDB bağlantı hatası:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'MongoDB bağlantısı başarısız',
        details: error.message 
      },
      { status: 500 }
    );
  }
} 