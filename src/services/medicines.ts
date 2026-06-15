import {
  collection,
  addDoc,
  getDocs,
} from "firebase/firestore";

import { db } from "./firebase";

export const addMedicine = async (medicine: {
  name: string;
  description: string;
  category: string;
}) => {
  return addDoc(collection(db, "medicines"), {
    ...medicine,
    available: true,
  });
};

export const getMedicinesCount = async () => {
  const medicines = await getMedicines();
  return medicines.length;
};

export const getMedicines = async () => {
  const snapshot = await getDocs(
    collection(db, "medicines")
  );

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};