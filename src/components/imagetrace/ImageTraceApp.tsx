"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Check,
  Contrast,
  Expand,
  ImagePlus,
  LockKeyhole,
  Maximize,
  Minus,
  Moon,
  Plus,
  Sun,
  UnlockKeyhole,
  X,
} from "lucide-react";
import {
  getRecentTraceImages,
  saveTraceImage,
  type StoredTraceImage,
} from "@/lib/imagetrace-storage";

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};
type RecentImage = StoredTraceImage & { previewUrl: string };
type Transform = { x: number; y: number; scale: number; rotation: number };
type Point = { x: number; y: number };
type Gesture = { center: Point; distance: number; transform: Transform };
type WakeLockLike = {
  release: () => Promise<void>;
  addEventListener: (type: "release", listener: () => void) => void;
};
type NavigatorWithWakeLock = Navigator & {
  wakeLock?: { request: (type: "screen") => Promise<WakeLockLike> };
};

const PREFERENCES_KEY = "imagetrace-preferences-v1";
const LAST_IMAGE_KEY = "imagetrace-last-image-v1";
const INITIAL_TRANSFORM: Transform = { x: 0, y: 0, scale: 1, rotation: 0 };
const MIN_ZOOM = 0.1;
const MAX_ZOOM = 8;
const SUPPORTED_IMAGE = /\.(jpe?g|png|webp)$/i;

function getCenter(points: Point[]): Point {
  return points.reduce(
    (result, point) => ({
      x: result.x + point.x / points.length,
      y: result.y + point.y / points.length,
    }),
    { x: 0, y: 0 },
  );
}

function getDistance(first: Point, second: Point) {
  return Math.hypot(second.x - first.x, second.y - first.y);
}

