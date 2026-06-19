"use client";

import { useState, useEffect, type MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { getMedicines, addMedicine } from "@/services/medicines";
import { getStocks } from "@/services/stocks";
import { getPharmacyByOwner } from "@/services/pharmacies";
import { auth } from "@/services/firebase";
import OwnerSidebar from "@/components/OwnerSidebar";

type FilterType = "all" | "inStock" | "lowStock" | "outOfStock";

export default function MedicinesPage() {
  const router = useRouter();
  const user = auth.currentUser;

  const [medicines, setMedicines] = useState<any[]>([]);
  const [stocks, setStocks] = useState<any[]>([]);
  const [userPharmacy, setUserPharmacy] = useState<any>(null); // ← La pharmacie du pharmacien
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;

      try {
        const [medicinesData, stocksData, pharmacy] = await Promise.all([
          getMedicines(),
          getStocks(),
          getPharmacyByOwner(user.uid), // ← Récupère la pharmacie du pharmacien
        ]);

        setMedicines(medicinesData);
        setStocks(stocksData);
        setUserPharmacy(pharmacy);
      } catch (error) {
        console.error("Erreur chargement:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  // ... le reste du code reste identique

  const getMedicineStock = (medicineId: string) => {
    return stocks
      .filter((s) => s.medicineId === medicineId)
      .reduce((total, stock) => total + (stock.quantity || 0), 0);
  };

  const getMedicineStatus = (medicineId: string) => {
    const stock = getMedicineStock(medicineId);
    if (stock === 0) return "outOfStock";
    if (stock < 10) return "lowStock";
    return "inStock";
  };

  const getStockPercentage = (medicineId: string) => {
    const stock = getMedicineStock(medicineId);
    return Math.min((stock / 200) * 100, 100);
  };

  const getStockColor = (medicineId: string) => {
    const status = getMedicineStatus(medicineId);
    if (status === "outOfStock") return "bg-red-500";
    if (status === "lowStock") return "bg-orange-500";
    return "bg-green-500";
  };

  const formatDate = (date: any) => {
    if (!date) return "Jamais";
    const d = date.toDate ? date.toDate() : new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return "À l'instant";
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays === 1) return "Hier";
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    return d.toLocaleDateString("fr-FR");
  };
  const handleAddMedicine = async () => {
  if (!userPharmacy) {
    alert("Aucune pharmacie associée à votre compte");
    return;
  }

  const name = (document.getElementById("medicine-name") as HTMLInputElement)?.value;
  const category = (document.getElementById("medicine-category") as HTMLSelectElement)?.value;
  const dosage = (document.getElementById("medicine-dosage") as HTMLInputElement)?.value;
  const form = (document.getElementById("medicine-form") as HTMLSelectElement)?.value;
  const price = parseInt((document.getElementById("medicine-price") as HTMLInputElement)?.value || "0");
  const quantity = parseInt((document.getElementById("medicine-quantity") as HTMLInputElement)?.value || "0");
  const description = (document.getElementById("medicine-description") as HTMLTextAreaElement)?.value;
  const requiresPrescription = (document.getElementById("medicine-prescription") as HTMLInputElement)?.checked;

  if (!name || !category || !price) {
    alert("Veuillez remplir tous les champs obligatoires");
    return;
  }

  try {
    // 1. Créer le médicament
    const medicineId = await addMedicine({
      name,
      category,
      dosage,
      form,
      price,
      description,
      requiresPrescription,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);

    // 2. Créer le stock associé
    if (quantity > 0) {
      const { addStock } = await import("@/services/stocks");
      await addStock({
        medicineId,
        pharmacyId: userPharmacy.id,
        quantity,
        updatedAt: new Date(),
      });
    }

    alert("Médicament ajouté avec succès !");
    setShowModal(false);

    // Recharger les données
    const [medicinesData, stocksData] = await Promise.all([
      getMedicines(),
      getStocks(),
    ]);
    setMedicines(medicinesData);
    setStocks(stocksData);
  } catch (error) {
    console.error("Erreur ajout médicament:", error);
    alert("Erreur lors de l'ajout du médicament");
  }
};

  // Statistiques
  const stats = {
    total: medicines.length,
    inStock: medicines.filter((m) => getMedicineStatus(m.id) === "inStock").length,
    lowStock: medicines.filter((m) => getMedicineStatus(m.id) === "lowStock").length,
    outOfStock: medicines.filter((m) => getMedicineStatus(m.id) === "outOfStock").length,
  };

  // Filtrage
  const filteredMedicines = medicines.filter((medicine) => {
    // Filtre par recherche
    if (search) {
      const searchLower = search.toLowerCase();
      if (
        !medicine.name.toLowerCase().includes(searchLower) &&
        !medicine.category?.toLowerCase().includes(searchLower)
      ) {
        return false;
      }
    }

    // Filtre par statut
    const status = getMedicineStatus(medicine.id);
    if (activeFilter === "inStock" && status !== "inStock") return false;
    if (activeFilter === "lowStock" && status !== "lowStock") return false;
    if (activeFilter === "outOfStock" && status !== "outOfStock") return false;

    return true;
  });

  const handleDelete = async (medicineId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce médicament ?")) return;

    try {
      // TODO: Implémenter deleteMedicine dans services/medicines.ts
      // await deleteMedicine(medicineId);
      setMedicines(medicines.filter((m) => m.id !== medicineId));
      alert("Médicament supprimé avec succès");
    } catch (error) {
      console.error("Erreur suppression:", error);
      alert("Erreur lors de la suppression");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des médicaments...</p>
        </div>
      </div>
    );
  }

  return (
  <div className="min-h-screen bg-gray-50">
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar Owner */}
      <OwnerSidebar />

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-y-auto flex flex-col relative">
        {/* Header */}
        <header className="px-6 md:px-12 py-8 shrink-0 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Gestion des médicaments</h2>
            <p className="text-sm text-gray-600">Gérez le catalogue de médicaments de vos pharmacies</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="h-[52px] px-6 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined">download</span>
              Exporter CSV
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="h-[52px] px-6 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors flex items-center gap-2 shadow-md"
            >
              <span className="material-symbols-outlined">add</span>
              Ajouter un médicament
            </button>
          </div>
        </header>

        <div className="px-6 md:px-12 pb-6 flex-1 flex flex-col gap-6 max-w-7xl mx-auto w-full">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 shrink-0">
            <div className="bg-white rounded-2xl p-6 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-blue-600">medication</span>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Médicaments référencés</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-green-600">check_circle</span>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">En stock normal</p>
                <p className="text-3xl font-bold text-gray-900">{stats.inStock}</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-orange-500">warning</span>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Stock faible</p>
                <p className="text-3xl font-bold text-gray-900">{stats.lowStock}</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-red-600">error</span>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">En rupture</p>
                <p className="text-3xl font-bold text-gray-900">{stats.outOfStock}</p>
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-2xl shadow-sm flex flex-col flex-1 overflow-hidden">
            {/* Search & Filters */}
            <div className="p-6 border-b border-gray-100 shrink-0 space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    search
                  </span>
                  <input
                    className="w-full h-12 pl-10 pr-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500/20 focus:border-green-600 outline-none transition-all text-sm placeholder-gray-400"
                    placeholder="Rechercher un médicament..."
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <div className="flex gap-4">
                  <select className="h-12 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500/20 focus:border-green-600 outline-none text-sm text-gray-600 bg-white min-w-[180px]">
                    <option>Toutes les catégories</option>
                    <option>Antibiotique</option>
                    <option>Antalgique</option>
                    <option>Antipaludique</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                <button
                  onClick={() => setActiveFilter("all")}
                  className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap shrink-0 transition-colors ${
                    activeFilter === "all"
                      ? "bg-green-50 text-green-600"
                      : "bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-600"
                  }`}
                >
                  Tous
                </button>
                <button
                  onClick={() => setActiveFilter("inStock")}
                  className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap shrink-0 transition-colors ${
                    activeFilter === "inStock"
                      ? "bg-green-50 text-green-600"
                      : "bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-600"
                  }`}
                >
                  En stock
                </button>
                <button
                  onClick={() => setActiveFilter("lowStock")}
                  className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap shrink-0 transition-colors ${
                    activeFilter === "lowStock"
                      ? "bg-orange-50 text-orange-600"
                      : "bg-gray-100 text-gray-600 hover:bg-orange-50 hover:text-orange-600"
                  }`}
                >
                  Stock faible
                </button>
                <button
                  onClick={() => setActiveFilter("outOfStock")}
                  className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap shrink-0 transition-colors ${
                    activeFilter === "outOfStock"
                      ? "bg-red-50 text-red-600"
                      : "bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600"
                  }`}
                >
                  Rupture
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-auto">
              <table className="w-full text-left border-collapse min-w-[1000px]">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="text-sm text-gray-600 py-4 px-6 border-b border-gray-100 font-medium">
                      Médicament
                    </th>
                    <th className="text-sm text-gray-600 py-4 px-6 border-b border-gray-100 font-medium">
                      Catégorie
                    </th>
                    <th className="text-sm text-gray-600 py-4 px-6 border-b border-gray-100 font-medium">
                      Dosage/Forme
                    </th>
                    <th className="text-sm text-gray-600 py-4 px-6 border-b border-gray-100 font-medium">
                      Prix unitaire
                    </th>
                    <th className="text-sm text-gray-600 py-4 px-6 border-b border-gray-100 font-medium">
                      Stock
                    </th>
                    <th className="text-sm text-gray-600 py-4 px-6 border-b border-gray-100 font-medium">
                      Statut
                    </th>
                    <th className="text-sm text-gray-600 py-4 px-6 border-b border-gray-100 font-medium">
                      Dernière MAJ
                    </th>
                    <th className="text-sm text-gray-600 py-4 px-6 border-b border-gray-100 font-medium text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {filteredMedicines.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-gray-500">
                        <span className="material-symbols-outlined text-5xl text-gray-300 mb-4 block">
                          search_off
                        </span>
                        Aucun médicament trouvé
                      </td>
                    </tr>
                  ) : (
                    filteredMedicines.map((medicine) => {
                      const stock = getMedicineStock(medicine.id);
                      const status = getMedicineStatus(medicine.id);
                      const percentage = getStockPercentage(medicine.id);
                      const color = getStockColor(medicine.id);

                      return (
                        <tr
                          key={medicine.id}
                          className="hover:bg-gray-50 transition-colors border-b border-gray-100"
                        >
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                                <span className="material-symbols-outlined text-blue-500 text-lg">
                                  pill
                                </span>
                              </div>
                              <span className="font-semibold text-gray-900">{medicine.name}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className="inline-flex px-2 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold">
                              {medicine.category || "Non catégorisé"}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-gray-600">
                            {medicine.dosage || "-"} • {medicine.form || "-"}
                          </td>
                          <td className="py-4 px-6 font-medium text-gray-900">
                            {medicine.price ? `${medicine.price} FCFA` : "-"}
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <span className="w-8">{stock}</span>
                              <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                  className={`h-full ${color} rounded-full transition-all`}
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            {status === "inStock" && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 text-green-600 text-xs font-semibold">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                Normal
                              </span>
                            )}
                            {status === "lowStock" && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-50 text-orange-600 text-xs font-semibold">
                                <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                                Faible
                              </span>
                            )}
                            {status === "outOfStock" && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-red-600 text-xs font-semibold">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                                Rupture
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-6 text-gray-600">
                            {formatDate(medicine.updatedAt)}
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-2 text-gray-600">
                              <button className="p-1.5 hover:bg-gray-100 rounded-md transition-colors">
                                <span className="material-symbols-outlined text-lg">visibility</span>
                              </button>
                              <button className="p-1.5 hover:bg-gray-100 rounded-md transition-colors">
                                <span className="material-symbols-outlined text-lg">edit</span>
                              </button>
                              <button
                                onClick={() => handleDelete(medicine.id)}
                                className="p-1.5 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors"
                              >
                                <span className="material-symbols-outlined text-lg">delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

     {/* Modal */}
{showModal && (
  <div
    className="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center p-4 backdrop-blur-sm"
    onClick={(e) => {
      if (e.target === e.currentTarget) setShowModal(false);
    }}
  >
    <div className="bg-white rounded-2xl w-full max-w-[560px] max-h-[90vh] flex flex-col shadow-2xl">
      <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between shrink-0">
        <h3 className="text-xl font-bold text-gray-900">Ajouter un médicament</h3>
        <button
          onClick={() => setShowModal(false)}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-600"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      {/* Info pharmacie actuelle */}
      {userPharmacy && (
        <div className="px-6 py-3 bg-green-50 border-b border-green-100 flex items-center gap-2">
          <span className="material-symbols-outlined text-green-700">store</span>
          <span className="text-sm text-gray-700">
            Pharmacie : <strong className="text-green-700">{userPharmacy.name}</strong>
          </span>
        </div>
      )}

      <div className="p-6 overflow-y-auto flex-1 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5 col-span-2">
            <label className="text-sm text-gray-600 block">
              Nom du médicament <span className="text-red-500">*</span>
            </label>
            <input
              id="medicine-name"
              className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500/20 focus:border-green-600 outline-none transition-all text-sm"
              placeholder="Ex: Paracétamol"
              type="text"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm text-gray-600 block">
              Catégorie <span className="text-red-500">*</span>
            </label>
            <select
              id="medicine-category"
              className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500/20 focus:border-green-600 outline-none transition-all text-sm bg-white"
            >
              <option value="">Sélectionner</option>
              <option>Antalgique</option>
              <option>Antibiotique</option>
              <option>Antipaludique</option>
              <option>Vitamine</option>
              <option>Autre</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm text-gray-600 block">Dosage</label>
            <input
              id="medicine-dosage"
              className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500/20 focus:border-green-600 outline-none transition-all text-sm"
              placeholder="Ex: 500mg"
              type="text"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm text-gray-600 block">Forme</label>
            <select
              id="medicine-form"
              className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500/20 focus:border-green-600 outline-none transition-all text-sm bg-white"
            >
              <option>Comprimé</option>
              <option>Sirop</option>
              <option>Gélule</option>
              <option>Injection</option>
              <option>Pommade</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm text-gray-600 block">
              Prix unitaire (FCFA) <span className="text-red-500">*</span>
            </label>
            <input
              id="medicine-price"
              className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500/20 focus:border-green-600 outline-none transition-all text-sm"
              placeholder="0"
              type="number"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm text-gray-600 block">
              Quantité initiale <span className="text-red-500">*</span>
            </label>
            <input
              id="medicine-quantity"
              className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500/20 focus:border-green-600 outline-none transition-all text-sm"
              placeholder="0"
              type="number"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm text-gray-600 block">Description</label>
          <textarea
            id="medicine-description"
            className="w-full p-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500/20 focus:border-green-600 outline-none transition-all text-sm resize-none"
            placeholder="Informations complémentaires..."
            rows={3}
          ></textarea>
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg border border-gray-300">
          <div>
            <p className="text-sm font-semibold text-gray-900">Nécessite une ordonnance</p>
            <p className="text-xs text-gray-600">
              Activer si le médicament est soumis à prescription médicale.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input id="medicine-prescription" className="sr-only peer" type="checkbox" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
          </label>
        </div>
      </div>

      <div className="px-6 py-5 border-t border-gray-100 flex items-center justify-end gap-3 shrink-0 bg-gray-50 rounded-b-2xl">
        <button
          onClick={() => setShowModal(false)}
          className="h-11 px-6 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-white transition-colors"
        >
          Annuler
        </button>
        <button
          onClick={handleAddMedicine}
          className="h-11 px-6 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors shadow-md"
        >
          Enregistrer
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  </div>
  );
}