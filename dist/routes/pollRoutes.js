"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pollController_1 = require("../controllers/pollController");
const auth_1 = require("../middlewares/auth");
const pollRouter = express_1.default.Router();
pollRouter.get('/', auth_1.auth, pollController_1.getPolls);
pollRouter.post('/', auth_1.auth, pollController_1.createPoll);
pollRouter.post('/:id/vote', auth_1.auth, pollController_1.votePoll);
pollRouter.get('/user', auth_1.auth, pollController_1.getUserPolls); // Add this line
exports.default = pollRouter;
