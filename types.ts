export interface BettingEvent {
  id: string;
  question: string;
  options: {
    [key: string]: {
      label: string;
      odds: number;
    };
  };
  deadlineSeconds: number;
  category: string;
}

export interface Bet {
  eventId: string;
  optionKey: string;
  amount: number;
}

export interface PlayerBet extends Bet {
  playerId: number;
}

export interface Score {
    name: string;
    score: number;
}

export interface Result {
  won: boolean;
  payout: number;
  outcomeKey: string;
  outcomeLabel: string;
}

export interface Player {
  id: number;
  name: string;
  balance: number;
}