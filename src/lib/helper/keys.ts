import { keysView } from "../store/store";

const keys = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "A", "S", "D", "F", "G", "H", "J", "K", "L", "Z", "X", "C", "V", "B", "N", "M"];

const keyMap = {} as { [key: string]: [() => void, string] };

const addKeyMap = (v: number | string, callback: () => void) => {
  // check v is string or number
  if (typeof v === "string") {
    keyMap[v] = [callback, v];
    return v;
  }

  if (keys.length <= v) {
    // don't record
    return;
  }

  const key = keys[v];
  keyMap[key] = [callback, key];
  return key;
};

// delete keyMap value
const deleteKeyMap = (key: string) => {
  delete keyMap[key];
};

const getKey = (key: string) => {
  if (keyMap[key]) {
    return keyMap[key][1];
  }

  return null;
};


const keyDownListener = (event: KeyboardEvent) => {
  if (event.defaultPrevented) {
    return; // Do nothing if the event was already processed
  }

  switch (event.key.toUpperCase()) {
    case "SHIFT":
      keysView.set(true);
      break;
    case getKey(event.key.toUpperCase()):
      if (event.shiftKey) keyMap[event.key.toUpperCase()][0]();
      break;
    default:
      return; // Quit when this doesn't handle the key event.
  }
};

const keyUpListener = (event: KeyboardEvent) => {
  if (event.defaultPrevented) {
    return; // Do nothing if the event was already processed
  }

  switch (event.key.toUpperCase()) {
    case "SHIFT":
      keysView.set(false);
      break;
    default:
      return; // Quit when this doesn't handle the key event.
  }
};

export { keyDownListener, keyUpListener, addKeyMap, deleteKeyMap };
