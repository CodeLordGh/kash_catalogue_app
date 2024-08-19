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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const buyerService_1 = require("../Services/buyerService");
const router = express_1.default.Router();
// Middleware to extract buyerId from headers or query params
const extractBuyerId = (req, res, next) => {
    const buyerId = req.headers['buyer-id'] || req.query.buyerId;
    if (!buyerId) {
        return res.status(400).json({ message: 'Buyer ID is required' });
    }
    req.buyerId = buyerId;
    next();
};
// Register a new buyer
router.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { storeId } = req.body;
        const result = yield (0, buyerService_1.registerBuyer)(storeId);
        res.status(201).json(result);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
}));
// Update buyer profile
router.put('/profile', extractBuyerId, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullName, phoneNumber } = req.body;
        yield (0, buyerService_1.updateBuyerProfile)(req.buyerId ? req.buyerId : "", fullName, phoneNumber);
        res.status(200).json({ message: 'Profile updated successfully' });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
}));
// View catalog
router.get('/catalog/:storeId', extractBuyerId, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { storeId } = req.params;
        const catalog = yield (0, buyerService_1.viewCatalog)(req.buyerId ? req.buyerId : "", storeId);
        res.status(200).json(catalog);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
}));
// Add to cart
router.post('/cart', extractBuyerId, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId, quantity } = req.body;
        yield (0, buyerService_1.addToCart)(req.buyerId ? req.buyerId : "", productId, quantity);
        res.status(200).json({ message: 'Product added to cart' });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
}));
// Remove from cart
router.delete('/cart/:productId', extractBuyerId, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.params;
        yield (0, buyerService_1.removeFromCart)(req.buyerId ? req.buyerId : "", productId);
        res.status(200).json({ message: 'Product removed from cart' });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
}));
// View cart
router.get('/cart', extractBuyerId, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cart = yield (0, buyerService_1.viewCart)(req.buyerId ? req.buyerId : "");
        res.status(200).json(cart);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
}));
// Create order
router.post('/order', extractBuyerId, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { deliveryAddress } = req.body;
        const result = yield (0, buyerService_1.createOrder)(req.buyerId ? req.buyerId : "", deliveryAddress);
        res.status(201).json(result);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
}));
// Get order history
router.get('/orders', extractBuyerId, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield (0, buyerService_1.getOrderHistory)(req.buyerId ? req.buyerId : "");
        res.status(200).json(orders);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
}));
// Get order details
router.get('/orders/:orderId', extractBuyerId, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderId } = req.params;
        const orderDetails = yield (0, buyerService_1.getOrderDetails)(req.buyerId ? req.buyerId : "", orderId);
        if (!orderDetails) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(orderDetails);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
}));
exports.default = router;