function imageId() {
  return globalThis.crypto?.randomUUID?.()
    ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function ImageTraceMark() {
  return <span className="trace-studio-mark" aria-hidden="true">I</span>;
}

export default function ImageTraceApp() {
  const [image, setImage] = useState<{ src: string; name: string } | null>(null);
  const [recentImages, setRecentImages] = useState<RecentImage[]>([]);
  const [transform, setTransform] = useState<Transform>(INITIAL_TRANSFORM);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [grayscale, setGrayscale] = useState(false);
  const [lineArt, setLineArt] = useState(false);
  const [locked, setLocked] = useState(false);
  const [tracingMode, setTracingMode] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [screenAwake, setScreenAwake] = useState(false);
  const [wakeLockAvailable, setWakeLockAvailable] = useState(false);
  const [wakeLockActive, setWakeLockActive] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [status, setStatus] = useState("");
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const sourceImageRef = useRef<HTMLImageElement | null>(null);
  const currentImageUrlRef = useRef<string | null>(null);
  const recentImageUrlsRef = useRef<string[]>([]);
  const pointersRef = useRef(new Map<number, Point>());
  const gestureRef = useRef<Gesture | null>(null);
  const transformRef = useRef(transform);

  transformRef.current = transform;

  const setCurrentImage = useCallback((nextImage: { src: string; name: string } | null) => {
    if (currentImageUrlRef.current) URL.revokeObjectURL(currentImageUrlRef.current);
    currentImageUrlRef.current = nextImage?.src.startsWith("blob:") ? nextImage.src : null;
    sourceImageRef.current = null;
    setImageLoaded(false);
    setImage(nextImage);
  }, []);

  const refreshRecentImages = useCallback(async () => {
    const storedImages = await getRecentTraceImages();
    recentImageUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    const images = storedImages.map((entry) => ({
      ...entry,
      previewUrl: URL.createObjectURL(entry.blob),
    }));
    recentImageUrlsRef.current = images.map((entry) => entry.previewUrl);
    setRecentImages(images);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const restoredUrls: string[] = [];
    void getRecentTraceImages()
      .then((storedImages) => {
        if (cancelled) return;
        const images = storedImages.map((entry) => {
          const previewUrl = URL.createObjectURL(entry.blob);
          restoredUrls.push(previewUrl);
          return { ...entry, previewUrl };
        });
        recentImageUrlsRef.current = restoredUrls;
        setRecentImages(images);
        const lastId = localStorage.getItem(LAST_IMAGE_KEY);
        const previousImage = images.find((entry) => entry.id === lastId);
        if (previousImage) {
          const src = URL.createObjectURL(previousImage.blob);
          currentImageUrlRef.current = src;
          setImage({ src, name: previousImage.name });
        }
      })
      .catch((error: unknown) => {
        console.error("ImageTrace could not restore local images.", error);
        if (!cancelled) setStatus(error instanceof Error ? error.message : "Saved images could not be loaded.");
      });

    try {
      const preferences = JSON.parse(localStorage.getItem(PREFERENCES_KEY) || "{}") as {
        brightness?: number;
        contrast?: number;
        grayscale?: boolean;
        lineArt?: boolean;
      };
      if (typeof preferences.brightness === "number" && preferences.brightness >= 0 && preferences.brightness <= 200) {
        setBrightness(preferences.brightness);
      }
      if (typeof preferences.contrast === "number" && preferences.contrast >= 0 && preferences.contrast <= 200) {
        setContrast(preferences.contrast);
      }
      if (typeof preferences.grayscale === "boolean") setGrayscale(preferences.grayscale);
      if (typeof preferences.lineArt === "boolean") setLineArt(preferences.lineArt);
    } catch (error) {
      console.error("ImageTrace could not read saved preferences.", error);
      setStatus("Saved settings could not be read; default settings are active.");
    }

    setWakeLockAvailable(Boolean((navigator as NavigatorWithWakeLock).wakeLock));
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
      setStatus("ImageTrace is ready on your home screen.");
    };
    window.addEventListener("beforeinstallprompt", handleInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);

    if ("serviceWorker" in navigator) {
      void navigator.serviceWorker.getRegistrations()
        .then(async (registrations) => {
          const oldRootWorker = registrations.find((registration) => (
            registration.scope === `${window.location.origin}/`
            && [registration.active, registration.waiting, registration.installing]
              .some((worker) => worker?.scriptURL.endsWith("/tracedraw-sw.js"))
          ));
          await oldRootWorker?.unregister();
          return navigator.serviceWorker.register("/imagetrace/sw.js", { scope: "/imagetrace/" });
        })
        .catch((error: unknown) => {
          console.error("ImageTrace offline support could not be registered.", error);
          setStatus("Offline support could not be enabled. The tracing tools remain available online.");
        });
    }

    return () => {
      cancelled = true;
      restoredUrls.forEach((url) => URL.revokeObjectURL(url));
      recentImageUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      if (currentImageUrlRef.current) URL.revokeObjectURL(currentImageUrlRef.current);
      window.removeEventListener("beforeinstallprompt", handleInstallPrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(PREFERENCES_KEY, JSON.stringify({ brightness, contrast, grayscale, lineArt }));
    } catch (error) {
      console.error("ImageTrace could not save preferences.", error);
    }
  }, [brightness, contrast, grayscale, lineArt]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const resizeObserver = new ResizeObserver(() => {
      setCanvasSize({ width: stage.clientWidth, height: stage.clientHeight });
    });
    resizeObserver.observe(stage);
    setCanvasSize({ width: stage.clientWidth, height: stage.clientHeight });
    return () => resizeObserver.disconnect();
  }, [tracingMode]);

  useEffect(() => {
    if (!image) return;
    let cancelled = false;
    const source = new window.Image();
    source.onload = () => {
      if (!cancelled) {
        sourceImageRef.current = source;
        setImageLoaded(true);
      }
    };
    source.onerror = () => {
      if (!cancelled) setStatus("This image could not be displayed. Choose another JPG, PNG, or WebP image.");
    };
    source.src = image.src;
    if (source.complete && source.naturalWidth > 0) {
      sourceImageRef.current = source;
      setImageLoaded(true);
    }
    return () => {
      cancelled = true;
    };
  }, [image]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const source = sourceImageRef.current;
    if (!canvas || !canvasSize.width || !canvasSize.height) return;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(canvasSize.width * pixelRatio);
    canvas.height = Math.round(canvasSize.height * pixelRatio);
    const context = canvas.getContext("2d");
    if (!context) {
      setStatus("Canvas rendering is unavailable in this browser.");
      return;
    }
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    context.clearRect(0, 0, canvasSize.width, canvasSize.height);
    if (!source || !source.naturalWidth || !source.naturalHeight) return;

    const fitScale = Math.min(
      (canvasSize.width * 0.92) / source.naturalWidth,
      (canvasSize.height * 0.88) / source.naturalHeight,
    );
    context.save();
    context.translate(canvasSize.width / 2 + transform.x, canvasSize.height / 2 + transform.y);
    context.rotate((transform.rotation * Math.PI) / 180);
    context.scale(fitScale * transform.scale, fitScale * transform.scale);
    const effectContrast = lineArt ? Math.max(contrast, 190) : contrast;
    context.filter = `brightness(${brightness}%) contrast(${effectContrast}%) grayscale(${grayscale || lineArt ? 1 : 0})`;
    context.drawImage(source, -source.naturalWidth / 2, -source.naturalHeight / 2);
    context.restore();
  }, [brightness, canvasSize, contrast, grayscale, image, imageLoaded, lineArt, transform]);

  useEffect(() => {
    if (!locked) return;
    pointersRef.current.clear();
    gestureRef.current = null;
  }, [locked]);

  useEffect(() => {
    if (!screenAwake) {
      setWakeLockActive(false);
      return;
    }
    const wakeLockApi = (navigator as NavigatorWithWakeLock).wakeLock;
    if (!wakeLockApi) {
      setScreenAwake(false);
      setStatus("Screen Awake is not supported by this browser.");
      return;
    }
    let disposed = false;
    let heldLock: WakeLockLike | null = null;
    const acquire = async () => {
      try {
        const lock = await wakeLockApi.request("screen");
        if (disposed) {
          await lock.release();
          return;
        }
        heldLock = lock;
        setWakeLockActive(true);
        lock.addEventListener("release", () => {
          if (heldLock === lock) {
            heldLock = null;
            setWakeLockActive(false);
          }
        });
      } catch (error) {
        if (!disposed) {
          console.error("ImageTrace could not acquire a screen wake lock.", error);
          setScreenAwake(false);
          setStatus("The screen could not be kept awake. You can still trace normally.");
        }
      }
    };
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible" && !heldLock) void acquire();
    };
    void acquire();
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      disposed = true;
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (heldLock) void heldLock.release();
    };
  }, [screenAwake]);

  const updateZoom = useCallback((scale: number) => {
    if (locked) return;
    setTransform((current) => ({ ...current, scale: Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, scale)) }));
  }, [locked]);

  async function chooseImage(file: File | undefined) {
    if (!file) return;
    if (!SUPPORTED_IMAGE.test(file.name) || !["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
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
    setCurrentImage({ src, name: file.name });
    setTransform(INITIAL_TRANSFORM);
    setLocked(false);
    setStatus("");
    const id = imageId();
    try {
      await saveTraceImage({ id, name: file.name, blob: file, savedAt: Date.now() });
      localStorage.setItem(LAST_IMAGE_KEY, id);
      await refreshRecentImages();
    } catch (error) {
      console.error("ImageTrace could not save the selected image.", error);
      setStatus("Image loaded, but could not be saved to this device's recent images.");
    }
  }

  function selectRecentImage(recent: RecentImage) {
    setCurrentImage({ src: URL.createObjectURL(recent.blob), name: recent.name });
    setTransform(INITIAL_TRANSFORM);
    setLocked(false);
    try {
      localStorage.setItem(LAST_IMAGE_KEY, recent.id);
    } catch (error) {
      console.error("ImageTrace could not remember the selected image.", error);
    }
  }

  function clearImage() {
    setCurrentImage(null);
    setTransform(INITIAL_TRANSFORM);
    setLocked(false);
    try {
      localStorage.removeItem(LAST_IMAGE_KEY);
    } catch (error) {
      console.error("ImageTrace could not clear the last-image preference.", error);
    }
  }

  function fitImage(mode: "fit" | "fill") {
    if (locked || !sourceImageRef.current || !canvasSize.width || !canvasSize.height) return;
    const source = sourceImageRef.current;
    const fit = Math.min(
      (canvasSize.width * 0.92) / source.naturalWidth,
      (canvasSize.height * 0.88) / source.naturalHeight,
    );
    const fill = Math.max(canvasSize.width / source.naturalWidth, canvasSize.height / source.naturalHeight);
    setTransform({ ...INITIAL_TRANSFORM, scale: mode === "fit" ? 1 : Math.min(MAX_ZOOM, fill / fit) });
  }

  function maximumZoom() {
    if (locked) return;
    setTransform((current) => ({ ...current, scale: MAX_ZOOM }));
  }

  function handlePointerDown(event: React.PointerEvent<HTMLCanvasElement>) {
    if (locked || !image) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    const points = [...pointersRef.current.values()];
    gestureRef.current = {
      center: getCenter(points),
      distance: points.length > 1 ? getDistance(points[0], points[1]) : 0,
      transform: { ...transformRef.current },
    };
  }

  function handlePointerMove(event: React.PointerEvent<HTMLCanvasElement>) {
    if (locked || !pointersRef.current.has(event.pointerId)) return;
    pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    const points = [...pointersRef.current.values()];
    const gesture = gestureRef.current;
    if (!gesture) return;
    const currentCenter = getCenter(points);
    const scale = points.length > 1 && gesture.distance > 0
      ? Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, gesture.transform.scale * getDistance(points[0], points[1]) / gesture.distance))
      : gesture.transform.scale;
    setTransform({
      ...gesture.transform,
      x: gesture.transform.x + currentCenter.x - gesture.center.x,
      y: gesture.transform.y + currentCenter.y - gesture.center.y,
      scale,
    });
  }

  function handlePointerEnd(event: React.PointerEvent<HTMLCanvasElement>) {
    pointersRef.current.delete(event.pointerId);
    const points = [...pointersRef.current.values()];
    gestureRef.current = points.length
      ? {
          center: getCenter(points),
          distance: points.length > 1 ? getDistance(points[0], points[1]) : 0,
          transform: { ...transformRef.current },
        }
      : null;
  }

  async function toggleTracingMode() {
    if (!tracingMode && !image) {
      setStatus("Choose an image before entering tracing mode.");
      return;
    }
    if (!tracingMode) {
      setTracingMode(true);
      try {
        if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        }
      } catch (error) {
        console.error("ImageTrace could not enter fullscreen mode.", error);
        setStatus("Fullscreen is unavailable here. ImageTrace will still use the full screen area.");
      }
      return;
    }
    setTracingMode(false);
    setSettingsOpen(false);
    if (document.fullscreenElement) {
      try {
        await document.exitFullscreen();
      } catch (error) {
        console.error("ImageTrace could not exit fullscreen mode.", error);
      }
    }
  }

  async function handleInstall() {
    if (!installPrompt) {
      setStatus(/iPad|iPhone|iPod/.test(navigator.userAgent)
        ? "In Safari, tap Share, then Add to Home Screen."
        : "Open your browser menu and choose Install app or Add to Home Screen.");
      return;
    }
    try {
      await installPrompt.prompt();
      await installPrompt.userChoice;
      setInstallPrompt(null);
    } catch (error) {
      console.error("ImageTrace installation prompt failed.", error);
      setStatus("Installation could not be started. Try Install app from your browser menu.");
    }
  }

  return (
    <div className={`imagetrace-app${tracingMode ? " is-tracing" : ""}`}>
      <input
        ref={fileInputRef}
        className="trace-file-input"
        type="file"
        accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
        onChange={(event) => {
          const file = event.currentTarget.files?.[0];
          event.currentTarget.value = "";
          void chooseImage(file);
        }}
      />

      {!tracingMode && (
        <header className="trace-studio-header">
          <a className="trace-studio-brand" href="/imagetrace/">
            <ImageTraceMark />
            <span><strong>ImageTrace</strong><small>Image tracing workspace</small></span>
          </a>
          <div className="trace-header-actions">
            <span className="trace-privacy-tag"><LockKeyhole size={14} /> Private on this device</span>
            <button className="trace-subtle-button" type="button" onClick={() => void handleInstall()}>
              {isInstalled ? <Check size={16} /> : <Expand size={16} />}
              {isInstalled ? "Installed" : "Install app"}
            </button>
          </div>
        </header>
      )}

      <main className="trace-editor">
        {!tracingMode && (
          <aside className="trace-control-panel">
            <div className="trace-panel-title">
              <div><span className="trace-kicker">YOUR CANVAS</span><h1>Trace drawing</h1></div>
            </div>
            <button className="trace-browse-button" type="button" onClick={() => fileInputRef.current?.click()}>
              <ImagePlus size={19} /> Browse image
            </button>
            {image && (
              <div className="trace-selected-image">
                <span className="trace-image-thumb"><img src={image.src} alt="" /></span>
                <span className="trace-selected-name">{image.name}</span>
                <button type="button" onClick={clearImage} aria-label="Remove selected image"><X size={16} /></button>
              </div>
            )}

            <section className="trace-control-section">
              <div className="trace-section-label">Image position</div>
              <div className="trace-fit-actions">
                <button type="button" onClick={() => fitImage("fit")} disabled={!image || locked}>Fit screen</button>
                <button type="button" onClick={() => fitImage("fill")} disabled={!image || locked}>Fill screen</button>
                <button type="button" onClick={maximumZoom} disabled={!image || locked}>Maximum zoom</button>
              </div>
              <div className="trace-zoom-label"><span>Zoom</span><strong>{Math.round(transform.scale * 100)}%</strong></div>
              <div className="trace-zoom-control">
                <button type="button" onClick={() => updateZoom(transform.scale - 0.1)} disabled={!image || locked} aria-label="Zoom out"><Minus size={17} /></button>
                <input
                  aria-label="Image zoom"
                  type="range"
                  min={MIN_ZOOM}
                  max={MAX_ZOOM}
                  step="0.01"
                  value={transform.scale}
                  disabled={!image || locked}
                  onChange={(event) => updateZoom(Number(event.target.value))}
                />
                <button type="button" onClick={() => updateZoom(transform.scale + 0.1)} disabled={!image || locked} aria-label="Zoom in"><Plus size={17} /></button>
              </div>
              <p className="trace-control-help">Drag to position · Pinch to zoom</p>
            </section>

            <section className="trace-control-section trace-adjustments">
              <div className="trace-section-heading">
                <span className="trace-section-label">Image adjustments</span>
                <button type="button" onClick={() => {
                  setBrightness(100);
                  setContrast(100);
                  setGrayscale(false);
                  setLineArt(false);
                }}>Reset</button>
              </div>
              <label className="trace-adjustment">
                <span><Sun size={16} /> Brightness <strong>{brightness}%</strong></span>
                <input aria-label="Brightness" type="range" min="0" max="200" value={brightness} onChange={(event) => setBrightness(Number(event.target.value))} />
              </label>
              <label className="trace-adjustment">
                <span><Contrast size={16} /> Contrast <strong>{contrast}%</strong></span>
                <input aria-label="Contrast" type="range" min="0" max="200" value={contrast} onChange={(event) => setContrast(Number(event.target.value))} />
              </label>
              <div className="trace-effect-buttons">
                <button className={grayscale ? "is-active" : ""} type="button" aria-pressed={grayscale} onClick={() => setGrayscale((value) => !value)}>Grayscale</button>
                <button className={lineArt ? "is-active" : ""} type="button" aria-pressed={lineArt} onClick={() => setLineArt((value) => !value)}>Line art</button>
              </div>
            </section>

            {recentImages.length > 0 && (
              <section className="trace-control-section trace-recent-section">
                <div className="trace-section-label">Recent images</div>
                <div className="trace-recent-list">
                  {recentImages.slice(0, 4).map((recent) => (
                    <button type="button" key={recent.id} onClick={() => selectRecentImage(recent)} title={recent.name}>
                      <img src={recent.previewUrl} alt="" /><span>{recent.name}</span>
                    </button>
                  ))}
                </div>
              </section>
            )}
          </aside>
        )}

        <section className="trace-canvas-column" aria-label="Image tracing workspace">
          <div className="trace-canvas-toolbar">
            {tracingMode ? (
              <>
                <div className={`trace-locked-indicator${locked ? " is-locked" : ""}`}>
                  {locked ? <LockKeyhole size={15} /> : <UnlockKeyhole size={15} />}
                  {locked ? "Image locked" : "Image unlocked"}
                </div>
                <div className="trace-floating-actions">
                  <button className="trace-toolbar-button" type="button" onClick={() => setSettingsOpen((value) => !value)} aria-expanded={settingsOpen} aria-label="Toggle tracing adjustments"><Sun size={17} /></button>
                  <button className="trace-toolbar-button" type="button" onClick={() => void toggleTracingMode()} aria-label="Exit tracing mode"><X size={18} /></button>
                </div>
              </>
            ) : (
              <>
                <div className={`trace-locked-indicator${locked ? " is-locked" : ""}`}>
                  {locked ? <LockKeyhole size={15} /> : <UnlockKeyhole size={15} />}
                  {locked ? "Position locked" : "Position unlocked"}
                </div>
                <div className="trace-canvas-actions">
                  <button type="button" disabled={!image || !wakeLockAvailable} onClick={() => setScreenAwake((value) => !value)} title={wakeLockAvailable ? "Keep screen awake while tracing" : "Screen Wake Lock is not supported by this browser"}>
                    <Moon size={16} /> {wakeLockActive ? "Screen awake" : "Keep awake"}
                  </button>
                  <button className={`trace-lock-button${locked ? " is-locked" : ""}`} type="button" disabled={!image} onClick={() => setLocked((value) => !value)}>
                    {locked ? <LockKeyhole size={17} /> : <UnlockKeyhole size={17} />}
                    {locked ? "Unlock image" : "Lock image"}
                  </button>
                </div>
              </>
            )}
          </div>

          <div className="trace-stage" ref={stageRef}>
            <canvas
              ref={canvasRef}
              className={locked ? "is-locked" : ""}
              aria-label={image ? `Tracing image: ${image.name}` : "Image tracing canvas"}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerEnd}
              onPointerCancel={handlePointerEnd}
              onLostPointerCapture={handlePointerEnd}
            />
            {!image && (
              <div className="trace-empty-state">
                <span className="trace-empty-icon"><ImagePlus size={25} /></span>
                <h2>Choose an image to start</h2>
                <p>Your image stays on this device. Nothing is uploaded.</p>
                <button type="button" className="trace-browse-button" onClick={() => fileInputRef.current?.click()}>
                  <ImagePlus size={18} /> Browse image
                </button>
                {recentImages.length > 0 && <span className="trace-empty-recent">Or choose one from Recent images.</span>}
              </div>
            )}
            {locked && image && <span className="trace-lock-chip"><LockKeyhole size={13} /> Image fixed in place</span>}
          </div>

          {tracingMode ? (
            settingsOpen && (
              <div className="trace-tracing-adjustments">
                <div className="trace-section-heading"><strong>Display adjustments</strong><button type="button" onClick={() => setSettingsOpen(false)} aria-label="Close adjustments"><X size={17} /></button></div>
                <label className="trace-adjustment"><span><Sun size={16} /> Brightness <strong>{brightness}%</strong></span><input aria-label="Brightness" type="range" min="0" max="200" value={brightness} onChange={(event) => setBrightness(Number(event.target.value))} /></label>
                <label className="trace-adjustment"><span><Contrast size={16} /> Contrast <strong>{contrast}%</strong></span><input aria-label="Contrast" type="range" min="0" max="200" value={contrast} onChange={(event) => setContrast(Number(event.target.value))} /></label>
              </div>
            )
          ) : (
            <footer className="trace-bottom-bar">
              <span>{image ? `${Math.round(transform.scale * 100)}% zoom` : "Ready when you are"}</span>
              <div>
                <button className="trace-enter-button" type="button" disabled={!image} onClick={() => void toggleTracingMode()}><Maximize size={16} /> Enter tracing mode</button>
                <button type="button" className={`trace-lock-button${locked ? " is-locked" : ""}`} disabled={!image} onClick={() => setLocked((value) => !value)}>
                  {locked ? <LockKeyhole size={17} /> : <UnlockKeyhole size={17} />}
                  {locked ? "Unlock image" : "Lock image"}
                </button>
              </div>
            </footer>
          )}
        </section>
      </main>

      {tracingMode && (
        <button className={`trace-floating-lock${locked ? " is-locked" : ""}`} type="button" disabled={!image} onClick={() => setLocked((value) => !value)}>
          {locked ? <LockKeyhole size={18} /> : <UnlockKeyhole size={18} />}
          {locked ? "Unlock image" : "Lock image"}
        </button>
      )}

      {status && (
        <div className="trace-status" role="status">
          <span>{status}</span><button type="button" onClick={() => setStatus("")} aria-label="Dismiss message"><X size={16} /></button>
        </div>
      )}
    </div>
  );
}
