import mongoose, { Schema, Document } from 'mongoose';

export interface IChat extends Document {
  members: mongoose.Types.ObjectId[];
  // Add other chat properties as needed
}

const chatSchema = new Schema({
  members: [{ type: Schema.Types.ObjectId, ref: 'Buyer' }],
  // Add other chat properties as needed
}, { timestamps: true });

export const Chat = mongoose.model<IChat>('Chat', chatSchema);
