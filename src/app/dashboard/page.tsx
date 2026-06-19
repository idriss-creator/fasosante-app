"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { auth } from "@/services/firebase";
import { getPartnerRequests } from "@/services/partnerRequests";
import useUserRole from "@/hooks/useUserRole";
import { getMedicinesCount } from "@/services/medicines";
import { getPharmaciesCount } from "@/services/pharmacies";
import { getUsersCount } from "@/services/auth";
import { getLowStocksCount, getOutOfStockCount, getStocksCount } from "@/services/stocks";
import OwnerSidebar from "@/components/OwnerSidebar";
import UserSidebar from "@/components/UserSidebar";

export default function DashboardPage() {
  const { role, loading } = useUserRole();
  const router = useRouter();
  const pathname = usePathname();
  const user = auth.currentUser;

  // ✅ TOUS les states EN HAUT
  const [medicines, setMedicines] = useState(0);
  const [pharmacies, setPharmacies] = useState(0);
  const [users, setUsers] = useState(0);
  const [stockCount, setStockCount] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [outOfStockCount, setOutOfStockCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [requestsCount, setRequestsCount] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
   
  const today = new Date().toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // ✅ TOUS les useEffect EN HAUT, avant tout if/return
  useEffect(() => {
    if (!loading && !role) {
      router.push("/login");
    }
  }, [role, loading, router]);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [m, p, u, stocks, low, out] = await Promise.all([
          getMedicinesCount(),
          getPharmaciesCount(),
          getUsersCount(),
          getStocksCount(),
          getLowStocksCount(),
          getOutOfStockCount(),
        ]);

        setMedicines(m);
        setPharmacies(p);
        setUsers(u);
        setStockCount(stocks);
        setLowStockCount(low);
        setOutOfStockCount(out);
      } catch (error) {
        console.error("Erreur chargement stats:", error);
      }
    };

    loadStats();
  }, []);

  // ✅ CE useEffect doit être ICI, avant le if (loading)
  useEffect(() => {
    const loadPartnerRequests = async () => {
      try {
        const requests = await getPartnerRequests();
        setRequestsCount(requests.length);
        setPendingCount(requests.filter((r) => r.status === "pending").length);
      } catch (error) {
        console.error("Erreur chargement demandes partenaires:", error);
      }
    };
    loadPartnerRequests();
  }, []);

  // ❌ APRÈS tous les hooks, tu peux faire des if/return
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <p className="text-gray-600">Chargement...</p>
      </div>
    );
  }

  console.log("🎭 MON RÔLE EST:", role);

  if (role === "user") {
    return (
      // ... ton code user (inchangé)
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-[rgb(0,135,122)]">
      {/* Sidebar en arrière-plan */}
      <UserSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content qui glisse par-dessus */}
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
                onClick={() => setSidebarOpen(true)}
                className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <span className="material-symbols-outlined text-green-700">menu</span>
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold shadow-md">
                  {user?.email?.charAt(0).toUpperCase() || "U"}
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">Bonjour, {user?.email?.split("@")[0]}</h1>
                  <div className="flex items-center text-gray-500 text-xs">
                    <span className="material-symbols-outlined text-sm mr-0.5">location_on</span>
                    <span>Ouagadougou, Burkina Faso</span>
                  </div>
                </div>
              </div>
            </div>
            <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white"></span>
            </button>
          </div>
        </header>

        <main className="px-4 pt-6 space-y-8 max-w-5xl mx-auto w-full pb-24">
          {/* Zone Recherche */}
          <section className="space-y-3">
            <div className="relative w-full shadow-lg rounded-2xl bg-white overflow-hidden">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <span className="material-symbols-outlined text-green-600 text-2xl">search</span>
              </div>
              <input
                className="block w-full pl-12 pr-24 py-4 text-gray-900 bg-transparent border-none focus:ring-2 focus:ring-green-500/20 text-base placeholder-gray-400 h-14"
                placeholder="Quel médicament cherchez-vous ?"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && router.push(`/dashboard/search?q=${search}`)}
              />
              <button
                onClick={() => router.push(`/dashboard/search?q=${search}`)}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition-colors text-sm font-semibold"
              >
                Rechercher
              </button>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 hide-scrollbar">
              <button
                onClick={() => router.push("/dashboard/search?q=Paracétamol")}
                className="whitespace-nowrap bg-white shadow-md text-green-700 px-5 py-2.5 rounded-full text-sm font-semibold hover:shadow-lg transition-all flex items-center gap-2 border border-green-100"
              >
                <span className="material-symbols-outlined text-base">pill</span> Paracétamol
              </button>
              <button
                onClick={() => router.push("/dashboard/search?q=Amoxicilline")}
                className="whitespace-nowrap bg-white shadow-md text-green-700 px-5 py-2.5 rounded-full text-sm font-semibold hover:shadow-lg transition-all flex items-center gap-2 border border-green-100"
              >
                <span className="material-symbols-outlined text-base">medication_liquid</span> Amoxicilline
              </button>
              <button
                onClick={() => router.push("/dashboard/search?q=Ibuprofène")}
                className="whitespace-nowrap bg-white shadow-md text-green-700 px-5 py-2.5 rounded-full text-sm font-semibold hover:shadow-lg transition-all flex items-center gap-2 border border-green-100"
              >
                <span className="material-symbols-outlined text-base">medical_services</span> Ibuprofène
              </button>
              <button
                onClick={() => router.push("/dashboard/search?q=Coartem")}
                className="whitespace-nowrap bg-white shadow-md text-green-700 px-5 py-2.5 rounded-full text-sm font-semibold hover:shadow-lg transition-all flex items-center gap-2 border border-green-100"
              >
                <span className="material-symbols-outlined text-base">local_pharmacy</span> Coartem
              </button>
            </div>
          </section>

          {/* Pharmacies proches */}
          <section className="space-y-4">
            <div className="flex justify-between items-end">
              <h2 className="text-xl font-bold text-gray-900">Pharmacies près de vous</h2>
              <Link href="/dashboard/pharmacies" className="text-sm font-semibold text-green-700 hover:underline">
                Voir sur la carte →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl p-5 shadow-md hover:shadow-xl transition-shadow border border-gray-100">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Pharmacie Koulouba</h3>
                    <div className="flex items-center text-gray-500 text-sm">
                      <span className="material-symbols-outlined text-sm mr-1">location_on</span>
                      <span className="truncate">Avenue Kwame Nkrumah</span>
                    </div>
                  </div>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase">Ouvert</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-3">
                  <span className="text-sm font-semibold text-gray-600 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm text-orange-500">near_me</span> 1.2 km
                  </span>
                  <Link href="/dashboard/pharmacies/1" className="bg-green-50 text-green-700 px-5 py-2 rounded-full text-sm font-bold hover:bg-green-100 transition-colors border border-green-200">
                    Voir
                  </Link>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-md hover:shadow-xl transition-shadow border border-gray-100">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Pharmacie Laafi</h3>
                    <div className="flex items-center text-gray-500 text-sm">
                      <span className="material-symbols-outlined text-sm mr-1">location_on</span>
                      <span className="truncate">Gounghin, Ouagadougou</span>
                    </div>
                  </div>
                  <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold uppercase">Fermé</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-3">
                  <span className="text-sm font-semibold text-gray-600 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm text-orange-500">near_me</span> 2.5 km
                  </span>
                  <Link href="/dashboard/pharmacies/2" className="bg-green-50 text-green-700 px-5 py-2 rounded-full text-sm font-bold hover:bg-green-100 transition-colors border border-green-200">
                    Voir
                  </Link>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-md hover:shadow-xl transition-shadow border border-gray-100">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Pharmacie du Marché</h3>
                    <div className="flex items-center text-gray-500 text-sm">
                      <span className="material-symbols-outlined text-sm mr-1">location_on</span>
                      <span className="truncate">Grand Marché Rood Woko</span>
                    </div>
                  </div>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase">Ouvert</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-3">
                  <span className="text-sm font-semibold text-gray-600 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm text-orange-500">near_me</span> 3.1 km
                  </span>
                  <Link href="/dashboard/pharmacies/3" className="bg-green-50 text-green-700 px-5 py-2 rounded-full text-sm font-bold hover:bg-green-100 transition-colors border border-green-200">
                    Voir
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Réservations actives */}
          <section className="space-y-4">
            <div className="flex justify-between items-end">
              <h2 className="text-xl font-bold text-gray-900">Mes réservations</h2>
              <Link href="/dashboard/reservations" className="text-sm font-semibold text-green-700 hover:underline">
                Tout voir →
              </Link>
            </div>
            <div className="space-y-3">
              <div className="bg-white rounded-2xl p-5 shadow-md hover:shadow-lg transition-shadow border border-gray-100 flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-400 to-green-600 text-white flex items-center justify-center shrink-0 shadow-md">
                  <span className="material-symbols-outlined text-2xl">vaccines</span>
                </div>
                <div className="flex-grow flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-bold text-gray-900">Paracétamol 500mg</h3>
                      <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold">En attente</span>
                    </div>
                    <div className="text-gray-600 text-sm mt-1 font-medium">Pharmacie Koulouba</div>
                    <div className="text-gray-400 text-xs mt-0.5">Aujourd'hui, 14:30</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-md hover:shadow-lg transition-shadow border border-gray-100 flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-400 to-green-600 text-white flex items-center justify-center shrink-0 shadow-md">
                  <span className="material-symbols-outlined text-2xl">medication</span>
                </div>
                <div className="flex-grow flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-bold text-gray-900">Amoxicilline Sandoz</h3>
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">Prête</span>
                    </div>
                    <div className="text-gray-600 text-sm mt-1 font-medium">Pharmacie Laafi</div>
                    <div className="text-gray-400 text-xs mt-0.5">Hier, 10:15</div>
                  </div>
                </div>
              </div>
            </div>
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
// ====== DASHBOARD PHARMACIEN ======
if (role === "owner") {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar Owner */}
        <OwnerSidebar />

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0 bg-white/50 relative overflow-hidden">
          {/* Top Bar */}
          <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 flex justify-between items-center w-full px-8 py-5 z-30 shadow-sm">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900">Bonjour, {user?.email?.split('@')[0]} 👋</h2>
              <p className="text-sm text-gray-500 mt-1 font-medium">Aujourd'hui, {today}</p>
            </div>
            <Link
              href="/dashboard/medicines/add"
              className="h-12 px-6 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold rounded-xl flex items-center gap-2 hover:shadow-xl hover:scale-105 transition-all shadow-lg"
            >
              <span className="material-symbols-outlined text-xl">add_business</span>
              <span>Ajouter</span>
            </Link>
          </header>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-7xl mx-auto space-y-8">
              {/* KPIs */}
              <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-3xl p-7 shadow-xl hover:shadow-2xl transition-all border border-gray-100 hover:scale-105">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-4 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl text-white shadow-lg">
                      <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>pill</span>
                    </div>
                    <span className="flex items-center text-green-600 text-sm font-bold bg-green-100 px-3 py-1.5 rounded-full">
                      <span className="material-symbols-outlined text-xs mr-1">trending_up</span> En stock
                    </span>
                  </div>
                  <h3 className="text-gray-600 mb-2 font-semibold">Médicaments</h3>
                  <p className="text-5xl font-extrabold text-gray-900">{medicines}</p>
                </div>

                <div className="bg-white rounded-3xl p-7 shadow-xl hover:shadow-2xl transition-all border border-gray-100 hover:scale-105">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-4 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl text-white shadow-lg">
                      <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>inventory</span>
                    </div>
                  </div>
                  <h3 className="text-gray-600 mb-2 font-semibold">Produits en stock</h3>
                  <p className="text-5xl font-extrabold text-gray-900">{stockCount}</p>
                </div>

                <div className="bg-white rounded-3xl p-7 shadow-xl hover:shadow-2xl transition-all border border-gray-100 hover:scale-105">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-4 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl text-white shadow-lg">
                      <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>receipt_long</span>
                    </div>
                  </div>
                  <h3 className="text-gray-600 mb-2 font-semibold">Réservations actives</h3>
                  <p className="text-5xl font-extrabold text-gray-900">28</p>
                </div>

                <div className="bg-white rounded-3xl p-7 shadow-xl hover:shadow-2xl transition-all border border-red-200 relative overflow-hidden hover:scale-105">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-bl-full"></div>
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className="p-4 bg-gradient-to-br from-red-400 to-red-600 rounded-2xl text-white shadow-lg">
                      <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
                    </div>
                    <span className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md z-10">Urgent</span>
                  </div>
                  <h3 className="text-gray-600 mb-2 font-semibold">Alertes stock</h3>
                  <p className="text-5xl font-extrabold text-red-600">{lowStockCount + outOfStockCount}</p>
                </div>
              </section>

              {/* Alertes et Activité */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Alertes */}
                <section className="space-y-5 bg-white p-7 rounded-3xl border border-gray-200 shadow-xl">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900">Alertes en cours</h2>
                    <Link href="/dashboard/alerts" className="text-green-700 font-bold hover:underline flex items-center gap-1">
                      Tout voir <span className="material-symbols-outlined text-lg">arrow_forward</span>
                    </Link>
                  </div>
                  <div className="space-y-4">
                    {lowStockCount > 0 && (
                      <div className="bg-gradient-to-r from-orange-50 to-orange-100/50 border-l-4 border-orange-500 p-5 rounded-2xl flex items-center justify-between shadow-md">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-orange-100 rounded-full text-orange-600 shadow-md">
                            <span className="material-symbols-outlined text-2xl">warning</span>
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 text-lg">Stock critique</p>
                            <p className="text-sm text-gray-600 mt-0.5">{lowStockCount} médicaments en stock faible</p>
                          </div>
                        </div>
                        <Link href="/dashboard/stocks" className="px-5 py-2.5 bg-white border-2 border-gray-200 rounded-xl font-bold text-gray-900 hover:border-orange-300 hover:bg-orange-50 transition-all shadow-sm">
                          Voir
                        </Link>
                      </div>
                    )}
                    {outOfStockCount > 0 && (
                      <div className="bg-gradient-to-r from-red-50 to-red-100/50 border-l-4 border-red-500 p-5 rounded-2xl flex items-center justify-between shadow-md">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-red-100 rounded-full text-red-600 shadow-md">
                            <span className="material-symbols-outlined text-2xl">error</span>
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 text-lg">Rupture de stock</p>
                            <p className="text-sm text-gray-600 mt-0.5">{outOfStockCount} médicaments en rupture</p>
                          </div>
                        </div>
                        <Link href="/dashboard/stocks" className="px-5 py-2.5 bg-white border-2 border-gray-200 rounded-xl font-bold text-gray-900 hover:border-red-300 hover:bg-red-50 transition-all shadow-sm">
                          Voir
                        </Link>
                      </div>
                    )}
                  </div>
                </section>

                {/* Activité récente */}
                <section className="space-y-5 bg-white p-7 rounded-3xl border border-gray-200 shadow-xl flex flex-col">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900">Activité récente</h2>
                    <Link href="/dashboard/history" className="text-green-700 font-bold hover:underline flex items-center gap-1">
                      Historique <span className="material-symbols-outlined text-lg">arrow_forward</span>
                    </Link>
                  </div>
                  <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="py-3 px-2 font-semibold text-gray-500 text-sm">Date</th>
                          <th className="py-3 px-2 font-semibold text-gray-500 text-sm">Action</th>
                          <th className="py-3 px-2 font-semibold text-gray-500 text-sm">Utilisateur</th>
                          <th className="py-3 px-2 font-semibold text-gray-500 text-sm">Statut</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        <tr className="hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-2 text-sm text-gray-500">24 Oct, 14:20</td>
                          <td className="py-3 px-2 text-sm font-bold text-gray-900">Mise à jour stock</td>
                          <td className="py-3 px-2 text-sm text-gray-500">M. Traoré</td>
                          <td className="py-3 px-2">
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">Complété</span>
                          </td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-2 text-sm text-gray-500">24 Oct, 13:45</td>
                          <td className="py-3 px-2 text-sm font-bold text-gray-900">Nouvelle réservation</td>
                          <td className="py-3 px-2 text-sm text-gray-500">Client #442</td>
                          <td className="py-3 px-2">
                            <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold">En attente</span>
                          </td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-2 text-sm text-gray-500">24 Oct, 11:10</td>
                          <td className="py-3 px-2 text-sm font-bold text-gray-900">Alerte stock</td>
                          <td className="py-3 px-2 text-sm text-gray-500">Système</td>
                          <td className="py-3 px-2">
                            <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-bold">Urgent</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}  // ====== DASHBOARD ADMIN (par défaut) ======

 
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* SIDEBAR */}
      <aside className="w-60 bg-[#0F172A] text-white fixed h-screen left-0 top-0 flex flex-col z-50 shadow-2xl">
        {/* Logo */}
        <div className="h-20 px-6 flex items-center border-b border-white/10">
          <span className="material-symbols-outlined text-green-400 mr-3 text-3xl">health_and_safety</span>
          <span className="text-xl tracking-tight text-white font-bold">FASOSANTÉ</span>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
          <Link href="/dashboard" className="flex items-center px-4 py-3 bg-green-600 text-white rounded-lg transition-colors shadow-lg">
            <span className="material-symbols-outlined mr-3">dashboard</span>
            <span className="font-semibold">Tableau de bord</span>
          </Link>
          <Link href="/dashboard/pharmacies" className="flex items-center px-4 py-3 text-gray-400 hover:bg-white/5 hover:text-white rounded-lg transition-colors group">
            <span className="material-symbols-outlined mr-3 group-hover:text-green-400 transition-colors">local_hospital</span>
            <span className="font-semibold">Pharmacies</span>
          </Link>
          <Link href="/dashboard/users" className="flex items-center px-4 py-3 text-gray-400 hover:bg-white/5 hover:text-white rounded-lg transition-colors group">
            <span className="material-symbols-outlined mr-3 group-hover:text-green-400 transition-colors">group</span>
            <span className="font-semibold">Utilisateurs</span>
          </Link>
          <Link href="/dashboard/history" className="flex items-center px-4 py-3 text-gray-400 hover:bg-white/5 hover:text-white rounded-lg transition-colors group">
            <span className="material-symbols-outlined mr-3 group-hover:text-green-400 transition-colors">history</span>
            <span className="font-semibold">Historique</span>
          </Link>
          <Link href="/dashboard/map" className="flex items-center px-4 py-3 text-gray-400 hover:bg-white/5 hover:text-white rounded-lg transition-colors group">
            <span className="material-symbols-outlined mr-3 group-hover:text-green-400 transition-colors">map</span>
            <span className="font-semibold">Carte</span>
          </Link>
          <Link href="/dashboard/settings" className="flex items-center px-4 py-3 text-gray-400 hover:bg-white/5 hover:text-white rounded-lg transition-colors group">
            <span className="material-symbols-outlined mr-3 group-hover:text-green-400 transition-colors">settings</span>
            <span className="font-semibold">Paramètres</span>
          </Link>
          {/* ✅ NOUVEAU LIEN : Demandes Partenaires */}
          <Link href="/dashboard/admin/partner-requests" className="flex items-center px-4 py-3 text-gray-400 hover:bg-white/5 hover:text-white rounded-lg transition-colors group">
            <span className="material-symbols-outlined mr-3 group-hover:text-green-400 transition-colors">group_add</span>
            <span className="font-semibold">Demandes Partenaires</span>
            {pendingCount > 0 && (
              <span className="ml-auto bg-yellow-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {pendingCount}
              </span>
            )}
          </Link>
        </nav>
        
        {/* Footer Profile */}
        <div className="p-4 border-t border-white/10 mt-auto bg-[#1E293B]/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold shadow-lg">
              {user?.email?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-white text-sm truncate">Admin Principal</p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button 
            onClick={() => auth.signOut()}
            className="w-full flex items-center justify-center px-4 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all border border-white/5 hover:border-white/20"
          >
            <span className="material-symbols-outlined text-lg mr-2">logout</span>
            Déconnexion
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 ml-60 flex flex-col min-h-screen">
        {/* HEADER */}
        <header className="h-20 bg-white/80 backdrop-blur-md shadow-sm flex items-center justify-between px-8 sticky top-0 z-40 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
            <span className="text-sm text-gray-600 bg-green-50 px-3 py-1 rounded-full">
              Aujourd'hui, {today}
            </span>
          </div>
          <div className="flex items-center gap-6">
            {/* Search */}
            <div className="relative hidden md:block w-64">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">search</span>
              <input 
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-600 text-sm transition-all h-10" 
                placeholder="Rechercher..." 
                type="text" 
              />
            </div>
            {/* Add Button */}
            <Link 
              href="/dashboard/pharmacies/add"
              className="h-10 px-4 bg-green-600 text-white font-semibold rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-xl">add_circle</span>
              <span>Ajouter une pharmacie</span>
            </Link>
            {/* Notifications */}
            <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white"></span>
            </button>
          </div>
        </header>

        {/* DASHBOARD CONTENT */}
        <main className="flex-1 p-8 space-y-8 max-w-7xl mx-auto w-full">
          {/* KPIs */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* KPI 1 - Pharmacies */}
            <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                  <span className="material-symbols-outlined">local_hospital</span>
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                  <span className="material-symbols-outlined text-sm">arrow_upward</span>
                  {pharmacies} total
                </span>
              </div>
              <h3 className="text-sm text-gray-600 mb-1">Pharmacies actives</h3>
              <p className="text-3xl font-bold text-gray-900 leading-none">{pharmacies}</p>
            </div>

            {/* KPI 2 - Utilisateurs */}
            <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                  <span className="material-symbols-outlined">group</span>
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                  <span className="material-symbols-outlined text-sm">arrow_upward</span>
                  {users} total
                </span>
              </div>
              <h3 className="text-sm text-gray-600 mb-1">Utilisateurs</h3>
              <p className="text-3xl font-bold text-gray-900 leading-none">{users}</p>
            </div>

            {/* KPI 3 - Médicaments */}
            <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                  <span className="material-symbols-outlined">medication</span>
                </div>
              </div>
              <h3 className="text-sm text-gray-600 mb-1">Médicaments</h3>
              <p className="text-3xl font-bold text-gray-900 leading-none">{medicines}</p>
            </div>

            {/* KPI 4 - Alertes */}
            <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow border border-red-200">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600">
                  <span className="material-symbols-outlined">warning</span>
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                  Urgent
                </span>
              </div>
              <h3 className="text-sm text-gray-600 mb-1">Alertes stock</h3>
              <p className="text-3xl font-bold text-red-600 leading-none">{lowStockCount + outOfStockCount}</p>
            </div>
          </section>

          {/* WIDGETS ROW 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Nouvelles inscriptions */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
              <div className="p-5 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900">Nouvelles inscriptions</h2>
              </div>
              <ul className="divide-y divide-gray-100">
                <li className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                      AK
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Aminata Kaboré</p>
                      <p className="text-xs text-gray-600">aminata.k@email.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-gray-600">Il y a 2h</span>
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">Citoyen</span>
                  </div>
                </li>
                <li className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-sm">
                      SO
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Seydou Ouedraogo</p>
                      <p className="text-xs text-gray-600">pharma.seydou@email.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-gray-600">Il y a 5h</span>
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">Propriétaire</span>
                  </div>
                </li>
                <li className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm">
                      FC
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Fatou Compaoré</p>
                      <p className="text-xs text-gray-600">fatou.c@email.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-gray-600">Hier</span>
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">Citoyen</span>
                  </div>
                </li>
              </ul>
            </div>

            {/* ✅ Widget Demandes Partenaires avec compteurs dynamiques */}
            <div className="bg-white rounded-2xl p-5 shadow-md hover:shadow-xl transition-shadow border border-gray-100">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Demandes Partenaires</h3>
                  <div className="flex items-center text-gray-500 text-sm">
                    <span className="material-symbols-outlined text-sm mr-1">group_add</span>
                    <span>Gérer les demandes de pharmacie</span>
                  </div>
                </div>
                <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold">
                  {pendingCount} en attente
                </span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-3">
                <span className="text-sm font-semibold text-gray-600">
                  Total : {requestsCount} demandes
                </span>
                <Link
                  href="/dashboard/admin/partner-requests"
                  className="bg-green-50 text-green-700 px-5 py-2 rounded-full text-sm font-bold hover:bg-green-100 transition-colors border border-green-200"
                >
                  Gérer
                </Link>
              </div>
            </div>

            {/* Aperçu Carte */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Couverture territoriale</h2>
                <span className="material-symbols-outlined text-gray-600">map</span>
              </div>
              {/* Map avec image de fond */}
              <div 
                className="flex-1 bg-gray-200 rounded-lg relative overflow-hidden min-h-[250px] bg-cover bg-center"
                style={{
                  backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&h=400&fit=crop')",
                }}
              >
                <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px]"></div>
                {/* Map Pins */}
                <div className="absolute top-[30%] left-[40%] text-green-600 drop-shadow-lg animate-bounce">
                  <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
                </div>
                <div className="absolute top-[50%] left-[60%] text-green-600 drop-shadow-lg animate-bounce" style={{ animationDelay: '0.5s' }}>
                  <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
                </div>
                <div className="absolute top-[60%] left-[30%] text-green-600 drop-shadow-lg animate-bounce" style={{ animationDelay: '1s' }}>
                  <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
                </div>
                <div className="absolute top-[20%] left-[70%] text-green-600 drop-shadow-lg animate-bounce" style={{ animationDelay: '1.5s' }}>
                  <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
                </div>
              </div>
              <Link 
                href="/dashboard/map"
                className="mt-4 w-full h-12 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <span className="material-symbols-outlined">open_in_new</span>
                Ouvrir la carte complète
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}