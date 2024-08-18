import mongoose, { Schema, Document } from 'mongoose';

// Seller Schema
interface ISeller extends Document {
    _id: mongoose.Types.ObjectId;
  fullName: string;
  businessName: string;
  phoneNumber: string;
  email: string;
  tokenBlacklist: [string];
  refreshToken: string | undefined;
  password: string;
  storeId: string;
  catalog: mongoose.Types.ObjectId;
  customers: mongoose.Types.ObjectId[];
  deliveryAddresses: mongoose.Types.ObjectId[];
}

const SellerSchema: Schema = new Schema({
  fullName: { type: String, required: true },
  refreshToken: {type: String},
  tokenBlacklist: [],
  businessName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  storeId: { type: String, required: true, unique: true },
  catalog: { type: Schema.Types.ObjectId, ref: 'Catalog' },
  customers: [{ type: Schema.Types.ObjectId, ref: 'Buyer' }],
  deliveryAddresses: [{ type: Schema.Types.ObjectId, ref: 'DeliveryAddress' }]
}, { timestamps: true });

export const Seller = mongoose.model<ISeller>('Seller', SellerSchema);

// Buyer Schema
interface IBuyer extends Document {
    _id: mongoose.Types.ObjectId;
  fullName: string;
  phoneNumber: string;
  serviceProvider: string;
  sellers: mongoose.Types.ObjectId[];
}

const BuyerSchema: Schema = new Schema({
  fullName: { type: String, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  serviceProvider: { type: String, required: true },
  sellers: [{ type: Schema.Types.ObjectId, ref: 'Seller' }]
}, { timestamps: true });

export const Buyer = mongoose.model<IBuyer>('Buyer', BuyerSchema);

// Delivery Address Schema
interface IDeliveryAddress extends Document {
    _id: mongoose.Types.ObjectId;
  seller: mongoose.Types.ObjectId;
  name: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

const DeliveryAddressSchema: Schema = new Schema({
  seller: { type: Schema.Types.ObjectId, ref: 'Seller', required: true },
  name: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
  postalCode: { type: String, required: true }
}, { timestamps: true });

export const DeliveryAddress = mongoose.model<IDeliveryAddress>('DeliveryAddress', DeliveryAddressSchema);

// Product Schema
interface IProduct extends Document {
    _id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  price: number;
  stock: [{color: string, qty: number}];
  catalog: mongoose.Types.ObjectId;
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  catalog: { type: Schema.Types.ObjectId, ref: 'Catalog', required: true },
  stock: [
    {
      color: { type: String, required: true },
      qty: { type: Number, required: true }
    }]
}, { timestamps: true });

export const Product = mongoose.model<IProduct>('Product', ProductSchema);

// Catalog Schema
interface ICatalog extends Document {
    _id: mongoose.Types.ObjectId;
  seller: mongoose.Types.ObjectId;
  products: mongoose.Types.ObjectId[];
}

const CatalogSchema: Schema = new Schema({
  seller: { type: Schema.Types.ObjectId, ref: 'Seller', required: true },
  products: [{ type: Schema.Types.ObjectId, ref: 'Product' }]
}, { timestamps: true });

export const Catalog = mongoose.model<ICatalog>('Catalog', CatalogSchema);

// Order Schema
interface IOrder extends Document {
    _id: mongoose.Types.ObjectId;
  buyer: mongoose.Types.ObjectId;
  seller: mongoose.Types.ObjectId;
  items: {
    product: mongoose.Types.ObjectId;
    quantity: number;
    price: number;
  }[];
  totalPrice: number;
  deliveryAddress: mongoose.Types.ObjectId;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
}

const OrderSchema: Schema = new Schema({
  buyer: { type: Schema.Types.ObjectId, ref: 'Buyer', required: true },
  seller: { type: Schema.Types.ObjectId, ref: 'Seller', required: true },
  items: [{
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
  }],
  totalPrice: { type: Number, required: true },
  deliveryAddress: { type: Schema.Types.ObjectId, ref: 'DeliveryAddress', required: true },
  status: { type: String, enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'pending' }
}, { timestamps: true });

export const Order = mongoose.model<IOrder>('Order', OrderSchema);

// Payment Schema
interface IPayment extends Document {
    _id: mongoose.Types.ObjectId;
  order: mongoose.Types.ObjectId;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  paymentMethod: string;
}

const PaymentSchema: Schema = new Schema({
  order: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  paymentMethod: { type: String, required: true }
}, { timestamps: true });

export const Payment = mongoose.model<IPayment>('Payment', PaymentSchema);