
import React, { useState, useCallback, useEffect, useRef } from 'react';
import type { BettingEvent, Bet, Score, Player, PlayerBet } from './types';
import { INITIAL_COINS, INITIAL_EVENTS, INITIAL_HIGH_SCORES } from './constants';
import HomeScreen from './components/HomeScreen';
import BettingScreen from './components/BettingScreen';
import ResultScreen from './components/ResultScreen';
import SetupScreen from './components/LoginScreen';
import VideoPlayer from './components/VideoPlayer';

type View = 'HOME' | 'BETTING' | 'RESULT';

interface Outcome {
    outcomeKey: string;
    outcomeLabel: string;
}

function App() {
  const [view, setView] = useState<View>('HOME');
  const [events, setEvents] = useState<BettingEvent[]>(INITIAL_EVENTS);
  const [highScores, setHighScores] = useState<Score[]>(INITIAL_HIGH_SCORES);
  
  const [selectedEvent, setSelectedEvent] = useState<BettingEvent | null>(null);
  const [lastOutcome, setLastOutcome] = useState<Outcome | null>(null);

  const [players, setPlayers] = useState<Player[]>([]);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  
  const [bettingPlayerIndex, setBettingPlayerIndex] = useState<number>(0);
  const [roundBets, setRoundBets] = useState<PlayerBet[]>([]);
  const [round, setRound] = useState<number>(0);
  
  const eventsRef = useRef(events);
  useEffect(() => {
    eventsRef.current = events;
  }, [events]);

  useEffect(() => {
    const savedHighScores = localStorage.getItem('sportsBetHighScores');
    if (savedHighScores) {
        setHighScores(JSON.parse(savedHighScores));
    }
  }, []);

  const updateHighScores = useCallback((currentPlayers: Player[]) => {
      setHighScores(prevScores => {
          const newScores = [...prevScores];
          currentPlayers.forEach(p => {
              const existingIndex = newScores.findIndex(s => s.name === p.name);
              if (existingIndex > -1) {
                  if (p.balance > newScores[existingIndex].score) {
                      newScores[existingIndex].score = Math.round(p.balance);
                  }
              } else {
                  newScores.push({ name: p.name, score: Math.round(p.balance) });
              }
          });
          
          newScores.sort((a, b) => b.score - a.score);
          
          const uniqueScores = newScores.filter((score, index, self) =>
              index === self.findIndex((s) => (s.name === score.name))
          );

          const topScores = uniqueScores.slice(0, 6);
          localStorage.setItem('sportsBetHighScores', JSON.stringify(topScores));
          return topScores;
      });
  }, []);

  const handleGameStart = (playerNames: string[]) => {
      const newPlayers = playerNames.map((name, index) => ({
          id: index,
          name,
          balance: INITIAL_COINS,
      }));
      setPlayers(newPlayers);
      setGameStarted(true);
      setRound(0); // Start at round 0 (home screen)
      setView('HOME');
      
      // Timer for the first question (10 seconds)
      setTimeout(() => {
          const firstEvent = eventsRef.current[0];
          setSelectedEvent(firstEvent);
          setBettingPlayerIndex(0);
          setRoundBets([]);
          setRound(1);
          setView('BETTING');
      }, 10000);

      // Timer for the second question (50 seconds)
      setTimeout(() => {
          const secondEvent = eventsRef.current[1];
          setSelectedEvent(secondEvent);
          setBettingPlayerIndex(0);
          setRoundBets([]);
          setRound(2);
          setView('BETTING');
      }, 50000);
  };

  const resolveOutcome = useCallback((finalBets: PlayerBet[], event: BettingEvent) => {
      const optionKeys = Object.keys(event.options);
      const outcomeKey = optionKeys[Math.floor(Math.random() * optionKeys.length)];
      const outcomeLabel = event.options[outcomeKey].label;

      const updatedPlayers = players.map(player => {
          const bet = finalBets.find(b => b.playerId === player.id);
          if (!bet || bet.amount === 0 || bet.optionKey === 'none') {
            return player;
          }

          let newBalance = player.balance;
          if (bet.optionKey === outcomeKey) {
              const winnings = bet.amount * (event.options[outcomeKey].odds - 1);
              newBalance = player.balance + winnings;
          } else {
              newBalance = player.balance - bet.amount;
          }
          return { ...player, balance: newBalance };
      });

      setPlayers(updatedPlayers);
      setLastOutcome({ outcomeKey, outcomeLabel });
      setView('RESULT');
  }, [players]);

  const handlePlaceBet = useCallback((bet: Bet) => {
      const newBet: PlayerBet = { ...bet, playerId: bettingPlayerIndex };
      const newRoundBets = [...roundBets, newBet];
      setRoundBets(newRoundBets);
      
      const nextPlayerIndex = bettingPlayerIndex + 1;

      if (nextPlayerIndex < players.length) {
          setBettingPlayerIndex(nextPlayerIndex);
      } else {
          if (selectedEvent) {
            resolveOutcome(newRoundBets, selectedEvent);
          }
      }
  }, [bettingPlayerIndex, players.length, roundBets, selectedEvent, resolveOutcome]);

  const handleNextTurn = useCallback(async () => {
    updateHighScores(players);
    setView('HOME');
    // After the first round, the app will wait for the second question timer.
    // After the second round, the game effectively ends, but stays on the home screen.
  }, [players, updateHighScores]);

  const renderContent = () => {
    if (!gameStarted) {
      return <SetupScreen onGameStart={handleGameStart} />;
    }
    
    const currentPlayer = players[bettingPlayerIndex] || players[0];
    
    switch(view) {
      case 'HOME':
        return <HomeScreen 
          currentPlayer={players[0]} 
          highScores={highScores}
        />;
      case 'BETTING':
        if (!selectedEvent || !currentPlayer) return null;
        return <BettingScreen 
          event={selectedEvent} 
          currentPlayer={currentPlayer} 
          onPlaceBet={handlePlaceBet} 
        />;
      case 'RESULT':
        if (!selectedEvent || !lastOutcome) return null;
        return <ResultScreen 
          event={selectedEvent} 
          bets={roundBets} 
          players={players}
          outcomeKey={lastOutcome.outcomeKey}
          outcomeLabel={lastOutcome.outcomeLabel}
          onNextTurn={handleNextTurn}
        />;
      default:
        return <HomeScreen currentPlayer={players[0]} highScores={highScores} />;
    }
  }

  return (
    <div className={`container mx-auto p-4 max-w-4xl min-h-screen ${!gameStarted ? 'flex flex-col justify-center' : ''}`}>
      {gameStarted && (
        <header className="w-full">
          <VideoPlayer videoId="nHBuC8cWD_w" />
        </header>
      )}
      
      <main className={`w-full ${gameStarted ? 'mt-8' : ''}`}>
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
