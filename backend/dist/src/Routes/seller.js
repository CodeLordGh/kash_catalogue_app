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
exports.generateAccessToken = generateAccessToken;
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const models_1 = require("../Models/models");
const auth_1 = require("../Utils/auth");
const router = express_1.default.Router();
// const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
/// <reference types="../../types" />
router.post('/seller/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullName, businessName, email, password } = req.body;
        // Check if seller already exists
        const existingSeller = yield models_1.Seller.findOne({ email });
        if (existingSeller) {
            return res.status(400).json({ message: 'Seller already exists' });
        }
        // Hash password
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        // generate a storeId
        const storeId = businessName + "-" + generateStoreId();
        // Create new seller
        const newSeller = new models_1.Seller({
            fullName,
            businessName,
            email,
            password: hashedPassword,
            storeId
        });
        // Create a catalog for the seller
        const catalog = new models_1.Catalog({ seller: newSeller._id });
        yield catalog.save();
        newSeller.catalog = catalog._id;
        yield newSeller.save();
        res.status(201).json({ message: 'Seller registered successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error registering seller', error });
    }
}));
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access_secret';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refresh_secret';
// Login route
router.post('/seller/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let products;
    try {
        const { email, password, fcmToken } = req.body;
        const seller = yield models_1.Seller.findOne({ email }).select('-refreshToken -createdAt -__v');
        if (seller)
            products = yield models_1.Catalog.find({ catalog: seller.catalog });
        if (!seller || !(yield bcrypt_1.default.compare(password, seller.password))) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const accessToken = generateAccessToken(seller._id);
        const refreshToken = jsonwebtoken_1.default.sign({ id: seller._id }, REFRESH_TOKEN_SECRET, { expiresIn: '30d' });
        seller.refreshToken = refreshToken;
        if (fcmToken)
            seller.fcmToken = fcmToken;
        yield seller.save();
        seller.password = ""; //undefined as any
        res.status(200).json({ accessToken, user: seller, products });
    }
    catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
}));
router.route("/seller/product").post(auth_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, price, description, stock } = req.body;
    const user = req.user;
    const catalog = user === null || user === void 0 ? void 0 : user.catalog;
    try {
        const newProduct = new models_1.Product({
            name, price, description, stock, catalog
        });
        yield newProduct.save();
        return res.status(201).json({ message: "Product added successfully" });
    }
    catch (error) {
        return res.status(500).json({ message: "Server internal Error!" });
    }
})).get(auth_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const catalog = (_a = req.user) === null || _a === void 0 ? void 0 : _a.catalog;
    try {
        yield models_1.Catalog.find({ _id: catalog }).populate("products").then(() => {
            return res.status(200).json({ products: catalog === null || catalog === void 0 ? void 0 : catalog.products });
        });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server Error!" });
    }
    // Product.find({ _id: { $in: catalog.products } });
}));
// Refresh token route
router.post('/token/refresh', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.body;
    if (!refreshToken)
        return res.sendStatus(401);
    try {
        const decoded = jsonwebtoken_1.default.verify(refreshToken, REFRESH_TOKEN_SECRET);
        const seller = yield models_1.Seller.findById(decoded.id);
        if (!seller || seller.refreshToken !== refreshToken) {
            return res.sendStatus(403);
        }
        const accessToken = generateAccessToken(seller._id);
        res.json({ accessToken });
    }
    catch (error) {
        res.sendStatus(403);
    }
}));
// Logout route
router.post('/seller/logout', auth_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const seller = yield models_1.Seller.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
        if (seller) {
            seller.refreshToken = undefined;
            seller.tokenBlacklist.push(req.token ? req.token : ""); // Add the current token to the blacklist
            yield seller.save();
        }
        res.sendStatus(204);
    }
    catch (error) {
        res.status(500).json({ message: 'Error logging out', error });
    }
}));
function generateAccessToken(id) {
    return jsonwebtoken_1.default.sign({ id }, ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
}
function generateStoreId() {
    return Math.floor(100000 + Math.random() * 900000);
}
exports.default = router;
