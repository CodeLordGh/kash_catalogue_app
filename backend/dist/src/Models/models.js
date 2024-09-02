"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = exports.Payment = exports.Order = exports.Catalog = exports.Product = exports.DeliveryAddress = exports.Buyer = exports.Seller = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const SellerSchema = new mongoose_1.Schema({
    fullName: { type: String, required: true },
    refreshToken: { type: String },
    tokenBlacklist: [],
    businessName: { type: String, required: true },
    phoneNumber: { type: String, sparse: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    storeId: { type: String, required: true, unique: true },
    catalog: { type: mongoose_1.Schema.Types.ObjectId, ref: "Catalog" },
    customers: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Buyer" }],
    deliveryAddresses: [
        { type: mongoose_1.Schema.Types.ObjectId, ref: "DeliveryAddress" },
    ],
    chatId: [{ type: String }],
    fcmToken: { type: String },
}, { timestamps: true });
exports.Seller = mongoose_1.default.model("Seller", SellerSchema);
const BuyerSchema = new mongoose_1.Schema({
    fullName: { type: String },
    buyerId: { type: String, unique: true },
    serviceProvider: { type: String },
    cart: [
        {
            product: { type: mongoose_1.Schema.Types.ObjectId, ref: "Product" },
            quantity: {
                color: { type: String },
                qty: { type: Number },
            },
        },
    ],
    orders: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Order" }],
    associatedStores: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Seller" }],
    chatId: { type: String },
    fcmToken: { type: String },
}, { timestamps: true });
BuyerSchema.index({ phoneNumber: 1, buyerId: 1 }, { unique: true, sparse: true });
exports.Buyer = mongoose_1.default.model("Buyer", BuyerSchema);
const DeliveryAddressSchema = new mongoose_1.Schema({
    seller: { type: mongoose_1.Schema.Types.ObjectId, ref: "Seller", required: true },
    name: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    postalCode: { type: String, required: true },
}, { timestamps: true });
exports.DeliveryAddress = mongoose_1.default.model("DeliveryAddress", DeliveryAddressSchema);
const ProductSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    catalog: { type: mongoose_1.Schema.Types.ObjectId, ref: "Catalog", required: true },
    stock: [
        {
            color: { type: String, required: true },
            qty: { type: Number, required: true },
            size: { type: String, required: false },
        },
    ],
}, { timestamps: true });
exports.Product = mongoose_1.default.model("Product", ProductSchema);
const CatalogSchema = new mongoose_1.Schema({
    seller: { type: mongoose_1.Schema.Types.ObjectId, ref: "Seller", required: true },
    products: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Product" }],
}, { timestamps: true });
exports.Catalog = mongoose_1.default.model("Catalog", CatalogSchema);
const OrderSchema = new mongoose_1.Schema({
    buyer: { type: mongoose_1.Schema.Types.ObjectId, ref: "Buyer", required: true },
    seller: { type: mongoose_1.Schema.Types.ObjectId, ref: "Seller", required: true },
    items: [
        {
            product: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
        },
    ],
    totalPrice: { type: Number, required: true },
    deliveryAddress: { type: String } /** {
      type: Schema.Types.ObjectId,
      ref: "DeliveryAddress",
      required: true,
    }*/,
    checkoutRequestID: String,
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    mpesaReceiptNumber: { type: String },
    transactionDate: { type: String },
    paidAmount: { type: String },
    payerPhoneNumber: { type: String },
    paymentFailureReason: { type: String }
}, { timestamps: true });
exports.Order = mongoose_1.default.model("Order", OrderSchema);
const PaymentSchema = new mongoose_1.Schema({
    order: { type: mongoose_1.Schema.Types.ObjectId, ref: "Order", required: true },
    amount: { type: Number, required: true },
    status: {
        type: String,
        enum: ["pending", "completed", "failed"],
        default: "pending",
    },
    paymentMethod: { type: String, required: true },
}, { timestamps: true });
exports.Payment = mongoose_1.default.model("Payment", PaymentSchema);
const MessageSchema = new mongoose_1.Schema({
    sender: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        refPath: "senderModel",
    },
    receiver: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        refPath: "receiverModel",
    },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    senderModel: { type: String, required: true, enum: ["Seller", "Buyer"] },
    receiverModel: { type: String, required: true, enum: ["Seller", "Buyer"] },
}, { timestamps: true });
exports.Message = mongoose_1.default.model("Message", MessageSchema);
// const accountSid = 'ACc3e63d94a8e499de4c2dd63c3939b97b';
// const authToken = '[AuthToken]';
// const client = require('twilio')(accountSid, authToken);
// client.messages
//     .create({
//         body: 'Your appointment is coming up on July 21 at 3PM',
//         from: 'whatsapp:+14155238886',
//         to: 'whatsapp:+233209456823'
//     })
//     .then(message => console.log(message.sid))
//     .done();
