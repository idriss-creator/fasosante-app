"use client";

import { useEffect, useState } from "react";

export default function PWAProvider() {
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    const registerSW = async () => {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        });

        console.log("✅ SW enregistré avec succès !", registration);

        // Vérifier les mises à jour
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener("statechange", () => {
              if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                setUpdateAvailable(true);
              }
            });
          }
        });

        // Forcer la vérification des mises à jour au chargement
        registration.update();
      } catch (error) {
        console.error("❌ Échec de l'enregistrement SW:", error);
      }
    };

    window.addEventListener("load", registerSW);

    return () => {
      window.removeEventListener("load", registerSW);
    };
  }, []);

  // Bouton pour mettre à jour (optionnel)
  useEffect(() => {
    if (updateAvailable) {
      if (confirm("Une nouvelle version est disponible. Recharger la page ?")) {
        window.location.reload();
      }
    }
  }, [updateAvailable]);

  return null;
}