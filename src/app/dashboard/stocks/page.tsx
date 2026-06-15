"use client";

import { useEffect, useState } from "react";
import { getStocks } from "@/services/stocks";
import { getMedicines } from "@/services/medicines";
import { getPharmacies } from "@/services/pharmacies";
import { updateStockQuantity } from "@/services/stocks";
import {
  addStockMovement,
} from "@/services/stocks";
export default function StocksPage() {
  const [stocks, setStocks] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [medicines, setMedicines] = useState<any[]>([]);
  const [pharmacies, setPharmacies] = useState<any[]>([]);

  const getMedicineName = (id: string) => {
    return medicines.find((m) => m.id === id)?.name || id;
  };

  const getPharmacyName = (id: string) => {
    return pharmacies.find((p) => p.id === id)?.name || id;
  };
  const increaseStock = async (
    stockId: string,
    currentQuantity: number
  ) => {
    const stock = stocks.find((s) => s.id === stockId);
    if (!stock) return;

    await updateStockQuantity(
      stockId,
      currentQuantity + 1
    );
    await addStockMovement({
      type: "entry",
      quantity: 1,
      stockId,
      medicineId: stock.medicineId,
      pharmacyId: stock.pharmacyId,
      createdAt: new Date(),
    });
    setStocks((prev) =>
      prev.map((stock) =>
        stock.id === stockId
          ? {
              ...stock,
              quantity:
                currentQuantity + 1,
            }
          : stock
      )
    );
  };

  const decreaseStock = async (
    stockId: string,
    currentQuantity: number
  ) => {
  if (currentQuantity <= 0) {
    return;
  }

  const stock = stocks.find((s) => s.id === stockId);
  if (!stock) return;

  await updateStockQuantity(
    stockId,
    currentQuantity - 1
  );
  await addStockMovement({
      type: "exit",
      quantity: 1,
      stockId,
      medicineId: stock.medicineId,
      pharmacyId: stock.pharmacyId,
      createdAt: new Date(),
    });

  setStocks((prev) =>
    prev.map((stock) =>
      stock.id === stockId
        ? {
            ...stock,
            quantity:
              currentQuantity - 1,
          }
        : stock
    )
  );
};

  useEffect(() => {
    const load = async () => {
      const stocksData = await getStocks();
      const medicinesData = await getMedicines();
      const pharmaciesData = await getPharmacies();

      setStocks(stocksData);
      setMedicines(medicinesData);
      setPharmacies(pharmaciesData);
    };

    load();
  }, []);

  const filteredStocks = stocks.filter((stock) =>
    stock.medicineId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold text-green-600 mb-6">
        Stock
      </h1>

      {filteredStocks.map((stock) => (
        <div
          key={stock.id}
          className="border rounded p-4 mb-3"
        >
          <p>
  Médicament :
  {getMedicineName(
    stock.medicineId
  )}
</p>

          <p>
  Pharmacie :
  {getPharmacyName(
    stock.pharmacyId
  )}
</p>

<div className="flex items-center justify-between">
  <span>
    Quantité : {stock.quantity}
  </span>

   {stock.quantity  === 0 && (
    <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm">
      Stock vide
    </span>
  )}
  {stock.quantity > 0 && stock.quantity < 10 && (
    <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm">
      Stock faible
    </span>


  )}
</div>
<button
  onClick={() =>
    increaseStock(
      stock.id,
      stock.quantity
    )
  }
  className="bg-green-600 text-white px-3 py-1 rounded mt-3"
>
  + Stock
</button>
<button
  onClick={() =>
    decreaseStock(
      stock.id,
      stock.quantity
    )
  }
  className="bg-red-600 text-white px-3 py-1 rounded mt-3 ml-2"
>
  - Stock
</button>
        </div>
      ))}
    </main>
  );
}