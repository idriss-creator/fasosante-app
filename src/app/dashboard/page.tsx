"use client";

import { useEffect, useState } from "react";
import { Pill, Building2, Users, CalendarDays } from "lucide-react";

import { getMedicinesCount } from "@/services/medicines";
import { getPharmaciesCount } from "@/services/pharmacies";
import { getUsersCount } from "@/services/auth";
import useUserRole from "@/hooks/useUserRole";
import { auth } from "@/services/firebase";
import Link from "next/link";
import { getLowStocksCount, getOutOfStockCount, getStocksCount } from "@/services/stocks";

export default function DashboardPage() {
  const [medicines, setMedicines] = useState(0);
  const [pharmacies, setPharmacies] = useState(0);
  const [users, setUsers] = useState(0);
  const [stocks] = useState(0);

  const { role } = useUserRole();
  const user = auth.currentUser;

  const today = new Date().toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const [stockCount, setStockCount] =
  useState(0);

  const [lowStockCount, setLowStockCount] =
    useState(0);

  const [outOfStockCount, setOutOfStockCount] =
  useState(0);
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
  if (role === "user") {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl md:text-4xl font-bold text-green-600">
        Bienvenue sur FASOSANTÉ
      </h1>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold">
          Recherche de médicaments
        </h2>

        <p className="text-gray-600 mt-2">
          Recherchez facilement un médicament
          disponible dans les pharmacies.
        </p>

        <Link
          href="/dashboard/search"
          className="inline-block mt-4 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
        >
          🔍 Rechercher
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="font-bold mb-3">
          Informations
        </h2>

        <ul className="space-y-2 text-gray-700">
          <li>✅ Recherche nationale active</li>
          <li>✅ Pharmacies disponibles</li>
          <li>✅ Données synchronisées</li>
        </ul>
      </div>
    </div>
  );
}
  if (role === "owner") {
  return (
    <div className="space-y-10">
      <h1 className="text-4xl font-bold text-green-600">
        Tableau de bord Propriétaire
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-gray-500">
            Mes pharmacies
          </h2>

          <p className="text-4xl font-bold text-green-600 mt-4">
            3
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-gray-500">
            Mon stock
          </h2>

          <p className="text-4xl font-bold text-orange-600 mt-4">
            450
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-gray-500">
            Alertes
          </h2>

          <p className="text-4xl font-bold text-red-600 mt-4">
            2
          </p>
        </div>
      </div>
    </div>
  );
}


  return (
    <div className="space-y-10">
    
      <h1 className="text-2xl md:text-4xl font-bold text-green-600">
        Tableau de bord FASOSANTÉ
      </h1>

      
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold">Bonjour 👋</h2>

        <p className="text-gray-600 mt-2">{user?.email}</p>

        <div className="flex items-center gap-2 mt-3 text-gray-500">
          <CalendarDays size={18} />
          {today}
        </div>
      </div>

      
     <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-gray-500">Médicaments</h2>
            <Pill className="text-blue-600" />
          </div>
          <p className="text-2xl md:text-4xl font-bold text-green-600 mt-4">
            {medicines}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-gray-500">Pharmacies</h2>
            <Building2 className="text-green-600" />
          </div>
          <p className="text-2xl md:text-4xl font-bold text-green-600 mt-4">
            {pharmacies}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-gray-500">Utilisateurs</h2>
            <Users className="text-purple-600" />
          </div>
          <p className="text-2xl md:text-4xl font-bold text-green-600 mt-4">
            {users}
          </p>
        </div>
      </div>

      
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">📊 Insights rapides</h2>

        <ul className="space-y-3 text-gray-700">
          <li className="flex justify-between">
            <span>💊 Médicaments enregistrés</span>
            <span className="font-bold text-green-600">{medicines}</span>
          </li>

          <li className="flex justify-between">
            <span>🏥 Pharmacies actives</span>
            <span className="font-bold text-green-600">{pharmacies}</span>
          </li>

          <li className="flex justify-between">
            <span>👥 Utilisateurs inscrits</span>
            <span className="font-bold text-green-600">{users}</span>
          </li>
        </ul>

        <div className="mt-5 pt-4 border-t text-sm text-gray-500">
          📈 + activité en croissance • 🚀 système stable
        </div>
        
      </div>
      
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-gray-500">
          Stock
        </h2>

        <p className="text-2xl md:text-4xl font-bold text-orange-600 mt-4">
          {stockCount}
        </p>
      </div>


      <div className="grid md:grid-cols-2 gap-8">
      
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="font-bold mb-4">⚡ Actions rapides</h2>

          <div className="space-y-3">
            <Link
  href="/dashboard/medicines/add"
  className="block w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition text-center"
>
  ➕ Ajouter un médicament
</Link>

            <Link
  href="/dashboard/pharmacies/add"
  className="block w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition text-center"
>
  🏥 Ajouter une pharmacie
</Link>

            <Link
  href="/dashboard/search"
  className="block w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition text-center"
>
  🔍 Rechercher un produit
</Link>
          </div>
        </div>

        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="font-bold mb-3">État du système</h2>

          <ul className="space-y-2 text-gray-700">
            <li>🟢 Firebase connecté</li>
            <li>🟢 Authentification active</li>
            <li>🟢 Firestore actif</li>
          </ul>
        </div>
      </div>
    </div>
  );
}