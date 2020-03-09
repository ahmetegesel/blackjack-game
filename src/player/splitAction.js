import { Action } from "../action";

/*
* TODO implement this class in a way that it can manipulate the current actions
*  of the owning StoreNode instance. You should replace current hit and stand
*  actions with new ones. These new actions should handle split hands using
*  the state of the Player StoreNode. These new actions should pass
*  action parameter of the dispatch of the class so that you can know
*  action to be handled. If it is a hit then you should use normal behaviour
*  of the hit to draw card but store it in split hands in the state. If stand
*  is dispatched, then it should behave like normal stand but additionally
*  it should restore default actions of the StoreNode.
* */
export class SplitAction extends Action {

}
