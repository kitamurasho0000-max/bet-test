import React, { useEffect } from 'react';
import type { BettingEvent, Player, PlayerBet } from '../types';
import { CoinIcon } from './icons';

interface ResultScreenProps {
  event: BettingEvent;
  bets: PlayerBet[];
  players: Player[];
  outcomeKey: string;
  outcomeLabel: string;
  onNextTurn: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ event, bets, players, outcomeKey, outcomeLabel, onNextTurn }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onNextTurn();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onNextTurn]);

  return (
    <div className="relative flex flex-col items-center text-center space-y-6 animate-fade-in pb-16">
      <div className="w-full max-w-2xl bg-slate-900/50 p-6 rounded-xl shadow-lg space-y-4 ring-1 ring-white/10">
        <p className="text-lg text-slate-300">The result for <strong className="text-white">"{event.question}"</strong> was:</p>
        <p className="text-4xl font-bold text-sky-400">{outcomeLabel}</p>
      </div>
      
      <div className="w-full max-w-2xl space-y-4">
        <h3 className="text-2xl font-bold text-slate-200">Round Results</h3>
        {players.map(player => {
            const bet = bets.find(b => b.playerId === player.id);
            const won = bet?.optionKey === outcomeKey;
            const betOnOption = bet && bet.optionKey !== 'none' ? event.options[bet.optionKey] : null;
            const payout = (won && bet) ? bet.amount * event.options[outcomeKey].odds : 0;
            const betAmount = bet?.amount || 0;

            return (
                <div key={player.id} className="bg-slate-800/70 p-4 rounded-lg shadow-md ring-1 ring-white/5">
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="text-xl font-bold text-white">{player.name}</h4>
                        <div className={`px-3 py-1 text-sm font-semibold rounded-full ${
                            betAmount === 0 ? 'bg-slate-600 text-slate-200' :
                            won ? 'bg-green-500/80 text-white' : 'bg-red-500/80 text-white'}`}>
                            {betAmount === 0 ? 'Skipped' : won ? 'WIN' : 'LOSS'}
                        </div>
                    </div>
                    {betAmount > 0 && betOnOption ? (
                        <div className="text-sm space-y-1 text-left">
                            <div className="flex justify-between">
                                <span className="text-slate-400">Bet:</span>
                                <span className="font-semibold text-slate-200">{betAmount} on "{betOnOption.label}"</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Payout:</span>
                                <span className={`font-semibold ${won ? 'text-green-400' : 'text-red-400'}`}>
                                    {won ? `+${Math.round(payout)}` : '+0'}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-slate-500 text-left">Did not place a bet.</p>
                    )}
                    <div className="border-t border-slate-700 my-2"></div>
                    <div className="flex justify-between items-center">
                         <span className="text-slate-300 font-semibold">New Balance:</span>
                        <div className="flex items-center space-x-2 font-bold text-amber-400 text-lg">
                            <CoinIcon className="w-5 h-5"/>
                            <span>{Math.round(player.balance)}</span>
                        </div>
                    </div>
                </div>
            )
        })}
      </div>
      
      <div className="absolute bottom-4 left-0 right-0 px-4 w-full max-w-2xl mx-auto">
        <p className="text-sm text-slate-400 mb-2">Returning to events...</p>
        <div className="w-full bg-slate-700 rounded-full h-1.5 overflow-hidden">
          <div 
            className="bg-sky-500 h-1.5 rounded-full"
            style={{ animation: 'progress-shrink 5s linear forwards' }}
          ></div>
        </div>
      </div>
      <style>{`
        @keyframes progress-shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

export default ResultScreen;