import mongoose from 'mongoose';

const LogSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  level: {
    type: String,
    enum: ['info', 'warning', 'error', 'debug'],
    required: true,
    index: true
  },
  category: {
    type: String,
    enum: ['auth', 'payment', 'system', 'user', 'admin', 'api'],
    required: true,
    index: true
  },
  message: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    index: true
  },
  userName: {
    type: String
  },
  ipAddress: {
    type: String,
    index: true
  },
  userAgent: {
    type: String
  },
  details: {
    type: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Index for efficient querying
LogSchema.index({ timestamp: -1 });
LogSchema.index({ level: 1, timestamp: -1 });
LogSchema.index({ category: 1, timestamp: -1 });

const Log = mongoose.models.Log || mongoose.model('Log', LogSchema);

export default Log; 