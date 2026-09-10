import CodePlayground from "../../components/CodePlayground";

export const metadata = {
  title: "Code Preview | Online HTML, CSS & JavaScript Editor",
  description:
    "Code Preview is a fast online HTML, CSS, and JavaScript editor with a live preview. Write code, run it instantly, and test your web ideas in the browser.",
  keywords: [
    "online HTML editor",
    "CSS editor",
    "JavaScript editor",
    "HTML CSS JavaScript playground",
    "live code preview",
    "online code editor",
    "frontend playground",
  ],
  applicationName: "Code Preview",
  category: "technology",
  alternates: {
    canonical: "/products/",
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
    title: "Code Preview | Online HTML, CSS & JavaScript Editor",
    description:
      "Write HTML, CSS, and JavaScript and see your changes live in the browser.",
    type: "website",
    url: "/products/",
    siteName: "Code Preview",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "Code Preview logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Code Preview | Online HTML, CSS & JavaScript Editor",
    description:
      "Write HTML, CSS, and JavaScript and see your changes live in the browser.",
    images: ["/logo.png"],
  },
};

export default function ProductsPage() {
  return <CodePlayground />;
}