"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaLinkedinIn } from "react-icons/fa";
import { ChevronDown } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const pathname = usePathname();
  const currentPath = pathname.replace(/\/$/, "") || "/";
  const isHomeActive = currentPath === "/";
  const isGalleryActive = currentPath === "/gallery";
  const isAboutActive = currentPath === "/about";
  const isProductsActive = currentPath === "/products";
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
            <div className="group relative">
              <button
                type="button"
                aria-expanded="false"
                className={`flex items-center gap-1 ${isProductsActive ? "text-blue-600" : "hover:text-blue-600"}`}
              >
                Products <ChevronDown size={15} />
              </button>
              <div className="invisible absolute left-1/2 top-full z-10 mt-3 w-44 -translate-x-1/2 rounded-lg border border-slate-200 bg-white p-2 opacity-0 shadow-lg transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                <Link
                  href="/products"
                  className="block rounded-md px-3 py-2 text-sm hover:bg-slate-100 hover:text-blue-600"
                >
                  Code preview
                </Link>
              </div>
            </div>
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
          <div>
            <button
              type="button"
              onClick={() => setProductsOpen(!productsOpen)}
              aria-expanded={productsOpen}
              className={`flex w-full items-center justify-between ${isProductsActive ? "text-blue-600" : "hover:text-blue-600"}`}
            >
              Products <ChevronDown size={16} className={productsOpen ? "rotate-180" : ""} />
            </button>
            {productsOpen && (
              <Link
                href="/products"
                onClick={() => {
                  setOpen(false);
                  setProductsOpen(false);
                }}
                className="mt-2 block pl-4 text-sm text-slate-600 hover:text-blue-600"
              >
                Code preview
              </Link>
            )}
          </div>
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