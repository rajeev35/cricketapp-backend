require('dotenv').config();
const connectDB = require('./config/db');
const express = require('express');
const cors = require('cors');
const http = require('http');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');
const authRoutes = require('./routes/auth');
const testRoutes = require('./routes/test');
const matchRoutes = require('./routes/match');
const inviteRoutes = require('./routes/invite');
const tossRoutes = require('./routes/toss');
const scoreRoutes = require('./routes/score');
const socketIo = require('socket.io');
connectDB();
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*', // in production, lock this down
  },
});

// --- Middleware ---
app.use(cors());
app.use(express.json());


// --- Swagger UI ---
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// --- Route Check ---
app.use('/auth', authRoutes);
app.use('/test', testRoutes);
app.use('/matches', matchRoutes);
app.use(inviteRoutes);
app.use(tossRoutes);
app.use(scoreRoutes);
// --- Health Check ---
app.get('/', (req, res) => {
  res.send('🦆 Cricket App Backend is running!');
});

// --- Socket.IO setup ---
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('joinMatch', ({ matchId }) => {
    socket.join(matchId);
    console.log(`${socket.id} joined match room ${matchId}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// --- Start Server ---
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
