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
// routes/chat.ts
const express_1 = require("express");
const chatService_1 = require("../Services/chatService");
const router = (0, express_1.Router)();
// Get chat history between two users
router.get('/chat/:user1/:user2', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user1, user2 } = req.params;
        const messages = yield (0, chatService_1.getMessagesBetweenUsers)(user1, user2);
        res.json(messages);
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching messages' });
    }
}));
// Post a new message
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let receiverModel = "";
    try {
        const { sender, receiver, message, senderModel } = req.body;
        if (senderModel == 'Seller') {
            receiverModel = 'Buyer';
        }
        else if (senderModel === "Buyer") {
            receiverModel = 'Seller';
        }
        const savedMessage = yield (0, chatService_1.saveMessage)(sender, receiver, senderModel, receiverModel, message);
        res.json(savedMessage);
    }
    catch (error) {
        res.status(500).json({ error: 'Error saving message' });
    }
}));
exports.default = router;
