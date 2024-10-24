"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMessages = void 0;
const chatModel_1 = __importDefault(require("../models/chatModel"));
const getMessages = async (req, res) => {
    try {
        const messages = await chatModel_1.default.find({});
        res.json(messages);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching messages' });
    }
};
exports.getMessages = getMessages;
