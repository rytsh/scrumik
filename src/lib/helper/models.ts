type RoomSpec = {
  id?: string;
  name: string;
  description?: string;
  password: {
    passCode: string;
    leaderCode: string;
  }
};

export { type RoomSpec };
