import ImageTraceApp from "@/components/imagetrace/ImageTraceApp";
import type { Viewport } from "next";
import "./imagetrace.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#151713",
  colorScheme: "dark",
};

export const metadata = {
  title: "ImageTrace | Image tracing studio",
  description:
    "A private, installable image tracing studio. Position, adjust, and lock images on your screen while you trace.",
  applicationName: "ImageTrace",
  appleWebApp: {
    capable: true,
    title: "ImageTrace",
    statusBarStyle: "black-translucent",
  },
  manifest: "/imagetrace/manifest.webmanifest",
  icons: {
    apple: "/imagetrace/icon.svg",
    icon: [{ url: "/imagetrace/icon.svg", type: "image/svg+xml" }],
  },
  alternates: {
    canonical: "/imagetrace/",
  },
};

export default function ImageTracePage() {
  return <ImageTraceApp />;
}
