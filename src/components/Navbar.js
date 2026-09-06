"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaLinkedinIn } from "react-icons/fa";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const currentPath = pathname.replace(/\/$/, "") || "/";
  const isHomeActive = currentPath === "/";
  const isGalleryActive = currentPath === "/gallery";
  const isAboutActive = currentPath === "/about";
  const isContactActive = currentPath === "/contact";

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <div className="text-xl font-bold text-green-600">
            <Link href="/" aria-label="Go to home page">
              <img src="/logo.png" alt="Logo" className="w-[68px]" />
            </Link>
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
            <Link
              href="/contact"
              className={isContactActive ? "text-blue-600" : "hover:text-blue-600"}
            >
              Contact
            </Link>
            <a
              href="https://www.linkedin.com/in/ajithrajkg/"
              target="_blank"
              rel="noreferrer"
              aria-label="Open Ajith Raj's LinkedIn profile"
              title="LinkedIn"
              className="text-slate-600 transition-colors hover:text-blue-600"
            >
              <FaLinkedinIn size={19} />
            </a>
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
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className={isContactActive ? "block text-blue-600" : "block hover:text-blue-600"}
          >
            Contact
          </Link>
          <a
            href="https://www.linkedin.com/in/ajithrajkg/"
            target="_blank"
            rel="noreferrer"
            aria-label="Open Ajith Raj's LinkedIn profile"
            title="LinkedIn"
            className="flex items-center gap-2 text-slate-600 transition-colors hover:text-blue-600"
          >
            <FaLinkedinIn size={18} />
            <span>LinkedIn</span>
          </a>
        </div>
      )}
    </nav>
  );
}