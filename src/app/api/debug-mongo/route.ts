import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';
import Log from '@/models/Log';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log('🔍 MongoDB Debug endpoint çağrıldı');
    
    // Bağlantı durumunu kontrol et
    console.log('📊 Mevcut bağlantı durumu:', mongoose.connection.readyState);
    const statusMap: { [key: number]: string } = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    console.log('📊 Bağlantı durumu açıklaması:', statusMap[mongoose.connection.readyState] || 'unknown');
    
    // MongoDB'ye bağlan
    console.log('🔗 MongoDB bağlantısı deneniyor...');
    const mongooseInstance = await connectDB();
    console.log('✅ MongoDB bağlantısı başarılı');
    
    // Bağlantı detayları
    const connectionDetails: any = {
      readyState: mongoose.connection.readyState,
      host: mongoose.connection.host,
      port: mongoose.connection.port,
      name: mongoose.connection.name,
      databaseName: mongoose.connection.db?.databaseName,
      collections: []
    };
    
    // Koleksiyonları listele
    if (mongoose.connection.db) {
      try {
        const collections = await mongoose.connection.db.listCollections().toArray();
        connectionDetails.collections = collections.map(c => c.name);
        console.log('📋 Mevcut koleksiyonlar:', connectionDetails.collections);
      } catch (collError) {
        console.error('❌ Koleksiyon listesi alınamadı:', collError);
      }
    }
    
    // Log koleksiyonunu kontrol et
    let logStats = null;
    try {
      const logCount = await Log.countDocuments();
      console.log('📊 Log koleksiyonunda kayıt sayısı:', logCount);
      
      // Son 5 log kaydını getir
      const recentLogs = await Log.find().sort({ timestamp: -1 }).limit(5).lean();
      console.log('📋 Son 5 log kaydı:', recentLogs.length);
      
      logStats = {
        totalCount: logCount,
        recentLogs: recentLogs.map(log => ({
          id: log._id,
          timestamp: log.timestamp,
          level: log.level,
          category: log.category,
          message: log.message
        }))
      };
    } catch (logError: any) {
      console.error('❌ Log istatistikleri alınamadı:', logError);
      logStats = { error: logError.message };
    }
    
    // Test log oluşturmayı dene
    let testLogResult = null;
    try {
      console.log('🧪 Test log oluşturuluyor...');
      const testLog = new Log({
        level: 'info',
        category: 'system',
        message: `Debug test log - ${new Date().toISOString()}`,
        ipAddress: '127.0.0.1',
        userAgent: 'Debug Agent',
        details: { debug: true, timestamp: new Date() }
      });
      
      const savedLog = await testLog.save();
      console.log('✅ Test log başarıyla kaydedildi:', savedLog._id);
      
      testLogResult = {
        success: true,
        logId: savedLog._id,
        message: 'Test log başarıyla oluşturuldu'
      };
    } catch (testError: any) {
      console.error('❌ Test log oluşturulamadı:', testError);
      testLogResult = {
        success: false,
        error: testError.message
      };
    }
    
    return NextResponse.json({
      success: true,
      mongodb: {
        connected: mongoose.connection.readyState === 1,
        connectionDetails,
        logStats,
        testLogResult
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    console.error('❌ MongoDB Debug hatası:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
      mongodb: {
        connected: false,
        readyState: mongoose.connection.readyState
      }
    }, { status: 500 });
  }
} 