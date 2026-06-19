"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getPartnerRequests,
  approvePartnerRequest,
  rejectPartnerRequest,
  PartnerRequest,
} from "@/services/partnerRequests";
import { auth } from "@/services/firebase";

type FilterStatus = "all" | "pending" | "approved" | "rejected";

export default function PartnerRequestsPage() {
  const router = useRouter();
  const user = auth.currentUser;

  const [requests, setRequests] = useState<PartnerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [modal, setModal] = useState<{
    type: "approve" | "reject";
    request: PartnerRequest | null;
  }>({ type: "approve", request: null });
  const [reviewNote, setReviewNote] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getPartnerRequests();
        setRequests(data);
      } catch (error) {
        console.error("Erreur chargement demandes:", error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filteredRequests =
    filter === "all" ? requests : requests.filter((r) => r.status === filter);

  const counts = {
    all: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    approved: requests.filter((r) => r.status === "approved").length,
    rejected: requests.filter((r) => r.status === "rejected").length,
  };

  const handleAction = async () => {
    if (!modal.request) return;
    setActionLoading(modal.request.id);

    try {
      if (modal.type === "approve") {
        await approvePartnerRequest(
          modal.request.id,
          modal.request,
          reviewNote
        );
      } else {
        await rejectPartnerRequest(modal.request.id, reviewNote);
      }

      // Recharger la liste
      const data = await getPartnerRequests();
      setRequests(data);
      setModal({ type: "approve", request: null });
      setReviewNote("");
    } catch (error) {
      console.error("Erreur action:", error);
      alert("Une erreur est survenue");
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (date: any) => {
    if (!date) return "";
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "approved":
        return "bg-green-100 text-green-700 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "En attente";
      case "approved":
        return "Approuvée";
      case "rejected":
        return "Refusée";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des demandes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Header */}
      <header className="bg-white sticky top-0 z-40 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="text-green-700 active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
          </button>
          <h1 className="text-xl font-bold text-green-700">Demandes Partenaires</h1>
          <div className="w-10"></div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          <div className="bg-white rounded-xl p-3 shadow-sm border-l-4 border-blue-500">
            <span className="text-2xl font-bold text-gray-900">{counts.all}</span>
            <span className="text-xs text-gray-600 block">Total</span>
          </div>
          <div className="bg-white rounded-xl p-3 shadow-sm border-l-4 border-yellow-500">
            <span className="text-2xl font-bold text-gray-900">{counts.pending}</span>
            <span className="text-xs text-gray-600 block">En attente</span>
          </div>
          <div className="bg-white rounded-xl p-3 shadow-sm border-l-4 border-green-500">
            <span className="text-2xl font-bold text-gray-900">{counts.approved}</span>
            <span className="text-xs text-gray-600 block">Approuvées</span>
          </div>
          <div className="bg-white rounded-xl p-3 shadow-sm border-l-4 border-red-500">
            <span className="text-2xl font-bold text-gray-900">{counts.rejected}</span>
            <span className="text-xs text-gray-600 block">Refusées</span>
          </div>
        </div>

        {/* Filtres */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-4">
          {(["all", "pending", "approved", "rejected"] as FilterStatus[]).map(
            (status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                  filter === status
                    ? "bg-green-700 text-white shadow-sm"
                    : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {status === "all"
                  ? "Toutes"
                  : status === "pending"
                  ? "En attente"
                  : status === "approved"
                  ? "Approuvées"
                  : "Refusées"}
              </button>
            )
          )}
        </div>

        {/* Liste des demandes */}
        {filteredRequests.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
            <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">
              inbox
            </span>
            <p className="text-gray-600 text-lg font-semibold">Aucune demande</p>
            <p className="text-gray-500 text-sm mt-2">
              {filter === "all"
                ? "Aucune demande de partenariat pour le moment"
                : `Aucune demande ${
                    filter === "pending"
                      ? "en attente"
                      : filter === "approved"
                      ? "approuvée"
                      : "refusée"
                  }`}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredRequests.map((request) => (
              <div
                key={request.id}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                {/* Header de la carte */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold text-gray-900">
                        {request.pharmacyName}
                      </h3>
                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase border ${getStatusBadge(
                          request.status
                        )}`}
                      >
                        {getStatusLabel(request.status)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {request.city} · {request.phone}
                    </p>
                  </div>
                </div>

                {/* Détails */}
                <div className="bg-gray-50 rounded-lg p-3 mb-3 space-y-1.5">
                  <div className="flex items-start gap-2 text-sm">
                    <span className="material-symbols-outlined text-gray-400 text-base">
                      location_on
                    </span>
                    <span className="text-gray-700">{request.address}</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <span className="material-symbols-outlined text-gray-400 text-base">
                      badge
                    </span>
                    <span className="text-gray-700">
                      Autorisation : {request.licenseNumber}
                    </span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <span className="material-symbols-outlined text-gray-400 text-base">
                      mail
                    </span>
                    <span className="text-gray-700">{request.userEmail}</span>
                  </div>
                  {request.description && (
                    <div className="flex items-start gap-2 text-sm">
                      <span className="material-symbols-outlined text-gray-400 text-base">
                        description
                      </span>
                      <span className="text-gray-700">{request.description}</span>
                    </div>
                  )}
                  <div className="flex items-start gap-2 text-sm">
                    <span className="material-symbols-outlined text-gray-400 text-base">
                      schedule
                    </span>
                    <span className="text-gray-500">
                      Soumise le {formatDate(request.createdAt)}
                    </span>
                  </div>
                  {request.reviewNote && (
                    <div className="flex items-start gap-2 text-sm bg-white rounded p-2 border border-gray-200">
                      <span className="material-symbols-outlined text-gray-400 text-base">
                        comment
                      </span>
                      <span className="text-gray-600 italic">
                        Note : {request.reviewNote}
                      </span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                {request.status === "pending" && (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() =>
                        setModal({ type: "approve", request })
                      }
                      disabled={actionLoading === request.id}
                      className="h-11 bg-green-700 hover:bg-green-800 disabled:bg-gray-400 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
                    >
                      {actionLoading === request.id ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-lg">
                            check_circle
                          </span>
                          Approuver
                        </>
                      )}
                    </button>
                    <button
                      onClick={() =>
                        setModal({ type: "reject", request })
                      }
                      disabled={actionLoading === request.id}
                      className="h-11 bg-white border border-red-400 text-red-700 hover:bg-red-50 disabled:bg-gray-100 font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
                    >
                      <span className="material-symbols-outlined text-lg">
                        cancel
                      </span>
                      Refuser
                    </button>
                  </div>
                )}

                {request.status === "approved" && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-green-700">
                      check_circle
                    </span>
                    <span className="text-sm text-green-700 font-medium">
                      Pharmacie créée · Rôle mis à jour en "owner"
                    </span>
                  </div>
                )}

                {request.status === "rejected" && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-red-700">
                      cancel
                    </span>
                    <span className="text-sm text-red-700 font-medium">
                      Demande refusée
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal de confirmation */}
      {modal.request && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            {/* Icône */}
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                modal.type === "approve"
                  ? "bg-green-100"
                  : "bg-orange-100"
              }`}
            >
              <span
                className={`material-symbols-outlined text-3xl ${
                  modal.type === "approve"
                    ? "text-green-600"
                    : "text-orange-600"
                }`}
              >
                {modal.type === "approve" ? "verified" : "warning"}
              </span>
            </div>

            {/* Titre */}
            <h2 className="text-lg font-bold text-gray-900 text-center mb-2">
              {modal.type === "approve"
                ? "Approuver cette demande ?"
                : "Refuser cette demande ?"}
            </h2>

            {/* Texte */}
            <p className="text-sm text-gray-600 text-center mb-4">
              {modal.type === "approve" ? (
                <>
                  Le rôle de l'utilisateur sera changé en <strong>"owner"</strong> et
                  la pharmacie <strong>"{modal.request.pharmacyName}"</strong> sera
                  créée automatiquement.
                </>
              ) : (
                <>
                  La demande de <strong>"{modal.request.pharmacyName}"</strong> sera
                  refusée. L'utilisateur pourra soumettre une nouvelle demande.
                </>
              )}
            </p>

            {/* Note optionnelle */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Note (optionnel)
              </label>
              <textarea
                value={reviewNote}
                onChange={(e) => setReviewNote(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-600 outline-none resize-none"
                placeholder="Raison de la décision..."
              />
            </div>

            {/* Boutons */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setModal({ type: "approve", request: null });
                  setReviewNote("");
                }}
                className="flex-1 h-11 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleAction}
                disabled={actionLoading === modal.request.id}
                className={`flex-1 h-11 font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors ${
                  modal.type === "approve"
                    ? "bg-green-700 hover:bg-green-800 text-white"
                    : "bg-red-600 hover:bg-red-700 text-white"
                } disabled:opacity-50`}
              >
                {actionLoading === modal.request.id ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : modal.type === "approve" ? (
                  <>
                    <span className="material-symbols-outlined text-lg">
                      check_circle
                    </span>
                    Approuver
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-lg">
                      cancel
                    </span>
                    Refuser
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}