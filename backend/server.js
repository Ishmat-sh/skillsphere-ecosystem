const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { Server } = require('socket.io');
require('dotenv').config();

const Message = require('./models/Message');
const Escrow = require('./models/Escrow');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
});

app.set('io', io);

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/gigs', require('./routes/gigRoutes'));
app.use('/api/proposals', require('./routes/proposalRoutes'));
app.use('/api/escrow', require('./routes/escrowRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));

app.get('/', (req, res) => {
  res.send('SkillSphere Backend API running...');
});

io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error('Unauthorized'));
  try {
    socket.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    next(new Error('Unauthorized'));
  }
});

io.on('connection', (socket) => {
  socket.join(`user:${socket.user.id}`);

  socket.on('chat:join', (roomId) => {
    socket.join(`chat:${roomId}`);
  });

  socket.on('chat:send', async ({ roomId, content }) => {
    try {
      const escrow = await Escrow.findById(roomId);
      if (!escrow) return;

      const allowed =
        escrow.client.toString() === socket.user.id ||
        escrow.freelancer.toString() === socket.user.id;
      if (!allowed) return;

      const message = await Message.create({
        roomId,
        sender: socket.user.id,
        content,
      });

      const populated = await Message.findById(message._id).populate('sender', 'name role');

      io.to(`chat:${roomId}`).emit('chat:message', populated);
    } catch (err) {
      socket.emit('chat:error', { message: err.message });
    }
  });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('Database connection error:', err));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
