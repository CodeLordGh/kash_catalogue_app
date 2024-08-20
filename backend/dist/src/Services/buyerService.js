"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrderDetails = exports.getOrderHistory = exports.createOrder = exports.viewCart = exports.removeFromCart = exports.addToCart = exports.viewCatalog = exports.updateBuyerProfile = exports.loginBuyer = exports.registerBuyer = void 0;
const buyerId_1 = require("../Utils/buyerId");
const models_1 = require("../Models/models");
const registerBuyer = (storeId) => __awaiter(void 0, void 0, void 0, function* () {
    const seller = yield models_1.Seller.findOne({ storeId });
    if (!seller) {
        return ({ buyerId: 'Invalid store ID' });
    }
    const buyerId = (0, buyerId_1.generateUniqueId)().toString();
    const buyer = new models_1.Buyer({ buyerId, associatedStores: [seller._id] });
    yield buyer.save();
    return ({ buyerId });
});
exports.registerBuyer = registerBuyer;
const loginBuyer = (input) => __awaiter(void 0, void 0, void 0, function* () {
    let user;
    // Check if the input is a 6-digit number
    const isSixDigitId = /^\d{6}$/.test(input);
    if (isSixDigitId) {
        // If it's a 6-digit number, treat it as an ID
        user = yield models_1.Buyer.findOne({ userId: input });
    }
    else {
        // Otherwise, treat it as a phone number
        user = yield models_1.Buyer.findOne({ phoneNumber: input });
    }
    if (!user) {
        throw new Error('User not found');
    }
    return user;
});
exports.loginBuyer = loginBuyer;
const updateBuyerProfile = (buyerId, fullName, phoneNumber) => __awaiter(void 0, void 0, void 0, function* () {
    const buyer = yield models_1.Buyer.findOne({ buyerId });
    if (!buyer) {
        throw new Error('Buyer not found');
    }
    buyer.fullName = fullName;
    buyer.phoneNumber = phoneNumber;
    yield buyer.save();
});
exports.updateBuyerProfile = updateBuyerProfile;
const viewCatalog = (buyerId, storeId) => __awaiter(void 0, void 0, void 0, function* () {
    const buyer = yield models_1.Buyer.findOne({ buyerId });
    if (!buyer) {
        throw new Error('Buyer not found');
    }
    const seller = yield models_1.Seller.findOne({ storeId });
    if (!seller) {
        throw new Error('Store not found');
    }
    if (!buyer.associatedStores.includes(seller._id)) {
        throw new Error('Buyer is not associated with this store');
    }
    const catalog = yield models_1.Catalog.findOne({ seller: seller._id });
    if (!catalog) {
        throw new Error('Catalog not found');
    }
    return models_1.Product.find({ _id: { $in: catalog.products } });
});
exports.viewCatalog = viewCatalog;
const addToCart = (buyerId, productId, quantity) => __awaiter(void 0, void 0, void 0, function* () {
    const buyer = yield models_1.Buyer.findOne({ buyerId });
    if (!buyer) {
        throw new Error('Buyer not found');
    }
    const product = yield models_1.Product.findById(productId);
    if (!product) {
        throw new Error('Product not found');
    }
    const cartItem = buyer.cart.find(item => item.product.toString() === productId);
    if (cartItem) {
        cartItem.quantity.qty += quantity;
    }
    else {
        buyer.cart.push({ product: product._id, quantity: { color: 'string', qty: quantity } });
    }
    yield buyer.save();
});
exports.addToCart = addToCart;
const removeFromCart = (buyerId, productId) => __awaiter(void 0, void 0, void 0, function* () {
    const buyer = yield models_1.Buyer.findOne({ buyerId });
    if (!buyer) {
        throw new Error('Buyer not found');
    }
    buyer.cart = buyer.cart.filter(item => item.product.toString() !== productId);
    yield buyer.save();
});
exports.removeFromCart = removeFromCart;
const viewCart = (buyerId) => __awaiter(void 0, void 0, void 0, function* () {
    const buyer = yield models_1.Buyer.findOne({ buyerId }).populate('cart.product');
    if (!buyer) {
        throw new Error('Buyer not found');
    }
    return buyer.cart.map(item => ({
        product: item.product,
        quantity: item.quantity,
    }));
});
exports.viewCart = viewCart;
const createOrder = (buyerId, deliveryAddress) => __awaiter(void 0, void 0, void 0, function* () {
    const buyer = yield models_1.Buyer.findOne({ buyerId }).populate({
        path: 'cart',
        populate: {
            path: 'product',
            model: 'Product',
            populate: { path: 'catalog' }
        }
    });
    if (!buyer) {
        throw new Error('Buyer not found');
    }
    if (buyer.cart.length === 0) {
        throw new Error('Cart is empty');
    }
    if (!buyer.fullName || !buyer.phoneNumber) {
        throw new Error('Please update your profile with full name and phone number before placing an order');
    }
    const orderId = (0, buyerId_1.generateUniqueId)().toString();
    const totalAmount = buyer.cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    const order = new models_1.Order({
        orderId,
        buyer: buyer._id,
        seller: buyer.cart[0].product instanceof models_1.Product ? buyer.cart[0].product.catalog : null, // Assuming all products in cart are from the same seller
        items: buyer.cart.map((item) => ({
            product: item.product._id,
            quantity: item.quantity,
            price: item.product.price,
        })),
        totalAmount,
        deliveryAddress,
        status: 'pending',
    });
    if (order.seller == null) {
        throw new Error("No seller found");
    }
    yield order.save();
    // Clear the cart after creating the order
    buyer.cart = [];
    yield buyer.save();
    return { orderId };
});
exports.createOrder = createOrder;
const getOrderHistory = (buyerId) => __awaiter(void 0, void 0, void 0, function* () {
    const buyer = yield models_1.Buyer.findOne({ buyerId });
    if (!buyer) {
        throw new Error('Buyer not found');
    }
    const orders = yield models_1.Order.find({ buyer: buyer._id }).sort({ createdAt: -1 });
    return orders;
});
exports.getOrderHistory = getOrderHistory;
const getOrderDetails = (buyerId, orderId) => __awaiter(void 0, void 0, void 0, function* () {
    const buyer = yield models_1.Buyer.findOne({ buyerId });
    if (!buyer) {
        throw new Error('Buyer not found');
    }
    const order = yield models_1.Order.findOne({ orderId, buyer: buyer._id }).populate('items.product');
    if (!order) {
        throw new Error('Order not found');
    }
    return order;
});
exports.getOrderDetails = getOrderDetails;
