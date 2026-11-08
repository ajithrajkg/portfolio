"use client";

import Image from "next/image";

export default function Banner({
  ctaText,
  ctaLink,
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
    <section className="relative isolate overflow-hidden bg-slate-950 shadow-2xl">
      <a
        href={ctaLink || "#professional-summary"}
        onClick={handleScroll}
        aria-label={ctaText || "Explore my work"}
        className="block w-full overflow-hidden"
      >
        <Image
          src="/ajith-dashboard.png"
          alt={imageAlt}
          width={1500}
          height={780}
          priority
          unoptimized
          className="block h-auto w-full object-cover"
        />
      </a>
    </section>
  );
}
