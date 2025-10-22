import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { BettingEvent, Bet, Player } from '../types';
import { CoinIcon } from './icons';

interface BettingScreenProps {
  event: BettingEvent;
  currentPlayer: Player;
  onPlaceBet: (bet: Bet) => void;
}

const BettingScreen: React.FC<BettingScreenProps> = ({ event, currentPlayer, onPlaceBet }) => {
  const [betAmount, setBetAmount] = useState<string>('');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(event.deadlineSeconds);

  const intervalRef = useRef<number | null>(null);
  const confirmedBetRef = useRef<{ optionKey: string; amount: number } | null>(null);

  // Use a ref to track confirmation status to prevent useEffect from re-running on change.
  const isConfirmedRef = useRef(isConfirmed);
  useEffect(() => {
    isConfirmedRef.current = isConfirmed;
  }, [isConfirmed]);

  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);
  
  // Make this function stable by removing the `isConfirmed` state dependency.
  const handleTimeEnd = useCallback(() => {
    stopTimer();
    // Use the ref to get the latest confirmation status.
    if (isConfirmedRef.current && confirmedBetRef.current) {
        onPlaceBet({
            eventId: event.id,
            ...confirmedBetRef.current
        });
    } else {
        // If not confirmed, it's a skip
        onPlaceBet({
            eventId: event.id,
            optionKey: 'none',
            amount: 0
        });
    }
  }, [onPlaceBet, event.id, stopTimer]);

  useEffect(() => {
    setBetAmount('');
    setSelectedOption(null);
    setIsConfirmed(false);
    confirmedBetRef.current = null;
    setError(null);
    setTimeLeft(event.deadlineSeconds);

    stopTimer();

    intervalRef.current = window.setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          handleTimeEnd();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => {
      stopTimer();
    };
  }, [currentPlayer, event, stopTimer, handleTimeEnd]);


  const handleConfirmBet = () => {
    const amount = parseFloat(betAmount);
    if (!selectedOption) {
        setError("Please select an option.");
        return;
    }
    if (isNaN(amount) || amount <= 0) {
        setError("Please enter a valid bet amount.");
        return;
    }
    if (amount > currentPlayer.balance) {
        setError("You don't have enough coins.");
        return;
    }
    
    setError(null);
    confirmedBetRef.current = { optionKey: selectedOption, amount: amount };
    setIsConfirmed(true);
  };
  
  const handleModifyBet = () => {
      setIsConfirmed(false);
  };
  
  const handleSkip = () => {
    stopTimer();
    onPlaceBet({
      eventId: event.id,
      optionKey: 'none',
      amount: 0
    });
  };
  
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = timeLeft > 0 ? circumference - (timeLeft / event.deadlineSeconds) * circumference : circumference;

  return (
    <div className="flex flex-col items-center space-y-4 animate-fade-in">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-100">{event.question}</h2>
        <p className="text-slate-400 mt-2 text-lg">
          It's <strong className="text-sky-400">{currentPlayer.name}'s</strong> turn to bet.
        </p>
      </div>

       <div className="relative flex items-center justify-center w-32 h-32 my-2">
        <svg className="absolute w-full h-full" viewBox="0 0 100 100">
            <circle
                className="text-slate-700"
                stroke="currentColor"
                strokeWidth="5"
                cx="50"
                cy="50"
                r={radius}
                fill="transparent"
            />
            <circle
                className="text-sky-400"
                stroke="currentColor"
                strokeWidth="5"
                cx="50"
                cy="50"
                r={radius}
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
                style={{ transition: 'stroke-dashoffset 1s linear' }}
            />
        </svg>
        <span className="text-4xl font-bold text-white z-10">{timeLeft}</span>
      </div>

      <div className="w-full max-w-md bg-slate-900/50 p-6 rounded-xl shadow-lg space-y-4 ring-1 ring-white/10">
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(event.options).map(([key, option]: [string, any]) => (
            <button
              key={key}
              onClick={() => !isConfirmed && setSelectedOption(key)}
              disabled={isConfirmed}
              className={`p-4 rounded-lg text-center transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${
                selectedOption === key 
                ? 'bg-sky-500 text-white ring-2 ring-sky-300 shadow-lg' 
                : 'bg-slate-800 hover:bg-slate-700'
              }`}
            >
              <span className="block text-xl font-bold">{option.label}</span>
              <span className="block text-sm text-slate-400">{option.odds.toFixed(2)}x</span>
            </button>
          ))}
        </div>
        
        <div className="relative">
          <input
            type="number"
            value={betAmount}
            onChange={(e) => setBetAmount(e.target.value)}
            placeholder={`Balance: ${Math.round(currentPlayer.balance)}`}
            disabled={isConfirmed}
            className="w-full bg-slate-800 border-2 border-slate-700 rounded-lg p-3 pr-16 text-white placeholder-slate-500 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition disabled:bg-slate-900"
            min="1"
            max={currentPlayer.balance}
          />
          <CoinIcon className="w-6 h-6 absolute right-4 top-1/2 -translate-y-1/2 text-amber-400" />
        </div>
        
        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

        {isConfirmed && confirmedBetRef.current && (
            <div className="text-center bg-slate-800 p-3 rounded-lg ring-1 ring-sky-500/30">
                <p className="text-slate-300">Your bet is set:</p>
                <p className="font-bold text-white text-lg">
                    {confirmedBetRef.current.amount} <span className="text-slate-400">on</span> "{event.options[confirmedBetRef.current.optionKey].label}"
                </p>
                <p className="text-xs text-slate-500 mt-1">You can modify your bet until the timer runs out.</p>
            </div>
        )}

        <div className="flex space-x-4">
          {!isConfirmed ? (
            <>
              <button
                onClick={handleSkip}
                className="w-full bg-slate-600 hover:bg-slate-500 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Skip Turn
              </button>
              <button
                onClick={handleConfirmBet}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Place Bet
              </button>
            </>
          ) : (
            <button
                onClick={handleModifyBet}
                className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
                Modify Bet
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default BettingScreen;