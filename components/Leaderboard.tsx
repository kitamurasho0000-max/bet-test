import React from 'react';
import type { Score } from '../types';
import { TrophyIcon } from './icons';

interface LeaderboardProps {
  scores: Score[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ scores }) => {
  const rankColors = [
    'text-amber-400', // 1st
    'text-slate-300', // 2nd
    'text-orange-400' // 3rd
  ];

  return (
    <div className="bg-slate-900/70 p-4 rounded-lg shadow-lg h-full ring-1 ring-amber-500/30">
      <h3 className="text-xl font-bold text-amber-400 flex items-center mb-4">
        <TrophyIcon className="w-6 h-6 mr-2" />
        Leaderboard
      </h3>
      <ol className="space-y-3">
        {scores.map((score, index) => (
          <li key={index} className="flex items-center justify-between text-sm p-2 rounded-md bg-slate-800/50">
            <div className="flex items-center truncate">
              <span className={`font-bold w-6 text-center ${rankColors[index] || 'text-slate-400'}`}>{index + 1}</span>
              <span className="ml-2 text-slate-200 truncate">{score.name}</span>
            </div>
            <span className="font-semibold text-slate-300 flex-shrink-0">{score.score}</span>
          </li>
        ))}
        {scores.length === 0 && <p className="text-slate-500 text-center text-sm py-4">No scores yet. Be the first!</p>}
      </ol>
    </div>
  );
};

export default Leaderboard;
