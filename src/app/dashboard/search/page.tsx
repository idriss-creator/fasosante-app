"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import UserSidebar from "@/components/UserSidebar";
import { searchPharmaciesByMedicine } from "@/services/pharmacies";
import { getStocks } from "@/services/stocks";
import { getMedicines } from "@/services/medicines";
import { getPharmacies } from "@/services/pharmacies";

export default function SearchPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [stocks, setStocks] = useState<any[]>([]);
  const [medicines, setMedicines] = useState<any[]>([]);
  const [pharmacies, setPharmacies] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const handleSearch = async () => {
    const pharmacies = await searchPharmaciesByMedicine(search);
    setResults(pharmacies);
  };

  const getMedicineName = (id: string) => medicines.find((m) => m.id === id)?.name || "";
  const getPharmacyName = (id: string) => pharmacies.find((p) => p.id === id)?.name || "";

  const filteredStocks = stocks.filter((stock) =>
    getMedicineName(stock.medicineId).toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const load = async () => {
      const [stocksData, medicinesData, pharmaciesData] = await Promise.all([
        getStocks(),
        getMedicines(),
        getPharmacies(),
      ]);
      setStocks(stocksData);
      setMedicines(medicinesData);
      setPharmacies(pharmaciesData);
    };
    load();
  }, []);

  const getStatusBadge = (quantity: number) => {
    if (quantity === 0) return { bg: "bg-red-100", text: "text-red-700", icon: "cancel", label: "Rupture" };
    if (quantity < 10) return { bg: "bg-orange-100", text: "text-orange-700", icon: "warning", label: "Faible" };
    return { bg: "bg-green-100", text: "text-green-700", icon: "check_circle", label: "En stock" };
  };

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

        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md shadow-sm">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.back()}
                className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <span className="material-symbols-outlined text-green-700">arrow_back</span>
              </button>
              <h1 className="text-xl font-bold text-green-700">Recherche</h1>
            </div>
            <div className="w-10 h-10 rounded-full overflow-hidden bg-green-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-green-700">person</span>
            </div>
          </div>

          <div className="px-4 pb-4">
            <div className="relative flex items-center w-full bg-white rounded-xl border border-gray-200 focus-within:border-green-600 focus-within:ring-2 focus-within:ring-green-500/20 transition-all h-12 shadow-sm">
              <span className="material-symbols-outlined text-green-600 ml-3 mr-2">search</span>
              <input
                className="flex-grow bg-transparent border-none text-gray-900 focus:ring-0 p-0 placeholder-gray-500 outline-none"
                placeholder="Rechercher un médicament..."
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <div className="h-6 w-[1px] bg-gray-300 mx-2"></div>
              <button className="relative text-gray-600 hover:text-green-700 p-2 mr-1 flex-shrink-0 active:scale-95 transition-transform">
                <span className="material-symbols-outlined">tune</span>
                {activeFilter !== "all" && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                )}
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 pb-24">
          <section className="px-4 py-4 bg-white border-b border-gray-200">
            <p className="text-sm text-gray-600 mb-3">{filteredStocks.length} résultats · Ouagadougou</p>
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => setActiveFilter("all")}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
                  activeFilter === "all" ? "bg-green-100 text-green-700 border-green-600/20" : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                }`}
              >
                Tous
              </button>
              <button
                onClick={() => setActiveFilter("stock")}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
                  activeFilter === "stock" ? "bg-green-100 text-green-700 border-green-600/20" : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                }`}
              >
                En stock
              </button>
              <button
                onClick={() => setActiveFilter("low")}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
                  activeFilter === "low" ? "bg-green-100 text-green-700 border-green-600/20" : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                }`}
              >
                Stock faible
              </button>
            </div>
          </section>

          <section className="px-4 py-6 space-y-4">
            {search && filteredStocks.length === 0 && (
              <div className="text-center py-12">
                <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">search_off</span>
                <p className="text-gray-600 text-lg">Aucun résultat pour "{search}"</p>
                <p className="text-gray-500 text-sm mt-2">Essayez avec un autre nom de médicament</p>
              </div>
            )}

            {filteredStocks.map((stock) => {
              const status = getStatusBadge(stock.quantity);
              const medicineName = getMedicineName(stock.medicineId);
              const pharmacyName = getPharmacyName(stock.pharmacyId);

              return (
                <article
                  key={stock.id}
                  className={`bg-white rounded-2xl p-5 shadow-md border relative ${
                    stock.quantity === 0 ? "border-red-200 opacity-75" : "border-gray-100"
                  }`}
                >
                  <div className={`absolute top-4 right-4 ${status.bg} ${status.text} text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1`}>
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>{status.icon}</span>
                    {status.label}
                  </div>

                  <h2 className="text-xl font-bold text-gray-900 pr-24">{medicineName}</h2>
                  <p className="text-sm text-gray-600 mt-1">Stock: {stock.quantity} unités</p>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-gray-500 text-lg mt-0.5">local_hospital</span>
                      <span className="text-sm text-gray-600">{pharmacyName}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-gray-500 text-lg mt-0.5">inventory_2</span>
                      <span className="text-sm text-gray-600">Quantité disponible : <strong className="text-gray-900">{stock.quantity}</strong></span>
                    </div>
                  </div>

                  <div className="mt-5 flex gap-3">
                    {stock.quantity > 0 ? (
                      <>
                        <Link
                          href={`/dashboard/reservations/new?medicine=${stock.medicineId}`}
                          className="flex-1 bg-green-700 hover:bg-green-800 text-white font-semibold py-3 rounded-lg transition-colors h-[52px] flex items-center justify-center"
                        >
                          Réserver
                        </Link>
                        <Link
                          href={`/dashboard/pharmacies/${stock.pharmacyId}`}
                          className="flex-1 bg-green-100 hover:bg-green-200 text-green-700 font-semibold py-3 rounded-lg transition-colors h-[52px] flex items-center justify-center gap-2"
                        >
                          <span className="material-symbols-outlined">map</span>
                          Voir sur carte
                        </Link>
                      </>
                    ) : (
                      <button className="w-full bg-gray-100 text-gray-600 font-semibold py-3 rounded-lg transition-colors h-[52px] flex items-center justify-center gap-2 border border-gray-300">
                        <span className="material-symbols-outlined">notifications</span>
                        M'alerter du réassort
                      </button>
                    )}
                  </div>
                </article>
              );
            })}

            {results.length > 0 && (
              <>
                <h3 className="text-lg font-bold text-gray-900 mt-8 mb-4">Pharmacies correspondantes</h3>
                {results.map((pharmacy) => (
                  <article key={pharmacy.id} className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">{pharmacy.name}</h2>
                    <div className="mt-3 space-y-2">
                      <div className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-gray-500 text-lg mt-0.5">location_on</span>
                        <span className="text-sm text-gray-600">{pharmacy.city}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-gray-500 text-lg mt-0.5">call</span>
                        <span className="text-sm text-gray-600">{pharmacy.phone}</span>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-3">
                      <Link
                        href={`/dashboard/pharmacies/${pharmacy.id}`}
                        className="flex-1 bg-green-700 hover:bg-green-800 text-white font-semibold py-3 rounded-lg transition-colors text-center"
                      >
                        Voir détails
                      </Link>
                    </div>
                  </article>
                ))}
              </>
            )}

            {!search && (
              <div className="text-center py-12">
                <span className="material-symbols-outlined text-7xl text-green-200 mb-4">search</span>
                <p className="text-gray-600 text-lg">Commencez votre recherche</p>
                <p className="text-gray-500 text-sm mt-2">Tapez le nom d'un médicament pour voir les disponibilités</p>
              </div>
            )}
          </section>
        </main>
      </div>

      
      {/* ✅ Bottom Navigation EN DEHORS du div animé - FIXE */}
      {!sidebarOpen && (
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-2xl border-t border-gray-200">
        <div className="flex justify-around items-center px-2 py-3 pb-safe">
          <Link 
            href="/dashboard" 
            className={`flex flex-col items-center justify-center px-4 py-1 rounded-2xl transition-all ${
              pathname === "/dashboard" ? "bg-green-400 text-white" : "text-gray-600 hover:text-green-700"
            }`}
          >
            <span className="material-symbols-outlined text-2xl">home</span>
            <span className="text-xs font-semibold mt-0.5">Accueil</span>
          </Link>
          
          <Link 
            href="/dashboard/search" 
            className={`flex flex-col items-center justify-center px-4 py-1 rounded-2xl transition-all ${
              pathname === "/dashboard/search" ? "bg-green-400 text-white" : "text-gray-600 hover:text-green-700"
            }`}
          >
            <span className="material-symbols-outlined text-2xl">search</span>
            <span className="text-xs font-semibold mt-0.5">Recherche</span>
          </Link>
          
          <Link 
            href="/dashboard/pharmacies" 
            className={`flex flex-col items-center justify-center px-4 py-1 rounded-2xl transition-all ${
              pathname === "/dashboard/pharmacies" ? "bg-green-400 text-white" : "text-gray-600 hover:text-green-700"
            }`}
          >
            <span className="material-symbols-outlined text-2xl">map</span>
            <span className="text-xs font-semibold mt-0.5">Carte</span>
          </Link>
          
          <Link 
            href="/dashboard/reservations" 
            className={`flex flex-col items-center justify-center px-4 py-1 rounded-2xl transition-all ${
              pathname === "/dashboard/reservations" ? "bg-green-400 text-white" : "text-gray-600 hover:text-green-700"
            }`}
          >
            <span className="material-symbols-outlined text-2xl">event_note</span>
            <span className="text-xs font-semibold mt-0.5">Réservations</span>
          </Link>
          
          <Link 
            href="/dashboard/profile" 
            className={`flex flex-col items-center justify-center px-4 py-1 rounded-2xl transition-all ${
              pathname === "/dashboard/profile" ? "bg-green-400 text-white" : "text-gray-600 hover:text-green-700"
            }`}
          >
            <span className="material-symbols-outlined text-2xl">person</span>
            <span className="text-xs font-semibold mt-0.5">Profil</span>
          </Link>
        </div>
      </nav>
      )}
    </div>
  );
}