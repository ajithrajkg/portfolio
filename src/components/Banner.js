"use client";

import Image from "next/image";

export default function Banner({
  title,
  subtitle,
  ctaText,
  ctaLink,
  imageSrc = "/logo.png",
  imageAlt = "Profile photo",
}) {
  const handleScroll = (event) => {
    event.preventDefault();

    if (typeof window === "undefined") return;

    const target = document.getElementById("professional-summary");
    if (!target) {
      window.location.hash = ctaLink || "#";
      return;
    }

    const y = target.getBoundingClientRect().top + window.scrollY - 90;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <section className="relative isolate overflow-hidden w-full bg-gradient-to-br from-slate-950 via-blue-950 to-slate-800 text-white py-20 px-6 shadow-2xl min-h-[45rem] flex items-center justify-center">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(96,165,250,0.28),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(167,139,250,0.24),_transparent_40%)]" />
      <div className="absolute left-10 top-10 h-40 w-40 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="absolute bottom-10 right-10 h-48 w-48 rounded-full bg-violet-500/20 blur-3xl" />
      <div className="relative z-10 max-w-4xl rounded-3xl border border-white/10 bg-white/10 px-8 py-12 text-center shadow-2xl backdrop-blur-md sm:px-12 md:px-16">
        <div className="mb-6 mx-auto flex w-fit rounded-full border-4 border-white/80 bg-white/10 p-1 shadow-2xl backdrop-blur-sm">
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={120}
            height={120}
            className="h-28 w-28 rounded-full object-cover md:h-32 md:w-32"
          />
        </div>

        <h2 className="text-4xl font-bold leading-tight md:text-5xl">
          {title || "Welcome to Our Platform"}
        </h2>
        <p className="mt-4 max-w-2xl text-lg text-white/90 md:text-xl">
          {subtitle || "Build something amazing with our tools"}
        </p>
        {ctaText && (
          <a
            href={ctaLink || "#"}
            onClick={handleScroll}
            className="mt-8 inline-block rounded-lg bg-white px-8 py-3 font-semibold text-blue-700 transition-colors duration-200 hover:bg-gray-100"
          >
            {ctaText}
          </a>
        )}
      </div>
    </section>
  );
}
