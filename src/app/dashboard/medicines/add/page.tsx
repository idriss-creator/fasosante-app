"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addMedicine } from "@/services/medicines";
import AdminGuard from "@/components/AdminGuard";
export default function AddMedicinePage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async () => {
    if (!name || !description || !category) {
      alert("Veuillez remplir tous les champs");
      return;
    }
  
    try {
      setLoading(true);

      await addMedicine({
        name,
        description,
        category,
      });

      alert("Médicament ajouté avec succès");

      router.push("/dashboard/medicines");
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'ajout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminGuard>
    <main className="min-h-screen p-6">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold text-green-600 mb-6">
          Ajouter un médicament
        </h1>

        <input
          type="text"
          placeholder="Nom du médicament"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-3 rounded mb-4"
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-3 rounded mb-4"
        />

        <input
          type="text"
          placeholder="Catégorie"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border p-3 rounded mb-4"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-green-600 text-white px-6 py-3 rounded"
        >
          {loading ? "Ajout..." : "Ajouter"}
        </button>
      </div>
    </main>
    </AdminGuard>
  );
}