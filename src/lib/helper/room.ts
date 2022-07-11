import { addDoc, collection, doc, Firestore, onSnapshot } from "firebase/firestore";
import type { RoomSpec } from "./models";

const subscribe = (db: Firestore) => {
  const unsub = onSnapshot(doc(db, "cities", "SF"), (doc) => {
    console.log("Current data: ", doc.data());
  });

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

export { subscribe, createRoom };
