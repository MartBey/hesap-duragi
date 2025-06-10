import connectDB from './mongodb';
import Log from '@/models/Log';

interface LogData {
  level: 'info' | 'warning' | 'error' | 'debug';
  category: 'auth' | 'payment' | 'system' | 'user' | 'admin' | 'api';
  message: string;
  userId?: string;
  userName?: string;
  ipAddress?: string;
  userAgent?: string;
  details?: any;
}

export async function createLog(logData: LogData) {
  try {
    console.log('📝 Log oluşturuluyor:', logData.message);
    await connectDB();
    console.log('🔗 MongoDB bağlantısı başarılı (logger)');
    
    const newLog = new Log({
      ...logData,
      timestamp: new Date()
    });
    
    console.log('💾 Log kaydediliyor...');
    const savedLog = await newLog.save();
    console.log(`✅ Log kaydı oluşturuldu: ${logData.level} - ${logData.message} (ID: ${savedLog._id})`);
    
    return true;
  } catch (error) {
    console.error('❌ Log kaydı oluşturulamadı:', error);
    return false;
  }
}

// Sistem başlatıldığında örnek loglar oluştur
export async function initializeSampleLogs() {
  try {
    console.log('🚀 Örnek log sistemi başlatılıyor...');
    await connectDB();
    console.log('🔗 MongoDB bağlantısı başarılı (initializeSampleLogs)');
    
    // Mevcut log sayısını kontrol et
    console.log('📊 Mevcut log sayısı kontrol ediliyor...');
    const logCount = await Log.countDocuments();
    console.log(`📊 Veritabanında ${logCount} log kaydı bulundu`);
    
    if (logCount === 0) {
      console.log('📝 Örnek log kayıtları oluşturuluyor...');
      
      const sampleLogs = [
        {
          level: 'info' as const,
          category: 'system' as const,
          message: 'Sistem başlatıldı',
          ipAddress: 'localhost',
          userAgent: 'System Process',
          details: { version: '1.0.0', environment: 'development' }
        },
        {
          level: 'info' as const,
          category: 'auth' as const,
          message: 'Admin kullanıcısı giriş yaptı',
          userId: 'admin_123',
          userName: 'Admin User',
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          details: { loginMethod: 'email', sessionId: 'sess_abc123' }
        },
        {
          level: 'warning' as const,
          category: 'system' as const,
          message: 'Yüksek CPU kullanımı tespit edildi',
          ipAddress: 'localhost',
          userAgent: 'System Monitor',
          details: { cpuUsage: 85, threshold: 80 }
        },
        {
          level: 'error' as const,
          category: 'api' as const,
          message: 'API endpoint hatası',
          userId: 'user_456',
          userName: 'Test Kullanıcı',
          ipAddress: '192.168.1.50',
          userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)',
          details: { endpoint: '/api/orders', error: 'Validation failed', statusCode: 400 }
        },
        {
          level: 'info' as const,
          category: 'payment' as const,
          message: 'Ödeme işlemi tamamlandı',
          userId: 'user_789',
          userName: 'Müşteri Kullanıcı',
          ipAddress: '192.168.1.75',
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
          details: { orderId: 'ORD-123456', amount: 150, paymentMethod: 'credit_card' }
        }
      ];
      
      for (const logData of sampleLogs) {
        await createLog(logData);
      }
      
      console.log(`✅ ${sampleLogs.length} örnek log kaydı oluşturuldu`);
    } else {
      console.log(`📊 Veritabanında ${logCount} log kaydı mevcut`);
    }
    
  } catch (error) {
    console.error('❌ Örnek log kayıtları oluşturulamadı:', error);
  }
}

export default { createLog, initializeSampleLogs }; 