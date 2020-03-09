import { Action } from "../action";
import { drawFromDeck, isAce } from "../helpers/card";

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
