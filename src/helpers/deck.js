import { createArrayFromRange } from "../../lib/fn";
import { card } from "./card";

// Composition of the card function to add suit to the card.
const cardOfSuit = suit => (rank, rankIndex) => card(suit, rank, rankIndex);

// Create the whole deck with the given suits array and ranks array.
export const deck =
  (suits, ranks) => {
    const initialValue = [];
    return suits.reduce(
      (cards, suit) => {
        const completeSuit = ranks.map(cardOfSuit(suit));
        return cards.concat(completeSuit)
      },
      initialValue
    )
  };

// Shuffle any kind of array.
export const shuffle = array => {
  const newArray = [...array];

  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }

  return newArray;
};

// We have 52 cards in the whole deck, but we can have more than one deck
// To reduce the complexity, instead of creating copies of the same cards
// it generates indices which will be then used as the reference number to
// the actual card in the deck
export const generateIndices = (deck, deckCount) => {
  const totalCardAmount = deckCount * deck.length;
  return createArrayFromRange(totalCardAmount);
};

// Getting the mod of the index will give us the actual index of the card that is drawn
const getCardIndexInDeck = (deck, index) => index % deck.length;

// Draws a card from the deck. nextPick represents the next indice to be drawn.
// Then this indice becomes the actual indice with the help of getCardIndexInDeck
export const drawFromDeck = (deck, indices, nextPick) => (Object.assign({}, deck[getCardIndexInDeck(deck, indices[nextPick])]));
