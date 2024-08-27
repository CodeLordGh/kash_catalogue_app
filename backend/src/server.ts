import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import * as admin from "firebase-admin";

// Import routes
import sellerRoutes, { CustomRequest } from "./Routes/seller";
import productRoutes from "./Routes/products";
import buyerRoutes from "./Routes/buyer";
import { authenticateToken } from "./Utils/auth";

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Set up middleware
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

// Connect to MongoDB
const MONGODB_URI = `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@${process.env.MONGO_DB_CLUSTER}.hnf4m.mongodb.net/?retryWrites=true&w=majority&appName=VendEx`;

// Set up routes
app.use("/api", sellerRoutes);
app.use("/api", productRoutes);
app.use("/api", buyerRoutes);

// Chat routes using Firebase
app.post("/chat", authenticateToken, async (req: CustomRequest, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const { senderModel } = user;
  try {
    const { receiver, message, chatId } = req.body;
    console.log(receiver, message, senderModel, chatId);

    if (!receiver || !message || !senderModel) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newMessage = {
      senderModel,
      // receiver,
      message,
      // senderModel,
      // receiverModel,
      timestamp: admin.database.ServerValue.TIMESTAMP,
    };

    const ref = admin.database().ref(`chats/${chatId}/messages`);
    const newMessageRef = await ref.push(newMessage);

    res.json({ id: newMessageRef.key, ...newMessage });
  } catch (error) {
    res.status(500).json({ error: "Error saving message" });
  }
});

app.get("/chat/", async (req: CustomRequest, res) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const userId = user.id;

  try {
    const ref = admin.database().ref("messages");
    const snapshot = await ref
      .orderByChild("sender")
      .equalTo(userId)
      .once("value");
    const messagesSent = snapshot.val() || {};

    const receivedSnapshot = await ref
      .orderByChild("receiver")
      .equalTo(userId)
      .once("value");
    const messagesReceived = receivedSnapshot.val() || {};

    // Combine sent and received messages
    const allMessages = { ...messagesSent, ...messagesReceived };

    res.json(allMessages);
  } catch (error) {
    res.status(500).json({ error: "Error fetching chats" });
  }
});

// Error handling middleware
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
  }
);

// Start the server
const PORT = process.env.PORT || 3000;
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => console.error("MongoDB connection error:", error));

export default app;
