import { Action } from "../action";

export class RebetAction extends Action {
  dispatch(action, payload, state) {
    const { cards, aceCount } = payload;
    return { ...state, cards, aceCount };
  }
}
