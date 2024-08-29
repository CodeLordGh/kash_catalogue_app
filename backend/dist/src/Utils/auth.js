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
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const models_1 = require("../Models/models");
const mongoose_1 = __importDefault(require("mongoose"));
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access_secret';
const authenticateToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token)
        return res.sendStatus(401); // Unauthorized
    try {
        const decoded = jsonwebtoken_1.default.verify(token, ACCESS_TOKEN_SECRET);
        if (!decoded.id || !mongoose_1.default.Types.ObjectId.isValid(decoded.id)) {
            return res.sendStatus(403); // Forbidden
        }
        const seller = yield models_1.Seller.findById(decoded.id);
        let buyer;
        if (!seller || seller.tokenBlacklist.includes(token)) {
            buyer = (yield models_1.Buyer.findById(decoded.id));
        }
        if (!seller && !buyer) {
            return res.sendStatus(403); // Forbidden if neither seller nor buyer is found
        }
        req.user = seller ?
            { id: seller._id.toString(), senderModel: "Seller", receiverModel: "Buyer" } :
            { id: buyer._id.toString(), senderModel: "Buyer", receiverModel: "Seller" };
        req.token = token;
        next();
    }
    catch (error) {
        console.error('Authentication error:', error);
        return res.sendStatus(403); // Forbidden
    }
});
exports.authenticateToken = authenticateToken;
