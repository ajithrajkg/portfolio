"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Camera,
  CameraOff,
  Eye,
  EyeOff,
  FlipHorizontal2,
  ImagePlus,
  LockKeyhole,
  Sparkles,
  X,
} from "lucide-react";
import CameraPreview from "./CameraPreview";
import ImageOverlay, { type OverlayTransform } from "./ImageOverlay";
import TracingToolbar from "./TracingToolbar";

type WorkspaceImage = { src: string; name: string };
type WakeLockLike = {
  release: () => Promise<void>;
  addEventListener: (type: "release", listener: () => void) => void;
};
type NavigatorWithWakeLock = Navigator & {
  wakeLock?: { request: (type: "screen") => Promise<WakeLockLike> };
};

type TracingWorkspaceProps = {
  image: WorkspaceImage | null;
  cameraActive: boolean;
  facingMode: "environment" | "user";
  opacity: number;
  transform: OverlayTransform;
  locked: boolean;
  controlsHidden: boolean;
  settingsOpen: boolean;
  status: string;
  onBack: () => void;
  onCameraToggle: () => void;
  onCameraError: (message: string) => void;
  onFacingModeChange: () => void;
  onOpacityChange: (opacity: number) => void;
  onTransformChange: (transform: OverlayTransform) => void;
  onLockedChange: (locked: boolean) => void;
  onControlsHiddenChange: (hidden: boolean) => void;
  onSettingsOpenChange: (open: boolean) => void;
  onStatusChange: (message: string) => void;
  onImport: () => void;
  onClearImage: () => void;
};

const initialTransform: OverlayTransform = { x: 0, y: 0, scale: 1, rotation: 0 };

