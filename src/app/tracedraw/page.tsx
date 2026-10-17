import TraceDrawApp from "@/components/tracedraw/TraceDrawApp";
import type { Viewport } from "next";
import "./tracedraw.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#151713",
  colorScheme: "dark",
};

export const metadata = {
  title: "TraceDraw | Trace anything, beautifully",
  description:
    "A private, installable tracing studio. Align an image over your live camera and trace it on paper.",
  applicationName: "TraceDraw",
  appleWebApp: {
    capable: true,
    title: "TraceDraw",
    statusBarStyle: "black-translucent",
  },
  manifest: "/tracedraw/manifest.webmanifest",
  icons: {
    apple: "/tracedraw/icon-192.png",
    icon: [
      { url: "/tracedraw/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/tracedraw/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  },
  alternates: {
    canonical: "/tracedraw/",
  },
};

export default function TraceDrawPage() {
  return <TraceDrawApp />;
}
