type IDNick = {
  id: string;
  nick: string;
}

type People = {
  [id: string]: {
    nick?: string;
    card?: CardV;
    isLeader?: boolean;
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
}

type Password = {
  passCode: string;
  leaderCode: string;
}

type RoomSpec = {
  id?: string;
  info: Info;
  password: Password;
  people?: People;
  cards: CardV[];
};

const defaultCards: CardV[] = [
  { text: "1", emoji: false },
  { text: "2", emoji: false },
  { text: "3", emoji: false },
  { text: "5", emoji: false },
  { text: "8", emoji: false },
  { text: "13", emoji: false },
  { text: "21", emoji: false },
  { text: "34", emoji: false },
  { text: "55", emoji: false },
  { text: "☕", emoji: true },
  { text: "🤯", emoji: true },
  { text: "🔭", emoji: true },
  { text: "❔", emoji: true },
];

export { type RoomInfo, type IDNick, type RoomSpec, type People, type Info, type CardV, type Password, defaultCards };
