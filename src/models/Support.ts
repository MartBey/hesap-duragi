import mongoose, { Document, Schema } from 'mongoose';

export interface ISupport extends Document {
  ticketId: string;
  userId: mongoose.Types.ObjectId;
  userName: string;
  userEmail: string;
  subject: string;
  message: string;
  category: 'technical' | 'payment' | 'account' | 'general';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  adminResponse?: string;
  adminId?: mongoose.Types.ObjectId;
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
}

const SupportSchema = new Schema<ISupport>({
  ticketId: {
    type: String,
    required: true,
    unique: true,
    default: () => `TKT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true,
    maxlength: 200
  },
  message: {
    type: String,
    required: true,
    maxlength: 2000
  },
  category: {
    type: String,
    enum: ['technical', 'payment', 'account', 'general'],
    default: 'general'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'resolved', 'closed'],
    default: 'open'
  },
  adminResponse: {
    type: String,
    maxlength: 2000
  },
  adminId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  attachments: [{
    type: String
  }],
  resolvedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index'ler
SupportSchema.index({ userId: 1 });
SupportSchema.index({ status: 1 });
SupportSchema.index({ priority: 1 });
SupportSchema.index({ createdAt: -1 });

export default mongoose.models.Support || mongoose.model<ISupport>('Support', SupportSchema); 