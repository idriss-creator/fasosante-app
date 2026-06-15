
import { db } from "./firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";


export const getUsers = async () => {
  const snapshot = await getDocs(
    collection(db, "users")
  );

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const updateUserRole = async (
  uid: string,
  role: string
) => {
  await updateDoc(
    doc(db, "users", uid),
    { role }
  );
};
export const getUserRole = async (
  uid: string
) => {
  const userRef = doc(db, "users", uid);

  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.data().role;
};