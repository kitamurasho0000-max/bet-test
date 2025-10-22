import type { BettingEvent, Score } from './types';

export const INITIAL_COINS = 1000;

export const INITIAL_EVENTS: BettingEvent[] = [
  {
    id: 'pk-1',
    question: 'PKは成功しますか？',
    category: 'pk',
    options: {
      'yes': { label: 'Yes', odds: 1.8 },
      'no': { label: 'No', odds: 2.2 },
    },
    deadlineSeconds: 20,
  },
  {
    id: 'fk-1',
    question: 'FKは成功しますか？',
    category: 'generic', // Assuming 'fk' is not a specific video category
    options: {
      'yes': { label: 'Yes', odds: 2.8 },
      'no': { label: 'No', odds: 1.5 },
    },
    deadlineSeconds: 20,
  },
];

export const INITIAL_HIGH_SCORES: Score[] = [
    { name: 'Player 1', score: 1500 },
    { name: 'Player 2', score: 1250 },
    { name: 'Player 3', score: 1100 },
];
