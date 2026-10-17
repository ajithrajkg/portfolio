"use client";

import { useRef } from "react";

export type OverlayTransform = {
  x: number;
  y: number;
  scale: number;
  rotation: number;
};

type Point = { x: number; y: number };

type GestureStart = {
  center: Point;
  distance: number;
  transform: OverlayTransform;
};

type ImageOverlayProps = {
  src: string;
  name: string;
  opacity: number;
  transform: OverlayTransform;
  locked: boolean;
  onTransformChange: (transform: OverlayTransform) => void;
};

function distance(first: Point, second: Point) {
  return Math.hypot(second.x - first.x, second.y - first.y);
}

function center(points: Point[]) {
  return points.reduce(
    (result, point) => ({ x: result.x + point.x / points.length, y: result.y + point.y / points.length }),
    { x: 0, y: 0 },
  );
}

export default function ImageOverlay({
  src,
  name,
  opacity,
  transform,
  locked,
  onTransformChange,
}: ImageOverlayProps) {
  const elementRef = useRef<HTMLImageElement>(null);
  const pointersRef = useRef(new Map<number, Point>());
  const gestureRef = useRef<GestureStart | null>(null);

  function beginGesture() {
    const points = [...pointersRef.current.values()];
    if (!points.length) return;
    gestureRef.current = {
      center: center(points),
      distance: points.length > 1 ? distance(points[0], points[1]) : 0,
      transform: { ...transform },
    };
  }

  function handlePointerDown(event: React.PointerEvent<HTMLImageElement>) {
    if (locked) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    beginGesture();
  }

  function handlePointerMove(event: React.PointerEvent<HTMLImageElement>) {
    if (locked || !pointersRef.current.has(event.pointerId)) return;
    pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    const points = [...pointersRef.current.values()];
    const gesture = gestureRef.current;
    if (!gesture) return;

    const currentCenter = center(points);
    const scale = points.length > 1 && gesture.distance > 0
      ? Math.min(4, Math.max(0.35, gesture.transform.scale * distance(points[0], points[1]) / gesture.distance))
      : gesture.transform.scale;

    onTransformChange({
      ...gesture.transform,
      x: gesture.transform.x + currentCenter.x - gesture.center.x,
      y: gesture.transform.y + currentCenter.y - gesture.center.y,
      scale,
    });
  }

  function handlePointerEnd(event: React.PointerEvent<HTMLImageElement>) {
    pointersRef.current.delete(event.pointerId);
    beginGesture();
  }

  return (
    <img
      ref={elementRef}
      className={`tracedraw-overlay${locked ? " is-locked" : ""}`}
      src={src}
      alt={name}
      draggable={false}
      style={{
        opacity: opacity / 100,
        transform: `translate(calc(-50% + ${transform.x}px), calc(-50% + ${transform.y}px)) scale(${transform.scale}) rotate(${transform.rotation}deg)`,
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
    />
  );
}