export default function TracingWorkspace({
  image,
  cameraActive,
  facingMode,
  opacity,
  transform,
  locked,
  controlsHidden,
  settingsOpen,
  status,
  onBack,
  onCameraToggle,
  onCameraError,
  onFacingModeChange,
  onOpacityChange,
  onTransformChange,
  onLockedChange,
  onControlsHiddenChange,
  onSettingsOpenChange,
  onStatusChange,
  onImport,
  onClearImage,
}: TracingWorkspaceProps) {
  const [wakeLockSupported, setWakeLockSupported] = useState(false);
  const [wakeLockActive, setWakeLockActive] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const wakeLockRef = useRef<WakeLockLike | null>(null);

  useEffect(() => {
    setWakeLockSupported(Boolean((navigator as NavigatorWithWakeLock).wakeLock));
  }, []);

  useEffect(() => {
    if (!cameraActive) return;
    const wakeLockApi = (navigator as NavigatorWithWakeLock).wakeLock;
    if (!wakeLockApi) return;

    let released = false;
    const acquireWakeLock = async () => {
      try {
        const wakeLock = await wakeLockApi.request("screen");
        if (released) {
          await wakeLock.release().catch((error: unknown) => {
            console.error("TraceDraw could not release the screen wake lock.", error);
          });
          return;
        }
        wakeLockRef.current = wakeLock;
        setWakeLockActive(true);
        wakeLock.addEventListener("release", () => {
          if (wakeLockRef.current === wakeLock) {
            wakeLockRef.current = null;
            setWakeLockActive(false);
          }
        });
      } catch (error) {
        if (!released) {
          const detail = error instanceof Error ? ` ${error.message}` : "";
          onStatusChange(`Screen wake lock could not be enabled.${detail}`);
        }
      }
    };
    const handleVisibility = () => {
      if (document.visibilityState === "visible" && !wakeLockRef.current) {
        void acquireWakeLock();
      }
    };

    void acquireWakeLock();
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      released = true;
      document.removeEventListener("visibilitychange", handleVisibility);
      const wakeLock = wakeLockRef.current;
      wakeLockRef.current = null;
      if (wakeLock) {
        void wakeLock.release().catch((error: unknown) => {
          console.error("TraceDraw could not release the screen wake lock.", error);
        });
      }
    };
  }, [cameraActive, onStatusChange]);

  const updateZoom = useCallback((amount: number) => {
    onTransformChange({
      ...transform,
      scale: Math.min(4, Math.max(0.35, transform.scale + amount)),
    });
  }, [onTransformChange, transform]);

  const rotate = useCallback((amount: number) => {
    onTransformChange({ ...transform, rotation: transform.rotation + amount });
  }, [onTransformChange, transform]);

  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      } else {
        onStatusChange("Full-screen mode is not available in this browser. On iPhone, use Add to Home Screen for a full-screen app.");
      }
    } catch (error) {
      const detail = error instanceof Error ? ` ${error.message}` : "";
      onStatusChange(`Full-screen mode could not be enabled.${detail}`);
    }
  }

  return (
    <section className="tracedraw-workspace" aria-label="Tracing workspace">
      <CameraPreview
        active={cameraActive}
        facingMode={facingMode}
        onError={onCameraError}
        onReadyChange={setCameraReady}
      />
      <div className="tracedraw-camera-shade" />
      {image ? (
        <ImageOverlay
          src={image.src}
          name={image.name}
          opacity={opacity}
          transform={transform}
          locked={locked}
          onTransformChange={onTransformChange}
        />
      ) : (
        <div className="tracedraw-empty-overlay">
          <span className="trace-empty-icon"><ImagePlus size={25} /></span>
          <strong>Your reference goes here</strong>
          <span>Import a photo or drawing to start tracing.</span>
          <button className="trace-button trace-button-light" type="button" onClick={onImport}>
            <ImagePlus size={17} /> Choose an image
          </button>
        </div>
      )}

      <header className="trace-workspace-header">
        <button className="trace-round-button" type="button" onClick={onBack} aria-label="Back to home" title="Back to home">
          <ArrowLeft size={19} />
        </button>
        <div className="trace-workspace-brand">
          <span className="trace-brand-mark"><Sparkles size={15} /></span>
          <span>TraceDraw</span>
          <i />
          <span className={`trace-camera-indicator${cameraActive ? " is-live" : ""}`}>
            <b />{cameraReady ? "Camera live" : cameraActive ? "Starting camera" : "Camera off"}
          </span>
        </div>
        {cameraActive && (
          <button className="trace-round-button" type="button" onClick={onFacingModeChange} aria-label="Switch camera" title={`Switch to ${facingMode === "environment" ? "front" : "rear"} camera`}>
            <FlipHorizontal2 size={19} />
          </button>
        )}
        <button
          className="trace-round-button trace-hide-button"
          type="button"
          onClick={() => {
            if (!controlsHidden) onLockedChange(true);
            onControlsHiddenChange(!controlsHidden);
          }}
          aria-label={controlsHidden ? "Show controls, image stays locked" : "Lock image and hide controls"}
          title={controlsHidden ? "Show controls, image stays locked" : "Lock image and hide controls"}
        >
          {controlsHidden ? <Eye size={19} /> : <EyeOff size={19} />}
        </button>
      </header>

      {!cameraActive && (
        <button className="trace-camera-start" type="button" onClick={onCameraToggle}>
          <Camera size={18} /> Start camera
        </button>
      )}

      {locked && image && (
        <div className="trace-lock-badge"><LockKeyhole size={13} /> Image locked</div>
      )}
      {status && (
        <div className="trace-status-message" role="status">
          <span>{status}</span>
          <button type="button" onClick={() => onStatusChange("")} aria-label="Dismiss message"><X size={15} /></button>
        </div>
      )}

      {!controlsHidden && (
        <>
          {settingsOpen && (
            <aside className="trace-settings-panel" aria-label="Tracing settings">
              <div className="trace-panel-heading">
                <span><span className="trace-live-dot" /> Fine-tune your trace</span>
                <button className="trace-round-button" type="button" onClick={() => onSettingsOpenChange(false)} aria-label="Close settings"><X size={17} /></button>
              </div>
              <label className="trace-opacity-control">
                <span>Image opacity <strong>{opacity}%</strong></span>
                <input
                  aria-label="Image opacity"
                  type="range"
                  min="10"
                  max="100"
                  step="1"
                  value={opacity}
                  disabled={!image}
                  onChange={(event) => onOpacityChange(Number(event.target.value))}
                />
                <span className="trace-range-labels"><small>See more paper</small><small>See more image</small></span>
              </label>
              <div className="trace-panel-divider" />
              <div className="trace-settings-note">
                <span className={`trace-setting-icon${wakeLockActive ? " is-on" : ""}`}><Camera size={16} /></span>
                <span><strong>Camera stays in the background</strong><small>{wakeLockActive ? "Screen stays awake while the camera is on." : wakeLockSupported && cameraActive ? "Screen wake lock is not active right now." : "Your camera preview and image stay separate."}</small></span>
              </div>
              {!wakeLockSupported && cameraActive && (
                <p className="trace-settings-hint">This browser cannot keep the screen awake automatically.</p>
              )}
            </aside>
          )}
          <div className="trace-toolbar-wrap">
            <TracingToolbar
              cameraActive={cameraActive}
              hasImage={Boolean(image)}
              locked={locked}
              settingsOpen={settingsOpen}
              onCameraToggle={onCameraToggle}
              onImport={onImport}
              onZoom={updateZoom}
              onRotate={rotate}
              onReset={() => onTransformChange(initialTransform)}
              onLockToggle={() => onLockedChange(!locked)}
              onSettingsToggle={() => onSettingsOpenChange(!settingsOpen)}
              onFullscreen={() => void toggleFullscreen()}
              onClearImage={onClearImage}
            />
          </div>
        </>
      )}
      {controlsHidden && (
        <button
          className="trace-reveal-controls"
          type="button"
          onClick={() => onControlsHiddenChange(false)}
          aria-label="Show tracing controls"
        >
          <Eye size={17} /> Show controls
        </button>
      )}
    </section>
  );
}
