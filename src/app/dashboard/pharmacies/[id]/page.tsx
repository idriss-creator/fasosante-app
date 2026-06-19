"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { getPharmacies } from "@/services/pharmacies";
import { getStocks } from "@/services/stocks";
import { getMedicines } from "@/services/medicines";

export default function PharmacyDetailPage() {
  const router = useRouter();
  const params = useParams();
  const pharmacyId = params.id as string;

  const [pharmacy, setPharmacy] = useState<any>(null);
  const [stocks, setStocks] = useState<any[]>([]);
  const [medicines, setMedicines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showHours, setShowHours] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [pharmaciesData, stocksData, medicinesData] = await Promise.all([
          getPharmacies(),
          getStocks(),
          getMedicines(),
        ]);

        const foundPharmacy = pharmaciesData.find((p) => p.id === pharmacyId);
        setPharmacy(foundPharmacy);

        // Filtrer les stocks de cette pharmacie
        const pharmacyStocks = (stocksData as any[]).filter((s: any) => s.pharmacyId === pharmacyId);
        setStocks(pharmacyStocks);
        setMedicines(medicinesData);
      } catch (error) {
        console.error("Erreur chargement pharmacie:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [pharmacyId]);

  const getMedicineName = (medicineId: string) => {
    return medicines.find((m) => m.id === medicineId)?.name || "Médicament inconnu";
  };

  const getMedicinePrice = (medicineId: string) => {
    return medicines.find((m) => m.id === medicineId)?.price || 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de la pharmacie...</p>
        </div>
      </div>
    );
  }

  if (!pharmacy) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">error</span>
          <p className="text-gray-600 text-lg font-semibold">Pharmacie introuvable</p>
          <Link
            href="/dashboard/pharmacies"
            className="inline-block mt-6 px-6 py-3 bg-green-700 text-white font-semibold rounded-xl hover:bg-green-800 transition-colors"
          >
            Retour à la liste
          </Link>
        </div>
      </div>
    );
  }

  const isOpen = pharmacy.status !== "closed";

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Header avec image */}
      <header className="relative h-[200px] w-full">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1585435557343-3b092031a831?w=800&h=400&fit=crop')",
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent"></div>
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white active:scale-90 transition-transform"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white active:scale-90 transition-transform">
            <span className="material-symbols-outlined">favorite</span>
          </button>
        </div>
      </header>

      <main className="relative -mt-8 px-4 pb-8 space-y-6 max-w-5xl mx-auto">
        {/* Carte principale */}
        <section className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
          <div className="flex justify-between items-start mb-2">
            <h1 className="font-bold text-2xl text-gray-900">{pharmacy.name}</h1>
            <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-full">
              <span
                className="material-symbols-outlined text-sm text-yellow-500"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                star
              </span>
              <span className="text-sm font-semibold text-gray-900">
                {pharmacy.rating || "4.8"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-4">
            {isOpen && (
              <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Ouverte
              </span>
            )}
            <span className="text-sm text-gray-600">Ferme à 22:00</span>
            <span className="text-sm text-gray-400">• {pharmacy.reviews || "128"} avis</span>
          </div>

          <div className="space-y-3 border-t border-gray-200 pt-4">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-green-700 text-xl">
                location_on
              </span>
              <p className="text-sm text-gray-600">
                {pharmacy.address || "Avenue de l'Indépendance"}, {pharmacy.city || "Ouagadougou"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-green-700 text-xl">
                directions_walk
              </span>
              <p className="text-sm text-gray-600">800m • 12 min à pied</p>
            </div>
            {pharmacy.phone && (
              <a
                href={`tel:${pharmacy.phone}`}
                className="flex items-center gap-3 active:opacity-70 transition-opacity"
              >
                <span className="material-symbols-outlined text-green-700 text-xl">call</span>
                <p className="text-sm text-green-700 font-semibold">{pharmacy.phone}</p>
              </a>
            )}
          </div>
        </section>

        {/* Boutons d'action rapide */}
        <section className="grid grid-cols-3 gap-3">
          {pharmacy.phone && (
            <a
              href={`tel:${pharmacy.phone}`}
              className="flex flex-col items-center justify-center gap-2 p-4 border-2 border-green-700 rounded-xl text-green-700 active:bg-green-50 transition-colors"
            >
              <span className="material-symbols-outlined text-2xl">call</span>
              <span className="text-sm font-semibold">Appeler</span>
            </a>
          )}
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${pharmacy.address || pharmacy.city || "Ouagadougou"}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center gap-2 p-4 border-2 border-green-700 rounded-xl text-green-700 active:bg-green-50 transition-colors"
          >
            <span className="material-symbols-outlined text-2xl">near_me</span>
            <span className="text-sm font-semibold">Itinéraire</span>
          </a>
          
        </section>

        {/* Horaires */}
        <section className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <button
            onClick={() => setShowHours(!showHours)}
            className="w-full flex items-center justify-between p-4 bg-green-50"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-gray-600">schedule</span>
              <span className="font-semibold text-gray-900">Horaires d'ouverture</span>
            </div>
            <span
              className={`material-symbols-outlined transition-transform duration-200 ${
                showHours ? "rotate-180" : ""
              }`}
            >
              expand_more
            </span>
          </button>
          {showHours && (
            <div className="p-4 space-y-2 text-sm">
              <div className="flex justify-between font-bold text-green-700">
                <span>Lundi</span>
                <span>07:30 - 22:00</span>
              </div>
              <div className="flex justify-between">
                <span>Mardi</span>
                <span>07:30 - 22:00</span>
              </div>
              <div className="flex justify-between">
                <span>Mercredi</span>
                <span>07:30 - 22:00</span>
              </div>
              <div className="flex justify-between">
                <span>Jeudi</span>
                <span>07:30 - 22:00</span>
              </div>
              <div className="flex justify-between">
                <span>Vendredi</span>
                <span>07:30 - 22:00</span>
              </div>
              <div className="flex justify-between">
                <span>Samedi</span>
                <span>08:00 - 20:00</span>
              </div>
              <div className="flex justify-between text-red-600">
                <span>Dimanche</span>
                <span>Garde (voir planning)</span>
              </div>
            </div>
          )}
        </section>

        {/* Médicaments courants */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">Médicaments courants</h2>
            <Link href="">
              Tout voir
            </Link>
          </div>
          <div className="flex overflow-x-auto gap-4 py-2 -mx-4 px-4">
            {stocks.slice(0, 5).map((stock) => {
              const medicineName = getMedicineName(stock.medicineId);
              const price = getMedicinePrice(stock.medicineId);

              return (
                <div
                  key={stock.id}
                  className="min-w-[160px] bg-white p-3 rounded-xl shadow-sm border border-gray-200 flex flex-col"
                >
                  <div className="w-full h-24 rounded-lg bg-green-50 mb-3 relative overflow-hidden flex items-center justify-center">
                    <span className="material-symbols-outlined text-5xl text-green-700">
                      medication
                    </span>
                    {stock.quantity > 0 && (
                      <div className="absolute top-1 right-1 bg-white/90 px-1.5 py-0.5 rounded-full text-[10px] font-bold text-green-700 flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-xs">check_circle</span>
                        Stock
                      </div>
                    )}
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm mb-1 line-clamp-1">
                    {medicineName}
                  </h3>
                  <p className="text-green-700 font-bold text-sm mb-3">
                    {price > 0 ? `${price} FCFA` : "Prix sur demande"}
                  </p>
                  <Link
                    href={`/dashboard/reservations/new?medicine=${stock.medicineId}&pharmacy=${pharmacy.id}`}
                    className="w-full py-2 bg-green-700 text-white text-xs font-bold rounded-lg active:scale-95 transition-transform text-center"
                  >
                    Réserver
                  </Link>
                </div>
              );
            })}
            {stocks.length === 0 && (
              <div className="min-w-full text-center py-8">
                <p className="text-gray-500">Aucun médicament en stock actuellement</p>
              </div>
            )}
          </div>
        </section>

        {/* Avis clients */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Avis clients</h2>
          <div className="space-y-3">
            <div className="bg-green-50 p-4 rounded-xl border border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center text-green-800 font-bold">
                  SO
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Seydou Ouattara</h4>
                  <div className="flex text-yellow-500 text-xs">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <span
                        key={i}
                        className="material-symbols-outlined text-sm"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        star
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 italic">
                "Service rapide et personnel très accueillant. Ils ont toujours tout en stock."
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-xl border border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-pink-200 flex items-center justify-center text-pink-800 font-bold">
                  MK
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Mariam Koné</h4>
                  <div className="flex text-yellow-500 text-xs">
                    {[1, 2, 3, 4].map((i) => (
                      <span
                        key={i}
                        className="material-symbols-outlined text-sm"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        star
                      </span>
                    ))}
                    <span className="material-symbols-outlined text-sm">star</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 italic">
                "Pratique pour vérifier le stock avant de se déplacer. Très bonne pharmacie."
              </p>
            </div>
          </div>
          <button className="w-full py-3 text-green-700 font-bold text-sm border-2 border-green-700 rounded-xl hover:bg-green-50 transition-colors">
            Laisser un avis
          </button>
        </section>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 py-3 bg-white shadow-lg rounded-t-xl">
        <Link
          href="/dashboard"
          className="flex flex-col items-center justify-center text-gray-600 p-2 hover:bg-gray-50 transition-colors"
        >
          <span className="material-symbols-outlined">home</span>
          <span className="text-sm font-semibold mt-1">Accueil</span>
        </Link>
        <Link
          href="/dashboard/search"
          className="flex flex-col items-center justify-center text-gray-600 p-2 hover:bg-gray-50 transition-colors"
        >
          <span className="material-symbols-outlined">search</span>
          <span className="text-sm font-semibold mt-1">Recherche</span>
        </Link>
        <Link
          href="/dashboard/pharmacies"
          className="flex flex-col items-center justify-center bg-green-100 text-green-700 rounded-xl px-4 py-2 active:scale-90 transition-transform"
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
            map
          </span>
          <span className="text-sm font-semibold mt-1">Carte</span>
        </Link>
        <Link
          href="/dashboard/reservations"
          className="flex flex-col items-center justify-center text-gray-600 p-2 hover:bg-gray-50 transition-colors"
        >
          <span className="material-symbols-outlined">calendar_today</span>
          <span className="text-sm font-semibold mt-1">Réservations</span>
        </Link>
        <Link
          href="/dashboard/profile"
          className="flex flex-col items-center justify-center text-gray-600 p-2 hover:bg-gray-50 transition-colors"
        >
          <span className="material-symbols-outlined">person</span>
          <span className="text-sm font-semibold mt-1">Profil</span>
        </Link>
      </nav>
    </div>
  );
}