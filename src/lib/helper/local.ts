import { roomList } from "../store/store";
import type { IDNick, Password } from "./models";
import { v4 as uuidv4 } from "uuid";

const roomKey = "room";
const nameIDKey = "id";

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

const getIDName = () => {
  const value = localStorage.getItem(nameIDKey);
  if (value == null) {
    return null;
  }

  return JSON.parse(value) as IDNick;
};

const setIDName = (nick: string) => {
  const id = uuidv4();
  const v = { id: id, nick: nick } as IDNick;
  localStorage.setItem(nameIDKey, JSON.stringify(v));
  return { id, nick } as IDNick;
};

const changeIDName = (id: string, nick: string) => {
  const v = { id: id, nick: nick } as IDNick;
  localStorage.setItem(nameIDKey, JSON.stringify(v));
};

export { getIDName, setIDName, changeIDName, recordRoomLocalStorage, getRoomsLocalStorage, getRoomPasswordLocalStorage, removeRoomLocalStorage, removeAllRoomsLocalStorage };
