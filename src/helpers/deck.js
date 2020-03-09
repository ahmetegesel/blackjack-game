import { createArrayFromRange } from "../../lib/fn";
import { card } from "./card";

const cardOfSuit = suit => (rank, rankIndex) => card(suit, rank, rankIndex);
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
