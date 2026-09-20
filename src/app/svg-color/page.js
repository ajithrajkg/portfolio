import AssetTintStudio from "../../components/SvgColorFilterTool";

export const metadata = {
  title: "SVG Color Tool | Recolor SVG Icons and Assets",
  description:
    "Create reusable CSS color treatments for SVG icons and artwork. Pick a source mark, choose a new hue, and generate a ready-to-use filter in seconds.",
  keywords: [
    "SVG color tool",
    "recolor SVG",
    "SVG icon color filter",
    "CSS filter generator",
    "SVG tint tool",
    "online SVG recolor",
    "colorize SVG icons",
    "frontend asset coloring",
  ],
  applicationName: "SVG Color",
  category: "technology",
  alternates: {
    canonical: "/svg-color/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: "SVG Color Tool | Recolor SVG Icons and Assets",
    description:
      "Generate reusable CSS filters to recolor SVG icons and source artwork without changing the original asset.",
    type: "website",
    url: "/svg-color/",
    siteName: "SVG Color",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "SVG Color logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "SVG Color Tool | Recolor SVG Icons and Assets",
    description:
      "Generate reusable CSS filters to recolor SVG icons and source artwork without changing the original asset.",
    images: ["/logo.png"],
  },
};

export default function SvgColorPage() {
  return <AssetTintStudio />;
}
