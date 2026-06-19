import {
  collection,
  addDoc,
  getDocs,
} from "firebase/firestore";
import { auth, db} from "./firebase";

import {
  query,
  where,
} from "firebase/firestore";
export  const addPharmacy = async (pharmacy: {
  name: string;
  city: string;
  phone: string;
  medicines: string[];
  latitude: number;
  longitude: number;
  
}) => {
 
   const user = auth.currentUser;
    if (!user) throw new Error("Not authenticated");
    const doc = { ...pharmacy, ownerId: user.uid };
    return addDoc(collection(db, "pharmacies"), doc);
};
export const getMyPharmacies =
  async (uid: string) => {
    const q = query(
      collection(db, "pharmacies"),
      where("ownerId", "==", uid)
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map(
      (doc) => ({
        id: doc.id,
        ...doc.data(),
      })
    );
  };
export const getPharmacies = async () => {
  const snapshot = await getDocs(
    collection(db, "pharmacies")
  );

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const getPharmaciesCount = async () => {
  const pharmacies = await getPharmacies();
  return pharmacies.length;
};

export const searchPharmaciesByMedicine = async (
  medicineName: string
) => {
  const pharmacies = await getPharmacies();

  return pharmacies.filter((pharmacy: any) =>
    pharmacy.medicines?.some((medicine: string) =>
      medicine
        .toLowerCase()
        .includes(medicineName.toLowerCase())
    )
  );
};
export const getPharmacyByOwner = async (ownerId: string) => {
  const q = query(
    collection(db, "pharmacies"),
    where("ownerId", "==", ownerId)
  );
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) return null;
  const doc = querySnapshot.docs[0];
  return { id: doc.id, ...doc.data() };
};
import {
  doc,
  getDoc,
} from "firebase/firestore";

export const getPharmacyById = async (
  pharmacyId: string
) => {
  const ref = doc(
    db,
    "pharmacies",
    pharmacyId
  );

  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
};
