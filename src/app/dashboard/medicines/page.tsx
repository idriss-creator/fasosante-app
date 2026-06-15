"use client";

import { useEffect, useState } from "react";
import { getMedicines } from "@/services/medicines";

export default function MedicinesPage() {
  const [medicines, setMedicines] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  useEffect(() => {
    const loadMedicines = async () => {
      const data = await getMedicines();
      setMedicines(data);
    };

    loadMedicines();
  }, []);
const filteredMedicines = medicines.filter(
  (medicine) =>
    medicine.name
      .toLowerCase()
      .includes(search.toLowerCase())
);
  return (
    <main className="min-h-screen p-6">
      <div className="mb-6">
  <h1 className="text-3xl font-bold text-green-600 mb-4">
    Médicaments
  </h1>

  <input
    type="text"
    placeholder="Rechercher un médicament..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="w-full border p-3 rounded"
  />
</div>

      {filteredMedicines.length === 0 ? (
        <p>Aucun médicament enregistré.</p>
      ) : (
        <div className="space-y-4">
          {filteredMedicines.map((medicine) => (
            <div
              key={medicine.id}
              className="border rounded-lg p-4"
            >
              <h2 className="font-bold">
                {medicine.name}
              </h2>

              <p>{medicine.description}</p>

              <p className="text-sm text-gray-500">
                Catégorie : {medicine.category}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}