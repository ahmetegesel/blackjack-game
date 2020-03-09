import readline from 'readline';

import {
  deck,
  drawFromDeck,
  drawNFromDeck,
  generateIndices,
  isAce,
  isBlackJack,
  ranks,
  shuffle,
  suits
} from "./src/card";
import { createArrayFromRange } from "./lib/fn";
import { isBusted, score } from "./src/player";
import { displayPlayer } from "./src/display";

class StoreNode {
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

class Player extends StoreNode {
  constructor(initialState) {
    super(initialState);

    this.registerGetter('cards', (state) => state.cards);
    this.registerAction('hit', new HitAction());
    this.registerGetter('score', (state) => score(state.cards, state.aceCount));
  }
}

class Action {
  dispatch(action, payload, context) {
    throw new Error('Not Implemented Error');
  }
}

class RestartGameAction extends Action {
  dispatch(action, payload, state, context) {
    const _deckIndices = shuffle(state.deckIndices);

    return { ...state, deckIndices: _deckIndices, pick: 0 }
  }
}

class HitAction extends Action {
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

class SplitAction extends Action {

}


const _deck = deck(suits, ranks);
const _deckCount = 2;
const _deckIndices = shuffle(generateIndices(_deck, _deckCount));


const game = new StoreNode({
  options: {
    players: 2,
    decks: _deckCount
  },
  deck: _deck,
  deckIndices: _deckIndices,
  pick: 0,
  isGameOver: false
});
game.registerAction('restart', new RestartGameAction());
game.registerAction('incrementPick', (action, payload, state) => ({ ...state, pick: state.pick + payload }));
game.registerAction('updatePick', (action, payload, state) => ({ ...state, pick: payload }));
game.registerGetter('playerCount', (state) => state.options.players);
game.registerGetter('pick', (state) => state.pick);
game.registerGetter('deck', (state) => state.deck);
game.registerGetter('deckIndices', (state) => state.deckIndices);
game.registerGetter('isGameOver', (state) => state.isGameOver);

const createPlayers = (game) => {
  const playerCount = game.get('playerCount');
  const deck = game.get('deck');

  return createArrayFromRange(playerCount)
    .map(i => {
      const pick = game.get('pick');
      const deckIndices = game.get('deckIndices');
      const initialCardAmount = 2;

      const initialCards = drawNFromDeck(initialCardAmount, deck, deckIndices, pick);
      const aceCount = initialCards.reduce((sum, card) => isAce(card) ? sum + 1 : sum, 0);
      game.dispatch('incrementPick', initialCardAmount);

      return { [`player${i + 1}`]: new Player({ cards: initialCards, aceCount }) };
    })
    .reduce((players, player) => ({ ...player, ...players }))
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const isGameOver = (game) => game.get('isGameOver');

const createGame = game => {
  let players = createPlayers(game);
  let dealer = players.player1;
  let player = players.player2;

  return { dealer, player };
};

const main = async (game) => {
  let { dealer, player } = createGame(game);
  let status = 'initial';
  let message = '';

  while (!isGameOver(game)) {
    console.log('Dealer');
    displayPlayer(dealer.get('cards'), dealer.get('score'));
    console.log('Player');
    displayPlayer(player.get('cards'), player.get('score'));
    console.log(message);

    let command;
    if (status !== 'restart') {
      command = await new Promise((resolve => {
        rl.question('Hit/Stand (h/s)?', (answer) => {
          rl.close();
          resolve(answer);
        });
      }));
    } else {
      game.dispatch('restart');
      const newGame = createGame(game);
      dealer = newGame.dealer;
      player = newGame.player;
      console.log('New game started!');
      status = 'initial';
      message = '';
      continue;
    }

    if (command == 'h') {
      player.dispatch('hit', {
        deck: game.get('deck'),
        deckIndices: game.get('deckIndices'),
        pick: game.get('pick')
      });
      game.dispatch('incrementPick', 1);

      if (!isBusted(player.get('score')))
        continue;

      message = 'Busted!';
      status = 'restart';
    }

    if (command == 's') {
      const dealerCards = dealer.get('cards');
      const playerCards = player.get('cards');

      const isDealerBlackJack = isBlackJack(dealerCards);
      if (isDealerBlackJack) {
        message ='Dealer Blackjack! Dealer wins!';
        status = 'restart';
        continue;
      }

      const isPlayerBlackJack = isBlackJack(playerCards);
      if (isPlayerBlackJack) {
        message = 'Blackjack! You win!';
        status = 'restart';
        continue;
      }

      while (dealer.get('score') > 16) {
        dealer.dispatch('hit', {
          deck: game.get('deck'),
          deckIndices: game.get('deckIndices'),
          pick: game.get('pick')
        })
      }

      const isDealerBusted = isBusted(dealer.get('score'));
      if (isDealerBusted) {
        message = 'Dealer busted! You win!';
        status = 'restart';
        continue;
      }
    }

    message = 'You lost!';
    status = 'restart';
  }
};

main(game);
