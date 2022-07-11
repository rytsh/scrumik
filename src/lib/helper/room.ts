import { addDoc, collection, doc, DocumentSnapshot, Firestore, onSnapshot, type DocumentData } from "firebase/firestore";
import type { RoomSpec } from "./models";

const subscribe = (db: Firestore, roomID: string, fn: (doc: DocumentSnapshot<DocumentData>)=>void) => {
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

export { subscribe, createRoom };
