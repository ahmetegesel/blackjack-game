import { StoreNode } from "../storeNode";
import { ShuffleDeckAction } from "./shuffleDeckAction";

export class Game extends StoreNode {
  constructor(initialState) {
    super(initialState);

    this.registerAction('shuffle', new ShuffleDeckAction());
    this.registerAction('incrementPick', (action, payload, state) => ({ ...state, pick: state.pick + payload }));
    this.registerAction('updatePick', (action, payload, state) => ({ ...state, pick: payload }));
    this.registerGetter('playerCount', (state) => state.options.players);
    this.registerGetter('pick', (state) => state.pick);
    this.registerGetter('deck', (state) => state.deck);
    this.registerGetter('deckIndices', (state) => state.deckIndices);
    this.registerGetter('isGameOver', (state) => state.isGameOver);
  }

}
