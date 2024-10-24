"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const pollRoutes_1 = __importDefault(require("./routes/pollRoutes"));
const chatModel_1 = __importDefault(require("./models/chatModel"));
const chatRoutes_1 = __importDefault(require("./routes/chatRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
});
app.use((0, cors_1.default)());
app.use(express_1.default.json());
mongoose_1.default.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));
// Handle socket connection
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    // Handle real-time vote update
    socket.on('vote', (pollId) => {
        console.log('Vote received for poll:', pollId);
        io.emit('pollUpdated', pollId);
    });
    socket.on('sendMessage', async ({ username, message }) => {
        try {
            const chatMessage = new chatModel_1.default({ username, message });
            await chatMessage.save(); // Store message in the database
            // Emit the message to all connected clients
            io.emit('receiveMessage', {
                username,
                message,
                timestamp: new Date(),
            });
        }
        catch (error) {
            console.error('Error saving message:', error);
        }
    });
    socket.on('typing', (username) => {
        socket.broadcast.emit('userTyping', username);
    });
    socket.on('stopTyping', () => {
        socket.broadcast.emit('userStopTyping');
    });
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});
// API routes
app.use('/api/user', userRoutes_1.default);
app.use('/api/polls', pollRoutes_1.default);
app.use('/api/chat', chatRoutes_1.default);
server.listen(5000, () => {
    console.log('Server is running on port 5000');
});
