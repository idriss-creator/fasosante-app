"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Pill,
  PlusCircle,
  Building2,
  Search,
  LogOut,
} from "lucide-react";

import { useRouter } from "next/navigation";
import { logout } from "@/services/auth";
import useUserRole from "@/hooks/useUserRole";
import { usePathname } from "next/navigation";
import { Package } from "lucide-react";
import { Boxes } from "lucide-react";
import { History } from "lucide-react";
export default function Sidebar() {
  const router = useRouter();
  const { role } = useUserRole();
  console.log("ROLE =", role);
  const isAdmin = role === "admin";
  const isOwner = role === "owner";
  const isUser = role === "user";

  const pathname = usePathname();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };
 



  return (
    
    <aside className="bg-green-600 text-white p-6 md:w-64 w-full ">
      <h1 className="text-2xl font-bold mb-8">
        FASOSANTÉ
      </h1>
    <div className="mb-8">
      <div className="w-12 h-12 rounded-full bg-white text-green-600 flex items-center justify-center font-bold text-lg">
        {role?.charAt(0).toUpperCase()}
      </div>

      <p className="mt-2 font-semibold">
        {role}
      </p>
  </div>
      <nav className="flex flex-col gap-4">
        <Link
          href="/dashboard"
          className={`flex items-center gap-3 p-2 rounded ${
          pathname === "/dashboard"
            ? "bg-green-800"
            : "hover:bg-green-700"
        }`}
        >
          <LayoutDashboard size={20} />
          Dashboard
        </Link>

        {isAdmin && (<Link
          href="/dashboard/medicines"
          className={`flex items-center gap-3 p-2 rounded ${
            pathname === "/dashboard/medicines"
              ? "bg-green-800"
              : "hover:bg-green-700"
          }`}
        >
          <Pill size={20} />
          Médicaments
        </Link>
        )}

        {isAdmin && (
      <Link
        href="/dashboard/medicines/add"
        className={`flex items-center gap-3 p-2 rounded ${
          pathname === "/dashboard/medicines/add"
            ? "bg-green-800"
            : "hover:bg-green-700"
        }`}
      >
        <PlusCircle size={20} />
        Ajouter Médicament
      </Link>
      )}

        {(isOwner || isAdmin) && ( <Link
          href="/dashboard/pharmacies"
          className={`flex items-center gap-3 p-2 rounded ${
          pathname === "/dashboard/pharmacies"
            ? "bg-green-800"
            : "hover:bg-green-700"
        }`}
                >
          <Building2 size={20} />
           Pharmacie
        </Link>
        )}
        {(isOwner || isAdmin) && (
        <Link
        href="/dashboard/stocks"
        className="flex items-center gap-3 hover:bg-green-700 p-2 rounded"
         >
        <Package size={20} />
        Stock
        </Link>
        )}
        {isAdmin && (
          <Link
            href="/dashboard/pharmacies/add"
            className={`flex items-center gap-3 p-2 rounded ${
              pathname === "/dashboard/pharmacies/add"
                ? "bg-green-800"
                : "hover:bg-green-700"
            }`}
          >
            <PlusCircle size={20} />
            Ajouter Pharmacie
          </Link>
        )}

        {(isOwner || isUser || isAdmin) && (
           <Link
          href="/dashboard/search"
         className={`flex items-center gap-3 p-2 rounded ${
          pathname === "/dashboard/search"
            ? "bg-green-800"
            : "hover:bg-green-700"
        }`}
        >
          <Search size={20} />
          Recherche
        </Link>
        )}
        {isAdmin && (<Link
          href="/dashboard/stocks/add"
          className="flex items-center gap-3 hover:bg-green-700 p-2 rounded"
        >
          <Boxes size={20} />
          Ajouter Stock
        </Link>
        )}
     {(isOwner || isAdmin) && ( <Link
        href="/dashboard/history"
        className="flex items-center gap-3 hover:bg-green-700 p-2 rounded"
      >
        <History size={20} />
        Historique
    </Link>
     )}
     {isAdmin && (
  <Link
    href="/dashboard/users"
    className={`flex items-center gap-3 p-2 rounded ${
      pathname === "/dashboard/users"
        ? "bg-green-800"
        : "hover:bg-green-700"
    }`}
  >
    👥 Utilisateurs
  </Link>
)}
      </nav>
      <div className="mt-8 bg-green-700 rounded-lg p-4">
      <h3 className="font-bold">
        FASOSANTÉ
      </h3>

      <p className="text-sm mt-2">
        Plateforme de gestion des
        médicaments et pharmacies.
      </p>
</div>
      <div className="mt-10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 bg-red-500 hover:bg-red-600 px-4 py-2 rounded w-full"
        >
          <LogOut size={20} />
          Déconnexion
        </button>
      </div>

    </aside>
    
  );
}