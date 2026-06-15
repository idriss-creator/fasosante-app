import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "./firebase";

import { collection, getDocs } from "firebase/firestore";


export const getUsersCount = async () => {
  const snapshot = await getDocs(
    collection(db, "users")
  );

  return snapshot.size;
};

export const registerUser = async (
  email: string,
  password: string
) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  await setDoc(doc(db, "users", userCredential.user.uid), {
    uid: userCredential.user.uid,
    email: userCredential.user.email,
    role: "user",
    createdAt: new Date().toISOString(),
  });

  return userCredential;
};
export const loginUser = async (
  email: string,
  password: string
) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const logoutUser = async () => {
  return signOut(auth);
};

export const logout = async () => {
  await signOut(auth);
};