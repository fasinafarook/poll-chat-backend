import mongoose, { Document, Schema } from 'mongoose';

// Define an interface for the chat message document
interface IChatMessage extends Document {
  username: string;
  message: string;
  timestamp: Date;
}

// Create the schema for the chat message
const ChatMessageSchema: Schema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now, // Automatically set the timestamp to the current date/time
    },
  },
  {
    timestamps: true, // Automatically manage `createdAt` and `updatedAt` timestamps
  }
);

// Create the model
const ChatMessage = mongoose.model<IChatMessage>('ChatMessage', ChatMessageSchema);

export default ChatMessage;
