import { DocumentReference, getDoc, type DocumentData } from "firebase/firestore";
import type { Password } from "./models";

const checkPass = async (roomRef: DocumentReference<DocumentData>, password: string, leader = false) => {
  // check password
  const roomSnap = await getDoc(roomRef);

  const vPasswords = roomSnap.get("password") as Password;

  if (leader) {
    return vPasswords?.leaderCode == password;
  }

  if (vPasswords?.leaderCode == password) {
    return true;
  }

  return vPasswords?.passCode == password;
};

const redirectToRoom = (id: string, password: string | null) => {
  window.location.href = `/room/${id}${password ? `?password=${password}` : ""
    }`;
};

export { checkPass, redirectToRoom };
