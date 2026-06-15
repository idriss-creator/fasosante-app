"use client";

import { useEffect, useState } from "react";
import { auth } from "@/services/firebase";
import { getDoc, doc } from "firebase/firestore";
import { db } from "@/services/firebase";

export default function usePharmacy() {
  const [pharmacyId, setPharmacyId] =
    useState<string | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const load = async () => {
      const user = auth.currentUser;

      if (!user) {
        setLoading(false);
        return;
      }

      const userDoc = await getDoc(
        doc(db, "users", user.uid)
      );

      if (userDoc.exists()) {
        setPharmacyId(
          userDoc.data().pharmacyId || null
        );
      }

      setLoading(false);
    };

    load();
  }, []);

  return {
    pharmacyId,
    loading,
  };
}