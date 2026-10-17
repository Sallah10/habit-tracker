"use client";
import { useEffect, useState } from "react";
import { Download, Share } from "lucide-react";
import { Button } from "@/components/ui/button";

// The beforeinstallprompt event isn't in the TS lib yet.
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

type NavigatorWithStandalone = Navigator & { standalone?: boolean };

// Shows an "install app" button when the browser offers one (Android/desktop
// Chrome + Edge), and plain home-screen instructions everywhere else (iOS).
export function InstallApp() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as NavigatorWithStandalone).standalone === true;
    if (standalone) {
      setInstalled(true);
      return;
    }

    setIsIOS(/iPad|iPhone|iPod/.test(window.navigator.userAgent));

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => setInstalled(true);

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
  };

  if (installed) {
    return (
      <p className="text-sm text-gray-400">
        You&apos;re running HabiTapp as an installed app. Open it from your home
        screen any time.
      </p>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {deferred ? (
        <Button size="lg" onClick={install} className="gap-2 px-8 text-base font-semibold">
          <Download className="h-4 w-4" aria-hidden="true" />
          Install HabiTapp
        </Button>
      ) : null}

      {isIOS ? (
        <p className="flex flex-wrap items-center justify-center gap-1.5 text-sm text-gray-400">
          On iPhone: tap <Share className="h-4 w-4" aria-hidden="true" /> Share, then
          &quot;Add to Home Screen&quot;.
        </p>
      ) : (
        <p className="text-sm text-gray-400">
          On Android: menu &#8942; → &quot;Add to Home screen&quot;. On desktop: the
          install icon in the address bar.
        </p>
      )}
    </div>
  );
}
