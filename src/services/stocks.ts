import {
  addDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import {
  updateDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import {
  query,
  where,
} from "firebase/firestore";

// addStock defined later with returned document id

export const getStocks = async () => {
  const snapshot = await getDocs(
    collection(db, "stocks")
  );

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};
export const updateStockQuantity = async (
  stockId: string,
  quantity: number
) => {
  const stockRef = doc(
    db,
    "stocks",
    stockId
  );

  await updateDoc(stockRef, {
    quantity,
  });
};
export const getStocksByPharmacy = async (
  pharmacyId: string
) => {
  const q = query(
    collection(db, "stocks"),
    where("pharmacyId", "==", pharmacyId)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};
export const addStockMovement =
  async (movement: any) => {
    await addDoc(
      collection(
        db,
        "stock_movements"
      ),
      movement
    );
  };

export const getStockMovements =
  async () => {
    const snapshot =
      await getDocs(
        collection(
          db,
          "stock_movements"
        )
      );

    return snapshot.docs.map(
      (doc) => ({
        id: doc.id,
        ...doc.data(),
      })
    );
  };
  export const getStocksCount = async () => {
  const snapshot = await getDocs(
    collection(db, "stocks")
  );

  return snapshot.size;
};
export const getLowStocksCount = async () => {
  const snapshot = await getDocs(
    collection(db, "stocks")
  );

  return snapshot.docs.filter(
    (doc) =>
      doc.data().quantity < 10
  ).length;
};
export const getOutOfStockCount =
  async () => {
    const snapshot = await getDocs(
      collection(db, "stocks")
    );

    return snapshot.docs.filter(
      (doc) =>
        doc.data().quantity === 0
    ).length;
  };
  export const addStock = async (stock: any): Promise<string> => {
  const docRef = await addDoc(collection(db, "stocks"), stock);
  return docRef.id;
};