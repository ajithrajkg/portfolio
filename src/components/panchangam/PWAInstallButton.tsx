"use client";

import { useEffect, useState } from "react";
import { Download, Share } from "lucide-react";

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

export default function PWAInstallButton() {
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [hint, setHint] = useState("");

  useEffect(() => {
    setInstalled(
      window.matchMedia("(display-mode: standalone)").matches
        || (window.navigator as Navigator & { standalone?: boolean }).standalone === true,
    );
    const onPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as InstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setInstallPrompt(null);
      setHint("ആപ്പ് ഇൻസ്റ്റാൾ ചെയ്തു.");
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    if ("serviceWorker" in navigator) {
      void navigator.serviceWorker.getRegistrations()
        .then(async (registrations) => {
          const rootScope = `${window.location.origin}/`;
          await Promise.all(registrations
            .filter((registration) => (
              registration.scope === rootScope
              && registration.active?.scriptURL.endsWith("/panchangam-sw.js")
            ))
            .map((registration) => registration.unregister()));
          return navigator.serviceWorker.register("/panchangam-sw.js", {
            scope: "/panchangam/",
          });
        })
        .catch((error) => {
          console.error("Panchangam offline support could not be registered.", error);
        });
    }
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  async function install() {
    if (!installPrompt) {
      const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent);
      setHint(isIos
        ? "Safari-യിലെ പങ്കിടുക ബട്ടൺ അമർത്തി “Add to Home Screen” തിരഞ്ഞെടുക്കുക."
        : "ബ്രൗസറിലെ ഇൻസ്റ്റാൾ ഐക്കൺ അല്ലെങ്കിൽ മെനു തുറന്ന് “Install app” തിരഞ്ഞെടുക്കുക.");
      return;
    }
    try {
      await installPrompt.prompt();
      const result = await installPrompt.userChoice;
      if (result.outcome === "accepted") setHint("ഇൻസ്റ്റാളേഷൻ ആരംഭിച്ചു.");
      setInstallPrompt(null);
    } catch (error) {
      console.error("Panchangam installation prompt failed.", error);
      setHint("ഇപ്പോൾ ഇൻസ്റ്റാൾ ചെയ്യാനായില്ല. ബ്രൗസർ മെനുവിൽ നിന്ന് ഇൻസ്റ്റാൾ ചെയ്യുക.");
    }
  }

  if (installed) {
    return <span className="panch-installed-label">ആപ്പ് ഇൻസ്റ്റാൾ ചെയ്തു</span>;
  }

  return (
    <div className="panch-install-wrap">
      <button
        className="panch-install-button"
        type="button"
        onClick={install}
        aria-label="ആപ്പ് ഇൻസ്റ്റാൾ ചെയ്യുക"
        title="ആപ്പ് ഇൻസ്റ്റാൾ ചെയ്യുക"
      >
        {installPrompt ? <Download size={17} /> : <Share size={17} />}
        <span>ആപ്പ് ഇൻസ്റ്റാൾ ചെയ്യുക</span>
      </button>
      {hint && <p className="panch-install-hint" role="status">{hint}</p>}
    </div>
  );
}
