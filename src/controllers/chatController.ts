import { Request, Response } from 'express';
import ChatMessage from '../models/chatModel';

export const getMessages = async (req: Request, res: Response) => {
    try {
        const messages = await ChatMessage.find({});
        res.json(messages);
      } catch (error) {
        res.status(500).json({ message: 'Error fetching messages' });
      }
};