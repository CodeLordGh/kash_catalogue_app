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
exports.getMessagesBetweenUsers = exports.saveMessage = void 0;
const models_1 = require("../Models/models");
const saveMessage = (sender, receiver, senderModel, receiverModel, message) => __awaiter(void 0, void 0, void 0, function* () {
    const newMessage = new models_1.Message({ sender, receiver, message, senderModel, receiverModel });
    return yield newMessage.save();
});
exports.saveMessage = saveMessage;
const getMessagesBetweenUsers = (user1, user2) => __awaiter(void 0, void 0, void 0, function* () {
    return yield models_1.Message.find({
        $or: [
            { sender: user1, receiver: user2 },
            { sender: user2, receiver: user1 }
        ]
    }).sort({ timestamp: 1 });
});
exports.getMessagesBetweenUsers = getMessagesBetweenUsers;
