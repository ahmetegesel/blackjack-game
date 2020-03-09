import {
  deck, drawFromDeck,
  generateIndices,
  isAce,
  isBlackJack,
  isEndOfDeck,
  ranks,
  shuffle,
  suits
} from "./src/helpers/card";
import { createArrayFromRange } from "./lib/fn";
import { isBusted, score } from "./src/helpers/player";
import { displayPlayer } from "./src/helpers/display";
import { Player } from "./src/player";
import { Game } from "./src/game";


const _deck = deck(suits, ranks);
const _deckCount = 2;
const _deckIndices = shuffle(generateIndices(_deck, _deckCount));


const game = new Game({
  options: {
    players: 2,
    decks: _deckCount
  },
  deck: _deck,
  deckIndices: _deckIndices,
  pick: 0,
  isGameOver: false
});

const newBet = (game) => {
  const deck = game.get('deck');
  const pick = game.get('pick');
  const deckIndices = game.get('deckIndices');
  const initialCardAmount = 2;

  const initialCards = createArrayFromRange(initialCardAmount).map(() => drawFromDeck(deck, deckIndices, pick)) ;
  const aceCount = initialCards.reduce((sum, card) => isAce(card) ? sum + 1 : sum, 0);
  game.dispatch('incrementPick', initialCardAmount);

  return { cards: initialCards, aceCount };
};

const rebet = (game) => {
  return createArrayFromRange(game.get('playerCount')).map(i=> newBet(game));
}

const createPlayers = (game) => {
  const playerCount = game.get('playerCount');

  return createArrayFromRange(playerCount)
    .map(i => {
      const {cards, aceCount } = newBet(game);

      return { [`player${i + 1}`]: new Player({ cards, aceCount }) };
    })
    .reduce((players, player) => ({ ...player, ...players }))
};

const createGame = game => {
  let players = createPlayers(game);
  let dealer = players.player1;
  let player = players.player2;

  return { dealer, player };
};

const ask = (message) => {
  return new Promise(resolve => {
    const readline = require('readline');

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question(message, (answer) => {
      resolve(answer);
      rl.close();
      rl.removeAllListeners();
    });
  })
};

const hit = (game, dealer, player) => {
  player.dispatch('hit', {
    deck: game.get('deck'),
    deckIndices: game.get('deckIndices'),
    pick: game.get('pick')
  });
  game.dispatch('incrementPick', 1);

  displayHands(dealer, player);

  if (!isBusted(player.get('score')))
    return 'continue';

  console.log('Busted!');
  return 'over';
};

const stand = (game, dealer, player) => {
  const dealerCards = dealer.get('cards');

  const isDealerBlackJack = isBlackJack(dealerCards);
  if (isDealerBlackJack) {
    console.log('Dealer Blackjack! Dealer wins!');
    return 'over';
  }

  while (dealer.get('score') < 16) {
    dealer.dispatch('hit', {
      deck: game.get('deck'),
      deckIndices: game.get('deckIndices'),
      pick: game.get('pick')
    });
    game.dispatch('incrementPick', 1);
  }

  console.log('Dealer drew his cards!');
  displayHands(dealer, player);

  const isDealerBusted = isBusted(dealer.get('score'));
  if (isDealerBusted) {
    console.log('Dealer busted! You win!');
    return 'over';
  }

  const playerScore = player.get('score');
  const dealerScore = dealer.get('score');
  if (playerScore === dealerScore)
    console.log('Push!');
  else if (playerScore > dealerScore) {
    console.log('You win!');
  } else {
    console.log('Busted! Dealer wins!');
  }

  return 'over';
};

const displayHands = (dealer, player) => {
  console.log('Dealer');
  displayPlayer(dealer.get('cards'), dealer.get('score'));
  console.log('Player');
  displayPlayer(player.get('cards'), player.get('score'));
};

const main = async (game) => {
  let { dealer, player } = createGame(game);
  let status = 'play';
  let command;

  displayHands(dealer, player);

  while (true) {
    if (status === 'over') {
      game.dispatch('shuffle');
      const hands = rebet(game);
      dealer.dispatch('rebet', hands[0]);
      player.dispatch('rebet', hands[1]);
      console.log('New game started!');
      displayHands(dealer, player);

      if (isBlackJack(player.get('cards'))) {
        console.log('Blackjack, you win!');
        status = 'over';
        continue;
      }

      status = 'play';
    }

    command = await ask('Hit/Stand (h/s)? ');

    if(command === 'h') {
      status = hit(game, dealer, player);
    } else if(command === 's'){
      status = stand(game, dealer, player);
    }
  }
};

main(game);
