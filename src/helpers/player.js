export const sumCards = cards => cards.reduce((sum, card) => sum + card.value, 0);

export const score = (cards, aceCount) => {
  let cardsSum = sumCards(cards);
  if(cardsSum > 21 && aceCount !== 0) {
    for (let i = 0; i < aceCount; i++) {
      if(cardsSum > 21){
        cardsSum -= 10
      }
    }
  }

  return cardsSum;
};

export const isBusted = (score) => score > 21;


