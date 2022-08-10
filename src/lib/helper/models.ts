type IDNick = {
  id: string;
  nick: string;
}

type People = {
  [id: string]: {
    nick?: string;
    card?: CardV;
  }
};

type Info = {
  name: string;
  description?: string;
}

type RoomInfo = {
  id: string;
  name: string;
}

type CardV = {
  text: string;
  emoji: boolean;
  id: string;
}

type Password = {
  passCode: string;
}

type RoomSpec = {
  id?: string;
  info: Info;
  password: Password;
  people?: People;
  show?: boolean;
  cards: CardV[];
};

const defaultCards: CardV[] = [
  { text: "1", emoji: false, id: "1" },
  { text: "2", emoji: false, id: "2" },
  { text: "3", emoji: false, id: "3" },
  { text: "5", emoji: false, id: "5" },
  { text: "8", emoji: false, id: "8" },
  { text: "13", emoji: false, id: "13" },
  { text: "21", emoji: false, id: "21" },
  { text: "34", emoji: false, id: "34" },
  { text: "55", emoji: false, id: "55" },
  { text: "☕", emoji: true, id: "coffee" },
  { text: "🤯", emoji: true, id: "exploding-head" },
  { text: "🔭", emoji: true, id: "telescope" },
  { text: "❔", emoji: true, id: "question" },
];

export { type RoomInfo, type IDNick, type RoomSpec, type People, type Info, type CardV, type Password, defaultCards };
