"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function SiteLayout({ children }) {
  const pathname = usePathname();
  const isPanchangam = pathname?.replace(/\/$/, "") === "/panchangam";

  return (
    <>
      {!isPanchangam && <Header />}
      <main className={`flex-1 ${isPanchangam ? "" : "pt-16"}`}>
        {children}
      </main>
      <Footer />
    </>
  );
}
