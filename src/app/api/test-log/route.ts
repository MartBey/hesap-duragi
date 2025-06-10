import { NextResponse } from 'next/server';
import { createLog, initializeSampleLogs } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log('🧪 Test log endpoint çağrıldı');
    
    // Önce örnek logları oluştur
    await initializeSampleLogs();
    
    // Sonra yeni bir test log oluştur
    const testLogResult = await createLog({
      level: 'info',
      category: 'system',
      message: 'Test log kaydı oluşturuldu',
      ipAddress: '127.0.0.1',
      userAgent: 'Test Agent',
      details: { 
        test: true, 
        timestamp: new Date().toISOString(),
        source: 'test-endpoint'
      }
    });
    
    return NextResponse.json({
      success: true,
      message: 'Test log işlemi tamamlandı',
      logCreated: testLogResult
    });
    
  } catch (error: any) {
    console.error('❌ Test log hatası:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
} 