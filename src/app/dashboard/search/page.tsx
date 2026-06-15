"use client";

import { useState } from "react";
import { searchPharmaciesByMedicine } from "@/services/pharmacies";
import { getStocks } from "@/services/stocks";
import { getMedicines } from "@/services/medicines";
import { getPharmacies } from "@/services/pharmacies";
import { useEffect } from "react";

export default function SearchPage() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [stocks, setStocks] =
  useState<any[]>([]);

const [medicines, setMedicines] =
  useState<any[]>([]);

const [pharmacies, setPharmacies] =
  useState<any[]>([]);
  const handleSearch = async () => {
    const pharmacies =
      await searchPharmaciesByMedicine(search);

    setResults(pharmacies);
  };
  const getMedicineName = (
  id: string
) =>
  medicines.find(
    (m) => m.id === id
  )?.name || "";

const getPharmacyName = (
  id: string
) =>
  pharmacies.find(
    (p) => p.id === id
  )?.name || "";
  const filteredStocks = stocks.filter(
  (stock) =>
    getMedicineName(
      stock.medicineId
    )
      .toLowerCase()
      .includes(
        search.toLowerCase()
      )
);
  useEffect(() => {
  const load = async () => {
    const stocksData =
      await getStocks();

    const medicinesData =
      await getMedicines();

    const pharmaciesData =
      await getPharmacies();

    setStocks(stocksData);
    setMedicines(medicinesData);
    setPharmacies(pharmaciesData);
  };

  load();
}, []);
  return (
    <main className="min-h-screen p-6">
      <h1 className="text-3xl font-bold text-green-600 mb-6">
        Rechercher un médicament
      </h1>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Rechercher un médicament..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border p-3 rounded"
        />
        <button
          onClick={handleSearch}
          className="bg-green-600 text-white px-4 rounded"
        >
          Rechercher
        </button>
      </div>

      
      <div className="mt-6 space-y-4">
 
  {search && filteredStocks.map((stock) => (
    <div
      key={stock.id}
      className="border rounded-lg p-4"
    >
      <h2 className="font-bold">
        {getMedicineName(
          stock.medicineId
        )}
      </h2>

      <p>
        🏥{" "}
        {getPharmacyName(
          stock.pharmacyId
        )}
      </p>

      <p>
        📦 Stock :
        {stock.quantity}
      </p>
    </div>
  ))}
</div>

      {results.length > 0 && (
        <div className="space-y-4">
          {results.map((pharmacy) => (
            <div
              key={pharmacy.id}
              className="border rounded-lg p-4"
            >
              <h2 className="font-bold">
                {pharmacy.name}
              </h2>

              <p>{pharmacy.city}</p>

              <p>{pharmacy.phone}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}