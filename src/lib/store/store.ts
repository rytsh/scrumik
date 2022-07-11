import { writable } from "svelte/store";
import { getRoomsLocalStorage } from "../helper/local";
import type { RoomSpec } from "../helper/models";

export const roomList = writable(null as RoomSpec[]|null);

export const setRoomList = () => {
  const roomLocal = getRoomsLocalStorage();
  roomList.set(roomLocal);
};
