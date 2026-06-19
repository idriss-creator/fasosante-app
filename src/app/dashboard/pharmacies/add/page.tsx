"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addPharmacy } from "@/services/pharmacies";

export default function AddPharmacyPage() {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [medicines, setMedicines] = useState("");
  const router = useRouter();
 const [latitude, setLatitude] = useState("");
const [longitude, setLongitude] = useState("");

  const handleSubmit = async () => {
    if (!name || !city || !phone) {
      alert("Veuillez remplir tous les champs");
      return;
    }

    try {
      setLoading(true);

     await addPharmacy({
  name,
  city,
  phone,
  latitude: Number(latitude),
  longitude: Number(longitude),
  medicines: medicines
    .split(",")
    .map((m) => m.trim())
    .filter(Boolean),
});

      alert("Pharmacie ajoutée avec succès");

      router.push("/dashboard/pharmacies");
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'ajout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold text-green-600 mb-6">
          Ajouter une pharmacie
        </h1>

        <input
          type="text"
          placeholder="Nom de la pharmacie"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-3 rounded mb-4"
        />

        <input
          type="text"
          placeholder="Ville"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full border p-3 rounded mb-4"
        />

        <input
          type="text"
          placeholder="Téléphone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border p-3 rounded mb-4"
        />
        <input
          type="text"
          placeholder="Latitude"
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
          className="w-full border p-3 rounded mb-4"
        />

        <input
          type="text"
          placeholder="Longitude"
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
          className="w-full border p-3 rounded mb-4"
        />
        <input
            type="text"
            placeholder="Médicaments (séparés par des virgules)"
            value={medicines}
            onChange={(e) => setMedicines(e.target.value)}
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
  );
}