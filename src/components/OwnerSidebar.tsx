"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { auth } from "@/services/firebase";

export default function OwnerSidebar() {
  const pathname = usePathname();
  const user = auth.currentUser;

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="hidden lg:flex flex-col h-full bg-gradient-to-b from-teal-600 to-teal-700 text-white w-72 shrink-0 pt-8 px-6 shadow-2xl">
      {/* Logo */}
      <div className="mb-10 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
          <span className="material-symbols-outlined text-2xl">local_pharmacy</span>
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight text-white">FASOSANTÉ</h2>
      </div>

      {/* Navigation */}
      <ul className="flex-1 space-y-2">
        <li>
          <Link
            href="/dashboard"
            className={`flex items-center gap-4 py-3.5 px-4 rounded-xl transition-all ${
              isActive("/dashboard")
                ? "bg-white/20 font-bold text-white backdrop-blur-sm shadow-lg"
                : "hover:bg-white/10 text-white/90"
            }`}
          >
            <span className="material-symbols-outlined text-xl">dashboard</span>
            <span>Tableau de bord</span>
          </Link>
        </li>
        <li>
          <Link
            href="/dashboard/medicines"
            className={`flex items-center gap-4 py-3.5 px-4 rounded-xl transition-all ${
              isActive("/dashboard/medicines")
                ? "bg-white/20 font-bold text-white backdrop-blur-sm shadow-lg"
                : "hover:bg-white/10 text-white/90"
            }`}
          >
            <span className="material-symbols-outlined text-xl">medication</span>
            <span>Médicaments</span>
          </Link>
        </li>
        <li>
          <Link
            href="/dashboard/stocks"
            className={`flex items-center gap-4 py-3.5 px-4 rounded-xl transition-all ${
              isActive("/dashboard/stocks")
                ? "bg-white/20 font-bold text-white backdrop-blur-sm shadow-lg"
                : "hover:bg-white/10 text-white/90"
            }`}
          >
            <span className="material-symbols-outlined text-xl">inventory_2</span>
            <span>Stocks</span>
          </Link>
        </li>
        <li>
          <Link
            href="/dashboard/reservations"
            className={`flex items-center gap-4 py-3.5 px-4 rounded-xl transition-all ${
              isActive("/dashboard/reservations")
                ? "bg-white/20 font-bold text-white backdrop-blur-sm shadow-lg"
                : "hover:bg-white/10 text-white/90"
            }`}
          >
            <span className="material-symbols-outlined text-xl">event_available</span>
            <span>Réservations</span>
          </Link>
        </li>
        <li>
          <Link
            href="/dashboard/reports"
            className={`flex items-center gap-4 py-3.5 px-4 rounded-xl transition-all ${
              isActive("/dashboard/reports")
                ? "bg-white/20 font-bold text-white backdrop-blur-sm shadow-lg"
                : "hover:bg-white/10 text-white/90"
            }`}
          >
            <span className="material-symbols-outlined text-xl">analytics</span>
            <span>Rapports</span>
          </Link>
        </li>
      </ul>

      {/* Profil */}
      <div className="mt-auto space-y-4 mb-6">
        <div className="border-t border-white/20 pt-6 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/30 bg-white/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-2xl">person</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-white">{user?.email?.split("@")[0] || "Utilisateur"}</span>
            <span className="text-xs text-white/70">Gestionnaire</span>
          </div>
        </div>
      </div>

      {/* Déconnexion */}
      <button
        onClick={() => auth.signOut()}
        className="flex items-center gap-3 py-3 px-4 rounded-xl hover:bg-white/10 w-full text-left text-white transition-all mt-2"
      >
        <span className="material-symbols-outlined">logout</span>
        <span className="font-semibold">Déconnexion</span>
      </button>
    </nav>
  );
}