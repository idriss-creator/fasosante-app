"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/services/firebase";

export default function HomePage() {
  const router = useRouter();
  const [phase, setPhase] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Animation sur 3 secondes
    const timers = [
      setTimeout(() => setPhase(1), 100),    // Particules apparaissent
      setTimeout(() => setPhase(2), 500),    // Logo pulse + ondes
      setTimeout(() => setPhase(3), 1200),   // Texte FASOSANTÉ
      setTimeout(() => setPhase(4), 1800),   // Slogan + loader
    ];

    // Redirection après 3 secondes
    const redirectTimer = setTimeout(() => {
      const user = auth.currentUser;
      const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding");

      if (!user) {
        if (!hasSeenOnboarding) {
          router.push("/onboarding");
        } else {
          router.push("/login");
        }
      } else {
        router.push("/dashboard");
      }
    }, 3000);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(redirectTimer);
    };
  }, [router]);

  return (
    <div className="fixed inset-0 overflow-hidden bg-gradient-to-br from-green-600 via-green-700 to-teal-800">
      {/* Particules en arrière-plan */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/10 animate-pulse"
            style={{
              width: `${60 + (i * 7) % 80}px`,
              height: `${60 + (i * 7) % 80}px`,
              left: `${(i * 17) % 100}%`,
              top: `${(i * 23) % 100}%`,
              animationDelay: `${(i * 0.3) % 3}s`,
              animationDuration: `${2 + (i * 0.5) % 3}s`,
              opacity: mounted && phase >= 1 ? 0.6 : 0,
              transition: "opacity 0.8s ease-out",
            }}
          />
        ))}
      </div>

      {/* Ondes radar */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="absolute w-96 h-96 rounded-full border-2 border-white/20 animate-ping"
          style={{ animationDuration: "2.5s", opacity: mounted && phase >= 2 ? 0.3 : 0, transition: "opacity 0.8s ease-out" }}
        />
        <div
          className="absolute w-72 h-72 rounded-full border-2 border-white/30 animate-ping"
          style={{ animationDuration: "2.5s", animationDelay: "0.5s", opacity: mounted && phase >= 2 ? 0.5 : 0, transition: "opacity 0.8s ease-out" }}
        />
        <div
          className="absolute w-48 h-48 rounded-full border-2 border-white/40 animate-ping"
          style={{ animationDuration: "2.5s", animationDelay: "1s", opacity: mounted && phase >= 2 ? 0.7 : 0, transition: "opacity 0.8s ease-out" }}
        />
      </div>

      {/* Carte Glassmorphism */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="relative backdrop-blur-xl bg-white/10 rounded-3xl p-12 shadow-2xl border border-white/20"
          style={{
            transform: mounted && phase >= 2 ? "scale(1)" : "scale(0.8)",
            opacity: mounted && phase >= 2 ? 1 : 0,
            transition: "all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        >
          {/* Logo avec pouls animé */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div
                className="w-28 h-28 bg-white rounded-3xl flex items-center justify-center shadow-2xl relative overflow-hidden"
                style={{
                  animation: mounted && phase >= 2 ? "pulse 2s ease-in-out infinite" : "none",
                }}
              >
                {/* SVG du pouls */}
                <svg
                  className="w-20 h-20 relative z-10"
                  viewBox="0 0 100 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Ligne de pouls principale */}
                  <path
                    d="M 10 50 L 25 50 L 30 30 L 35 70 L 40 20 L 45 80 L 50 50 L 65 50 L 70 35 L 75 65 L 80 50 L 90 50"
                    stroke="#059669"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                      strokeDasharray: 300,
                      strokeDashoffset: mounted && phase >= 2 ? 0 : 300,
                      transition: "stroke-dashoffset 2s ease-out",
                    }}
                  />
                  {/* Glow effect */}
                  <path
                    d="M 10 50 L 25 50 L 30 30 L 35 70 L 40 20 L 45 80 L 50 50 L 65 50 L 70 35 L 75 65 L 80 50 L 90 50"
                    stroke="#059669"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.3"
                    style={{
                      strokeDasharray: 300,
                      strokeDashoffset: mounted && phase >= 2 ? 0 : 300,
                      transition: "stroke-dashoffset 2s ease-out",
                      filter: "blur(4px)",
                    }}
                  />
                </svg>
              </div>
              {/* Halo lumineux */}
              <div
                className="absolute inset-0 bg-green-500/30 rounded-3xl blur-2xl -z-10"
                style={{
                  animation: mounted && phase >= 2 ? "glow 2.5s ease-in-out infinite" : "none",
                }}
              />
            </div>
          </div>

          {/* Texte FASOSANTÉ */}
          <h1
            className="text-5xl font-extrabold text-white text-center mb-3 tracking-tight"
            style={{
              opacity: mounted && phase >= 3 ? 1 : 0,
              transform: mounted && phase >= 3 ? "translateY(0)" : "translateY(30px)",
              transition: "all 0.8s ease-out",
            }}
          >
            FASOSANTÉ
          </h1>

          {/* Slogan */}
          <p
            className="text-white/90 text-center text-lg font-medium"
            style={{
              opacity: mounted && phase >= 4 ? 1 : 0,
              transform: mounted && phase >= 4 ? "translateY(0)" : "translateY(30px)",
              transition: "all 0.8s ease-out",
            }}
          >
            Votre santé, à portée de main
          </p>
        </div>
      </div>

      {/* Loader en bas */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
        <div
          className="w-56 h-1.5 bg-white/20 rounded-full overflow-hidden"
          style={{
            opacity: mounted && phase >= 1 ? 1 : 0,
            transition: "opacity 0.8s ease-out",
          }}
        >
          <div
            className="h-full bg-white rounded-full"
            style={{
              width: mounted && phase >= 4 ? "100%" : "0%",
              transition: "width 1.2s ease-out",
            }}
          />
        </div>
      </div>

      {/* Styles CSS */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        @keyframes glow {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.1);
          }
        }
      `}</style>
    </div>
  );
}