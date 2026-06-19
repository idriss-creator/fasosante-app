"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function OnboardingPage() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < 2) {
      setCurrentSlide(currentSlide + 1);
    } else {
      // Fin de l'onboarding
      localStorage.setItem("hasSeenOnboarding", "true");
      router.push("/login");
    }
  };

  const handleSkip = () => {
    localStorage.setItem("hasSeenOnboarding", "true");
    router.push("/login");
  };

  // Slide 1: Recherche
  const renderSlide1 = () => (
    <div className="flex flex-col h-full">
      {/* Top Section (60%) */}
      <div className="h-[60%] w-full p-4 relative flex flex-col">
        <div className="absolute inset-x-4 top-4 bottom-0 bg-green-50 rounded-b-[2.5rem] rounded-t-3xl overflow-hidden flex items-center justify-center">
          {/* Map silhouette */}
          <div className="absolute inset-0 opacity-40 flex items-center justify-center pointer-events-none">
            <svg className="w-[120%] h-[120%] text-gray-300 fill-current" viewBox="0 0 100 100">
              <path d="M45,20 C55,15 65,25 75,22 C80,30 85,35 80,45 C85,55 75,65 70,70 C60,75 50,80 40,75 C30,75 20,65 15,55 C10,45 15,35 25,30 C30,25 35,25 45,20 Z"></path>
            </svg>
          </div>
          
          {/* Central magnifying glass */}
          <div className="relative z-10 w-32 h-32 rounded-full bg-white shadow-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-6xl text-green-700" style={{ fontVariationSettings: "'FILL' 1" }}>search</span>
          </div>
          
          {/* Floating pills */}
          <div className="absolute inset-0 z-20 pointer-events-none">
            <div className="absolute top-1/4 left-[10%] animate-[float_4s_ease-in-out_infinite]">
              <div className="bg-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                <span className="material-symbols-outlined text-base text-green-700">medication</span>
                <span className="text-sm font-semibold text-green-700">Paracétamol</span>
              </div>
            </div>
            <div className="absolute top-[15%] right-[5%] animate-[float_5s_ease-in-out_infinite]">
              <div className="bg-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                <span className="material-symbols-outlined text-base text-green-700">prescriptions</span>
                <span className="text-sm font-semibold text-green-700">Amoxicilline</span>
              </div>
            </div>
            <div className="absolute bottom-[20%] left-[5%] animate-[float_3.5s_ease-in-out_infinite]">
              <div className="bg-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                <span className="material-symbols-outlined text-base text-green-700">vaccines</span>
                <span className="text-sm font-semibold text-green-700">Coartem</span>
              </div>
            </div>
            <div className="absolute bottom-[25%] right-[10%] animate-[float_4.5s_ease-in-out_infinite_reverse]">
              <div className="bg-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                <span className="material-symbols-outlined text-base text-green-700">pill</span>
                <span className="text-sm font-semibold text-green-700">Ibuprofène</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section (40%) */}
      <div className="h-[40%] w-full px-4 pt-6 pb-12 flex flex-col items-center justify-between relative z-10 bg-white">
        <div className="flex flex-col items-center text-center space-y-2 w-full">
          <div className="bg-green-50 px-3 py-1 rounded-full mb-2">
            <span className="text-sm font-semibold text-green-700 uppercase tracking-wider">RECHERCHE</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Trouvez n'importe quel médicament</h2>
          <p className="text-base text-gray-600 max-w-[320px] pt-2">
            Recherchez parmi des milliers de médicaments référencés dans toutes les pharmacies du Burkina Faso, en temps réel.
          </p>
        </div>

        <div className="w-full flex flex-col items-center space-y-6 mt-auto pt-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-6 h-2 rounded-full bg-green-700"></div>
            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          </div>
          <button
            onClick={handleNext}
            className="w-full h-[52px] bg-green-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-green-800 transition-colors active:scale-[0.98]"
          >
            Suivant
            <span className="material-symbols-outlined text-xl">arrow_forward</span>
          </button>
          <button
            onClick={handleSkip}
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors pb-2"
          >
            Passer
          </button>
        </div>
      </div>
    </div>
  );

  // Slide 2: Localisation
  const renderSlide2 = () => (
    <div className="flex flex-col h-full">
      {/* Top Section (60%) */}
      <div className="h-[60%] w-full bg-blue-50 rounded-b-[40px] relative overflow-hidden">
        {/* Map background */}
        <div
          className="absolute inset-0 w-full h-full opacity-60 mix-blend-multiply bg-cover bg-center"
          style={{
            backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDJhyIxBHqT5kHmRE96kEI0gksLAeW2s62TyUwn2GdBfDopu8bOMPv1gCTt2jPVwqpVTg1vr9xu89W7L3D9hMnhC9rtuKRPPwhAQEHsyKO66CSUr1GWEj_2hunoUr2EbU_wJcCtXqmQmvDOH1sxADEIEV2lt8GItBEVzXpIj9u8qz42CucxzobsWPfoadxxKdh4PK0ux3mOXtVulv1pTOacskUZsYsfViPW-Bi3Sjgix-DtBuFsPuGRP1aQURu8jeVFR39O7jkep58')",
          }}
        ></div>

        {/* User pin */}
        <div className="absolute left-[195px] top-[250px] -translate-x-1/2 -translate-y-1/2">
          <div className="relative flex items-center justify-center">
            <div className="absolute w-12 h-12 bg-blue-500 rounded-full animate-ping opacity-50"></div>
            <div className="w-6 h-6 bg-blue-500 rounded-full border-4 border-white shadow-lg z-10"></div>
          </div>
        </div>

        {/* Pharmacy pin */}
        <div className="absolute left-[280px] top-[150px] -translate-x-1/2 -translate-y-full z-20">
          <div className="relative flex flex-col items-center">
            <div className="w-10 h-10 bg-green-700 rounded-full flex items-center justify-center shadow-lg">
              <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1", fontSize: "20px" }}>
                local_hospital
              </span>
            </div>
            <div className="w-3 h-3 bg-green-700 transform rotate-45 -translate-y-2"></div>
          </div>
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max bg-white rounded-xl shadow-lg py-2 px-3 flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-900">Pharmacie Centrale</span>
            <span className="text-xs text-gray-600">— 0.8 km —</span>
            <span className="text-xs font-medium text-green-700 flex items-center gap-1">
              <span className="material-symbols-outlined" style={{ fontSize: "14px", fontVariationSettings: "'FILL' 1" }}>
                check_circle
              </span>
              En stock
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Section (40%) */}
      <div className="h-[40%] w-full px-6 pt-8 pb-8 flex flex-col items-center justify-between bg-white">
        <div className="flex flex-col items-center text-center">
          <div className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold tracking-wide mb-4">
            LOCALISATION
          </div>
          <h2 className="text-2xl font-bold text-gray-900 leading-tight mb-3">
            Pharmacies proches de vous
          </h2>
          <p className="text-sm text-gray-600 font-normal leading-relaxed px-2">
            Localisez en un instant les pharmacies autour de vous, consultez leurs stocks disponibles et obtenez un itinéraire GPS.
          </p>
        </div>

        <div className="w-full flex flex-col items-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
            <div className="w-6 h-2 rounded-full bg-blue-500"></div>
            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          </div>
          <button
            onClick={handleNext}
            className="w-full h-[52px] bg-green-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-green-800 transition-colors active:scale-95"
          >
            Suivant
            <span className="material-symbols-outlined text-xl">arrow_forward</span>
          </button>
          <button
            onClick={handleSkip}
            className="text-gray-600 text-sm font-medium hover:text-gray-900 transition-colors pb-2"
          >
            Passer
          </button>
        </div>
      </div>
    </div>
  );
  // Slide 3: Réservation et paiement
  const renderSlide3 = () => (
    <div className="flex flex-col h-full bg-white">
      {/* Top Section (55%) */}
      <div className="h-[55%] w-full p-6 pt-8">
        <div className="w-full h-full rounded-[2.5rem] bg-[#FFF5F0] relative flex items-center justify-center">
          <div className="relative w-72 h-72">
            {/* Central phone */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-72 bg-white rounded-3xl shadow-2xl flex flex-col items-center p-5 z-10">
              <div className="w-16 h-1.5 bg-gray-300 rounded-full mb-8"></div>
              <div className="flex-1 flex flex-col items-center justify-center w-full">
                <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-green-600 text-4xl">check_circle</span>
                </div>
                <p className="text-sm text-gray-600 text-center mb-1">Réservation confirmée</p>
                <p className="text-xl font-bold text-gray-900 mb-4">1 500 FCFA</p>
                <div className="flex items-center gap-2 text-gray-700">
                  <span className="material-symbols-outlined text-lg">lock</span>
                  <span className="text-sm font-semibold">Paiement sécurisé</span>
                </div>
              </div>
            </div>

            {/* OM Logo - Orange Money */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 z-20 shadow-xl transform -translate-x-2">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center p-1 overflow-hidden">
                <img 
                  alt="Orange Money" 
                  className="w-full h-full object-contain"
                  src="/images/onboarding/orange-money.png"
                  style={{ imageRendering: 'crisp-edges', ...( { WebkitImageRendering: 'optimize-contrast' } as any) }}
                />
              </div>
            </div>

            {/* MM Logo - Moov Money */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 z-20 shadow-xl transform translate-x-2">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center p-1 overflow-hidden">
                <img 
                  alt="Moov Money" 
                  className="w-full h-full object-contain"
                  src="/images/onboarding/moov-money.png"
                  style={{ imageRendering: 'crisp-edges', ...( { WebkitImageRendering: 'optimize-contrast' } as any) }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section (45%) */}
      <div className="flex-1 bg-white px-6 flex flex-col justify-end pb-10">
        <div className="flex flex-col items-center text-center">
          <div className="bg-[#FEF3C7] px-4 py-1.5 rounded-full mb-6 border border-[#FDE68A]">
            <span className="text-xs text-[#D97706] uppercase tracking-wider font-bold">RÉSERVATION</span>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 leading-tight mb-4">
            Réservez et payez<br />en un clic
          </h2>
          <p className="text-base text-gray-600 mb-10 max-w-[320px] leading-relaxed">
            Réservez vos médicaments à l'avance et payez facilement via Orange Money ou Moov Money. Collectez quand vous voulez.
          </p>

          <div className="flex space-x-2 mb-10">
            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
            <div className="w-8 h-2 rounded-full bg-green-600"></div>
          </div>

          <div className="w-full space-y-3">
            <button
              onClick={handleNext}
              className="w-full h-[56px] bg-[#16A34A] text-white rounded-2xl font-bold text-base flex items-center justify-center hover:bg-green-700 transition-colors active:scale-[0.98] shadow-lg shadow-green-600/20"
            >
              Commencer maintenant
            </button>
            <Link
              href="/login"
              className="w-full h-[56px] bg-white border-2 border-[#16A34A] text-[#16A34A] rounded-2xl font-bold text-sm flex items-center justify-center hover:bg-green-50 transition-colors active:scale-[0.98]"
            >
              J'ai déjà un compte — Se connecter
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
  return (
    <div className="w-full min-h-screen bg-white flex items-center justify-center">
      <div className="w-full max-w-[390px] h-[844px] max-h-screen bg-white relative flex flex-col overflow-hidden mx-auto shadow-2xl">
        {currentSlide === 0 && renderSlide1()}
        {currentSlide === 1 && renderSlide2()}
        {currentSlide === 2 && renderSlide3()}
      </div>
    </div>
  );
  
}