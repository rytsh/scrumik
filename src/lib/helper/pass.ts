import { DocumentReference, getDoc, type DocumentData } from "firebase/firestore";
import type { Password } from "./models";

// check if the room is reachable
// return [true, true] if leader pass
// return [false, true] if pass
const checkPass = async (roomRef: DocumentReference<DocumentData>, password: string) => {
  // check password
  const roomSnap = await getDoc(roomRef);

  const vPasswords = roomSnap.get("password") as Password;

  if (vPasswords?.leaderCode == password) {
    return [true, true];
  }

  return [false, vPasswords?.passCode == password];
};

// get current password
const getPass = async (roomRef: DocumentReference<DocumentData>) => {
  // check password
  const roomSnap = await getDoc(roomRef);
  const vPasswords = roomSnap.get("password") as Password;

  return vPasswords;
};

export { checkPass, getPass };
