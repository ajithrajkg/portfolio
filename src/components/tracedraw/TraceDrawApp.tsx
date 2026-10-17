"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Camera,
  Check,
  ChevronRight,
  Download,
  ImagePlus,
  Images,
  LockKeyhole,
  Move,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import { type OverlayTransform } from "./ImageOverlay";
import TracingWorkspace from "./TracingWorkspace";
import {
  getRecentTraceImages,
  saveTraceImage,
  type StoredTraceImage,
} from "@/lib/tracedraw-storage";

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};
type RecentImage = StoredTraceImage & { previewUrl: string };
type View = "home" | "workspace";

const PREFERENCES_KEY = "tracedraw-preferences-v1";
const LAST_IMAGE_KEY = "tracedraw-last-image-v1";
const INITIAL_TRANSFORM: OverlayTransform = { x: 0, y: 0, scale: 1, rotation: 0 };
const SUPPORTED_IMAGE = /\.(jpe?g|png|webp)$/i;

function imageId() {
  return globalThis.crypto?.randomUUID?.()
    ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function TraceDrawBrand() {
  return (
    <span className="tracedraw-brand">
      <span className="trace-brand-mark"><Sparkles size={17} /></span>
      <span>trace<span>draw</span></span>
    </span>
  );
}

export default function TraceDrawApp() {
  const [view, setView] = useState<View>("home");
  const [cameraActive, setCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [image, setImage] = useState<{ src: string; name: string; id: string } | null>(null);
  const [recentImages, setRecentImages] = useState<RecentImage[]>([]);
  const [opacity, setOpacity] = useState(50);
  const [transform, setTransform] = useState<OverlayTransform>(INITIAL_TRANSFORM);
  const [imageLocked, setImageLocked] = useState(false);
  const [controlsHidden, setControlsHidden] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [status, setStatus] = useState("");
  const [storageReady, setStorageReady] = useState(false);
  const [preferencesReady, setPreferencesReady] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null);
  const [installHint, setInstallHint] = useState("");
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentImageUrlRef = useRef<string | null>(null);
  const recentImageUrlsRef = useRef<string[]>([]);
  const handleCameraError = useCallback((message: string) => setStatus(message), []);

  const setCurrentImage = useCallback((nextImage: { src: string; name: string; id: string } | null) => {
    if (currentImageUrlRef.current) URL.revokeObjectURL(currentImageUrlRef.current);
    currentImageUrlRef.current = nextImage?.src.startsWith("blob:") ? nextImage.src : null;
    setImage(nextImage);
  }, []);

  const refreshRecentImages = useCallback(async (selectedId?: string) => {
    try {
      const storedImages = await getRecentTraceImages();
      recentImageUrlsRef.current.forEach((previewUrl) => URL.revokeObjectURL(previewUrl));
      const images = storedImages.map((entry) => ({
        ...entry,
        previewUrl: URL.createObjectURL(entry.blob),
      }));
      recentImageUrlsRef.current = images.map((entry) => entry.previewUrl);
      setRecentImages(images);
      if (selectedId) localStorage.setItem(LAST_IMAGE_KEY, selectedId);
    } catch (error) {
      console.error("TraceDraw could not load recent images.", error);
      setStatus(error instanceof Error ? error.message : "Your recent images could not be loaded.");
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const previousImages: string[] = [];
    getRecentTraceImages()
      .then((storedImages) => {
        if (cancelled) return;
        const images = storedImages.map((entry) => {
          const previewUrl = URL.createObjectURL(entry.blob);
          previousImages.push(previewUrl);
          return { ...entry, previewUrl };
        });
        recentImageUrlsRef.current = previousImages;
        setRecentImages(images);
        setStorageReady(true);
        const lastImageId = localStorage.getItem(LAST_IMAGE_KEY);
        const lastImage = images.find((entry) => entry.id === lastImageId);
        if (lastImage) {
          const source = URL.createObjectURL(lastImage.blob);
          currentImageUrlRef.current = source;
          setImage({ src: source, name: lastImage.name, id: lastImage.id });
        }
      })
      .catch((error: unknown) => {
        console.error("TraceDraw could not restore local images.", error);
        if (!cancelled) {
          setStorageReady(true);
          setStatus(error instanceof Error ? error.message : "Local image storage is unavailable.");
        }
      });

    try {
      const preferences = JSON.parse(localStorage.getItem(PREFERENCES_KEY) || "{}") as { opacity?: number };
      if (typeof preferences.opacity === "number" && preferences.opacity >= 10 && preferences.opacity <= 100) {
        setOpacity(preferences.opacity);
      }
    } catch (error) {
      console.error("TraceDraw could not read saved preferences.", error);
      setStatus("Saved preferences could not be read; using the defaults.");
    }
    setPreferencesReady(true);

    setIsIos(/iPad|iPhone|iPod/.test(navigator.userAgent));
    setIsInstalled(
      window.matchMedia("(display-mode: standalone)").matches
      || (navigator as Navigator & { standalone?: boolean }).standalone === true,
    );

    const handleInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as InstallPromptEvent);
    };
    const handleInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
      setInstallHint("TraceDraw is ready on your home screen.");
    };
    window.addEventListener("beforeinstallprompt", handleInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/tracedraw/sw.js", { scope: "/tracedraw/" })
        .catch((error: unknown) => {
          console.error("TraceDraw offline support could not be registered.", error);
          setStatus("Offline support could not be enabled. The tracing tools still work while online.");
        });
    }

    return () => {
      cancelled = true;
      previousImages.forEach((previewUrl) => URL.revokeObjectURL(previewUrl));
      recentImageUrlsRef.current.forEach((previewUrl) => URL.revokeObjectURL(previewUrl));
      if (currentImageUrlRef.current) URL.revokeObjectURL(currentImageUrlRef.current);
      window.removeEventListener("beforeinstallprompt", handleInstallPrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  useEffect(() => {
    if (!preferencesReady) return;
    try {
      localStorage.setItem(PREFERENCES_KEY, JSON.stringify({ opacity }));
    } catch (error) {
      console.error("TraceDraw could not save preferences.", error);
    }
  }, [opacity, preferencesReady]);

  async function installApp() {
    if (!installPrompt) {
      setInstallHint(isIos
        ? "In Safari, tap Share, then Add to Home Screen."
        : "Open your browser menu and choose Install app or Add to Home Screen.");
      return;
    }
    try {
      await installPrompt.prompt();
      const result = await installPrompt.userChoice;
      if (result.outcome === "accepted") setInstallHint("TraceDraw is being installed.");
      setInstallPrompt(null);
    } catch (error) {
      console.error("TraceDraw installation prompt failed.", error);
      setInstallHint("Installation could not be started. Try Install app from your browser menu.");
    }
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!SUPPORTED_IMAGE.test(file.name) || (file.type && !file.type.startsWith("image/"))) {
      setStatus("Choose a JPG, PNG, or WebP image.");
      return;
    }

    const src = URL.createObjectURL(file);
    try {
      const preview = new window.Image();
      preview.src = src;
      await preview.decode();
    } catch {
      URL.revokeObjectURL(src);
      setStatus("This image could not be opened. Try a different JPG, PNG, or WebP file.");
      return;
    }

    const id = imageId();
    setCurrentImage({ src, name: file.name, id });
    setTransform(INITIAL_TRANSFORM);
    setImageLocked(false);
    setView("workspace");
    setStatus("Image ready. Drag to position it or pinch to resize.");
    try {
      const imageRecord = { id, name: file.name, blob: file, savedAt: Date.now() };
      await saveTraceImage(imageRecord);
      await refreshRecentImages(id);
    } catch (error) {
      console.error("TraceDraw could not save the selected image.", error);
      setStatus("Image loaded, but could not be saved to your recent images on this device.");
    }
  }

  function pickRecentImage(recent: RecentImage) {
    const src = URL.createObjectURL(recent.blob);
    setCurrentImage({ src, name: recent.name, id: recent.id });
    setTransform(INITIAL_TRANSFORM);
    setImageLocked(false);
    setView("workspace");
    setStatus("Image ready. Drag to position it or pinch to resize.");
    try {
      localStorage.setItem(LAST_IMAGE_KEY, recent.id);
    } catch (error) {
      console.error("TraceDraw could not remember the last image.", error);
    }
  }

  function clearImage() {
    setCurrentImage(null);
    setTransform(INITIAL_TRANSFORM);
    setImageLocked(false);
    try {
      localStorage.removeItem(LAST_IMAGE_KEY);
    } catch (error) {
      console.error("TraceDraw could not clear the last-image preference.", error);
    }
    setStatus("Reference image cleared.");
  }

  function openWorkspace(startCamera: boolean) {
    setStatus("");
    setView("workspace");
    setCameraActive(startCamera);
  }

  function leaveWorkspace() {
    setCameraActive(false);
    setView("home");
    setControlsHidden(false);
    setSettingsOpen(false);
  }

  return (
    <div className="tracedraw-app">
      <input
        ref={fileInputRef}
        className="trace-file-input"
        type="file"
        accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
        onChange={(event) => void handleFileChange(event)}
      />

      {view === "home" ? (
        <div className="tracedraw-home">
          <header className="trace-home-header">
            <TraceDrawBrand />
            <div className="trace-home-actions">
              <span className="trace-private-note"><LockKeyhole size={13} /> Private by design</span>
              <button className={`trace-install-button${isInstalled ? " is-installed" : ""}`} type="button" onClick={() => void installApp()}>
                {isInstalled ? <Check size={16} /> : <Download size={16} />}
                {isInstalled ? "Installed" : "Install app"}
              </button>
            </div>
          </header>

          <section className="trace-hero">
            <div className="trace-hero-copy">
              <span className="trace-eyebrow"><span /> YOUR CAMERA. YOUR CANVAS.</span>
              <h1>Turn any image<br />into <em>something real.</em></h1>
              <p>Lay your phone over a page. Line up your image. Then trace the lines that feel right.</p>
              <div className="trace-hero-actions">
                <button className="trace-button trace-button-primary" type="button" onClick={() => openWorkspace(true)}>
                  <Camera size={18} /> Start tracing <ArrowRight size={17} />
                </button>
                <button className="trace-button trace-button-secondary" type="button" onClick={() => fileInputRef.current?.click()}>
                  <ImagePlus size={18} /> Import image
                </button>
              </div>
              <div className="trace-privacy-note"><LockKeyhole size={14} /> Your photos stay on this device. No account, no uploads.</div>
              {installHint && <p className="trace-install-hint" role="status">{installHint}</p>}
            </div>

            <div className="trace-hero-art" aria-label="An illustration showing a reference image over a sheet of paper">
              <div className="trace-art-glow" />
              <div className="trace-art-label"><span><span className="trace-live-dot" /> LIVE PREVIEW</span><small>01 / READY TO TRACE</small></div>
              <div className="trace-art-camera">
                <div className="trace-art-paper">
                  <svg viewBox="0 0 240 260" fill="none" aria-hidden="true">
                    <path d="M40 197c16-24 30-31 43-43 17-16 10-44 19-67 6-16 14-26 27-31 10-4 22-1 26 8 5 12-2 28-8 41-8 17-17 30-11 45 6 14 24 19 37 28 9 7 19 20 14 30-4 9-20 9-31 8-28-2-57-3-83 1-12 2-27 5-35-3-6-5-3-12 2-17Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M116 83c7-7 14-9 20-7m-38 81c8 7 18 9 28 6m-49 37c18-7 33-6 48-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity=".5" />
                    <path d="M149 45c2-6 7-10 13-11m22 21c4-3 10-4 15-2M46 77c-5-4-6-10-5-15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity=".6" />
                  </svg>
                  <span className="trace-paper-caption">A little space to make it yours.</span>
                </div>
                <div className="trace-art-image">
                  <svg viewBox="0 0 240 260" fill="none" aria-hidden="true">
                    <path d="M40 197c16-24 30-31 43-43 17-16 10-44 19-67 6-16 14-26 27-31 10-4 22-1 26 8 5 12-2 28-8 41-8 17-17 30-11 45 6 14 24 19 37 28 9 7 19 20 14 30-4 9-20 9-31 8-28-2-57-3-83 1-12 2-27 5-35-3-6-5-3-12 2-17Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M116 83c7-7 14-9 20-7m-38 81c8 7 18 9 28 6m-49 37c18-7 33-6 48-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity=".5" />
                    <path d="M149 45c2-6 7-10 13-11m22 21c4-3 10-4 15-2M46 77c-5-4-6-10-5-15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity=".6" />
                  </svg>
                  <span className="trace-art-corner trace-art-corner-tl" />
                  <span className="trace-art-corner trace-art-corner-tr" />
                  <span className="trace-art-corner trace-art-corner-bl" />
                  <span className="trace-art-corner trace-art-corner-br" />
                </div>
                <span className="trace-art-crosshair">+</span>
              </div>
              <div className="trace-art-card trace-art-card-top"><span className="trace-art-card-icon"><Move size={15} /></span><span><strong>Find your fit</strong><small>Move · resize · rotate</small></span></div>
              <div className="trace-art-card trace-art-card-bottom"><span className="trace-art-opacity" /><span><strong>Just enough to see through</strong><small>Opacity <b>50%</b></small></span></div>
              <div className="trace-art-footnote"><WandSparkles size={14} /> MADE FOR THE MOMENT BEFORE THE FIRST LINE</div>
            </div>
          </section>

          <section className="trace-how">
            <div className="trace-section-heading">
              <div><span className="trace-eyebrow">A SIMPLE LITTLE RITUAL</span><h2>From reference to paper.</h2></div>
              <p>Everything you need. Nothing between you and the page.</p>
            </div>
            <div className="trace-steps">
              <article><span className="trace-step-number">01</span><span className="trace-step-icon"><Camera size={19} /></span><h3>See your page</h3><p>Your camera looks down at the paper, right through the app.</p></article>
              <article><span className="trace-step-number">02</span><span className="trace-step-icon"><Images size={19} /></span><h3>Bring an image</h3><p>Choose a photo or drawing from your device. It stays right here.</p></article>
              <article><span className="trace-step-number">03</span><span className="trace-step-icon"><Sparkles size={19} /></span><h3>Make it yours</h3><p>Find the right lightness, position, and size. Then start tracing.</p></article>
            </div>
          </section>

          {recentImages.length > 0 && (
            <section className="trace-recent">
              <div className="trace-section-heading">
                <div><span className="trace-eyebrow">PICK UP WHERE YOU LEFT OFF</span><h2>Your recent images.</h2></div>
                <span className="trace-private-note"><LockKeyhole size={13} /> Only on this device</span>
              </div>
              <div className="trace-recent-grid">
                {recentImages.map((recent) => (
                  <button className="trace-recent-card" type="button" key={recent.id} onClick={() => pickRecentImage(recent)}>
                    <span className="trace-recent-preview"><img src={recent.previewUrl} alt="" /><span><ChevronRight size={18} /></span></span>
                    <span className="trace-recent-name">{recent.name}</span>
                  </button>
                ))}
              </div>
            </section>
          )}

          <footer className="trace-home-footer">
            <TraceDrawBrand />
            <span>For the joy of making.</span>
            <span>Works best on your phone, in good light.</span>
          </footer>
          {!storageReady && <span className="trace-storage-loading">Opening your private workspace…</span>}
        </div>
      ) : (
        <TracingWorkspace
          image={image}
          cameraActive={cameraActive}
          facingMode={facingMode}
          opacity={opacity}
          transform={transform}
          locked={imageLocked}
          controlsHidden={controlsHidden}
          settingsOpen={settingsOpen}
          status={status}
          onBack={leaveWorkspace}
          onCameraToggle={() => setCameraActive((active) => !active)}
          onCameraError={handleCameraError}
          onFacingModeChange={() => setFacingMode((mode) => mode === "environment" ? "user" : "environment")}
          onOpacityChange={setOpacity}
          onTransformChange={setTransform}
          onLockedChange={setImageLocked}
          onControlsHiddenChange={setControlsHidden}
          onSettingsOpenChange={setSettingsOpen}
          onStatusChange={setStatus}
          onImport={() => fileInputRef.current?.click()}
          onClearImage={clearImage}
        />
      )}
    </div>
  );
}
