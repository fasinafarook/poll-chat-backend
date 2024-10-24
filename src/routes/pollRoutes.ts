import express from 'express';
import { getPolls, createPoll, votePoll, getUserPolls } from '../controllers/pollController';
import { auth } from '../middlewares/auth';

const pollRouter = express.Router();

pollRouter.get('/', auth, getPolls);
pollRouter.post('/', auth, createPoll);
pollRouter.post('/:id/vote', auth, votePoll);
pollRouter.get('/user',auth, getUserPolls); // Add this line


export default pollRouter;