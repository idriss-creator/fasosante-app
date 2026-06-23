"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginUser } from "@/services/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const handleLogin = async () => {
    try {
      setLoading(true);
      await loginUser(email, password);
      router.push("/dashboard");
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };
// Après login réussi
document.cookie = "hasSeenOnboarding=true; path=/; max-age=31536000";
router.push("/dashboard");
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background decor */}
      <div className="absolute top-[-10%] right-[-10%] w-[120%] h-[50%] bg-gradient-to-b from-green-600/10 to-transparent rounded-full blur-3xl -z-10"></div>
      
      <div className="w-full max-w-[400px] flex flex-col gap-6 z-10">
        {/* Header */}
        <header className="flex flex-col items-center gap-4 text-center">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-2">
            <div className="w-12 h-12 rounded-xl bg-green-600 flex items-center justify-center text-white shadow-lg">
              <span className="material-symbols-outlined text-3xl">medical_services</span>
            </div>
            <h1 className="text-2xl font-bold text-green-700 tracking-tight">FASOSANTÉ</h1>
          </div>
          
          {/* Welcome Text */}
          <div className="flex flex-col gap-1">
            <h2 className="text-3xl font-bold text-gray-900">Bon retour 👋</h2>
            <p className="text-gray-600">Connectez-vous à votre espace FASOSANTÉ</p>
          </div>
        </header>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <div className="flex flex-col gap-5">
            {/* Email Field */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700" htmlFor="email">
                Adresse email
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-4 text-gray-500">mail</span>
                <input
                  className="w-full h-[52px] pl-12 pr-4 bg-green-50/50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                  id="email"
                  placeholder="exemple@email.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-gray-700" htmlFor="password">
                  Mot de passe
                </label>
                <Link 
                  href="/forgot-password" 
                  className="text-sm text-green-600 font-medium hover:text-green-700 transition-colors"
                >
                  Mot de passe oublié ?
                </Link>
              </div>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-4 text-gray-500">lock</span>
                <input
                  className="w-full h-[52px] pl-12 pr-12 bg-green-50/50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                  id="password"
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  aria-label="Toggle password visibility"
                  className="absolute right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full h-[52px] mt-2 bg-green-700 hover:bg-green-800 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Connexion..." : (
                <>
                  Se connecter
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer Links */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center w-full gap-4">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-sm text-gray-500">ou</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>
          
          <p className="text-gray-600 text-center">
            Pas encore de compte ?{" "}
            <Link 
              href="/register" 
              className="text-green-700 font-bold hover:underline underline-offset-4"
            >
              Créer un compte
            </Link>
          </p>

          <Link
            href="/"
            className="text-center text-gray-600 hover:text-green-700 transition-colors"
          >
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </main>
  );
}