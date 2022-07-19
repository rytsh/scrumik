import { addDoc, collection, doc, DocumentSnapshot, Firestore, getDoc, onSnapshot, type DocumentData } from "firebase/firestore";
import { recordRoomLocalStorage } from "./local";
import type { Info, Password, RoomSpec } from "./models";

const subscribe = (db: Firestore, roomID: string, fn: (doc: DocumentSnapshot<DocumentData>) => void) => {
  const unsub = onSnapshot(doc(db, "room", roomID), fn);

  return unsub;
};

const createRoom = async (db: Firestore, roomSpec: RoomSpec) => {
  try {
    const docRef = await addDoc(collection(db, "room"), roomSpec);
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
};

const isReachableRoom = async (db: Firestore, roomID: string, password: string) => {
  const docRef = doc(db, "room", roomID);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const roomPass = docSnap.get("password") as Password;

    // public room is always reachable
    if (roomPass.passCode == "") {
      return true;
    }

    return roomPass.passCode === password || roomPass.leaderCode === password;
  } else {
    // doc.data() will be undefined in this case
    throw new Error("No such document!");
  }
};

const recordRoom = async (db: Firestore, roomID: string, password: string) => {
  const docRef = doc(db, "room", roomID);
  const docSnap = await getDoc(docRef);
  let name = "";
  if (docSnap.exists()) {
    const info = docSnap.get("info") as Info;

    name = info.name;
    recordRoomLocalStorage(roomID, { id: roomID, name: name, password: password });
  } else {
    null;
  }

  return name;
};

export { subscribe, createRoom, recordRoom, isReachableRoom };
