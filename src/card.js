// Create an array of card suit names
import { pipe, createArrayFromRange, after, map } from "../lib/fn";

export const suits = Object.freeze(['club', 'diamond', 'heart', 'spade']);

// Create an array of card ranks.
// When is JavaScript going to support array comprehensions? :)
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

// Create a new card data structure from a suit name and a rank.
// The value of cards over rank===13 is 10.
export const card = (suit, rank, rankIndex) => ({ suit, rank, value: rank === A ? 11 : Math.min(10, rankIndex + 1) });

const cardOfSuit = suit => (rank, rankIndex) => card(suit, rank, rankIndex);

// Create a deck from an array of suit names and an array of ranks.
// A deck is the cross-product of suits x ranks.
export const deck =
  (suits, ranks) => {
    const initialValue = [];
    return suits.reduce(
      (cards, suit) => {
        const completeSuit = ranks.map(cardOfSuit(suit))
        return cards.concat(completeSuit)
      },
      initialValue
    )
  };


export const shuffle = array => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }

  return newArray;
}

export const generateIndices = (deck, deckCount) => {
  const totalCardAmount = deckCount * deck.length;
  return createArrayFromRange(totalCardAmount);
}

const getCardIndexInDeck = (deck, index) => index % deck.length;

export const drawFromDeck = (deck, indices, nextPick) => (Object.assign({}, deck[getCardIndexInDeck(deck, indices[nextPick])]));

export const drawNFromDeck = (n, deck, indices, nextPick) => {
  return createArrayFromRange(n).map((i) => drawFromDeck(deck, indices, nextPick + i));
};

// Given a deck, return a tuple of the first N cards and the rest of the deck.
export const hitN =
  (deck, indices, nextPick, n = 1) => {
    const pickedCards = createArrayFromRange(n).map(() => drawFromDeck(deck, indices, nextPick))
    const incrementedNextPick = nextPick + n;

    return { cards: pickedCards, deck, indices, nextPick: incrementedNextPick }
  }
