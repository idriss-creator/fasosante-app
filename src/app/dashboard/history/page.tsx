"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import UserSidebar from "@/components/UserSidebar";

type SearchHistoryItem = {
  id: string;
  medicineName: string;
  resultsCount: number;
  pharmaciesCount: number;
  timestamp: Date;
  filters?: {
    status?: string;
    city?: string;
  };
};

type DateGroup = {
  label: string;
  items: SearchHistoryItem[];
};

export default function HistoryPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");
  const [showClearModal, setShowClearModal] = useState(false);
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);

  // Données de démonstration
  useEffect(() => {
    const mockHistory: SearchHistoryItem[] = [
      {
        id: "1",
        medicineName: "Paracétamol 500mg",
        resultsCount: 524,
        pharmaciesCount: 8,
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // Il y a 30 min
        filters: { status: "all" },
      },
      {
        id: "2",
        medicineName: "Amoxicilline 1g",
        resultsCount: 142,
        pharmaciesCount: 4,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // Il y a 2h
        filters: { status: "stock" },
      },
      {
        id: "3",
        medicineName: "Ibuprofène 400mg",
        resultsCount: 389,
        pharmaciesCount: 6,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // Il y a 5h
      },
      {
        id: "4",
        medicineName: "Coartem",
        resultsCount: 67,
        pharmaciesCount: 3,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26), // Hier
      },
      {
        id: "5",
        medicineName: "Metformine 850mg",
        resultsCount: 234,
        pharmaciesCount: 5,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 30), // Hier
      },
      {
        id: "6",
        medicineName: "Loratadine 10mg",
        resultsCount: 156,
        pharmaciesCount: 4,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 jours
      },
      {
        id: "7",
        medicineName: "Omeprazole 20mg",
        resultsCount: 298,
        pharmaciesCount: 7,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 jours
      },
      {
        id: "8",
        medicineName: "Azithromycine 500mg",
        resultsCount: 89,
        pharmaciesCount: 2,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10), // 10 jours
      },
    ];
    setHistory(mockHistory);
  }, []);

  const groupByDate = (items: SearchHistoryItem[]): DateGroup[] => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const groups: DateGroup[] = [
      { label: "Aujourd'hui", items: [] },
      { label: "Hier", items: [] },
      { label: "Cette semaine", items: [] },
      { label: "Plus ancien", items: [] },
    ];

    items.forEach((item) => {
      const itemDate = new Date(item.timestamp);
      if (itemDate >= today) {
        groups[0].items.push(item);
      } else if (itemDate >= yesterday) {
        groups[1].items.push(item);
      } else if (itemDate >= weekAgo) {
        groups[2].items.push(item);
      } else {
        groups[3].items.push(item);
      }
    });

    return groups.filter((g) => g.items.length > 0);
  };

  const filteredHistory = history.filter((item) =>
    item.medicineName.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const dateGroups = groupByDate(filteredHistory);

  const handleRelaunchSearch = (item: SearchHistoryItem) => {
    router.push(`/dashboard/search?q=${encodeURIComponent(item.medicineName)}`);
  };

  const handleDeleteItem = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearAll = () => {
    setHistory([]);
    setShowClearModal(false);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-[rgb(0,135,122)]">
      <UserSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div
        className="absolute top-0 left-0 h-full w-full z-10 flex flex-col overflow-y-auto"
        style={{
          backgroundColor: "#F8FAFC",
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

        {/* Header */}
        <header className="sticky top-0 z-30 bg-white shadow-sm flex items-center justify-between px-4 h-16">
          <button
            onClick={() => router.back()}
            className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <span className="material-symbols-outlined text-green-700">arrow_back</span>
          </button>
          <h1 className="text-lg font-bold text-gray-900">Historique de recherche</h1>
          <button
            onClick={() => setShowClearModal(true)}
            className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
          >
            Tout effacer
          </button>
        </header>

        <main className="flex-1 pb-24">
          {/* Barre de recherche dans l'historique */}
          <div className="px-4 pt-4 pb-3">
            <div className="relative flex items-center w-full bg-white rounded-xl border border-gray-200 focus-within:border-green-600 focus-within:ring-2 focus-within:ring-green-500/20 transition-all h-12 shadow-sm">
              <span className="material-symbols-outlined text-gray-400 ml-3 mr-2">search</span>
              <input
                className="flex-grow bg-transparent border-none text-gray-900 focus:ring-0 p-0 placeholder-gray-400 outline-none text-sm"
                placeholder="Filtrer dans mon historique..."
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
              />
              {searchFilter && (
                <button
                  onClick={() => setSearchFilter("")}
                  className="p-2 mr-1 text-gray-400 hover:text-gray-600"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              )}
            </div>
          </div>

          {/* Compteur */}
          <div className="px-4 pb-4">
            <p className="text-xs text-gray-500">{history.length} recherches enregistrées</p>
          </div>

          {/* Liste chronologique */}
          {dateGroups.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-4 py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-5xl text-gray-300">search</span>
              </div>
              <h2 className="text-base font-semibold text-gray-900 mb-2">Aucune recherche pour le moment</h2>
              <p className="text-sm text-gray-500 text-center mb-6">Vos recherches de médicaments apparaîtront ici</p>
              <Link
                href="/dashboard/search"
                className="bg-green-700 hover:bg-green-800 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
              >
                Rechercher un médicament
              </Link>
            </div>
          ) : (
            <div className="px-4 space-y-6">
              {dateGroups.map((group) => (
                <div key={group.label}>
                  {/* Titre de section sticky */}
                  <h3 className="sticky top-16 z-20 bg-[#F8FAFC] py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {group.label}
                  </h3>
                  
                  <div className="space-y-2">
                    {group.items.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white rounded-xl p-3.5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group"
                        onClick={() => handleRelaunchSearch(item)}
                      >
                        <div className="flex items-start gap-3">
                          {/* Icône médicament */}
                          <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                            <span className="material-symbols-outlined text-green-700 text-xl">medication</span>
                          </div>

                          {/* Contenu principal */}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-gray-900 mb-0.5 truncate">
                              {item.medicineName}
                            </h4>
                            <p className="text-xs text-gray-500">
                              {item.resultsCount} résultats · {item.pharmaciesCount} pharmacies
                            </p>
                          </div>

                          {/* Heure et actions */}
                          <div className="flex flex-col items-end gap-1">
                            <span className="text-xs text-gray-400">{formatTime(item.timestamp)}</span>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRelaunchSearch(item);
                                }}
                                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-green-700 transition-colors"
                                title="Relancer la recherche"
                              >
                                <span className="material-symbols-outlined text-sm">refresh</span>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteItem(item.id);
                                }}
                                className="p-1.5 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                                title="Supprimer"
                              >
                                <span className="material-symbols-outlined text-sm">delete</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Bottom Navigation */}
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

      {/* Modal de confirmation "Tout effacer" */}
      {showClearModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-in fade-in zoom-in duration-200">
            {/* Icône alerte */}
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-orange-600 text-3xl">warning</span>
            </div>

            {/* Titre */}
            <h2 className="text-lg font-bold text-gray-900 text-center mb-2">
              Effacer tout l'historique ?
            </h2>

            {/* Texte */}
            <p className="text-sm text-gray-500 text-center mb-6">
              Toutes vos recherches de médicaments enregistrées seront supprimées définitivement.
            </p>

            {/* Boutons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowClearModal(false)}
                className="flex-1 h-11 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleClearAll}
                className="flex-1 h-11 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors"
              >
                Effacer tout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}