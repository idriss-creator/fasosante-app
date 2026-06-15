"use client";

import { useState } from "react";
import { addStock } from "@/services/stocks";
import { getMedicines } from "@/services/medicines";
import { useEffect } from "react";
import { getPharmacies } from "@/services/pharmacies";

export default function AddStockPage() {
  const [medicineId, setMedicineId] =
    useState("");

  const [pharmacyId, setPharmacyId] =
    useState("");
    const [medicines, setMedicines] = useState<any[]>([]);

  const [quantity, setQuantity] =
    useState("");
  const [pharmacies, setPharmacies] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const data = await getMedicines();
      setMedicines(data);
      const pharmaciesData = await getPharmacies();
      setPharmacies(pharmaciesData);
    };

    load();
  }, []);

  const handleSubmit = async () => {
    await addStock({
      medicineId,
      pharmacyId,
      quantity: Number(quantity),
      updatedAt: new Date(),
    });

    alert("Stock ajouté");
  };

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold text-green-600 mb-6">
        Ajouter du stock
      </h1>

      <select
  value={medicineId}
  onChange={(e) =>
    setMedicineId(e.target.value)
  }
  className="w-full border p-3 rounded mb-4"
>
  <option value="">
    Sélectionner un médicament
  </option>

  {medicines.map((medicine) => (
    <option
      key={medicine.id}
      value={medicine.id}
    >
      {medicine.name}
    </option>
  ))}
</select>

     <select
  value={pharmacyId}
  onChange={(e) =>
    setPharmacyId(e.target.value)
  }
  className="w-full border p-3 rounded mb-4"
>
  <option value="">
    Sélectionner une pharmacie
  </option>

  {pharmacies.map((pharmacy) => (
    <option
      key={pharmacy.id}
      value={pharmacy.id}
    >
      {pharmacy.name}
    </option>
  ))}
</select>

      <input
        type="number"
        placeholder="Quantité"
        value={quantity}
        onChange={(e) =>
          setQuantity(e.target.value)
        }
        className="w-full border p-3 rounded mb-4"
      />

      <button
        onClick={handleSubmit}
        className="w-full bg-green-600 text-white py-3r ounded"
      >
        Ajouter
      </button>
    </main>
  );
}