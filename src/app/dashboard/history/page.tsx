"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  getStockMovements,
} from "@/services/stocks";

export default function HistoryPage() {
  const [movements, setMovements] =
    useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const data =
        await getStockMovements();

      setMovements(data);
    };

    load();
  }, []);

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold text-green-600 mb-6">
        Historique
      </h1>

      {movements.map(
        (movement) => (
          <div
            key={movement.id}
            className="border rounded p-4 mb-3"
          >
            <p>
              Type :
              {movement.type}
            </p>

            <p>
              Quantité :
              {movement.quantity}
            </p>
          </div>
        )
      )}
    </main>
  );
}