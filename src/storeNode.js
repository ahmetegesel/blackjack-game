export class StoreNode {
  _store = {
    actions: {},
    getters: {},
    state: {}
  };

  constructor(initialState) {
    this._store.state = { ...(initialState || {}) };
  }

  registerGetter(getterName, getter) {
    if (!getterName)
      throw new Error('getterName parameter cannot be undefined.');
    if (!getter || typeof getter !== 'function')
      throw new Error('You must define a getter function!');

    this._store.getters[getterName] = getter;
  }

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

  dispatch(action, payload) {
    this._store.state = this._store.actions[action](action, payload, { ...this._store.state }, this._populateContext());
  }

  get(getterName) {
    return this._store.getters[getterName]({ ...this._store.state });
  }

  _populateContext() {
    return {
      getters: Object.assign({}, this._store.getters),
      state: Object.assign({}, this._store.state)
    };
  }
}
