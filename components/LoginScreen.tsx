
import React, { useState } from 'react';

interface SetupScreenProps {
  onGameStart: (playerNames: string[]) => void;
}

const SetupScreen: React.FC<SetupScreenProps> = ({ onGameStart }) => {
  const [playerName, setPlayerName] = useState<string>('Player 1');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim()) {
      onGameStart([playerName.trim()]);
    }
  };

  const isNameEntered = playerName.trim() !== '';

  return (
    <div className="flex flex-col items-center py-12 animate-fade-in">
      <div className="w-full max-w-md bg-slate-900/50 p-8 rounded-xl shadow-lg ring-1 ring-white/10">
        <h2 className="text-3xl font-bold text-center text-slate-100 mb-6">Enter Your Name</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
              <label htmlFor="player-name" className="sr-only">Your Name</label>
              <input
                id="player-name"
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Your Name"
                className="w-full bg-slate-800 border-2 border-slate-700 rounded-lg p-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition text-lg text-center"
                required
                autoFocus
              />
          </div>
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg disabled:bg-slate-600 disabled:cursor-not-allowed"
              disabled={!isNameEntered}
            >
              Start Game
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SetupScreen;
