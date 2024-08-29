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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const admin = __importStar(require("firebase-admin"));
// Import routes
const seller_1 = __importDefault(require("./Routes/seller"));
const products_1 = __importDefault(require("./Routes/products"));
const buyer_1 = __importDefault(require("./Routes/buyer"));
const auth_1 = require("./Utils/auth");
// Load environment variables
dotenv_1.default.config();
// Create Express app
const app = (0, express_1.default)();
// Set up middleware
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: (_a = process.env.FIREBASE_PRIVATE_KEY) === null || _a === void 0 ? void 0 : _a.replace(/\\n/g, "\n"),
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
});
// Connect to MongoDB
const MONGODB_URI = `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@${process.env.MONGO_DB_CLUSTER}.hnf4m.mongodb.net/?retryWrites=true&w=majority&appName=VendEx`;
// Set up routes
app.use("/api", seller_1.default);
app.use("/api", products_1.default);
app.use("/api", buyer_1.default);
// Chat routes using Firebase
app.post("/chat", auth_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    const { senderModel } = user;
    // console.log("I reach here")
    try {
        const { sender, message, chatId, _id, createdAt } = req.body;
        console.log(sender, message, _id, chatId, createdAt);
        if (!sender || !message || !chatId) {
            return res.status(400).json({ error: "All fields are required" });
        }
        const newMessage = {
            sender: sender._id,
            message,
            _id,
            timestamp: createdAt,
        };
        const ref = admin.database().ref(`chats/${chatId}/messages`);
        const newMessageRef = yield ref.push(newMessage);
        res.json(Object.assign({ id: newMessageRef.key }, newMessage));
    }
    catch (error) {
        res.status(500).json({ error: "Error saving message" });
    }
}));
app.get("/chat/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    const userId = user.id;
    try {
        const ref = admin.database().ref("messages");
        const snapshot = yield ref
            .orderByChild("sender")
            .equalTo(userId)
            .once("value");
        const messagesSent = snapshot.val() || {};
        const receivedSnapshot = yield ref
            .orderByChild("receiver")
            .equalTo(userId)
            .once("value");
        const messagesReceived = receivedSnapshot.val() || {};
        // Combine sent and received messages
        const allMessages = Object.assign(Object.assign({}, messagesSent), messagesReceived);
        res.json(allMessages);
    }
    catch (error) {
        res.status(500).json({ error: "Error fetching chats" });
    }
}));
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
});
// Start the server
const PORT = process.env.PORT || 3000;
mongoose_1.default
    .connect(MONGODB_URI)
    .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})
    .catch((error) => console.error("MongoDB connection error:", error));
exports.default = app;
