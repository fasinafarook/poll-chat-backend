"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserPolls = exports.votePoll = exports.createPoll = exports.getPolls = void 0;
const pollModel_1 = __importDefault(require("../models/pollModel"));
const getPolls = async (req, res) => {
    try {
        const polls = await pollModel_1.default.find().sort({ createdAt: -1 });
        res.json(polls);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};
exports.getPolls = getPolls;
const createPoll = async (req, res) => {
    try {
        const { question, options } = req.body;
        const newPoll = new pollModel_1.default({
            question,
            options: options.map((option) => ({ text: option, votes: 0 })),
            createdBy: req.userId,
        });
        const poll = await newPoll.save();
        res.json(poll);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};
exports.createPoll = createPoll;
const votePoll = async (req, res) => {
    try {
        const { id } = req.params;
        const { optionIndex } = req.body;
        const voterId = req.userId;
        if (!voterId) {
            res.status(401).json({ msg: 'User not authenticated' });
            return;
        }
        const poll = await pollModel_1.default.findById(id);
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
            const io = req.app.get('io');
            io.emit('pollUpdated', poll);
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};
exports.votePoll = votePoll;
const getUserPolls = async (req, res) => {
    try {
        const polls = await pollModel_1.default.find({ createdBy: req.userId }).sort({ createdAt: -1 });
        res.json(polls);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};
exports.getUserPolls = getUserPolls;
