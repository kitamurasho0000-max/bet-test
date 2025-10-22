
import React from 'react';
import type { Score, Player } from '../types';
import Leaderboard from './Leaderboard';
import { CoinIcon } from './icons';

interface HomeScreenProps {
  currentPlayer: Player;
  highScores: Score[];
}

const HomeScreen: React.FC<HomeScreenProps> = ({ currentPlayer, highScores }) => {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-center text-slate-100">Home画面</h1>

      <div className="flex justify-between items-center bg-slate-900/70 p-4 rounded-lg shadow-lg ring-1 ring-sky-500/30 max-w-lg mx-auto">
        <div>
            <h2 className="text-lg font-semibold text-slate-300">Your Balance</h2>
            <p className="text-sm text-slate-500">Current Player: {currentPlayer.name}</p>
        </div>
        <div className="flex items-center space-x-2 text-2xl font-bold text-amber-400">
          <CoinIcon className="w-8 h-8"/>
          <span>{Math.round(currentPlayer.balance)}</span>
        </div>
      </div>
      
      <div className="max-w-lg mx-auto">
        <Leaderboard scores={highScores} />
      </div>
    </div>
  );
};

export default HomeScreen;
