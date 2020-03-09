export const displayPlayer = (cards, score, displayer = console.log) => {
  displayer('Hand: ',
    JSON.stringify(
      cards.reduce((handText, { suit, rank }) => handText + `${suit} - ${rank}, `, '')),
    JSON.stringify('Score: '),
    score);
};
