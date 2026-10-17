"use client";

import {
  Camera,
  CameraOff,
  ImagePlus,
  LockKeyhole,
  Maximize,
  Minus,
  Plus,
  RotateCw,
  RotateCcw,
  SlidersHorizontal,
  Trash2,
  UnlockKeyhole,
} from "lucide-react";

type TracingToolbarProps = {
  cameraActive: boolean;
  hasImage: boolean;
  locked: boolean;
  settingsOpen: boolean;
  onCameraToggle: () => void;
  onImport: () => void;
  onZoom: (amount: number) => void;
  onRotate: (amount: number) => void;
  onReset: () => void;
  onLockToggle: () => void;
  onSettingsToggle: () => void;
  onFullscreen: () => void;
  onClearImage: () => void;
};

export default function TracingToolbar({
  cameraActive,
  hasImage,
  locked,
  settingsOpen,
  onCameraToggle,
  onImport,
  onZoom,
  onRotate,
  onReset,
  onLockToggle,
  onSettingsToggle,
  onFullscreen,
  onClearImage,
}: TracingToolbarProps) {
  return (
    <div className="tracedraw-controls">
      <div className="tracedraw-toolbar">
        <button
          className={`trace-tool-button trace-tool-primary${cameraActive ? " is-live" : ""}`}
          type="button"
          onClick={onCameraToggle}
          aria-label={cameraActive ? "Stop camera" : "Start camera"}
          title={cameraActive ? "Stop camera" : "Start camera"}
        >
          {cameraActive ? <CameraOff size={19} /> : <Camera size={19} />}
          <span>{cameraActive ? "Stop" : "Camera"}</span>
        </button>
        <span className="trace-tool-divider" />
        <button className="trace-tool-button" type="button" onClick={onImport} aria-label="Import image" title="Import image">
          <ImagePlus size={19} /><span>Image</span>
        </button>
        <button className="trace-tool-button" type="button" onClick={() => onZoom(0.15)} disabled={!hasImage} aria-label="Zoom in" title="Zoom in">
          <Plus size={19} /><span>Zoom</span>
        </button>
        <button className="trace-tool-icon" type="button" onClick={() => onZoom(-0.15)} disabled={!hasImage} aria-label="Zoom out" title="Zoom out">
          <Minus size={19} />
        </button>
        <button className="trace-tool-button" type="button" onClick={() => onRotate(15)} disabled={!hasImage} aria-label="Rotate image clockwise" title="Rotate clockwise">
          <RotateCw size={19} /><span>Rotate</span>
        </button>
        <button className="trace-tool-icon" type="button" onClick={() => onRotate(-15)} disabled={!hasImage} aria-label="Rotate image counterclockwise" title="Rotate counterclockwise">
          <RotateCcw size={19} />
        </button>
        <button className={`trace-tool-button${locked ? " is-selected" : ""}`} type="button" onClick={onLockToggle} disabled={!hasImage} aria-label={locked ? "Unlock image" : "Lock image"} title={locked ? "Unlock image" : "Lock image"}>
          {locked ? <LockKeyhole size={19} /> : <UnlockKeyhole size={19} />}
          <span>{locked ? "Locked" : "Lock"}</span>
        </button>
        <button className="trace-tool-icon trace-desktop-only" type="button" onClick={onReset} disabled={!hasImage} aria-label="Reset image position" title="Reset image">
          <RotateCcw size={19} />
        </button>
        <button className="trace-tool-icon trace-desktop-only" type="button" onClick={onClearImage} disabled={!hasImage} aria-label="Clear image" title="Clear image">
          <Trash2 size={19} />
        </button>
        <button className={`trace-tool-icon${settingsOpen ? " is-selected" : ""}`} type="button" onClick={onSettingsToggle} aria-label="Toggle settings" title="Settings">
          <SlidersHorizontal size={19} />
        </button>
        <button className="trace-tool-icon trace-desktop-only" type="button" onClick={onFullscreen} aria-label="Toggle fullscreen" title="Fullscreen">
          <Maximize size={19} />
        </button>
      </div>
      <div className="tracedraw-mobile-extras">
        <button className="trace-tool-button" type="button" onClick={onReset} disabled={!hasImage}><RotateCcw size={17} />Reset</button>
        <button className="trace-tool-button" type="button" onClick={onClearImage} disabled={!hasImage}><Trash2 size={17} />Clear image</button>
        <button className="trace-tool-button" type="button" onClick={onFullscreen}><Maximize size={17} />Fullscreen</button>
      </div>
    </div>
  );
}
