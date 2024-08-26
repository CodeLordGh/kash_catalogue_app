import { IMessage, Message } from "../Models/models";

export const saveMessage = async (sender: string, receiver: string,senderModel: string, receiverModel: string, message: string): Promise<IMessage> => {
  const newMessage = new Message({ sender, receiver, message, senderModel, receiverModel });
  return await newMessage.save();
};

export const getMessagesBetweenUsers = async (user1: string, user2: string): Promise<IMessage[]> => {
  return await Message.find({
    $or: [
      { sender: user1, receiver: user2 },
      { sender: user2, receiver: user1 }
    ]
  }).sort({ timestamp: 1 });
};
