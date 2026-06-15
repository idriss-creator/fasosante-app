"use client";

import { useEffect, useState } from "react";
import { getPharmacies } from "@/services/pharmacies";
import AdminGuard from "@/components/AdminGuard";



export default function PharmaciesPage() {
  const [pharmacies, setPharmacies] = useState<any[]>([]);
  

  useEffect(() => {
    const loadPharmacies = async () => {
      const data = await getPharmacies();
      setPharmacies(data);
    };

    loadPharmacies();
  }, []);

  return (
    <AdminGuard>
    <main className="min-h-screen p-6">
      <h1 className="text-3xl font-bold text-green-600 mb-6">
        Pharmacies
      </h1>

      {pharmacies.length === 0 ? (
        <p>Aucune pharmacie enregistrée.</p>
      ) : (
        <div className="space-y-4">
          {pharmacies.map((pharmacy) => (
            <div
              key={pharmacy.id}
              className="border rounded-lg p-4"
            >
              <h2 className="font-bold">
                {pharmacy.name}
              </h2>

              <p>
                Ville : {pharmacy.city}
              </p>

              <p>
                Téléphone : {pharmacy.phone}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
    </AdminGuard>
  );
}