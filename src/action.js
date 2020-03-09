/**
 * Base class for actions.
 *
 * You do not hold the instance of this class and invoke this function to dispatch actions.
 * You should only pass the instance of this class to registerAction function of
 * the StoreNode instance.
 * */
export class Action {
  /**
   * This is function is invoked by the StoreNode instance.
   * */
  dispatch(action, payload, context) {
    throw new Error('Not Implemented Error');
  }
}
