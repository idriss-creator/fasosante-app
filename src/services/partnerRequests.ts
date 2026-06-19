import { db } from "./firebase";
import {
  collection,
  doc,
  getDocs,
  updateDoc,
  setDoc,
  query,
  orderBy,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";

export type PartnerRequest = {
  id: string;
  userId: string;
  userEmail: string;
  pharmacyName: string;
  phone: string;
  city: string;
  address: string;
  licenseNumber: string;
  description?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: any;
  reviewedAt?: any;
  reviewNote?: string;
};

// Récupérer toutes les demandes
export async function getPartnerRequests(): Promise<PartnerRequest[]> {
  const q = query(collection(db, "owner_requests"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as PartnerRequest[];
}

// Approuver une demande
export async function approvePartnerRequest(
  requestId: string,
  request: PartnerRequest,
  reviewNote?: string
) {
  // 1. Mettre à jour le statut de la demande
  await updateDoc(doc(db, "owner_requests", requestId), {
    status: "approved",
    reviewedAt: serverTimestamp(),
    reviewNote: reviewNote || "",
  });

  // 2. Mettre à jour le rôle de l'utilisateur
  await updateDoc(doc(db, "users", request.userId), {
    role: "owner",
    pharmacyName: request.pharmacyName,
    pharmacyPhone: request.phone,
    pharmacyCity: request.city,
    pharmacyAddress: request.address,
    pharmacyLicense: request.licenseNumber,
    updatedAt: serverTimestamp(),
  });

  // 3. Créer la pharmacie dans la collection pharmacies
  const pharmacyId = `ph_${request.userId}`;
  await setDoc(doc(db, "pharmacies", pharmacyId), {
    id: pharmacyId,
    ownerId: request.userId,
    ownerEmail: request.userEmail,
    name: request.pharmacyName,
    phone: request.phone,
    city: request.city,
    address: request.address,
    licenseNumber: request.licenseNumber,
    description: request.description || "",
    status: "open",
    is24h: false,
    rating: 0,
    distance: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return true;
}

// Refuser une demande
export async function rejectPartnerRequest(
  requestId: string,
  reviewNote?: string
) {
  await updateDoc(doc(db, "owner_requests", requestId), {
    status: "rejected",
    reviewedAt: serverTimestamp(),
    reviewNote: reviewNote || "",
  });

  return true;
}