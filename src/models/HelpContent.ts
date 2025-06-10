import mongoose, { Document, Schema } from 'mongoose';

export interface IHelpContent extends Document {
  type: 'faq' | 'general';
  key: string;
  title: string;
  content: string;
  category?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const HelpContentSchema = new Schema<IHelpContent>({
  type: {
    type: String,
    enum: ['faq', 'general'],
    required: true
  },
  key: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type: String
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index'ler
HelpContentSchema.index({ type: 1, isActive: 1 });
HelpContentSchema.index({ key: 1 });
HelpContentSchema.index({ order: 1 });

export default mongoose.models.HelpContent || mongoose.model<IHelpContent>('HelpContent', HelpContentSchema); 