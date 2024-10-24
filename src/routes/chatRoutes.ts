import express from 'express';
import { getMessages } from '../controllers/chatController';
import { auth } from '../middlewares/auth';

const chatRouter = express.Router();

chatRouter.get('/messages', auth, getMessages);

export default chatRouter;