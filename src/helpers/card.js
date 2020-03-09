export const suits = Object.freeze(['club', 'diamond', 'heart', 'spade']);

const A = 'A';
const J = 'J';
const Q = 'Q';
const K = 'K';

export const ranks = Object.freeze([A, '2', '3', '4', '5', '6', '7', '8', '9', '10', J, Q, K]);

export const isAce = card => card.rank === A;

export const isFace = card => Array.from([J, Q, K]).indexOf(card.rank) > 0;

export const isBlackJack = (cards) => {
  const _cards = cards.slice(0, 2);
  return _cards.some(card => isAce(card)) && _cards.some(card => isFace(card));
}

export const card = (suit, rank, rankIndex) => ({ suit, rank, value: rank === A ? 11 : Math.min(10, rankIndex + 1) });

