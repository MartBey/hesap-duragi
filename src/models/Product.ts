import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: [{
    type: String,
    enum: ['FPS', 'MMORPG', 'MOBA'],
    required: true,
  }],
  details: {
    level: {
      type: Number,
      required: true,
    },
    rank: {
      type: String,
      required: true,
    },
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'sold'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product; 