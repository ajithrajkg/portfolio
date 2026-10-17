"use client";

import { useEffect, useRef } from "react";

type CameraPreviewProps = {
  active: boolean;
  facingMode: "environment" | "user";
  onError: (message: string) => void;
  onReadyChange: (ready: boolean) => void;
};

function cameraErrorMessage(error: unknown) {
  if (error instanceof DOMException) {
    if (error.name === "NotAllowedError" || error.name === "SecurityError") {
      return "Camera access was blocked. Allow camera access in your browser settings, then try again.";
    }
    if (error.name === "NotFoundError" || error.name === "OverconstrainedError") {
      return "That camera is unavailable. Try switching cameras or check that your device has a camera.";
    }
    if (error.name === "NotReadableError") {
      return "Your camera is busy in another app. Close it there and try again.";
    }
  }
  return "The camera could not be started. Check your browser permissions and try again.";
}

export default function CameraPreview({ active, facingMode, onError, onReadyChange }: CameraPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!active) return;

    if (!navigator.mediaDevices?.getUserMedia) {
      onReadyChange(false);
      onError("Camera access is not supported by this browser. Try the latest Safari or Chrome over HTTPS.");
      return;
    }

    onReadyChange(false);
    let cancelled = false;
    let stream: MediaStream | null = null;

    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            facingMode: { ideal: facingMode },
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
        });
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          onReadyChange(true);
          stream.getVideoTracks().forEach((track) => {
            track.addEventListener("ended", () => onReadyChange(false));
          });
        }
      } catch (error) {
        if (!cancelled) {
          onReadyChange(false);
          onError(cameraErrorMessage(error));
        }
      }
    }

    void startCamera();
    return () => {
      cancelled = true;
      stream?.getTracks().forEach((track) => track.stop());
      if (videoRef.current) videoRef.current.srcObject = null;
      onReadyChange(false);
    };
  }, [active, facingMode, onError, onReadyChange]);

  return (
    <video
      ref={videoRef}
      className="tracedraw-camera"
      autoPlay
      muted
      playsInline
      aria-label="Live camera preview"
    />
  );
}
