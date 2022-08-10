import { DocumentReference, getDoc, type DocumentData } from "firebase/firestore";
import type { Password } from "./models";

// check if the room is reachable
const checkPass = async (roomRef: DocumentReference<DocumentData>, password: string) => {
  // check password
  const roomSnap = await getDoc(roomRef);

  const vPasswords = roomSnap.get("password") as Password;

  return vPasswords?.passCode == password;
};

// get current password
const getPass = async (roomRef: DocumentReference<DocumentData>) => {
  // check password
  const roomSnap = await getDoc(roomRef);
  const vPasswords = roomSnap.get("password") as Password;

  return vPasswords;
};

export { checkPass, getPass };
