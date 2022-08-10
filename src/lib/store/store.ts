import { writable } from "svelte/store";
import { getRoomsLocalStorage } from "../helper/local";
import type { RoomInfo } from "../helper/models";

export const roomList = writable(null as RoomInfo[] | null);

export const setRoomList = () => {
  const roomLocal = getRoomsLocalStorage();
  roomList.set(roomLocal);
};

export const show = writable(false);
