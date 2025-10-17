import React, { useState, useEffect, useRef } from 'react';
import { Users, Trophy, Clock, MousePointerClick, Copy, Check, Zap } from 'lucide-react';
import * as funcs from './functions.js';

const WikipediaRaceGame = () => {
  const [gameState, setGameState] = useState('menu'); // menu, lobby, playing, finished
  const [roomCode, setRoomCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [room, setRoom] = useState(null);
  const [currentPage, setCurrentPage] = useState('');
  const [targetPage, setTargetPage] = useState('');
  const [startPage, setStartPage] = useState('');
  const [links, setLinks] = useState([]);
  const [clicks, setClicks] = useState(0);
  const [time, setTime] = useState(0);
  const [players, setPlayers] = useState([]);
  const [winner, setWinner] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [pageHistory, setPageHistory] = useState([]);
  const timerRef = useRef(null);
  const [pageContent, setPageContent] = useState('');


  // Simuler un système de rooms (en vrai, utiliser WebSocket/Socket.IO)
  const mockRooms = useRef(new Map());

  useEffect(() => {
    if (gameState === 'playing') {
      timerRef.current = setInterval(() => {
        setTime(t => t + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState]);

  const generateRoomCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const createRoom = () => {
    if (!playerName.trim()) {
      alert('Entrez votre nom de joueur');
      return;
    }
    const code = generateRoomCode();
    const newRoom = {
      code,
      host: playerName,
      players: [{ name: playerName, clicks: 0, finished: false, currentPage: '' }],
      startPage: '',
      targetPage: '',
      started: false
    };
    mockRooms.current.set(code, newRoom);
    setRoomCode(code);
    setRoom(newRoom);
    setPlayers(newRoom.players);
    setGameState('lobby');
  };

  const joinRoom = () => {
    if (!playerName.trim() || !roomCode.trim()) {
      alert('Entrez votre nom et le code de la room');
      return;
    }
    const existingRoom = mockRooms.current.get(roomCode.toUpperCase());
    if (existingRoom) {
      const newPlayer = { name: playerName, clicks: 0, finished: false, currentPage: '' };
      existingRoom.players.push(newPlayer);
      setRoom(existingRoom);
      setPlayers([...existingRoom.players]);
      setGameState('lobby');
    } else {
      alert('Room introuvable');
    }
  };

  const startGame = async () => {
    setLoading(true);

    // Obtenir deux pages aléatoires : départ et cible
    const randomStart = await funcs.fetchRandomWikipediaPage();
    let randomTarget = await funcs.fetchRandomWikipediaPage();

    // S’assurer qu’elles ne sont pas identiques
    while (randomTarget === randomStart) {
      randomTarget = await funcs.fetchRandomWikipediaPage();
    }

    // Mettre à jour la room
    room.startPage = randomStart;
    room.targetPage = randomTarget;
    room.started = true;

    setStartPage(randomStart);
    setTargetPage(randomTarget);
    setGameState('playing');
    setTime(0);
    setClicks(0);
    setPageHistory([]);

    await funcs.fetchWikipediaLinks(randomStart);
    setLoading(false);
  };


  const clickLink = async (linkTitle) => {
    const newClicks = clicks + 1;
    setClicks(newClicks);

    // Mettre à jour le joueur actuel
    const updatedPlayers = players.map(p =>
      p.name === playerName
        ? { ...p, clicks: newClicks, currentPage: linkTitle }
        : p
    );
    setPlayers(updatedPlayers);

    // Vérifier si c'est la page cible
    if (linkTitle.toLowerCase() === targetPage.toLowerCase()) {
      const updatedPlayersWithWin = updatedPlayers.map(p =>
        p.name === playerName
          ? { ...p, finished: true, time }
          : p
      );
      setPlayers(updatedPlayersWithWin);
      setWinner({ name: playerName, clicks: newClicks, time });
      setGameState('finished');
      return;
    }

    await funcs.fetchWikipediaLinks(linkTitle);
  };

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const goBack = () => {
    if (pageHistory.length > 1) {
      const newHistory = [...pageHistory];
      newHistory.pop(); // Enlever la page actuelle
      const previousPage = newHistory[newHistory.length - 1];
      setPageHistory(newHistory);
      funcs.fetchWikipediaLinks(previousPage);
    }
  };

  if (gameState === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 max-w-md w-full border border-white/20 shadow-2xl">
          <div className="text-center mb-8">
            <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-white mb-2">Wikipedia Race</h1>
            <p className="text-blue-200">Trouvez la page cible le plus rapidement possible !</p>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Votre nom"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <button
              onClick={createRoom}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-lg"
            >
              Créer une partie
            </button>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Code de la room"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                onClick={joinRoom}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg"
              >
                Rejoindre
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'lobby') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Lobby</h2>
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="text-blue-200">Code de la room:</span>
                <span className="text-2xl font-mono font-bold text-yellow-400">{roomCode}</span>
                <button
                  onClick={copyRoomCode}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  {copiedCode ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5 text-white" />}
                </button>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Users className="w-6 h-6" />
                Joueurs ({players.length})
              </h3>
              <div className="space-y-2">
                {players.map((player, idx) => (
                  <div key={idx} className="bg-white/5 rounded-lg p-3 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                    <span className="text-white font-medium">{player.name}</span>
                    {player.name === room?.host && (
                      <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded">HOST</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {playerName === room?.host && (
              <div className="space-y-4">
                <button
                  onClick={startGame}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-lg font-bold text-lg hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                >
                  <Zap className="w-6 h-6" />
                  Lancer la partie
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'playing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-2 text-white">
                <Clock className="w-5 h-5 text-blue-400" />
                <span className="text-2xl font-mono font-bold">{formatTime(time)}</span>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-2 text-white">
                <MousePointerClick className="w-5 h-5 text-green-400" />
                <span className="text-2xl font-mono font-bold">{clicks} clics</span>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-2 text-white">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <span className="text-sm">Cible: <span className="font-bold">{targetPage}</span></span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Classement
                </h3>
                <div className="space-y-2">
                  {players.sort((a, b) => b.clicks - a.clicks).map((player, idx) => (
                    <div key={idx} className="bg-white/5 rounded-lg p-2">
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-medium ${player.name === playerName ? 'text-yellow-400' : 'text-white'}`}>
                          {player.name}
                        </span>
                        <span className="text-xs text-blue-300">{player.clicks} clics</span>
                      </div>
                      {player.finished && (
                        <span className="text-xs text-green-400">✓ Terminé!</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
                <h3 className="text-lg font-bold text-white mb-3">Parcours</h3>
                <div className="space-y-1 max-h-64 overflow-y-auto">
                  {pageHistory.map((page, idx) => (
                    <div key={idx} className="text-xs text-blue-200 truncate">
                      {idx + 1}. {page}
                    </div>
                  ))}
                </div>
                {pageHistory.length > 1 && (
                  <button
                    onClick={goBack}
                    className="mt-3 w-full bg-white/10 hover:bg-white/20 text-white py-2 rounded-lg text-sm transition-colors"
                  >
                    ← Retour
                  </button>
                )}
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-white mb-1">{currentPage}</h2>
                  <p className="text-sm text-blue-300">Cliquez sur un lien pour continuer</p>
                </div>

                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-400 border-t-transparent mx-auto"></div>
                    <p className="text-white mt-4">Chargement...</p>
                  </div>
                ) : (
                  <div
                    className="prose prose-invert max-w-none text-white overflow-y-auto max-h-[70vh]"
                    dangerouslySetInnerHTML={{__html: pageContent}}
                  ></div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'finished') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-900 via-orange-900 to-red-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 max-w-md w-full border border-white/20 shadow-2xl text-center">
          <Trophy className="w-24 h-24 text-yellow-400 mx-auto mb-6 animate-bounce" />
          <h1 className="text-4xl font-bold text-white mb-4">Victoire !</h1>
          <div className="space-y-2 mb-8">
            <p className="text-2xl text-white">
              <span className="font-bold text-yellow-400">{winner.name}</span> a gagné !
            </p>
            <p className="text-blue-200">Temps: {formatTime(winner.time)}</p>
            <p className="text-blue-200">Clics: {winner.clicks}</p>
          </div>
          <button
            onClick={() => {
              setGameState('menu');
              setRoomCode('');
              setRoom(null);
              setCurrentPage('');
              setClicks(0);
              setTime(0);
              setPageHistory([]);
            }}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all"
          >
            Retour au menu
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default WikipediaRaceGame;