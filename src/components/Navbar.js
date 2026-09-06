"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isHomeActive = pathname === "/";
  const isGalleryActive = pathname === "/gallery";
  const isAboutActive = pathname === "/about";

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <div className="text-xl font-bold text-green-600">
            <img src="/logo.png" alt="Logo" className="w-[68px]" />
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 font-medium">
            <Link
              href="/"
              className={isHomeActive ? "text-blue-600" : "hover:text-blue-600"}
            >
              Home
            </Link>
            <Link
              href="/gallery"
              className={isGalleryActive ? "text-blue-600" : "hover:text-blue-600"}
            >
              Gallery
            </Link>
            <Link
              href="/about"
              className={isAboutActive ? "text-blue-600" : "hover:text-blue-600"}
            >
              About Me
            </Link>
            <Link href="/contact" className="hover:text-blue-600">Contact Us</Link>
          </div>

          {/* Mobile Button */}
          <div className="md:hidden">
            <button onClick={() => setOpen(!open)}>
              {open ? (
                <span className="text-2xl">✖</span>
              ) : (
                <span className="text-2xl">☰</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white shadow-md px-4 pb-4 space-y-3 font-medium">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className={isHomeActive ? "block text-blue-600" : "block hover:text-blue-600"}
          >
            Home
          </Link>
          <Link
            href="/gallery"
            onClick={() => setOpen(false)}
            className={isGalleryActive ? "block text-blue-600" : "block hover:text-blue-600"}
          >
            Gallery
          </Link>
          <Link
            href="/about"
            onClick={() => setOpen(false)}
            className={isAboutActive ? "block text-blue-600" : "block hover:text-blue-600"}
          >
            About Me
          </Link>
          <Link href="/contact" onClick={() => setOpen(false)} className="block hover:text-blue-600">
            Contact Us
          </Link>
        </div>
      )}
    </nav>
  );
}