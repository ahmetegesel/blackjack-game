import { Action } from "../action";
import { shuffle } from "../helpers/deck";

export class ShuffleDeckAction extends Action {
  dispatch(action, payload, state, context) {
    const _deckIndices = shuffle(state.deckIndices);

    return { ...state, deckIndices: _deckIndices, pick: 0 }
  }
}
