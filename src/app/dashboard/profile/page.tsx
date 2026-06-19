"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import UserSidebar from "@/components/UserSidebar";
import { auth } from "@/services/firebase";
import { getUserReservations } from "@/services/reservations";

export default function ProfilePage() {
  const router = useRouter();
  const pathname = usePathname();
  const user = auth.currentUser;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [reservationCount, setReservationCount] = useState(0);
  const [favoritesCount] = useState(5);
  const [memberSince] = useState(8);

  const [twoFA, setTwoFA] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(true);

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

  const handleLogout = async () => {
    if (confirm("Voulez-vous vraiment vous déconnecter ?")) {
      await auth.signOut();
      router.push("/login");
    }
  };

  const handleDeleteAccount = () => {
    if (confirm("Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.")) {
      alert("Fonctionnalité à implémenter");
    }
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

        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md shadow-sm flex items-center justify-between px-4 h-16 w-full md:hidden">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors active:scale-95"
            >
              <span className="material-symbols-outlined text-green-700">arrow_back</span>
            </button>
            <h1 className="text-xl font-bold text-green-700">Mon Profil</h1>
          </div>
          <button className="p-2 -mr-2 rounded-full hover:bg-gray-100 transition-colors active:scale-95">
            <span className="material-symbols-outlined text-green-700">settings</span>
          </button>
        </header>

        <main className="pt-4 px-4 max-w-5xl mx-auto w-full pb-24 md:pb-8">
          <section className="bg-gradient-to-b from-green-600 to-green-700 rounded-[20px] p-6 mb-6 shadow-md relative overflow-hidden flex flex-col items-center">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
            <div className="relative mb-4">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="Photo de profil" className="w-20 h-20 rounded-full border-[3px] border-white object-cover shadow-sm" />
              ) : (
                <div className="w-20 h-20 rounded-full border-[3px] border-white bg-white/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-4xl">person</span>
                </div>
              )}
              <button className="absolute bottom-0 right-0 bg-white text-green-700 p-1.5 rounded-full shadow-md hover:bg-gray-100 active:scale-95 transition-transform flex items-center justify-center">
                <span className="material-symbols-outlined text-[16px]">photo_camera</span>
              </button>
            </div>
            <h2 className="text-xl font-bold text-white mb-1">{user?.displayName || user?.email?.split("@")[0] || "Utilisateur"}</h2>
            <p className="text-sm text-white/80 mb-3">{user?.email || "email@exemple.com"}</p>
            <div className="bg-white/20 text-white rounded-full px-3 py-1 text-xs flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">verified_user</span>
              Patient
            </div>
          </section>

          <section className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-white rounded-xl p-3 shadow-sm flex flex-col items-center justify-center text-center">
              <span className="text-xl font-bold text-green-700">{reservationCount}</span>
              <span className="text-[11px] text-gray-600 mt-1 leading-tight">Réservations<br />totales</span>
            </div>
            <div className="bg-white rounded-xl p-3 shadow-sm flex flex-col items-center justify-center text-center">
              <span className="text-xl font-bold text-green-700">{favoritesCount}</span>
              <span className="text-[11px] text-gray-600 mt-1 leading-tight">Pharmacies<br />favorites</span>
            </div>
            <div className="bg-white rounded-xl p-3 shadow-sm flex flex-col items-center justify-center text-center">
              <span className="text-xl font-bold text-green-700">{memberSince}</span>
              <span className="text-[11px] text-gray-600 mt-1 leading-tight">Mois<br />membre</span>
            </div>
          </section>

          <section className="bg-white rounded-2xl p-5 shadow-sm mb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-semibold text-gray-900">Informations personnelles</h3>
              <button className="text-green-700 hover:bg-gray-100 p-2 rounded-full transition-colors active:scale-95 flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">edit</span>
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <span className="text-sm text-gray-600">Nom complet</span>
                <span className="text-sm text-gray-900 font-medium">{user?.displayName || user?.email?.split("@")[0] || "Non renseigné"}</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <span className="text-sm text-gray-600">Téléphone</span>
                <span className="text-sm text-gray-900 font-medium">+226 07X XXX XXX</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <span className="text-sm text-gray-600">Ville</span>
                <span className="text-sm text-gray-900 font-medium">Ouagadougou</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Date de naissance</span>
                <span className="text-sm text-gray-900 font-medium">12/05/1995</span>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl p-5 shadow-sm mb-4">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Sécurité</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <span className="text-sm text-gray-600">Mot de passe</span>
                <button className="px-3 py-1.5 border-[1.5px] border-gray-300 text-green-700 rounded-full text-sm hover:bg-gray-50 transition-colors">Changer</button>
              </div>
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <span className="text-sm text-gray-600">Authentification 2FA</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={twoFA} onChange={(e) => setTwoFA(e.target.checked)} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-700"></div>
                </label>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-sm text-gray-600">Sessions actives</span>
                <a className="text-sm text-green-700 hover:underline" href="#">Voir les appareils</a>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl p-5 shadow-sm mb-4">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Préférences</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <span className="text-sm text-gray-600">Notifications Push</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={pushNotif} onChange={(e) => setPushNotif(e.target.checked)} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-700"></div>
                </label>
              </div>
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <span className="text-sm text-gray-600">Notifications SMS</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={smsNotif} onChange={(e) => setSmsNotif(e.target.checked)} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-700"></div>
                </label>
              </div>
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-600">Langue</span>
                  <span className="text-sm text-gray-900 font-medium">Français</span>
                </div>
                <span className="material-symbols-outlined text-gray-600">chevron_right</span>
              </div>
            </div>
          </section>
           {/* Section Partenariat */}
            <section className="bg-white rounded-2xl p-5 shadow-sm mb-4">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Devenir partenaire</h3>
            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-white">storefront</span>
                </div>
                <div className="flex-1">
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">
                    Vous êtes pharmacien ?
                    </h4>
                    <p className="text-xs text-gray-600 mb-3">
                    Rejoignez FASOSANTÉ en tant que partenaire et gérez votre pharmacie en ligne.
                    </p>
                    <Link
                    href="/dashboard/become-partner"
                    className="inline-block bg-green-700 hover:bg-green-800 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                    >
                    Faire une demande
                    </Link>
                </div>
                </div>
            </div>
            </section>
          <section className="bg-white rounded-2xl p-5 shadow-sm mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-semibold text-gray-900">Mes pharmacies favorites</h3>
              <Link href="/dashboard/favorites" className="text-sm text-green-700 hover:underline">Gérer →</Link>
            </div>
            <ul className="space-y-3">
              {[
                { name: "Pharmacie Koulouba", id: "1" },
                { name: "Pharmacie du Progrès", id: "2" },
                { name: "Pharmacie Suka", id: "3" },
              ].map((pharmacy) => (
                <li key={pharmacy.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-2 rounded-full text-green-700">
                      <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>local_pharmacy</span>
                    </div>
                    <span className="text-sm text-gray-900">{pharmacy.name}</span>
                  </div>
                  <span className="material-symbols-outlined text-green-700" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="flex flex-col items-center gap-4 mb-8">
            <button onClick={handleLogout} className="w-full h-[52px] border-[1.5px] border-red-500 text-red-500 rounded-xl font-semibold hover:bg-red-50 active:scale-95 transition-all flex items-center justify-center gap-2">
              <span className="material-symbols-outlined">logout</span>
              Se déconnecter
            </button>
            <button onClick={handleDeleteAccount} className="text-sm text-red-500 hover:underline opacity-80">Supprimer mon compte</button>
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