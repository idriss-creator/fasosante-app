"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { updateReservationStatus } from "@/services/reservations";

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reservationId = searchParams.get("reservation");
  const total = searchParams.get("total") || "1500";
  const medicine = searchParams.get("medicine") || "Paracétamol 500mg";
  const pharmacy = searchParams.get("pharmacy") || "Pharmacie Centrale";
  const quantity = searchParams.get("quantity") || "2";

  const [paymentMethod, setPaymentMethod] = useState<"orange" | "moov">("orange");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [reservationCode, setReservationCode] = useState("");

  const handlePayment = async () => {
    if (!phoneNumber || phoneNumber.length !== 8) {
      alert("Veuillez entrer un numéro de téléphone valide (8 chiffres)");
      return;
    }

    setLoading(true);
    
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      const code = `#FSK-${new Date().toISOString().split("T")[0].replace(/-/g, "")}-${Math.floor(Math.random() * 10000).toString().padStart(4, "0")}`;
      setReservationCode(code);

      if (reservationId) {
        await updateReservationStatus(reservationId, "confirmed", {
          paymentMethod: paymentMethod === "orange" ? "Orange Money" : "Moov Money",
          phoneNumber,
          paidAt: new Date(),
          transactionId: code,
        });
      }

      setSuccess(true);
    } catch (error) {
      console.error("Erreur de paiement:", error);
      alert("Une erreur est survenue lors du paiement. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, "");
    
    if (digits.length <= 8) {
      setPhoneNumber(digits);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
        <div className="flex flex-col items-center justify-center w-full max-w-sm gap-6 text-center -mt-16">
          <div className="relative w-24 h-24 flex items-center justify-center">
            <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping"></div>
            <div className="relative w-20 h-20 bg-green-600 rounded-full flex items-center justify-center shadow-lg">
              <span
                className="material-symbols-outlined text-white text-[48px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                check
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-4">
            <h1 className="font-bold text-2xl text-gray-900">Paiement confirmé !</h1>
            <p className="text-sm text-gray-600 leading-relaxed">
              Votre médicament est réservé à {pharmacy}.
            </p>
          </div>

          <div className="bg-gray-100 px-6 py-4 rounded-xl w-full flex flex-col gap-2 mt-2">
            <span className="text-xs text-gray-600 font-semibold uppercase tracking-wider">
              Code réservation
            </span>
            <span className="font-mono font-bold text-xl tracking-wide text-green-700">
              {reservationCode}
            </span>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 w-full text-left">
            <p className="text-sm text-gray-700 mb-2">
              <strong>Prochaines étapes :</strong>
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>✓ SMS de confirmation envoyé</li>
              <li>✓ Retirer votre médicament dans 30 min</li>
              <li>✓ Présenter ce code à la pharmacie</li>
            </ul>
          </div>

          <div className="flex gap-3 w-full mt-4">
            <Link
              href="/dashboard/reservations"
              className="flex-1 h-12 bg-green-700 text-white font-bold rounded-xl flex items-center justify-center hover:bg-green-800 transition-colors shadow-lg"
            >
              Voir ma réservation
            </Link>
            <Link
              href="/dashboard"
              className="flex-1 h-12 border-2 border-gray-300 text-gray-700 font-bold rounded-xl flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              Accueil
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="flex items-center justify-between px-4 h-16 bg-white sticky top-0 z-10 shadow-sm">
        <button
          onClick={() => router.back()}
          aria-label="Retour"
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <span className="material-symbols-outlined text-gray-700">arrow_back</span>
        </button>
        <h1 className="font-semibold text-lg text-gray-900">Paiement sécurisé</h1>
        <div className="p-2 -mr-2">
          <span className="material-symbols-outlined text-green-700">lock</span>
        </div>
      </header>

      <main className="flex-1 px-4 py-6 flex flex-col gap-6 max-w-md mx-auto w-full">
        <section className="bg-gray-100 rounded-2xl p-4 flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <p className="font-semibold text-sm text-gray-900">
              💊 {medicine} × {quantity}
            </p>
            <p className="text-xs text-gray-600">{pharmacy}, Ouagadougou</p>
          </div>
          <hr className="border-t border-gray-300/50 my-1" />
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Sous-total</span>
            <span className="font-medium">{total} FCFA</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Frais de service</span>
            <span className="font-medium">0 FCFA</span>
          </div>
          <hr className="border-t-2 border-gray-300/30 my-1" />
          <div className="flex justify-between items-center">
            <span className="font-bold text-lg text-gray-900">Total</span>
            <span className="font-bold text-lg text-green-600">{total} FCFA</span>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="font-semibold text-base text-gray-900">
            Choisissez votre mode de paiement
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {/* Orange Money avec vrai logo */}
            <button
              onClick={() => setPaymentMethod("orange")}
              className={`relative rounded-2xl p-4 flex flex-col items-center justify-center gap-3 transition-all border-2 ${
                paymentMethod === "orange"
                  ? "bg-orange-50 border-orange-500"
                  : "bg-white border-gray-300 hover:bg-gray-50"
              }`}
            >
              {paymentMethod === "orange" && (
                <div className="absolute top-2 right-2 bg-orange-500 rounded-full p-0.5">
                  <span
                    className="material-symbols-outlined text-white text-sm"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check
                  </span>
                </div>
              )}
              <div className="h-10 w-16 flex items-center justify-center overflow-hidden">
                <img 
                  alt="Orange Money" 
                  className="w-full h-full object-contain"
                  src="/images/payment/orange-money.png"
                  style={{ imageRendering: 'crisp-edges' }}
                />
              </div>
              <span className="font-semibold text-sm text-gray-900">Orange Money</span>
            </button>

            {/* Moov Money avec vrai logo */}
            <button
              onClick={() => setPaymentMethod("moov")}
              className={`relative rounded-2xl p-4 flex flex-col items-center justify-center gap-3 transition-all border-2 ${
                paymentMethod === "moov"
                  ? "bg-orange-50 border-orange-500"
                  : "bg-white border-gray-300 hover:bg-gray-50"
              }`}
            >
              {paymentMethod === "moov" && (
                <div className="absolute top-2 right-2 bg-orange-500 rounded-full p-0.5">
                  <span
                    className="material-symbols-outlined text-white text-sm"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check
                  </span>
                </div>
              )}
              <div className="h-10 w-16 flex items-center justify-center overflow-hidden">
                <img 
                  alt="Moov Money" 
                  className="w-full h-full object-contain"
                  src="/images/payment/moov-money.png"
                  style={{ WebkitImageRendering: '-webkit-optimize-contrast', imageRendering: 'crisp-edges' } as React.CSSProperties}
                />
              </div>
              <span className="font-semibold text-sm text-gray-900">Moov Money</span>
            </button>
          </div>
        </section>

        <section className="flex flex-col gap-2 mt-2">
          <label className="font-semibold text-sm text-gray-900" htmlFor="phone">
            Numéro {paymentMethod === "orange" ? "Orange Money" : "Moov Money"}
          </label>
          <div className="relative flex items-center">
            <div className="absolute left-0 top-0 bottom-0 flex items-center px-4 bg-gray-100 rounded-l-xl border border-r-0 border-gray-300">
              <span className="font-semibold text-sm">+226</span>
            </div>
            <input
              className="w-full h-[52px] pl-[80px] pr-4 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none bg-white font-semibold text-lg transition-all"
              id="phone"
              placeholder="07X XXX XXX"
              type="tel"
              value={phoneNumber}
              onChange={(e) => formatPhoneNumber(e.target.value)}
              maxLength={8}
            />
          </div>
          <p className="text-xs text-gray-600 mt-1">
            Vous recevrez une demande de confirmation sur votre téléphone.
          </p>
        </section>
      </main>

      <div className="px-4 pb-8 pt-4 bg-white border-t border-gray-200 flex flex-col gap-4 sticky bottom-0">
        <button
          onClick={handlePayment}
          disabled={loading || phoneNumber.length !== 8}
          className={`w-full h-14 font-bold text-lg rounded-xl flex items-center justify-center transition-all shadow-lg ${
            paymentMethod === "orange"
              ? "bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/30"
              : "bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/30"
          } disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]`}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Traitement...
            </span>
          ) : (
            `Confirmer le paiement — ${total} FCFA`
          )}
        </button>
        <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">lock</span>
            SSL Sécurisé
          </span>
          <span>•</span>
          <span>✓ Orange Money</span>
          <span>•</span>
          <span>✓ Moov Money</span>
        </div>
      </div>
    </div>
  );
}