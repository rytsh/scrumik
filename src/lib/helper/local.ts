import { roomList } from "../store/store";
import type { IDNick } from "./models";
import { v4 as uuidv4 } from "uuid";

const roomKey = "room";
const nameIDKey = "id";

const recordRoomLocalStorage = (key: string, value: any, append = true) => {
  let rooms = getRoomsLocalStorage();
  if (!rooms) {
    rooms = [value];
  } else {
    let found: any;
    rooms = rooms.filter((room) => {
      if (room.id != key) {
        return true;
      }

      found = room;
      return false;
    });

    if (append) {
      found = { ...found, ...value };
    }

    rooms.push(found);
  }

  localStorage.setItem(roomKey, JSON.stringify(rooms));
};

const getRoomsLocalStorage = (): any[] | null => {
  const value = localStorage.getItem(roomKey);
  if (value == null) {
    return null;
  }
  return JSON.parse(value);
};

const getRoomPasswordLocalStorage = (id: string): string | null => {
  const rooms = getRoomsLocalStorage();
  if (rooms == null) {
    return "";
  }

  const room = rooms.find((room) => room.id == id);
  return room?.password ?? "";
};

const getRoomNameLocalStorage = (id: string): string | null => {
  const rooms = getRoomsLocalStorage();
  if (rooms == null) {
    return;
  }

  const room = rooms.find((room) => room.id == id);
  return room?.name;
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

export { getIDName, setIDName, changeIDName, recordRoomLocalStorage, getRoomsLocalStorage, getRoomPasswordLocalStorage, getRoomNameLocalStorage, removeRoomLocalStorage, removeAllRoomsLocalStorage };
