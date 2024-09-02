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
exports.initiateMpesaPayment = void 0;
const axios_1 = __importDefault(require("axios"));
const models_1 = require("../Models/models");
const baseUrl = "https://czc9hkp8-3000.uks1.devtunnels.ms";
const initiateMpesaPayment = (_a) => __awaiter(void 0, [_a], void 0, function* ({ phoneNumber, amount, orderId, }) {
    try {
        // Generate access token
        const auth = Buffer.from(`${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`).toString("base64");
        const tokenResponse = yield axios_1.default.get(process.env.MPESA_OAUTHURL ? process.env.MPESA_OAUTHURL : "", {
            headers: {
                Authorization: `Basic ${auth}`,
            },
        });
        const accessToken = tokenResponse.data.access_token;
        // Initiate STK Push
        const timestamp = new Date()
            .toISOString()
            .replace(/[^0-9]/g, "")
            .slice(0, -3);
        const password = Buffer.from(`${process.env.MPESA_SHORTCODE}${process.env.MPESSA_PASSKEY}${timestamp}`).toString("base64");
        // const stkPushResponse = await axios.post(
        //   process.env.MPESA_STK_PUSH_URL ? process.env.MPESA_STK_PUSH_URL : "",
        //   {
        //     BusinessShortCode: process.env.MPESA_SHORTCODE,
        //     Password: password,
        //     Timestamp: timestamp,
        //     TransactionType: "CustomerPayBillOnline",
        //     Amount: amount,
        //     PartyA: phoneNumber,
        //     PartyB: process.env.MPESA_SHORTCODE,
        //     PhoneNumber: phoneNumber,
        //     CallBackURL: `${baseUrl}/api/mpesa/callback`,
        //     AccountReference: orderId,
        //     TransactionDesc: `Payment for order ${orderId}`,
        //   },
        //   {
        //     headers: {
        //       Authorization: `Bearer ${accessToken}`,
        //     },
        //   }
        // );
        // Save CheckoutRequestID to the order
        yield models_1.Order.findByIdAndUpdate(orderId, {
            checkoutRequestID: "test mode" //stkPushResponse.data.CheckoutRequestID,
        });
        return {
            success: true,
            checkoutRequestID: "test mode" //stkPushResponse.data.CheckoutRequestID,
        };
    }
    catch (error) {
        console.error("M-Pesa payment initiation error:", error);
        return {
            success: false,
            error: "Failed to initiate M-Pesa payment",
        };
    }
});
exports.initiateMpesaPayment = initiateMpesaPayment;
