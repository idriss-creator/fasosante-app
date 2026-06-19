"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { auth } from "@/services/firebase";
import { getUserReservations } from "@/services/reservations";

interface UserSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UserSidebar({ isOpen, onClose }: UserSidebarProps) {
  const pathname = usePathname();
  const user = auth.currentUser;
  const [reservationCount, setReservationCount] = useState(0);

  useEffect(() => {
    const loadStats = async () => {
      if (!user) return;
      try {
        const reservations = await getUserReservations(user.uid);
        setReservationCount(reservations.length);
      } catch (error) {
        console.error("Erreur chargement stats:", error);
      }
    };
    loadStats();
  }, [user]);

  const isActive = (path: string) => pathname === path;

  return (
    <nav
      className="flex flex-col h-full text-white"
      style={{
        backgroundColor: "rgb(0, 135, 122)",
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        paddingTop: "48px",
        paddingLeft: "24px",
        transform: isOpen ? "translateX(0)" : "translateX(-30%)",
        transition: "transform 400ms cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {/* Header */}
      <div className="mb-8 flex justify-between items-center pr-6">
        <h2 className="text-2xl font-extrabold tracking-tight flex items-center gap-2 text-white">
          <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            local_pharmacy
          </span>
          FASOSANTÉ
        </h2>
        <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors text-white">
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      {/* Navigation - flex-1 pour prendre l'espace disponible */}
      <ul className="flex-1 space-y-4 text-base">
        <li>
          <Link
            href="/dashboard"
            onClick={onClose}
            className={`flex items-center gap-4 py-2 transition-opacity hover:opacity-80 ${
              isActive("/dashboard") ? "font-bold" : ""
            }`}
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive("/dashboard") ? "'FILL' 1" : "'FILL' 0" }}>
              home
            </span>
            <span>Accueil</span>
          </Link>
        </li>
        <li>
          <Link
            href="/dashboard/search"
            onClick={onClose}
            className={`flex items-center gap-4 py-2 transition-opacity hover:opacity-80 ${
              isActive("/dashboard/search") ? "font-bold" : ""
            }`}
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive("/dashboard/search") ? "'FILL' 1" : "'FILL' 0" }}>
              search
            </span>
            <span>Recherche</span>
          </Link>
        </li>
        <li>
          <Link
            href="/dashboard/pharmacies"
            onClick={onClose}
            className={`flex items-center gap-4 py-2 transition-opacity hover:opacity-80 ${
              isActive("/dashboard/pharmacies") ? "font-bold" : ""
            }`}
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive("/dashboard/pharmacies") ? "'FILL' 1" : "'FILL' 0" }}>
              local_pharmacy
            </span>
            <span>Pharmacies</span>
          </Link>
        </li>
        <li>
          <Link
            href="/dashboard/reservations"
            onClick={onClose}
            className={`flex items-center gap-4 py-2 transition-opacity hover:opacity-80 ${
              isActive("/dashboard/reservations") ? "font-bold" : ""
            }`}
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive("/dashboard/reservations") ? "'FILL' 1" : "'FILL' 0" }}>
              calendar_today
            </span>
            <span>Réservations</span>
          </Link>
        </li>
        <li>
          <Link
            href=""
            onClick={onClose}
            className={`flex items-center gap-4 py-2 transition-opacity hover:opacity-80 ${
              isActive("/dashboard/favorites") ? "font-bold" : ""
            }`}
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive("/dashboard/favorites") ? "'FILL' 1" : "'FILL' 0" }}>
              favorite
            </span>
            <span>Favoris</span>
          </Link>
        </li>
       <li>
            <Link
                href="/dashboard/profile"
                onClick={onClose}
                className={`flex items-center gap-4 py-2 transition-opacity hover:opacity-80 ${
                isActive("/dashboard/profile") ? "font-bold" : ""
                }`}
            >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive("/dashboard/profile") ? "'FILL' 1" : "'FILL' 0" }}>
                settings
                </span>
                <span>Paramètres</span>
            </Link>
        </li>
        <li>
          <Link
            href="/dashboard/history"
            onClick={onClose}
            className={`flex items-center gap-4 py-2 transition-opacity hover:opacity-80 ${
              isActive("/dashboard/history") ? "font-bold" : ""
            }`}
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive("/dashboard/history") ? "'FILL' 1" : "'FILL' 0" }}>
              history
            </span>
            <span>Recherches récentes</span>
          </Link>
        </li>
        <li>
          <Link
            href=""
            onClick={onClose}
            className="flex items-center gap-4 py-2 transition-opacity hover:opacity-80 justify-between pr-8"
          >
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined">notifications</span>
              <span>Notifications</span>
            </div>
            <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">2</span>
          </Link>
        </li>
      </ul>

      {/* Section Compte - mt-auto pour pousser vers le bas */}
      <div className="mt-auto space-y-6 mb-6 pr-6">
        <div className="border-t border-white/30 pt-6 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/20">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="Profil" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {user?.email?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-white">
              {user?.displayName || user?.email?.split("@")[0] || "Utilisateur"}
            </span>
            <span className="text-xs text-white">Citoyen</span>
          </div>
        </div>
      </div>

      {/* Déconnexion */}
      <div className="pb-10 pr-6">
        <button
          onClick={() => auth.signOut()}
          className="flex items-center gap-4 py-2 transition-opacity hover:opacity-80 w-full text-left text-white"
        >
          <span className="material-symbols-outlined">logout</span>
          <span className="text-base">Déconnexion</span>
        </button>
      </div>
    </nav>
  );
}