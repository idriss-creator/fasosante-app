"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerUser } from "@/services/auth";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState<"citoyen" | "proprietaire">("citoyen");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // Calcul simple de la force du mot de passe
  const getPasswordStrength = () => {
    if (password.length === 0) return 0;
    if (password.length < 6) return 1;
    if (password.length < 10) return 2;
    return 3;
  };

  const passwordStrength = getPasswordStrength();

  const handleRegister = async () => {
    // Validation
    if (!fullName || !email || !phone || !password) {
      alert("Veuillez remplir tous les champs");
      return;
    }

    if (password !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas");
      return;
    }

    if (!acceptTerms) {
      alert("Veuillez accepter les conditions d'utilisation");
      return;
    }

    try {
      setLoading(true);
      await registerUser(email, password);
      alert("Compte créé avec succès !");
      router.push("/dashboard");
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-[400px] min-h-[844px] bg-white relative flex flex-col mx-auto overflow-hidden shadow-2xl rounded-3xl border border-gray-100">
        {/* Header */}
        <header className="pt-10 pb-4 px-4 flex flex-col items-center z-10 bg-white">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-green-600 text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              medical_services
            </span>
            <h1 className="text-xl font-bold text-green-700 tracking-tight">FASOSANTÉ</h1>
          </div>
          
          {/* Stepper */}
          <div className="flex items-center justify-center gap-3 w-full">
            {/* Step 1: Active */}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-semibold">1</div>
              <span className="text-sm font-semibold text-green-600">Profil</span>
            </div>
            {/* Connector */}
            <div className="h-[2px] w-8 bg-gray-200 rounded-full"></div>
            {/* Step 2: Inactive */}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-xs font-semibold">2</div>
              <span className="text-sm font-semibold text-gray-600">Informations</span>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto px-4 pb-12 flex flex-col gap-6">
          {/* Step 1: Profile Selection */}
          <section className="flex flex-col gap-2">
            <div className="grid grid-cols-2 gap-3">
              {/* Card 1: Citoyen */}
              <button
                onClick={() => setUserType("citoyen")}
                className={`relative border-2 rounded-xl p-4 flex flex-col items-center text-center transition-all active:scale-95 shadow-sm flex-1 ${
                  userType === "citoyen"
                    ? "bg-green-50 border-green-600"
                    : "bg-white border-gray-200 hover:border-green-300"
                }`}
              >
                {userType === "citoyen" && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-green-600 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check
                    </span>
                  </div>
                )}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                  userType === "citoyen" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"
                }`}>
                  <span className="material-symbols-outlined text-2xl">person</span>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Citoyen</h3>
                <p className="text-xs text-gray-600 leading-tight">Je cherche des médicaments</p>
              </button>

              {/* Card 2: Propriétaire */}
              <button
                onClick={() => setUserType("proprietaire")}
                className={`relative border-2 rounded-xl p-4 flex flex-col items-center text-center transition-all active:scale-95 shadow-sm flex-1 ${
                  userType === "proprietaire"
                    ? "bg-green-50 border-green-600"
                    : "bg-white border-gray-200 hover:border-green-300"
                }`}
              >
                {userType === "proprietaire" && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-green-600 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check
                    </span>
                  </div>
                )}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                  userType === "proprietaire" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                }`}>
                  <span className="material-symbols-outlined text-2xl">storefront</span>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Propriétaire</h3>
                <p className="text-xs text-gray-600 leading-tight">Je gère une pharmacie</p>
              </button>
            </div>
          </section>

          {/* Step 2: Form */}
          <section className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 flex flex-col gap-4">
            {/* Full Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-700" htmlFor="fullName">
                Nom complet
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-gray-500 text-xl">person</span>
                <input
                  className="w-full h-12 pl-10 pr-4 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-colors"
                  id="fullName"
                  placeholder="Aminata Traoré"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-700" htmlFor="email">
                Email
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-gray-500 text-xl">mail</span>
                <input
                  className="w-full h-12 pl-10 pr-4 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-colors"
                  id="email"
                  placeholder="exemple@email.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-700" htmlFor="phone">
                Téléphone
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3 flex items-center gap-1.5">
                  <span className="text-base">🇧🇫</span>
                  <span className="text-sm text-gray-500">+226</span>
                  <div className="w-[1px] h-4 bg-gray-300 ml-1"></div>
                </div>
                <input
                  className="w-full h-12 pl-[84px] pr-4 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-colors"
                  id="phone"
                  placeholder="07X XXX XXX"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-700" htmlFor="password">
                Mot de passe
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-gray-500 text-xl">lock</span>
                <input
                  className="w-full h-12 pl-10 pr-10 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-colors"
                  id="password"
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  className="absolute right-3 text-gray-500 hover:text-gray-700"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined text-xl">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
              {/* Strength Indicator */}
              <div className="flex gap-1 mt-1">
                <div className={`h-1 flex-1 rounded-full ${passwordStrength >= 1 ? "bg-red-500" : "bg-gray-200"}`}></div>
                <div className={`h-1 flex-1 rounded-full ${passwordStrength >= 2 ? "bg-yellow-500" : "bg-gray-200"}`}></div>
                <div className={`h-1 flex-1 rounded-full ${passwordStrength >= 3 ? "bg-green-500" : "bg-gray-200"}`}></div>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-700" htmlFor="confirmPassword">
                Confirmer le mot de passe
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-gray-500 text-xl">lock_reset</span>
                <input
                  className="w-full h-12 pl-10 pr-4 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-colors"
                  id="confirmPassword"
                  placeholder="••••••••"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  className="absolute right-3 text-gray-500 hover:text-gray-700"
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <span className="material-symbols-outlined text-xl">
                    {showConfirmPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-3 mt-2">
              <div className="flex items-center h-5">
                <input
                  className="w-4 h-4 rounded text-green-600 border-gray-300 focus:ring-green-600 focus:ring-offset-0 bg-white"
                  id="terms"
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                />
              </div>
              <label className="text-xs text-gray-600 leading-tight" htmlFor="terms">
                J'accepte les{" "}
                <a className="text-green-700 font-medium hover:underline" href="#">
                  conditions d'utilisation
                </a>{" "}
                et la politique de confidentialité.
              </label>
            </div>
          </section>

          {/* Actions */}
          <div className="flex flex-col gap-4 mt-2">
            <button
              onClick={handleRegister}
              disabled={loading}
              className="w-full h-[52px] bg-green-700 hover:bg-green-800 text-white rounded-xl font-semibold text-base flex items-center justify-center transition-all active:scale-[0.98] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Création..." : "Créer mon compte"}
            </button>
            <div className="text-center">
              <Link
                href="/login"
                className="text-sm font-semibold text-green-700 hover:underline"
              >
                Déjà un compte ? Se connecter
              </Link>
            </div>
          </div>
        </main>
      </div>
    </main>
  );
}