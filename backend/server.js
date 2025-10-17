// backend/server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const axios = require('axios');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// Stockage en mémoire des rooms (utiliser Redis en production)
const rooms = new Map();

// Générer un code de room unique
function generateRoomCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// API REST pour créer une room
app.post('/api/rooms/create', (req, res) => {
  const { playerName } = req.body;
  const code = generateRoomCode();
  
  const room = {
    code,
    host: playerName,
    players: [],
    startPage: '',
    targetPage: '',
    started: false,
    createdAt: Date.now()
  };
  
  rooms.set(code, room);
  res.json({ success: true, code, room });
});

// API pour vérifier si une room existe
app.get('/api/rooms/:code', (req, res) => {
  const code = req.params.code.toUpperCase();
  const room = rooms.get(code);
  
  if (room) {
    res.json({ success: true, room });
  } else {
    res.status(404).json({ success: false, message: 'Room not found' });
  }
});

// API pour récupérer les liens Wikipedia
app.get('/api/wikipedia/links/:page', async (req, res) => {
  try {
    const page = decodeURIComponent(req.params.page);
    const url = `https://fr.wikipedia.org/w/api.php?action=parse&page=${encodeURIComponent(page)}&format=json&origin=*&prop=text&section=0`;
    
    const response = await axios.get(url);
    
    if (response.data.parse) {
      res.json({ success: true, data: response.data.parse });
    } else {
      res.status(404).json({ success: false, message: 'Page not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Socket.IO pour le temps réel
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Rejoindre une room
  socket.on('join-room', ({ roomCode, playerName }) => {
    const code = roomCode.toUpperCase();
    const room = rooms.get(code);
    
    if (room) {
      const player = {
        id: socket.id,
        name: playerName,
        clicks: 0,
        currentPage: '',
        finished: false,
        finishTime: null
      };
      
      room.players.push(player);
      socket.join(code);
      
      // Notifier tous les joueurs de la room
      io.to(code).emit('room-updated', room);
      socket.emit('join-success', { room });
      
      console.log(`${playerName} joined room ${code}`);
    } else {
      socket.emit('join-error', { message: 'Room not found' });
    }
  });

  // Démarrer la partie
  socket.on('start-game', ({ roomCode, startPage, targetPage }) => {
    const code = roomCode.toUpperCase();
    const room = rooms.get(code);
    
    if (room && room.host === room.players.find(p => p.id === socket.id)?.name) {
      room.startPage = startPage;
      room.targetPage = targetPage;
      room.started = true;
      room.startTime = Date.now();
      
      io.to(code).emit('game-started', { 
        startPage, 
        targetPage,
        startTime: room.startTime
      });
      
      console.log(`Game started in room ${code}`);
    }
  });

  // Clic sur un lien
  socket.on('click-link', ({ roomCode, page, clicks }) => {
    const code = roomCode.toUpperCase();
    const room = rooms.get(code);
    
    if (room) {
      const player = room.players.find(p => p.id === socket.id);
      if (player) {
        player.clicks = clicks;
        player.currentPage = page;
        
        // Notifier tous les joueurs
        io.to(code).emit('player-progress', {
          playerId: socket.id,
          playerName: player.name,
          clicks,
          currentPage: page
        });
      }
    }
  });

  // Un joueur a terminé
  socket.on('finish-game', ({ roomCode, clicks, time }) => {
    const code = roomCode.toUpperCase();
    const room = rooms.get(code);
    
    if (room) {
      const player = room.players.find(p => p.id === socket.id);
      if (player && !player.finished) {
        player.finished = true;
        player.clicks = clicks;
        player.finishTime = time;
        
        // Notifier tous les joueurs
        io.to(code).emit('player-finished', {
          playerName: player.name,
          clicks,
          time
        });
        
        // Vérifier si c'est le premier à finir
        const finishedPlayers = room.players.filter(p => p.finished);
        if (finishedPlayers.length === 1) {
          io.to(code).emit('winner', {
            playerName: player.name,
            clicks,
            time
          });
        }
      }
    }
  });

  // Déconnexion
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    
    // Retirer le joueur de toutes les rooms
    rooms.forEach((room, code) => {
      const playerIndex = room.players.findIndex(p => p.id === socket.id);
      if (playerIndex !== -1) {
        const playerName = room.players[playerIndex].name;
        room.players.splice(playerIndex, 1);
        
        // Notifier les autres joueurs
        io.to(code).emit('player-left', { playerName });
        io.to(code).emit('room-updated', room);
        
        // Supprimer la room si elle est vide
        if (room.players.length === 0) {
          rooms.delete(code);
          console.log(`Room ${code} deleted (empty)`);
        }
      }
    });
  });
});

// 1 heure en millisecondes
const ONE_HOUR = 60 * 60 * 1000;

// Nettoyer les rooms inactives toutes les heures
setInterval(() => {
  const now = Date.now();

  rooms.forEach((room, code) => {
    if (now - room.createdAt > ONE_HOUR && room.players.length === 0) {
      rooms.delete(code);
      console.log(`Room ${code} deleted (inactive)`);
    }
  });
}, ONE_HOUR);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});