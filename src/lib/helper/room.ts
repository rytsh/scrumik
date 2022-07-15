import { addDoc, collection, doc, DocumentSnapshot, Firestore, getDoc, onSnapshot, type DocumentData } from "firebase/firestore";
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

const isReachableRoom = async (db: Firestore, roomID: string, password: string) => {
  const docRef = doc(db, "room", roomID);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const roomSpec = docSnap.data() as RoomSpec;

    // public room is always reachable
    if (roomSpec.password.passCode == "") {
      return true;
    }

    return roomSpec.password.passCode === password || roomSpec.password.leaderCode === password;
  } else {
    // doc.data() will be undefined in this case
    throw new Error("No such document!");
  }
};

export { subscribe, createRoom, isReachableRoom };
