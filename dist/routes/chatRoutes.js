"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chatController_1 = require("../controllers/chatController");
const auth_1 = require("../middlewares/auth");
const chatRouter = express_1.default.Router();
chatRouter.get('/messages', auth_1.auth, chatController_1.getMessages);
exports.default = chatRouter;
