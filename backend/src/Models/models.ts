import mongoose, { Schema, Document } from "mongoose";

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
  chatId: string;
  fcmToken: string,
}

const SellerSchema: Schema = new Schema(
  {
    fullName: { type: String, required: true },
    refreshToken: { type: String },
    tokenBlacklist: [],
    businessName: { type: String, required: true },
    phoneNumber: { type: String, sparse: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    storeId: { type: String, required: true, unique: true },
    catalog: { type: Schema.Types.ObjectId, ref: "Catalog" },
    customers: [{ type: Schema.Types.ObjectId, ref: "Buyer" }],
    deliveryAddresses: [
      { type: Schema.Types.ObjectId, ref: "DeliveryAddress" },
    ],
    chatId: [{ type: String }],
    fcmToken: {type: String},
  },
  
  { timestamps: true }
);

export const Seller = mongoose.model<ISeller>("Seller", SellerSchema);

// Buyer Schema
interface IBuyer extends Document {
  _id: mongoose.Types.ObjectId;
  fullName: string;
  buyerId: string;
  phoneNumber: string;
  cart: {
    product: mongoose.Types.ObjectId;
    quantity: {
      color: string;
      qty: number;
    };
  }[];
  serviceProvider: string;
  associatedStores: mongoose.Types.ObjectId[];
  chatId: string;
  fcmToken: string,
}

const BuyerSchema: Schema = new Schema(
  {
    fullName: { type: String },
    buyerId: { type: String, unique: true },
    serviceProvider: { type: String },
    cart: [
      {
        product: { type: Schema.Types.ObjectId, ref: "Product" },
        quantity: {
          color: { type: String },
          qty: { type: Number },
        },
      },
    ],
    orders: [{ type: Schema.Types.ObjectId, ref: "Order" }],
    associatedStores: [{ type: Schema.Types.ObjectId, ref: "Seller" }],
    phoneNumber: { type: String },
    chatId: { type: String },
    fcmToken: {type: String},
  },
  { timestamps: true }
);

// BuyerSchema.index(
//   { phoneNumber: 1, buyerId: 1 },
//   { unique: true, sparse: true }
// );

export const Buyer = mongoose.model<IBuyer>("Buyer", BuyerSchema);

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

const DeliveryAddressSchema: Schema = new Schema(
  {
    seller: { type: Schema.Types.ObjectId, ref: "Seller", required: true },
    name: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    postalCode: { type: String, required: true },
  },
  { timestamps: true }
);

export const DeliveryAddress = mongoose.model<IDeliveryAddress>(
  "DeliveryAddress",
  DeliveryAddressSchema
);

// Product Schema
export interface IProduct extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  price: number;
  stock: [{ color: string; qty: number; size: string}];
  catalog: mongoose.Types.ObjectId;
  images: Array<string>;
  productId: string; // Add this line
}

const ProductSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    catalog: { type: Schema.Types.ObjectId, ref: "Catalog", required: true },
    stock: [
      {
        color: { type: String, required: true },
        qty: { type: Number, required: true },
        size: { type: String, required: false },
      },
    ],
    images: [{type: String}],
    productId: { type: String, required: true, unique: true }, // Add this line
  },
  { timestamps: true }
);

export const Product = mongoose.model<IProduct>("Product", ProductSchema);

// Catalog Schema
interface ICatalog extends Document {
  _id: mongoose.Types.ObjectId;
  seller: mongoose.Types.ObjectId;
  products: mongoose.Types.ObjectId[];
}

const CatalogSchema: Schema = new Schema(
  {
    seller: { type: Schema.Types.ObjectId, ref: "Seller", required: true },
    products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  },
  { timestamps: true }
);

export const Catalog = mongoose.model<ICatalog>("Catalog", CatalogSchema);

// Order Schema
interface IOrder extends Document {
  _id: mongoose.Types.ObjectId;
  buyer: mongoose.Types.ObjectId;
  seller: mongoose.Types.ObjectId;
  items: Array<{product: mongoose.Types.ObjectId; quantity: number ; price: number}>
  totalPrice: number;
  deliveryAddress: string;
  checkoutRequestID: String,
  paymentStatus: 'pending' | 'completed' | 'failed'
  mpesaReceiptNumber: String;
  transactionDate: String;
  paidAmount: Number;
  payerPhoneNumber: String;
  paymentFailureReason: String;
  paymentMethod: string;
}

const OrderSchema: Schema = new Schema(
  {
    buyer: { type: Schema.Types.ObjectId, ref: "Buyer", required: true },
    seller: { type: Schema.Types.ObjectId, ref: "Seller", required: true },
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    totalPrice: { type: Number, required: true },
    deliveryAddress: {type: String}/** {
      type: Schema.Types.ObjectId,
      ref: "DeliveryAddress",
      required: true,
    }*/ ,
    checkoutRequestID: String,
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending'
    },
    mpesaReceiptNumber: {type:String},
    transactionDate: {type:String},
    paidAmount: {type:String},
    payerPhoneNumber: {type:String},
    paymentFailureReason: {type: String}
  },
  { timestamps: true }
);

export const Order = mongoose.model<IOrder>("Order", OrderSchema);

// Payment Schema
interface IPayment extends Document {
  _id: mongoose.Types.ObjectId;
  order: mongoose.Types.ObjectId;
  amount: number;

}

const PaymentSchema: Schema = new Schema(
  {
    order: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    paymentMethod: { type: String, required: true },
  },
  { timestamps: true }
);

export const Payment = mongoose.model<IPayment>("Payment", PaymentSchema);

export interface IMessage extends Document {
  whatsappMessageId: string;
  from: string;
  timestamp: string;
  text: string;
  platform: string;
}

const MessageSchema: Schema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "senderModel",
    },
    receiver: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "receiverModel",
    },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    senderModel: { type: String, required: true, enum: ["Seller", "Buyer"] },
    receiverModel: { type: String, required: true, enum: ["Seller", "Buyer"] },
  },
  { timestamps: true }
);

export const Message = mongoose.model<IMessage>("Message", MessageSchema);
