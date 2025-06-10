import mongoose, { Document, Schema } from 'mongoose';

export interface ISubcategory {
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  order: number;
}

export interface ICategory extends Document {
  title: string;
  image: string;
  type: 'account' | 'license';
  status: 'active' | 'inactive';
  itemCount: number;
  subcategories: ISubcategory[];
  createdAt: Date;
  updatedAt: Date;
}

const SubcategorySchema = new Schema<ISubcategory>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, { _id: true });

const CategorySchema = new Schema<ICategory>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['account', 'license'],
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  itemCount: {
    type: Number,
    default: 0
  },
  subcategories: [SubcategorySchema]
}, {
  timestamps: true
});

// Index for better performance
CategorySchema.index({ type: 1, status: 1 });
CategorySchema.index({ title: 'text' });
CategorySchema.index({ 'subcategories.slug': 1 });

export default mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema); 