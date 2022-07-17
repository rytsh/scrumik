import { roomList } from "../store/store";
import type { Password } from "./models";

const roomKey = "room";
const nameKey = "name";

const recordRoomLocalStorage = (key: string, value: any) => {
  let rooms = getRoomsLocalStorage();
  if (rooms == null) {
    rooms = [value];
  } else {
    rooms = rooms.filter((room) => room.id !== key);
    rooms.push(value);
  }

  localStorage.setItem(roomKey, JSON.stringify(rooms));
  roomList.set(rooms);
};

const getRoomsLocalStorage = (): any[] | null => {
  const value = localStorage.getItem(roomKey);
  if (value == null) {
    return null;
  }
  return JSON.parse(value);
};

const getRoomPasswordLocalStorage = (id: string): Password | null => {
  const rooms = getRoomsLocalStorage();
  if (rooms == null) {
    return;
  }

  const room = rooms.find((room) => room.id == id);
  return room?.password;
};

const removeRoomLocalStorage = (key: string) => {
  const rooms = getRoomsLocalStorage();
  if (rooms == null) {
    return;
  }

  const roomsFiltered = rooms.filter((room) => room.id !== key);
  localStorage.setItem(roomKey, JSON.stringify(roomsFiltered));
  roomList.set(roomsFiltered);
};

const removeAllRoomsLocalStorage = () => {
  localStorage.removeItem(roomKey);
  roomList.set(null);
};

const getName = () => {
  const value = localStorage.getItem(nameKey);
  return value;
};

const setName = (v: string) => {
  localStorage.setItem(nameKey, v);
  return v;
};

export { getName, setName, recordRoomLocalStorage, getRoomsLocalStorage, getRoomPasswordLocalStorage, removeRoomLocalStorage, removeAllRoomsLocalStorage };
