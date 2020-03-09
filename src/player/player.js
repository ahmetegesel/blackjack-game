import { StoreNode } from "../storeNode";
import { HitAction } from "./hitAction";
import { score } from "../helpers/player";
import { RebetAction } from "./rebetAction";

export class Player extends StoreNode {
  constructor(initialState) {
    super(initialState);

    this.registerAction('hit', new HitAction());
    this.registerAction('rebet', new RebetAction());
    this.registerGetter('cards', (state) => state.cards);
    this.registerGetter('score', (state) => score(state.cards, state.aceCount));
  }
}
