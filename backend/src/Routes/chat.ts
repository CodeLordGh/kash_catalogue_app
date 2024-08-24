// routes/chat.ts
import { Router } from 'express';
import { getMessagesBetweenUsers, saveMessage } from '../Services/chatService';

const router = Router();

// Get chat history between two users
router.get('/chat/:user1/:user2', async (req, res) => {
  try {
    const { user1, user2 } = req.params;
    const messages = await getMessagesBetweenUsers(user1, user2);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching messages' });
  }
});

// Post a new message
router.post('/', async (req, res) => {
  let receiverModel = ""
  try {
    const { sender, receiver, message, senderModel } = req.body;

    if (senderModel == 'Seller') {
      receiverModel = 'Buyer'
    } else if (senderModel === "Buyer"){
      receiverModel = 'Seller'
    } 

    const savedMessage = await saveMessage(sender, receiver, senderModel, receiverModel, message);
    res.json(savedMessage);
  } catch (error) {
    res.status(500).json({ error: 'Error saving message' });
  }
});

export default router;
