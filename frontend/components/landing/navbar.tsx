"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CaretDown, List, X, ArrowRight } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "motion/react";

const navLinks = [
  { label: "Platform", href: "#platform" },
  { label: "Features", href: "#features" },
  { label: "Corridors", href: "#corridors" },
  { label: "Ecosystem", href: "#ecosystem" },
  { label: "Briefings", href: "#news" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 350);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md border-b border-black/[0.08] shadow-[0_1px_3px_rgba(0,0,0,0.03)]"
          : "bg-transparent"
      }`}
    >
      {/* Top vignette overlay behind navbar when over dark hero */}
      <div
        className={`absolute inset-0 h-[140px] bg-gradient-to-b from-black/60 via-black/25 to-transparent pointer-events-none transition-opacity duration-300 ${
          isScrolled ? "opacity-0" : "opacity-100"
        }`}
      />

      <div className="relative flex items-center justify-between px-6 md:px-10 lg:px-14 h-[72px]">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <AlertDriveLogo dark={isScrolled} />
          <span
            className={`text-[15px] font-semibold tracking-[-0.02em] transition-colors duration-200 ${
              isScrolled ? "text-[#08090C]" : "text-white"
            }`}
          >
            alertdrive
          </span>
        </Link>

        {/* Desktop Navigation - Smooth Scroll Anchor Links */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`px-3.5 py-2 text-[14px] font-medium transition-colors duration-200 ${
                isScrolled
                  ? "text-neutral-700 hover:text-black"
                  : "text-white/85 hover:text-white"
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right CTA Button: Direct to Live Demo / Test Model */}
        <div className="hidden lg:flex items-center gap-4">
          <Link
            href="/demo"
            className={`inline-flex items-center text-[13px] font-medium px-5 py-2 rounded-full transition-all duration-200 ${
              isScrolled
                ? "bg-[#08090C] hover:bg-neutral-800 text-white shadow-xs"
                : "bg-white hover:bg-white/90 text-[#08090C] shadow-xs"
            }`}
          >
            Launch Demo
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className={`lg:hidden relative z-50 p-2 transition-colors duration-200 ${
            isScrolled ? "text-[#08090C]" : "text-white"
          }`}
          aria-label="Toggle navigation"
        >
          {mobileOpen ? (
            <X size={22} weight="bold" />
          ) : (
            <List size={22} weight="bold" />
          )}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 z-40 bg-[#08090C]/98 backdrop-blur-md lg:hidden"
          >
            <div className="flex flex-col pt-24 px-8 gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="py-3.5 text-[16px] font-medium text-white/85 hover:text-white border-b border-white/10 transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <Link
                href="/demo"
                onClick={() => setMobileOpen(false)}
                className="mt-6 flex items-center justify-center text-[14px] font-medium text-[#08090C] bg-white hover:bg-white/90 px-6 py-3 rounded-full transition-colors"
              >
                Launch Demo
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

/* AlertDrive Logo: abstract sensor reticle mark */
function AlertDriveLogo({ dark = false }: { dark?: boolean }) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={dark ? "text-[#08090C] transition-colors duration-200" : "text-white transition-colors duration-200"}
    >
      <circle
        cx="14"
        cy="14"
        r="12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="4 3"
        opacity="0.5"
      />
      <circle
        cx="14"
        cy="14"
        r="7"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="14" cy="14" r="2.5" fill="currentColor" />
      <line
        x1="14"
        y1="2"
        x2="14"
        y2="5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="14"
        y1="23"
        x2="14"
        y2="26"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="2"
        y1="14"
        x2="5"
        y2="14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="23"
        y1="14"
        x2="26"
        y2="14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
