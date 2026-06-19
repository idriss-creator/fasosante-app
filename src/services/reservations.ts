import { db } from "./firebase";
import { collection, addDoc, doc, updateDoc, query, where, getDocs } from "firebase/firestore";

export interface Reservation {
  id: string;
  userId: string;
  pharmacyId: string;
  medicineId: string;
  quantity: number;
  totalPrice: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  paymentMethod?: string;
  phoneNumber?: string;
  transactionId?: string;
  paidAt?: any;
  cancelReason?: string;
  createdAt: any;
}

export const createReservation = async (
  reservation: Omit<Reservation, "id">
): Promise<string> => {
  const docRef = await addDoc(collection(db, "reservations"), reservation);
  return docRef.id;
};

export const updateReservationStatus = async (
  reservationId: string,
  status: Reservation["status"],
  additionalData?: Partial<Reservation>
) => {
  const reservationRef = doc(db, "reservations", reservationId);
  await updateDoc(reservationRef, {
    status,
    ...additionalData,
  });
};

export const getUserReservations = async (userId: string): Promise<Reservation[]> => {
  const q = query(
    collection(db, "reservations"),
    where("userId", "==", userId)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Reservation[];
};