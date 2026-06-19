"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import UserSidebar from "@/components/UserSidebar";
import { getUserReservations } from "@/services/reservations";
import { getMedicines } from "@/services/medicines";
import { getPharmacies } from "@/services/pharmacies";
import { auth } from "@/services/firebase";

type ReservationStatus = "pending" | "confirmed" | "completed" | "cancelled";
type FilterType = "all" | ReservationStatus;

type Reservation = {
  id: string;
  createdAt?: { toDate?: () => Date } | Date | string;
  status: ReservationStatus;
  medicineId?: string;
  pharmacyId?: string;
  quantity?: number;
  totalPrice?: number;
  transactionId?: string;
  cancelReason?: string;
};

export default function ReservationsPage() {
  const user = auth.currentUser;
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [medicines, setMedicines] = useState<any[]>([]);
  const [pharmacies, setPharmacies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;

      try {
        const [reservationsData, medicinesData, pharmaciesData] = await Promise.all([
          getUserReservations(user.uid),
          getMedicines(),
          getPharmacies(),
        ]);

        const sorted = reservationsData.sort((a, b) => {
          const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
          const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
          return dateB.getTime() - dateA.getTime();
        });

        setReservations(sorted);
        setMedicines(medicinesData);
        setPharmacies(pharmaciesData);
      } catch (error) {
        console.error("Erreur chargement réservations:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  const getMedicineName = (id: string) =>
    medicines.find((m) => m.id === id)?.name || "Médicament inconnu";

  const getPharmacyName = (id: string) =>
    pharmacies.find((p) => p.id === id)?.name || "Pharmacie inconnue";

  const formatDate = (date: any) => {
    if (!date) return "";
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusInfo = (status: ReservationStatus) => {
    switch (status) {
      case "pending":
        return {
          label: "En attente",
          border: "border-yellow-400",
          bg: "bg-yellow-50",
          text: "text-yellow-700",
          badge: "bg-yellow-100 text-yellow-700",
          icon: "medication",
          iconColor: "text-yellow-600",
          iconBg: "bg-yellow-50",
        };
      case "confirmed":
        return {
          label: "Confirmée",
          border: "border-green-600",
          bg: "bg-green-50",
          text: "text-green-700",
          badge: "bg-green-100 text-white",
          icon: "pill",
          iconColor: "text-green-700",
          iconBg: "bg-green-100",
        };
      case "completed":
        return {
          label: "Collectée",
          border: "border-blue-500",
          bg: "bg-blue-50",
          text: "text-blue-700",
          badge: "bg-blue-100 text-blue-700",
          icon: "task_alt",
          iconColor: "text-blue-600",
          iconBg: "bg-blue-50",
        };
      case "cancelled":
        return {
          label: "Annulée",
          border: "border-red-500",
          bg: "bg-red-50",
          text: "text-red-700",
          badge: "bg-red-100 text-red-700",
          icon: "block",
          iconColor: "text-red-600",
          iconBg: "bg-red-50",
        };
      default:
        return {
          label: "Inconnu",
          border: "border-gray-400",
          bg: "bg-gray-50",
          text: "text-gray-700",
          badge: "bg-gray-100 text-gray-700",
          icon: "help",
          iconColor: "text-gray-600",
          iconBg: "bg-gray-50",
        };
    }
  };

  const counts = {
    pending: reservations.filter((r) => r.status === "pending").length,
    confirmed: reservations.filter((r) => r.status === "confirmed").length,
    completed: reservations.filter((r) => r.status === "completed").length,
    cancelled: reservations.filter((r) => r.status === "cancelled").length,
  };

  const filteredReservations =
    activeFilter === "all"
      ? reservations
      : reservations.filter((r) => r.status === activeFilter);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de vos réservations...</p>
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

        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md shadow-sm flex items-center justify-between px-4 h-16 w-full">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <span className="material-symbols-outlined text-green-700">menu</span>
            </button>
            <h1 className="text-xl font-bold text-green-700">Mes réservations</h1>
          </div>
          <button className="active:scale-95 transition-transform hover:opacity-80">
            <span className="material-symbols-outlined text-green-700">filter_list</span>
          </button>
        </header>

        <main className="flex-1 pb-6 px-4 space-y-4 pt-4 max-w-5xl mx-auto w-full pb-24">
          <section className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
            <div className="flex-shrink-0 w-[110px] bg-white p-3 rounded-2xl shadow-sm border-l-4 border-yellow-400">
              <span className="text-xs font-bold text-yellow-700 block uppercase tracking-wider">En attente</span>
              <span className="text-2xl font-bold text-gray-900">{counts.pending}</span>
            </div>
            <div className="flex-shrink-0 w-[110px] bg-white p-3 rounded-2xl shadow-sm border-l-4 border-green-600">
              <span className="text-xs font-bold text-green-700 block uppercase tracking-wider">Confirmées</span>
              <span className="text-2xl font-bold text-gray-900">{counts.confirmed}</span>
            </div>
            <div className="flex-shrink-0 w-[110px] bg-white p-3 rounded-2xl shadow-sm border-l-4 border-blue-500">
              <span className="text-xs font-bold text-blue-700 block uppercase tracking-wider">Terminées</span>
              <span className="text-2xl font-bold text-gray-900">{counts.completed}</span>
            </div>
            <div className="flex-shrink-0 w-[110px] bg-white p-3 rounded-2xl shadow-sm border-l-4 border-red-500">
              <span className="text-xs font-bold text-red-700 block uppercase tracking-wider">Annulées</span>
              <span className="text-2xl font-bold text-gray-900">{counts.cancelled}</span>
            </div>
          </section>

          <nav className="flex gap-2 overflow-x-auto py-2">
            <button onClick={() => setActiveFilter("all")} className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${activeFilter === "all" ? "bg-green-700 text-white shadow-sm" : "bg-white text-gray-600 border border-gray-300"}`}>Toutes</button>
            <button onClick={() => setActiveFilter("pending")} className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${activeFilter === "pending" ? "bg-green-700 text-white shadow-sm" : "bg-white text-gray-600 border border-gray-300"}`}>En attente</button>
            <button onClick={() => setActiveFilter("confirmed")} className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${activeFilter === "confirmed" ? "bg-green-700 text-white shadow-sm" : "bg-white text-gray-600 border border-gray-300"}`}>Confirmées</button>
            <button onClick={() => setActiveFilter("completed")} className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${activeFilter === "completed" ? "bg-green-700 text-white shadow-sm" : "bg-white text-gray-600 border border-gray-300"}`}>Terminées</button>
            <button onClick={() => setActiveFilter("cancelled")} className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${activeFilter === "cancelled" ? "bg-green-700 text-white shadow-sm" : "bg-white text-gray-600 border border-gray-300"}`}>Annulées</button>
          </nav>

          <section className="space-y-4 pb-24">
            {filteredReservations.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
                <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">event_busy</span>
                <p className="text-gray-600 text-lg font-semibold">Aucune réservation</p>
                <p className="text-gray-500 text-sm mt-2">
                  {activeFilter === "all"
                    ? "Vous n'avez pas encore fait de réservation"
                    : `Aucune réservation ${activeFilter === "pending" ? "en attente" : activeFilter === "confirmed" ? "confirmée" : activeFilter === "completed" ? "terminée" : "annulée"}`}
                </p>
                <Link href="/dashboard/search" className="inline-block mt-6 px-6 py-3 bg-green-700 text-white font-semibold rounded-xl hover:bg-green-800 transition-colors">
                  Faire une réservation
                </Link>
              </div>
            ) : (
              filteredReservations.map((reservation) => {
                const statusInfo = getStatusInfo(reservation.status);
                const medicineName = getMedicineName(reservation.medicineId ?? "");
                const pharmacyName = getPharmacyName(reservation.pharmacyId ?? "");

                return (
                  <div key={reservation.id} className={`bg-white rounded-2xl overflow-hidden shadow-sm border-l-4 ${statusInfo.border} p-4 transition-all hover:-translate-y-0.5`}>
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex gap-3 items-center">
                        <div className={`w-10 h-10 ${statusInfo.iconBg} rounded-full flex items-center justify-center`}>
                          <span className={`material-symbols-outlined ${statusInfo.iconColor}`}>{statusInfo.icon}</span>
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900">{medicineName} x {reservation.quantity}</h3>
                          <p className="text-xs text-gray-600">{pharmacyName}</p>
                          {reservation.status === "confirmed" && reservation.totalPrice && (
                            <p className="text-xs font-bold text-green-700 mt-0.5">{reservation.totalPrice} FCFA</p>
                          )}
                        </div>
                      </div>
                      <span className={`px-2 py-1 ${statusInfo.badge} text-[10px] font-bold rounded-full uppercase`}>{statusInfo.label}</span>
                    </div>

                    {reservation.transactionId && (
                      <div className="bg-green-50 p-2 rounded-lg mb-4 flex justify-between items-center">
                        <span className="text-xs font-mono text-gray-600">{reservation.transactionId}</span>
                        <span className="text-xs text-gray-600">{formatDate(reservation.createdAt)}</span>
                      </div>
                    )}

                    {reservation.status === "confirmed" && (
                      <div className="flex items-center gap-2 mb-4 text-green-700 text-xs font-medium">
                        <span className="material-symbols-outlined text-base">schedule</span>
                        Prêt dans 15 minutes
                      </div>
                    )}

                    {reservation.status === "cancelled" && (
                      <div className="text-xs text-red-600 flex items-center gap-1 mt-1 font-medium italic">
                        <span className="material-symbols-outlined text-sm">info</span>
                        Raison : {reservation.cancelReason || "Annulée par l'utilisateur"}
                      </div>
                    )}

                    {/* ✅ Boutons au lieu de liens pour éviter les 404 */}
                    {reservation.status === "pending" && (
                      <button
                        onClick={() => alert("Page de détails en cours de développement")}
                        className="w-full h-11 bg-white border border-yellow-400 text-yellow-700 font-semibold rounded-xl flex items-center justify-center active:scale-[0.98] transition-transform hover:bg-yellow-50"
                      >
                        Voir les détails
                      </button>
                    )}

                    {reservation.status === "confirmed" && (
                      <div className="grid grid-cols-2 gap-2">
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${pharmacyName}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="h-11 bg-green-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform hover:bg-green-800"
                        >
                          <span className="material-symbols-outlined text-lg">directions</span>
                          Itinéraire
                        </a>
                        <button
                          onClick={() => alert("Page de détails en cours de développement")}
                          className="h-11 bg-white border border-gray-300 text-gray-700 font-semibold rounded-xl flex items-center justify-center active:scale-[0.98] transition-transform hover:bg-gray-50"
                        >
                          Détails
                        </button>
                      </div>
                    )}

                    {reservation.status === "completed" && (
                      <button
                        onClick={() => alert("Nouvelle réservation en cours de développement")}
                        className="w-full h-11 bg-blue-50 text-blue-700 font-semibold rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform hover:bg-blue-100"
                      >
                        <span className="material-symbols-outlined text-lg">refresh</span>
                        Réserver à nouveau
                      </button>
                    )}

                    {reservation.status === "cancelled" && (
                      <button
                        onClick={() => alert("Nouvelle réservation en cours de développement")}
                        className="w-full h-11 bg-white border border-red-400 text-red-700 font-semibold rounded-xl flex items-center justify-center active:scale-[0.98] transition-transform hover:bg-red-50"
                      >
                        Réessayer
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </section>
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