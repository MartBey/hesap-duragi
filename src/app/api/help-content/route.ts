import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import HelpContent from '@/models/HelpContent';

// GET - Help içeriklerini getir
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    const query: any = { isActive: true };
    if (type) {
      query.type = type;
    }

    const helpContents = await HelpContent.find(query)
      .sort({ order: 1, createdAt: 1 });

    return NextResponse.json({
      success: true,
      data: helpContents
    });

  } catch (error: any) {
    console.error('Help content getirme hatası:', error);
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    );
  }
} 