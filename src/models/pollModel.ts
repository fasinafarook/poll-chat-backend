import mongoose, { Schema, Document } from 'mongoose';

interface Option {
  text: string;
  votes: number;
  voters: string[]; // Add this field to track who voted
}

interface PollDocument extends Document {
  question: string;
  options: Option[];
  createdBy: string;
  createdAt: Date;
}

const OptionSchema = new Schema<Option>({
  text: { type: String, required: true },
  votes: { type: Number, default: 0 },
  voters: { type: [String], default: [] }, // Define the voters field
});

const PollSchema = new Schema<PollDocument>({
  question: { type: String, required: true },
  options: { type: [OptionSchema], required: true },
  createdBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Poll = mongoose.model<PollDocument>('Poll', PollSchema);
export default Poll;
