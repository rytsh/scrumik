import type { CardV } from "./models";

const getCardId = (cardV: CardV) => {
  if (cardV.id) {
    return cardV.id;
  }

  return cardV.text + cardV.emoji.toString();
};

export { getCardId };
