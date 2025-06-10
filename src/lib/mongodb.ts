import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://duragihesap:7XJNTIss1Zo0Wq9N@hdurag.qet35hk.mongodb.net/hesapduragi?retryWrites=true&w=majority&appName=HesapDuragi';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 30000, // 30 saniye timeout
      socketTimeoutMS: 45000, // 45 saniye socket timeout
      connectTimeoutMS: 30000, // 30 saniye connect timeout
      maxPoolSize: 10, // Daha fazla connection
      minPoolSize: 2,
      maxIdleTimeMS: 30000,
      retryWrites: true,
      retryReads: true,
      heartbeatFrequencyMS: 10000,
      // IP whitelist sorunu için ek parametreler
      authSource: 'admin',
      tls: true,
      tlsAllowInvalidCertificates: false,
      // Ek bağlantı parametreleri
      directConnection: false,
      maxConnecting: 2,
    };

    console.log('MongoDB bağlantısı kuruluyor...', MONGODB_URI.substring(0, 50) + '...');
    console.log('Bağlantı seçenekleri:', JSON.stringify(opts, null, 2));
    cached.promise = mongoose.connect(MONGODB_URI, opts);
  }

  try {
    cached.conn = await cached.promise;
    console.log('✅ MongoDB bağlantısı başarılı!');
    console.log('Bağlantı durumu:', mongoose.connection.readyState);
    console.log('Veritabanı adı:', mongoose.connection.db?.databaseName);
  } catch (e) {
    cached.promise = null;
    console.error('❌ MongoDB bağlantı hatası:', e);
    throw e;
  }

  return cached.conn;
}

export default connectDB; 