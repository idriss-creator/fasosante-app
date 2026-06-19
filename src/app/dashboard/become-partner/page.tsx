"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/services/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import Link from "next/link";

export default function BecomePartnerPage() {
  const router = useRouter();
  const user = auth.currentUser;

  const [formData, setFormData] = useState({
    pharmacyName: "",
    phone: "",
    city: "",
    address: "",
    licenseNumber: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!user) {
        throw new Error("Vous devez être connecté");
      }

      // Créer la demande dans owner_requests
      const requestId = `${user.uid}_${Date.now()}`;
      await setDoc(doc(db, "owner_requests", requestId), {
        userId: user.uid,
        userEmail: user.email,
        pharmacyName: formData.pharmacyName,
        phone: formData.phone,
        city: formData.city,
        address: formData.address,
        licenseNumber: formData.licenseNumber,
        description: formData.description,
        status: "pending",
        createdAt: serverTimestamp(),
      });

      setSuccess(true);
      
      // Rediriger après 3 secondes
      setTimeout(() => {
        router.push("/dashboard/profile");
      }, 3000);
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 shadow-md max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-green-600 text-4xl">check_circle</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Demande envoyée !</h2>
          <p className="text-gray-600 mb-6">
            Votre demande de partenariat a été soumise avec succès. Notre équipe l'examinera dans les plus brefs délais.
          </p>
          <p className="text-sm text-gray-500">
            Vous serez redirigé vers votre profil dans quelques secondes...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <header className="bg-white sticky top-0 z-40 flex items-center justify-between px-4 h-16 shadow-sm">
        <button
          onClick={() => router.back()}
          className="text-green-700 active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </button>
        <h1 className="text-xl font-bold text-green-700">Devenir partenaire</h1>
        <div className="w-10"></div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Introduction */}
        <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-6 mb-6 text-white">
          <h2 className="text-xl font-bold mb-2">Rejoignez FASOSANTÉ</h2>
          <p className="text-sm text-white/90">
            En tant que pharmacie partenaire, vous pourrez gérer vos stocks, recevoir des réservations et atteindre plus de clients.
          </p>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Informations de la pharmacie</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom de la pharmacie *
              </label>
              <input
                type="text"
                required
                value={formData.pharmacyName}
                onChange={(e) => setFormData({ ...formData, pharmacyName: e.target.value })}
                className="w-full h-12 px-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition-all outline-none"
                placeholder="Ex: Pharmacie Laafi"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Téléphone *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full h-12 px-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition-all outline-none"
                placeholder="+226 70 00 00 00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ville *
              </label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full h-12 px-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition-all outline-none"
                placeholder="Ouagadougou"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Adresse complète *
              </label>
              <textarea
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition-all outline-none resize-none"
                placeholder="Quartier, rue, point de repère..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Numéro d'autorisation d'exploitation *
              </label>
              <input
                type="text"
                required
                value={formData.licenseNumber}
                onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                className="w-full h-12 px-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition-all outline-none"
                placeholder="Ex: AUT-2024-001"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description (optionnel)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition-all outline-none resize-none"
                placeholder="Présentez votre pharmacie en quelques lignes..."
              />
            </div>
          </div>

          {/* Message d'erreur */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          {/* Bouton soumettre */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-green-700 hover:bg-green-800 disabled:bg-gray-400 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Envoi en cours...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined">send</span>
                Envoyer ma demande
              </>
            )}
          </button>

          <p className="text-xs text-gray-500 text-center">
            En soumettant ce formulaire, vous acceptez que notre équipe examine votre demande. Vous serez notifié par email de la décision.
          </p>
        </form>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-2xl border-t border-gray-200">
        <div className="flex justify-around items-center px-2 py-3">
          <Link href="/dashboard" className="flex flex-col items-center text-gray-600">
            <span className="material-symbols-outlined text-2xl">home</span>
            <span className="text-xs mt-0.5">Accueil</span>
          </Link>
          <Link href="/dashboard/search" className="flex flex-col items-center text-gray-600">
            <span className="material-symbols-outlined text-2xl">search</span>
            <span className="text-xs mt-0.5">Recherche</span>
          </Link>
          <Link href="/dashboard/pharmacies" className="flex flex-col items-center text-gray-600">
            <span className="material-symbols-outlined text-2xl">map</span>
            <span className="text-xs mt-0.5">Carte</span>
          </Link>
          <Link href="/dashboard/reservations" className="flex flex-col items-center text-gray-600">
            <span className="material-symbols-outlined text-2xl">event_note</span>
            <span className="text-xs mt-0.5">Réservations</span>
          </Link>
          <Link href="/dashboard/profile" className="flex flex-col items-center text-gray-600">
            <span className="material-symbols-outlined text-2xl">person</span>
            <span className="text-xs mt-0.5">Profil</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}