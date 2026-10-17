import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/panchangam/",
    name: "Personal Panchangam",
    short_name: "Panchangam",
    description: "A personal, offline-ready Malayalam daily Panchangam.",
    start_url: "/panchangam/",
    scope: "/panchangam/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#f7f7f3",
    theme_color: "#203a52",
    lang: "ml",
    dir: "ltr",
    categories: ["lifestyle", "utilities"],
    icons: [
      {
        src: "/panchangam-icon.svg",
        sizes: "192x192",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/panchangam-icon.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
