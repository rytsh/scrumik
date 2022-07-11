type People = {
  [name: string]: {
    points: number;
    isLeader: boolean;
  }
};

type Info = {
  name: string;
  description?: string;
}

type RoomSpec = {
  id?: string;
  info: Info;
  password: {
    passCode: string;
    leaderCode: string;
  }
  people?: People;
};

export { type RoomSpec, type People, type Info };

