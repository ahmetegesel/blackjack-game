import { Action } from "../action";
import { isAce } from "../helpers/card";
import { drawFromDeck } from "../helpers/deck";

export class HitAction extends Action {
  dispatch(action, payload, state) {
    const { deck, deckIndices, pick } = payload;
    let aceCount = state.aceCount || 0;

    const drawnCard = drawFromDeck(deck, deckIndices, pick);
    const cards = [...state.cards, drawnCard];

    if (isAce(drawnCard))
      aceCount++;

    return { ...state, cards, aceCount };
  }
}
