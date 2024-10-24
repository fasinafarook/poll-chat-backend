import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/userRoutes';
import pollRouter from './routes/pollRoutes';
import ChatMessage from './models/chatModel';
import chatRouter from './routes/chatRoutes';



dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI as string)
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
      const chatMessage = new ChatMessage({ username, message });
      await chatMessage.save(); // Store message in the database

      // Emit the message to all connected clients
      io.emit('receiveMessage', {
        username,
        message,
        timestamp: new Date(),
      });
    } catch (error) {
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
app.use('/api/user', userRouter);
app.use('/api/polls', pollRouter);
app.use('/api/chat', chatRouter);


server.listen(5000, () => {
  console.log('Server is running on port 5000');
});