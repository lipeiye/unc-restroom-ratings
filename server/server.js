const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const cron = require('node-cron');
require('dotenv').config();

const connectDB = require('./config/db');
const memoryStore = require('./data/memoryStore');
const restroomRoutes = require('./routes/restrooms');
const reviewRoutes = require('./routes/reviews');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

connectDB();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use('/api/restrooms', restroomRoutes);
app.use('/api/reviews', reviewRoutes);

// Daily reset at 6:00 AM
function scheduleReset() {
  const now = new Date();
  const resetTime = new Date();
  resetTime.setHours(6, 0, 0, 0);
  if (resetTime <= now) resetTime.setDate(resetTime.getDate() + 1);

  const msUntilReset = resetTime - now;
  console.log(`⏰ Next reset scheduled at ${resetTime.toLocaleString()} (${Math.round(msUntilReset / 60000)} minutes)`);

  setTimeout(() => {
    console.log('🔄 Running daily reset...');
    memoryStore.resetAllData();
    io.emit('dataReset', { resetAt: new Date().toISOString() });
    console.log('✅ Daily reset complete');
    scheduleReset();
  }, msUntilReset);
}

scheduleReset();

// Also support cron for robustness
cron.schedule('0 6 * * *', () => {
  console.log('🔄 Cron triggered daily reset');
  memoryStore.resetAllData();
  io.emit('dataReset', { resetAt: new Date().toISOString() });
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.on('disconnect', () => console.log('Client disconnected:', socket.id));
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('public'));
  app.get('*', (req, res) => res.sendFile('index.html', { root: 'public' }));
}

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📅 Daily reset at 6:00 AM`);
});
