import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Account from '@/models/Account';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    // Tüm hesaplarda isFeatured alanını false olarak ekle (eğer yoksa)
    const result = await Account.updateMany(
      { isFeatured: { $exists: false } },
      { $set: { isFeatured: false } }
    );

    console.log(`${result.modifiedCount} hesap güncellendi`);

    return NextResponse.json({
      success: true,
      message: `${result.modifiedCount} hesap güncellendi`,
      modifiedCount: result.modifiedCount
    });

  } catch (error) {
    console.error('Migration hatası:', error);
    return NextResponse.json(
      { success: false, error: 'Migration işlemi başarısız' },
      { status: 500 }
    );
  }
} 