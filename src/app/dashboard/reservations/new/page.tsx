"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { getPharmacies } from "@/services/pharmacies";
import { getMedicines } from "@/services/medicines";
import { getStocks } from "@/services/stocks";
import { createReservation } from "@/services/reservations";
import { auth } from "@/services/firebase";
import { useEffect } from "react";

export default function ReservationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const medicineId = searchParams.get("medicine");
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [reservationId, setReservationId] = useState<string>("");

  const [pharmacies, setPharmacies] = useState<any[]>([]);
  const [medicines, setMedicines] = useState<any[]>([]);
  const [stocks, setStocks] = useState<any[]>([]);
  
  const [selectedPharmacy, setSelectedPharmacy] = useState<string>("");
  const [selectedMedicine, setSelectedMedicine] = useState<string>(medicineId || "");
  const [quantity, setQuantity] = useState<number>(1);
  const [price, setPrice] = useState<number>(750);
  
  const user = auth.currentUser;

  useEffect(() => {
    const loadData = async () => {
      const [pharmaciesData, medicinesData, stocksData] = await Promise.all([
        getPharmacies(),
        getMedicines(),
        getStocks(),
      ]);
      setPharmacies(pharmaciesData);
      setMedicines(medicinesData);
      setStocks(stocksData);
      
      if (medicineId) {
        setSelectedMedicine(medicineId);
      }
    };
    
    loadData();
  }, [medicineId]);

  const getMedicineName = (id: string) =>
    medicines.find((m) => m.id === id)?.name || "";

  const getPharmacyName = (id: string) =>
    pharmacies.find((p) => p.id === id)?.name || "";

  const getPharmacyStock = (pharmacyId: string, medicineId: string) => {
    const stock = stocks.find(
      (s) => s.pharmacyId === pharmacyId && s.medicineId === medicineId
    );
    return stock?.quantity || 0;
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else router.back();
  };

  const handleCreateReservation = async (payNow: boolean = true) => {
  if (!user || !selectedPharmacy || !selectedMedicine || quantity === 0) {
    alert("Veuillez remplir tous les champs");
    return;
  }

  setLoading(true);
  try {
    // ✅ Construit l'objet SANS les champs undefined
    const reservationData: any = {
      userId: user.uid,
      pharmacyId: selectedPharmacy,
      medicineId: selectedMedicine,
      quantity,
      totalPrice: quantity * price,
      status: payNow ? "pending" : "confirmed",
      createdAt: new Date(),
    };

    // ✅ Ajoute paymentMethod seulement si défini
    if (!payNow) {
      reservationData.paymentMethod = "Paiement à la collecte";
    }

    const newReservationId = await createReservation(reservationData);
    
    setReservationId(newReservationId);
    
    if (payNow) {
      setStep(4);
    } else {
      router.push("/dashboard/reservations?success=true");
    }
  } catch (error) {
    console.error("Erreur création réservation:", error);
    alert("Une erreur est survenue lors de la réservation");
  } finally {
    setLoading(false);
  }
};

  const incrementQuantity = () => {
    const maxStock = getPharmacyStock(selectedPharmacy, selectedMedicine);
    if (quantity < maxStock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const renderStepper = () => (
    <div className="flex items-center justify-between w-full max-w-md mx-auto mb-8">
      {[1, 2, 3, 4].map((s) => (
        <div key={s} className="flex flex-col items-center gap-1 relative z-10">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
              s < step
                ? "bg-green-600 text-white"
                : s === step
                ? "bg-green-600 text-white ring-4 ring-green-200"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {s < step ? (
              <span className="material-symbols-outlined text-sm">check</span>
            ) : (
              s
            )}
          </div>
          <span
            className={`text-[10px] font-semibold ${
              s <= step ? "text-green-700" : "text-gray-500"
            }`}
          >
            {s === 1 && "Pharmacie"}
            {s === 2 && "Médicament"}
            {s === 3 && "Quantité"}
            {s === 4 && "Confirm"}
          </span>
        </div>
      ))}
      <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-0 mx-20" />
      <div
        className="absolute top-5 left-0 h-0.5 bg-green-600 -z-0 mx-20 transition-all"
        style={{ width: `${((step - 1) / 3) * 100}%` }}
      />
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="bg-green-50 border border-gray-200 rounded-lg p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-green-700">
          <span className="material-symbols-outlined">medication</span>
        </div>
        <div>
          <p className="text-sm text-gray-600">Médicament recherché</p>
          <p className="text-lg font-bold text-green-700">
            {getMedicineName(selectedMedicine)}
          </p>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-gray-900">Choisissez votre pharmacie</h2>
        <p className="text-sm text-gray-600 mt-1">
          Pharmacies disposant de stock à proximité.
        </p>
      </div>

      <div className="space-y-3">
        {pharmacies.map((pharmacy) => {
          const stock = getPharmacyStock(pharmacy.id, selectedMedicine);
          const isSelected = selectedPharmacy === pharmacy.id;

          return (
            <button
              key={pharmacy.id}
              onClick={() => setSelectedPharmacy(pharmacy.id)}
              className={`w-full text-left rounded-xl p-4 border-2 transition-all relative ${
                isSelected
                  ? "bg-green-50 border-green-600 shadow-md"
                  : "bg-white border-gray-200 hover:border-green-300"
              }`}
            >
              {isSelected && (
                <div className="absolute top-4 right-4 text-green-600">
                  <span
                    className="material-symbols-outlined"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                </div>
              )}
              
              <h3 className="text-lg font-bold text-gray-900 pr-8">
                {pharmacy.name}
              </h3>
              
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1 text-gray-600">
                  <span className="material-symbols-outlined text-sm">location_on</span>
                  <span className="text-sm">0.8 km</span>
                </div>
                <div className={`flex items-center gap-1 ${stock > 0 ? "text-green-700" : "text-gray-400"}`}>
                  <span className="material-symbols-outlined text-sm">inventory_2</span>
                  <span className="text-sm">
                    {stock > 0 ? `${stock} unités dispo.` : "Rupture"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 mt-2">
                <span className="material-symbols-outlined text-sm text-yellow-500">star</span>
                <span className="text-sm font-semibold">4.8</span>
                <span className="text-sm text-gray-500">(128 avis)</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6 text-center">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Confirmer le médicament</h2>
        <p className="text-sm text-gray-600 mt-1">
          Vérifiez les détails avant de sélectionner la quantité.
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 flex flex-col items-center">
        <div className="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-6xl text-green-700">medication</span>
        </div>
        
        <h3 className="text-lg font-bold text-gray-900">
          {getMedicineName(selectedMedicine)}
        </h3>
        <p className="text-sm text-gray-600 mt-1">Comprimé · Boîte de 16</p>
        
        <div className="w-full border-t border-gray-200 pt-4 mt-4 flex flex-col items-center gap-2">
          <div className="text-lg font-bold text-green-700">{price} FCFA / unité</div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-700">
            <span className="material-symbols-outlined text-sm">local_pharmacy</span>
            <span className="text-sm font-semibold">{getPharmacyName(selectedPharmacy)}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => {
    const maxStock = getPharmacyStock(selectedPharmacy, selectedMedicine);
    const total = quantity * price;

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-900">
          Choisissez la quantité
        </h2>

        <div className="flex items-center justify-center gap-6 bg-white p-8 rounded-3xl shadow-md border border-gray-100">
          <button
            onClick={decrementQuantity}
            className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
          >
            <span className="material-symbols-outlined text-2xl">remove</span>
          </button>
          
          <div className="w-24 text-center">
            <span className="text-4xl font-black text-green-700 block">{quantity}</span>
          </div>
          
          <button
            onClick={incrementQuantity}
            disabled={quantity >= maxStock}
            className="w-14 h-14 rounded-full bg-green-700 flex items-center justify-center text-white hover:bg-green-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-2xl">add</span>
          </button>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg text-gray-600">{getMedicineName(selectedMedicine)}</span>
            <span className="text-sm font-semibold bg-green-100 text-green-700 px-3 py-1 rounded-full">
              Boîte
            </span>
          </div>
          
          <div className="flex justify-between items-center mb-6">
            <span className="text-gray-600">
              {quantity} unités × {price} FCFA
            </span>
          </div>
          
          <hr className="border-gray-200 mb-6" />
          
          <div className="flex justify-between items-end mb-4">
            <span className="text-lg font-bold text-gray-900">Total</span>
            <span className="text-lg font-bold text-green-700">{total} FCFA</span>
          </div>
          
          <div className="flex items-center gap-2 text-gray-600 bg-green-50 p-3 rounded-lg border border-green-200">
            <span className="material-symbols-outlined text-green-700 text-sm">inventory_2</span>
            <span className="text-sm">
              Stock restant : <strong>{maxStock} unités</strong>
            </span>
          </div>
        </div>
      </div>
    );
  };

  const renderStep4 = () => {
    const total = quantity * price;

    return (
      <div className="space-y-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Confirmation</h2>

        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-4xl text-green-700">
                check_circle
              </span>
            </div>
            <h3 className="text-lg font-bold text-gray-900">
              Récapitulatif de votre réservation
            </h3>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-4 p-4 rounded-lg bg-green-50 border border-green-200">
              <div className="p-2 bg-white rounded-full text-green-700">
                <span className="material-symbols-outlined">medication</span>
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-600 mb-1">Médicament</p>
                <p className="font-semibold text-gray-900">
                  {getMedicineName(selectedMedicine)} x{quantity}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-lg bg-green-50 border border-green-200">
              <div className="p-2 bg-white rounded-full text-green-700">
                <span className="material-symbols-outlined">local_pharmacy</span>
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-600 mb-1">Pharmacie</p>
                <p className="font-semibold text-gray-900">
                  {getPharmacyName(selectedPharmacy)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-lg bg-green-50 border border-green-200">
              <div className="p-2 bg-white rounded-full text-red-600">
                <span className="material-symbols-outlined">timer</span>
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-600 mb-1">Délai</p>
                <p className="font-semibold text-gray-900">Prêt dans 30 minutes</p>
              </div>
            </div>
          </div>

          <hr className="border-gray-200 my-4" />

          <div className="py-4">
            <p className="text-sm text-gray-600 mb-2 uppercase tracking-wider">Total à payer</p>
            <p className="text-2xl font-black text-green-700">{total} FCFA</p>
          </div>

          <div className="flex flex-col gap-3">
            <Link
              href={`/dashboard/reservations/payment?reservation=${reservationId}&total=${total}&medicine=${encodeURIComponent(getMedicineName(selectedMedicine))}&pharmacy=${encodeURIComponent(getPharmacyName(selectedPharmacy))}&quantity=${quantity}`}
              className="w-full h-12 bg-green-700 text-white font-semibold rounded-lg flex items-center justify-center gap-2 hover:bg-green-800 transition-colors"
            >
              <span className="material-symbols-outlined">payments</span>
              Payer maintenant
            </Link>
            <button
              onClick={() => handleCreateReservation(false)}
              disabled={loading}
              className="w-full h-12 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <span className="material-symbols-outlined">storefront</span>
              {loading ? "Traitement..." : "Payer à la collecte"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-green-50 pb-24">
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-4 max-w-5xl mx-auto">
          <button
            onClick={handleBack}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-xl font-bold text-green-700">FASOSANTÉ</h1>
          <div className="w-10" />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        {renderStepper()}
        
        <div className="max-w-md mx-auto">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
        </div>
      </main>

      {step < 4 && (
        <div className="fixed bottom-0 w-full bg-white border-t border-gray-200 p-4 shadow-lg z-50">
          <div className="max-w-md mx-auto">
            <button
              onClick={() => {
                if (step === 3) {
                  handleCreateReservation(true);
                } else {
                  handleNext();
                }
              }}
              disabled={
                (step === 1 && !selectedPharmacy) ||
                (step === 2 && !selectedMedicine) ||
                loading
              }
              className="w-full h-12 bg-green-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-green-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Traitement...
                </span>
              ) : (
                <>
                  <span>{step === 3 ? "Confirmer" : "Continuer"}</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}