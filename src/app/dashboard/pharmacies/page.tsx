"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import UserSidebar from "@/components/UserSidebar";
import { getPharmacies } from "@/services/pharmacies";

type FilterType = "all" | "open" | "closed" | "24h" | "near";

export default function PharmaciesPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pharmacies, setPharmacies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  useEffect(() => {
    const loadData = async () => {
      try {
        const pharmaciesData = await getPharmacies();
        setPharmacies(pharmaciesData);
      } catch (error) {
        console.error("Erreur chargement pharmacies:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const isPharmacyOpen = (pharmacy: any) => pharmacy.status !== "closed";
  const isPharmacy24h = (pharmacy: any) => pharmacy.is24h === true;
  const getDistance = (pharmacy: any) => pharmacy.distance || (Math.random() * 5 + 0.5).toFixed(1);
  const getRating = (pharmacy: any) => pharmacy.rating || (Math.random() * 2 + 3).toFixed(1);

  const filteredPharmacies = pharmacies.filter((pharmacy) => {
    if (search) {
      const searchLower = search.toLowerCase();
      if (!pharmacy.name.toLowerCase().includes(searchLower) && !pharmacy.city?.toLowerCase().includes(searchLower) && !pharmacy.address?.toLowerCase().includes(searchLower)) {
        return false;
      }
    }
    if (activeFilter === "open" && !isPharmacyOpen(pharmacy)) return false;
    if (activeFilter === "closed" && isPharmacyOpen(pharmacy)) return false;
    if (activeFilter === "24h" && !isPharmacy24h(pharmacy)) return false;
    if (activeFilter === "near" && parseFloat(getDistance(pharmacy)) > 2) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des pharmacies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-[rgb(0,135,122)]">
      <UserSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div
        className="absolute top-0 left-0 h-full w-full z-10 flex flex-col overflow-y-auto"
        style={{
          backgroundColor: "#f4fcf0",
          transformOrigin: "center left",
          transition: "transform 400ms cubic-bezier(0.16, 1, 0.3, 1), border-radius 400ms ease, box-shadow 400ms ease",
          transform: sidebarOpen ? "scale(0.85) translateX(280px)" : "scale(1) translateX(0)",
          borderRadius: sidebarOpen ? "24px" : "0",
          boxShadow: sidebarOpen ? "-10px 0 25px rgba(0, 0, 0, 0.1)" : "none",
        }}
      >
        {sidebarOpen && (
          <div className="absolute inset-0 z-50 cursor-pointer" onClick={() => setSidebarOpen(false)} />
        )}

        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md shadow-sm flex items-center justify-between px-4 h-16">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <span className="material-symbols-outlined text-green-700">arrow_back</span>
            </button>
            <h1 className="text-xl font-bold text-green-700">Pharmacies</h1>
          </div>
          <Link href="/dashboard/pharmacies/map" className="text-gray-600 active:scale-95 transition-transform hover:opacity-80">
            <span className="material-symbols-outlined text-2xl">map</span>
          </Link>
        </header>

        {/* ✅ CORRECTION : overflow-hidden retiré du main */}
        <main className="flex-1 w-full max-w-5xl mx-auto pb-24">
          <section className="mt-4 px-4">
            <div className="relative w-full h-[180px] rounded-xl overflow-hidden shadow-sm">
              <div
                className="absolute inset-0 bg-gray-200 bg-cover bg-center"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&h=400&fit=crop')" }}
              ></div>
              <button className="absolute bottom-12 right-3 bg-white text-green-700 p-2 rounded-lg shadow-lg active:scale-95 transition-transform">
                <span className="material-symbols-outlined text-xl">fullscreen</span>
              </button>
              <div className="absolute bottom-0 w-full bg-white/80 backdrop-blur-sm px-4 py-2 border-t border-gray-200">
                <p className="text-sm font-semibold text-green-700">{filteredPharmacies.length} pharmacies disponibles</p>
              </div>
            </div>
          </section>

          <section className="mt-4 px-4">
            <div className="relative flex items-center">
              <span className="absolute left-4 material-symbols-outlined text-green-700">search</span>
              <input
                className="w-full h-12 pl-12 pr-4 bg-white border border-gray-300 rounded-2xl text-base focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition-all outline-none placeholder-gray-500"
                placeholder="Rechercher une pharmacie par nom ou quartier..."
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </section>

          <section className="mt-4 overflow-x-auto whitespace-nowrap px-4 flex gap-2">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all active:scale-95 ${
                activeFilter === "all" ? "bg-green-700 text-white" : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"
              }`}
            >
              Toutes
            </button>
            <button
              onClick={() => setActiveFilter("open")}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all active:scale-95 flex items-center gap-1.5 ${
                activeFilter === "open" ? "bg-green-700 text-white" : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              Ouvertes
            </button>
            <button
              onClick={() => setActiveFilter("closed")}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all active:scale-95 flex items-center gap-1.5 ${
                activeFilter === "closed" ? "bg-green-700 text-white" : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              Fermées
            </button>
            <button
              onClick={() => setActiveFilter("24h")}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all active:scale-95 ${
                activeFilter === "24h" ? "bg-green-700 text-white" : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"
              }`}
            >
              🌙 Garde 24h
            </button>
            <button
              onClick={() => setActiveFilter("near")}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all active:scale-95 ${
                activeFilter === "near" ? "bg-green-700 text-white" : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"
              }`}
            >
              📍 &lt; 2km
            </button>
          </section>

          <section className="mt-4 px-4 flex justify-end">
            <button className="flex items-center gap-1 text-sm text-gray-600 active:opacity-70 transition-opacity">
              Trier par : <span className="text-green-700 font-bold">Distance</span>
              <span className="material-symbols-outlined text-sm">expand_more</span>
            </button>
          </section>

          <div className="mt-4 px-4 space-y-4 pb-12">
            {filteredPharmacies.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
                <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">local_pharmacy</span>
                <p className="text-gray-600 text-lg font-semibold">Aucune pharmacie trouvée</p>
              </div>
            ) : (
              filteredPharmacies.map((pharmacy) => {
                const isOpen = isPharmacyOpen(pharmacy);
                const is24h = isPharmacy24h(pharmacy);
                const distance = getDistance(pharmacy);
                const rating = getRating(pharmacy);

                return (
                  <div
                    key={pharmacy.id}
                    className={`bg-white rounded-2xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow ${
                      !isOpen ? "opacity-80" : ""
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        {isOpen && !is24h && (
                          <span className="text-[10px] font-bold text-green-600 uppercase tracking-wider bg-green-50 px-2 py-0.5 rounded">Ouvert</span>
                        )}
                        {is24h && (
                          <span className="text-[10px] font-bold text-green-700 bg-green-100 uppercase tracking-wider px-2 py-0.5 rounded">Garde 24h</span>
                        )}
                        {!isOpen && (
                          <span className="text-[10px] font-bold text-red-600 bg-red-100 uppercase tracking-wider px-2 py-0.5 rounded">Fermé</span>
                        )}
                        <h3 className="text-xl font-bold text-gray-900 mt-1">{pharmacy.name}</h3>
                      </div>
                      <button className="text-gray-400 hover:text-red-500 transition-colors">
                        <span className="material-symbols-outlined">favorite</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-1 mt-1 text-gray-500 text-sm">
                      <span className="material-symbols-outlined text-base">location_on</span>
                      <span>{pharmacy.city || "Ouagadougou"}, {pharmacy.address || "Zone Commerciale"}</span>
                    </div>

                    <div className="mt-3 flex items-center gap-4 text-sm font-semibold">
                      <span className="flex items-center gap-1 text-green-700">
                        <span className="material-symbols-outlined text-sm">near_me</span>
                        {distance} km
                      </span>
                      <span className="flex items-center gap-1 text-gray-600">
                        <span className="material-symbols-outlined text-sm">schedule</span>
                        {Math.round(parseFloat(distance) * 12)} min
                      </span>
                      <span className="flex items-center gap-1 text-orange-500">
                        <span className="material-symbols-outlined text-sm">star</span>
                        {rating}
                      </span>
                    </div>

                    <div className="mt-2 flex items-center gap-2">
                      {isOpen && !is24h && <span className="text-xs font-medium text-green-600">Ouvert jusqu'à 20h00</span>}
                      {is24h && <span className="text-xs font-medium text-green-700">Ouvert 24h/24</span>}
                      {!isOpen && <span className="text-xs font-medium text-red-600">Ouvre demain à 08h00</span>}
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="text-[11px] bg-green-50 text-green-700 px-2 py-1 rounded-md font-bold">💊 Stock élevé</span>
                      <span className="text-[11px] bg-green-50 text-green-700 px-2 py-1 rounded-md font-bold"> Parking</span>
                      <span className="text-[11px] bg-green-50 text-green-700 px-2 py-1 rounded-md font-bold">♿ Accessible</span>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${pharmacy.address || pharmacy.city || "Ouagadougou"}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green-50 text-green-700 h-12 rounded-xl font-bold active:scale-95 transition-transform flex items-center justify-center gap-2"
                      >
                        <span className="material-symbols-outlined text-xl">directions</span>
                        Itinéraire
                      </a>
                      <Link
                        href={`/dashboard/pharmacies/${pharmacy.id}`}
                        className="bg-green-700 text-white h-12 rounded-xl font-bold active:scale-95 transition-transform flex items-center justify-center"
                      >
                        Voir la pharmacie
                      </Link>
                    </div>
                  </div>
                );
              })
            )}

            {/* Pharmacies supplémentaires pour le scroll */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Pharmacie Espoir</h3>
              <div className="flex items-center gap-1 mt-1 text-gray-500 text-sm">
                <span className="material-symbols-outlined text-base">location_on</span>
                <span>Ouagadougou, Secteur 15</span>
              </div>
              <div className="mt-3 flex items-center gap-4 text-sm font-semibold">
                <span className="flex items-center gap-1 text-green-700">
                  <span className="material-symbols-outlined text-sm">near_me</span> 4.2 km
                </span>
                <span className="flex items-center gap-1 text-orange-500">
                  <span className="material-symbols-outlined text-sm">star</span> 4.7
                </span>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <a href="#" className="bg-green-50 text-green-700 h-12 rounded-xl font-bold flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-xl">directions</span> Itinéraire
                </a>
                <button className="bg-green-700 text-white h-12 rounded-xl font-bold flex items-center justify-center">Voir</button>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Pharmacie du Bonheur</h3>
              <div className="flex items-center gap-1 mt-1 text-gray-500 text-sm">
                <span className="material-symbols-outlined text-base">location_on</span>
                <span>Ouagadougou, Ouaga 2000</span>
              </div>
              <div className="mt-3 flex items-center gap-4 text-sm font-semibold">
                <span className="flex items-center gap-1 text-green-700">
                  <span className="material-symbols-outlined text-sm">near_me</span> 5.8 km
                </span>
                <span className="flex items-center gap-1 text-orange-500">
                  <span className="material-symbols-outlined text-sm">star</span> 4.9
                </span>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <a href="#" className="bg-green-50 text-green-700 h-12 rounded-xl font-bold flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-xl">directions</span> Itinéraire
                </a>
                <button className="bg-green-700 text-white h-12 rounded-xl font-bold flex items-center justify-center">Voir</button>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Pharmacie de la Nuit</h3>
              <div className="flex items-center gap-1 mt-1 text-gray-500 text-sm">
                <span className="material-symbols-outlined text-base">location_on</span>
                <span>Ouagadougou, Patte d'Oie</span>
              </div>
              <div className="mt-3 flex items-center gap-4 text-sm font-semibold">
                <span className="flex items-center gap-1 text-green-700">
                  <span className="material-symbols-outlined text-sm">near_me</span> 3.7 km
                </span>
                <span className="flex items-center gap-1 text-orange-500">
                  <span className="material-symbols-outlined text-sm">star</span> 4.6
                </span>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <a href="#" className="bg-green-50 text-green-700 h-12 rounded-xl font-bold flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-xl">directions</span> Itinéraire
                </a>
                <button className="bg-green-700 text-white h-12 rounded-xl font-bold flex items-center justify-center">Voir</button>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Pharmacie Saint-Jean</h3>
              <div className="flex items-center gap-1 mt-1 text-gray-500 text-sm">
                <span className="material-symbols-outlined text-base">location_on</span>
                <span>Ouagadougou, Kamsaoghin</span>
              </div>
              <div className="mt-3 flex items-center gap-4 text-sm font-semibold">
                <span className="flex items-center gap-1 text-green-700">
                  <span className="material-symbols-outlined text-sm">near_me</span> 6.1 km
                </span>
                <span className="flex items-center gap-1 text-orange-500">
                  <span className="material-symbols-outlined text-sm">star</span> 4.4
                </span>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <a href="#" className="bg-green-50 text-green-700 h-12 rounded-xl font-bold flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-xl">directions</span> Itinéraire
                </a>
                <button className="bg-green-700 text-white h-12 rounded-xl font-bold flex items-center justify-center">Voir</button>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Pharmacie du Parc</h3>
              <div className="flex items-center gap-1 mt-1 text-gray-500 text-sm">
                <span className="material-symbols-outlined text-base">location_on</span>
                <span>Ouagadougou, Centre-ville</span>
              </div>
              <div className="mt-3 flex items-center gap-4 text-sm font-semibold">
                <span className="flex items-center gap-1 text-green-700">
                  <span className="material-symbols-outlined text-sm">near_me</span> 2.3 km
                </span>
                <span className="flex items-center gap-1 text-orange-500">
                  <span className="material-symbols-outlined text-sm">star</span> 4.8
                </span>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <a href="#" className="bg-green-50 text-green-700 h-12 rounded-xl font-bold flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-xl">directions</span> Itinéraire
                </a>
                <button className="bg-green-700 text-white h-12 rounded-xl font-bold flex items-center justify-center">Voir</button>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Pharmacie Laafi</h3>
              <div className="flex items-center gap-1 mt-1 text-gray-500 text-sm">
                <span className="material-symbols-outlined text-base">location_on</span>
                <span>Ouagadougou, Gounghin</span>
              </div>
              <div className="mt-3 flex items-center gap-4 text-sm font-semibold">
                <span className="flex items-center gap-1 text-green-700">
                  <span className="material-symbols-outlined text-sm">near_me</span> 7.2 km
                </span>
                <span className="flex items-center gap-1 text-orange-500">
                  <span className="material-symbols-outlined text-sm">star</span> 4.5
                </span>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <a href="#" className="bg-green-50 text-green-700 h-12 rounded-xl font-bold flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-xl">directions</span> Itinéraire
                </a>
                <button className="bg-green-700 text-white h-12 rounded-xl font-bold flex items-center justify-center">Voir</button>
              </div>
            </div>
          </div>
        </main>
      </div>
      {!sidebarOpen && (
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-2xl border-t border-gray-200">
        <div className="flex justify-around items-center px-2 py-3 pb-safe">
          <Link href="/dashboard" className={`flex flex-col items-center justify-center px-4 py-1 rounded-2xl transition-all ${pathname === "/dashboard" ? "bg-green-400 text-white" : "text-gray-600 hover:text-green-700"}`}>
            <span className="material-symbols-outlined text-2xl">home</span>
            <span className="text-xs font-semibold mt-0.5">Accueil</span>
          </Link>
          <Link href="/dashboard/search" className={`flex flex-col items-center justify-center px-4 py-1 rounded-2xl transition-all ${pathname === "/dashboard/search" ? "bg-green-400 text-white" : "text-gray-600 hover:text-green-700"}`}>
            <span className="material-symbols-outlined text-2xl">search</span>
            <span className="text-xs font-semibold mt-0.5">Recherche</span>
          </Link>
          <Link href="/dashboard/pharmacies" className={`flex flex-col items-center justify-center px-4 py-1 rounded-2xl transition-all ${pathname === "/dashboard/pharmacies" ? "bg-green-400 text-white" : "text-gray-600 hover:text-green-700"}`}>
            <span className="material-symbols-outlined text-2xl">map</span>
            <span className="text-xs font-semibold mt-0.5">Carte</span>
          </Link>
          <Link href="/dashboard/reservations" className={`flex flex-col items-center justify-center px-4 py-1 rounded-2xl transition-all ${pathname === "/dashboard/reservations" ? "bg-green-400 text-white" : "text-gray-600 hover:text-green-700"}`}>
            <span className="material-symbols-outlined text-2xl">event_note</span>
            <span className="text-xs font-semibold mt-0.5">Réservations</span>
          </Link>
          <Link href="/dashboard/profile" className={`flex flex-col items-center justify-center px-4 py-1 rounded-2xl transition-all ${pathname === "/dashboard/profile" ? "bg-green-400 text-white" : "text-gray-600 hover:text-green-700"}`}>
            <span className="material-symbols-outlined text-2xl">person</span>
            <span className="text-xs font-semibold mt-0.5">Profil</span>
          </Link>
        </div>
      </nav>
      )}
    </div>
  );
}