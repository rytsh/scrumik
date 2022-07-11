import { roomList } from "../store/store";

const roomKey = "room";

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

export { roomKey, recordRoomLocalStorage, getRoomsLocalStorage, removeRoomLocalStorage, removeAllRoomsLocalStorage };
