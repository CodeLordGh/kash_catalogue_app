"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUniqueId = void 0;
const generateUniqueId = () => {
    return Math.floor(100000 + Math.random() * 90000);
};
exports.generateUniqueId = generateUniqueId;
