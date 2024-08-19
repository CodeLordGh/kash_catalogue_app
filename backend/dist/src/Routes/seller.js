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
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const models_1 = require("../Models/models");
const auth_1 = require("../Utils/auth");
const router = express_1.default.Router();
// const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
/// <reference types="../../types" />
router.post('/seller/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullName, businessName, phoneNumber, email, password } = req.body;
        // Check if seller already exists
        const existingSeller = yield models_1.Seller.findOne({ email });
        if (existingSeller) {
            return res.status(400).json({ message: 'Seller already exists' });
        }
        // Hash password
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        // generate a storeId
        const storeId = businessName + "-" + generateStoreId(businessName);
        // Create new seller
        const newSeller = new models_1.Seller({
            fullName,
            businessName,
            phoneNumber,
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
    try {
        const { email, password } = req.body;
        const seller = yield models_1.Seller.findOne({ email });
        if (!seller || !(yield bcrypt_1.default.compare(password, seller.password))) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const accessToken = generateAccessToken(seller._id);
        const refreshToken = jsonwebtoken_1.default.sign({ id: seller._id }, REFRESH_TOKEN_SECRET, { expiresIn: '30d' });
        seller.refreshToken = refreshToken;
        yield seller.save();
        res.json({ accessToken, refreshToken });
    }
    catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
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
function generateStoreId(name) {
    return Math.floor(100000 + Math.random() * 900000);
}
exports.default = router;
