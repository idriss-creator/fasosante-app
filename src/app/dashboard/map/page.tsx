"use client";

import { useEffect, useState } from "react";
import { getPharmacies } from "@/services/pharmacies";
import dynamic from "next/dynamic";

const PharmacyMap = dynamic(() => import("@/components/PharmacyMap"), {
  ssr: false
});

export default function MapPage() {
  const [pharmacies, setPharmacies] = useState<any[]>([]);
const [userPosition, setUserPosition] =
  useState<[number, number] | null>(null);
  useEffect(() => {
    const load = async () => {
      const data = await getPharmacies();
      setPharmacies(data);
      navigator.geolocation.getCurrentPosition(
  (position) => {
    setUserPosition([
      position.coords.latitude,
      position.coords.longitude,
    ]);
  },
  (error) => {
    console.error(error);
  }
);
    };

    load();
  }, []);
console.log("Position utilisateur :", userPosition);
  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold text-green-600 mb-6">
        Carte des Pharmacies
      </h1>

      <PharmacyMap pharmacies={pharmacies} userPosition={userPosition} />
    </main>
  );
}

     