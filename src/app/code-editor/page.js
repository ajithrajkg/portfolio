import CodePlayground from "../../components/CodePlayground";

export const metadata = {
  title: "Code Editor | Live HTML, CSS & JavaScript Playground",
  description:
    "Write, run, and preview HTML, CSS, and JavaScript instantly in a live browser-based code editor. Test frontend ideas quickly with a clean playground.",
  keywords: [
    "online HTML editor",
    "CSS editor",
    "JavaScript editor",
    "live HTML CSS JavaScript editor",
    "frontend playground",
    "code playground",
    "browser code editor",
    "online code sandbox",
    "HTML CSS JS tester",
  ],
  applicationName: "Code Editor",
  category: "technology",
  alternates: {
    canonical: "/code-editor/",
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
    title: "Code Editor | Live HTML, CSS & JavaScript Playground",
    description:
      "Build and preview frontend code instantly in a clean, browser-based editor for HTML, CSS, and JavaScript.",
    type: "website",
    url: "/code-editor/",
    siteName: "Code Editor",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "Code Editor logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Code Editor | Live HTML, CSS & JavaScript Playground",
    description:
      "Build and preview frontend code instantly in a clean, browser-based editor for HTML, CSS, and JavaScript.",
    images: ["/logo.png"],
  },
};

export default function CodeEditorPage() {
  return <CodePlayground />;
}
