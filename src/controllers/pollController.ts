import { Request, Response } from 'express';
import Poll from '../models/pollModel';
import { Server } from 'socket.io';

interface AuthRequest extends Request {
  userId?: string;
}

export const getPolls = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const polls = await Poll.find().sort({ createdAt: -1 });
    res.json(polls);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

export const createPoll = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { question, options } = req.body;
    const newPoll = new Poll({
      question,
      options: options.map((option: string) => ({ text: option, votes: 0 })),
      createdBy: req.userId,
    });
    const poll = await newPoll.save();
    res.json(poll);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

export const votePoll = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { optionIndex } = req.body;
    const voterId = req.userId;

    if (!voterId) {
      res.status(401).json({ msg: 'User not authenticated' });
      return;
    }

    const poll = await Poll.findById(id);
    if (!poll) {
      res.status(404).json({ msg: 'Poll not found' });
      return;
    }

    if (optionIndex < 0 || optionIndex >= poll.options.length) {
      res.status(400).json({ msg: 'Invalid option index' });
      return;
    }

    const currentOptionIndex = poll.options.findIndex(option => option.voters.includes(voterId));

    if (currentOptionIndex !== -1) {
      poll.options[currentOptionIndex].voters = poll.options[currentOptionIndex].voters.filter(id => id !== voterId);
      poll.options[currentOptionIndex].votes -= 1;
    }

    poll.options[optionIndex].voters.push(voterId);
    poll.options[optionIndex].votes += 1;

    await poll.save();

    res.json(poll);

    // Notify about the poll update in a separate event handler
    if (req.app.get('io')) {
      const io: Server = req.app.get('io');
      io.emit('pollUpdated', poll);
    }

  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

export const getUserPolls = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const polls = await Poll.find({ createdBy: req.userId }).sort({ createdAt: -1 });
    res.json(polls);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
