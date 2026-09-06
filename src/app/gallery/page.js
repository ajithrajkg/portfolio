"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const galleryItems = [
  { image: "/office/01.jfif", alt: "Office workspace view", height: "aspect-[4/5]" },
  { image: "/office/02.jfif", alt: "Office interior view", height: "aspect-[4/3]" },
  { image: "/office/03.jfif", alt: "Office design detail", height: "aspect-[3/4]" },
  { image: "/office/04.jfif", alt: "Creative office space", height: "aspect-[4/5]" },
  { image: "/office/05.jfif", alt: "Office workspace detail", height: "aspect-[3/4]" },
  { image: "/office/06.jfif", alt: "Office interior detail", height: "aspect-[4/3]" },
];

export default function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (!selectedImage) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setSelectedImage(null);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedImage]);

  return (
    <main className="min-h-screen bg-[#f4f1ec] px-5 py-20 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">
            Professional moments
          </p>
          <h1 className="mt-4 font-serif text-5xl leading-[0.95] tracking-tight text-stone-900 sm:text-7xl">
            Meetings, programs, and milestones.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-stone-600">
            A visual collection of official meetings, professional programs, and meaningful moments shared with colleagues and teams.
          </p>
        </div>

        <div className="mt-14 columns-1 gap-5 sm:columns-2 lg:columns-3">
          {galleryItems.map((item, index) => (
            <button
              key={item.image}
              type="button"
              onClick={() => setSelectedImage(item)}
              className="group mb-5 block w-full break-inside-avoid overflow-hidden rounded-2xl bg-stone-200 text-left shadow-[0_12px_35px_rgba(68,58,46,0.12)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(68,58,46,0.2)] focus:outline-none focus:ring-4 focus:ring-stone-400/40"
              aria-label={`Open image ${index + 1}`}
            >
              <div className={`relative w-full ${item.height}`}>
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  unoptimized
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/45 to-transparent px-5 pb-4 pt-14 text-sm font-medium text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  View image
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/90 p-5 backdrop-blur-sm sm:p-10"
          role="dialog"
          aria-modal="true"
          aria-label="Image preview"
          onClick={() => setSelectedImage(null)}
        >
          <button
            type="button"
            onClick={() => setSelectedImage(null)}
            className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-2xl text-white transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Close image preview"
          >
            &times;
          </button>
          <div
            className="relative h-[80vh] w-full max-w-5xl"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={selectedImage.image}
              alt={selectedImage.alt}
              fill
                  unoptimized
              sizes="100vw"
              className="object-contain"
              priority
            />
          </div>
        </div>
      )}
    </main>
  );
}
