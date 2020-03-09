/**
 * Represents the smallest node class for State Management based Game Component.
 *
 * Every single component that needs its own state management itself, incl. actions,
 * state, and getters, must derive from StoreNode. All actions related to a particular
 * StoreNode component can be dispatched through its own StoreNode component. It should not
 * be shared between the other StoreNodes to keep the consistency and stay clear from side effects.
 *
 */
export class StoreNode {
  /**
   * This is the core field of the component. All state related operations must be
   * handled by using this particular field. Copying, cloning or sharing with other components
   * may cause conflicts.
   * */
  _store = {
    /**
     * Field that stores all the actions related to the StoreNode component.
     * These actions must be either function which  may accept payload,
     * and state, or an instance of Action class.
     * */
    actions: {},
    /**
     * Getters are basically function which are responsible for returning
     * needed values using state. State must remain immutable, so be sure
     * not to use it without at cloning it.
     * */
    getters: {},
    /**
     * This is the object stores any kind of data to handle operation related
     * to the StoreNode component. This field must be immutable. Since we are not
     * using any professional solution for immutability, be sure not to pass this field
     * outside of the component, and be sure not to pass its fields to anywhere
     * without cloning it.
     * */
    state: {}
  };

  constructor(initialState) {
    this._store.state = { ...(initialState || {}) };
  }

  /**
   * Registers given getter function in the StoreNode component with given name.
   *
   * @param {string} getterName Name of the getter function.
   * @param {function} getter Getter function.
   */
  registerGetter(getterName, getter) {
    if (!getterName)
      throw new Error('getterName parameter cannot be undefined.');
    if (!getter || typeof getter !== 'function')
      throw new Error('You must define a getter function!');

    this._store.getters[getterName] = getter;
  }

  /**
   * Registers given action function in the StoreNode component with given name.
   *
   * @param {string} actionName Name of the action.
   * @param {Action | function} action Either action class which has dispatch function,
   * or a function accepts payload, and state .
   * */
  registerAction(actionName, action) {
    if (!actionName)
      throw new Error('actionName parameter cannot be undefined.');
    if (!action)
      throw new Error('action parameter cannot be undefined.');

    let _action;
    if (typeof action === 'function') {
      _action = action;
    } else {
      if (action.dispatch && typeof action.dispatch === 'function') {
        _action = action.dispatch.bind(action);
      }
    }

    if (!_action)
      throw new Error('You must define an action function or an instance of object inheriting Action!');

    this._store.actions[actionName] = _action;
  }

  /**
   * Invokes given action with given payload.
   */
  dispatch(action, payload) {
    this._store.state = this._store.actions[action](action, payload, { ...this._store.state }, this._populateContext());
  }

  /**
   * Invokes given getter function.
   *
   * Since getter function need current state object and we also
   * must maintain the immutability, this function passes current
   * state to the getter function cloning it.
   *
   * @param {string} getterName Name of the getter function to be invoked.
   */
  get(getterName) {
    return this._store.getters[getterName]({ ...this._store.state });
  }

  /**
   * Populates the context object that is shared between actions within the same StoreNode component.
   *
   * You may need an object which you can pass some functions or arbitrary objects to,
   * context is responsible for this and, _populateContext function is used to populated it.
   * You can override this function in your StoreNode class to populate some additional things.
   * As default, it populates getters and state object.
   * */
  _populateContext() {
    return {
      getters: Object.assign({}, this._store.getters),
      state: Object.assign({}, this._store.state)
    };
  }
}
