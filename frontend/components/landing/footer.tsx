"use client";

import Link from "next/link";
import { XLogo, LinkedinLogo, YoutubeLogo } from "@phosphor-icons/react";

export default function Footer() {
  return (
    <footer className="relative w-full bg-gradient-to-b from-[#141A28] via-[#2D2D49] to-[#786A8B] text-white pt-12 md:pt-16 pb-8 md:pb-10">
      <div className="max-w-[1240px] mx-auto px-6 md:px-12 lg:px-16">
        
        {/* Main 2-Column Desktop Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          
          {/* ================= LEFT SIDE: Contact & Brand ================= */}
          <div className="md:col-span-6 lg:col-span-6 flex flex-col justify-between">
            {/* Contact Block */}
            <div>
              <h4 className="text-[11px] font-mono tracking-widest text-white/50 uppercase font-semibold mb-3.5">
                CONTACT
              </h4>

              <div className="text-[12.5px] sm:text-[13px] text-white/80 leading-relaxed font-normal space-y-0.5">
                <p className="font-semibold text-white">
                  Headquarters, Nigeria
                </p>
                <p>14 Commercial Avenue, Sabo Yaba</p>
                <p>Lagos State, Nigeria</p>
                <p className="pt-2 font-mono text-white/70">+234 1 888 2390</p>
                <p className="pt-0.5">
                  <a
                    href="mailto:hello@alertdrive.ai"
                    className="text-white underline underline-offset-4 decoration-white/40 hover:decoration-white transition-colors"
                  >
                    hello@alertdrive.ai
                  </a>
                </p>
              </div>
            </div>

            {/* Brand Logo & Corporate Registry (Bottom-Left) */}
            <div className="mt-12 md:mt-16 flex flex-col gap-2.5">
              <Link href="/" className="flex items-center gap-2 group">
                <AlertDriveLogo />
                <span className="text-[17px] font-semibold tracking-[-0.02em] text-white">
                  alertdrive
                </span>
              </Link>

              <div className="text-[11.5px] text-white/60 leading-snug font-normal space-y-0.5">
                <p>&copy; AlertDrive 2026. All rights reserved</p>
                <p>AlertDrive Intelligence Technologies Ltd.</p>
                <p className="font-mono text-[10.5px]">
                  Registered in Nigeria Number: RC 1892044
                </p>
              </div>
            </div>
          </div>

          {/* ================= RIGHT SIDE: Navigation & Socials ================= */}
          <div className="md:col-span-6 lg:col-span-6 flex flex-col justify-between">
            
            {/* Links Columns: Platform + Navigation */}
            <div className="grid grid-cols-2 gap-6 sm:gap-10">
              
              {/* Platform Column */}
              <div>
                <h4 className="text-[11px] font-mono tracking-widest text-white/50 uppercase font-semibold mb-3.5">
                  PLATFORM
                </h4>

                <ul className="space-y-1.5 text-[12.5px] sm:text-[13px] text-white/80 font-normal">
                  <li>
                    <a
                      href="#platform"
                      className="hover:text-white transition-colors"
                    >
                      Vision Engine
                    </a>
                  </li>
                  <li>
                    <a
                      href="#features"
                      className="hover:text-white transition-colors"
                    >
                      PERCLOS Analytics
                    </a>
                  </li>
                  <li>
                    <Link
                      href="/demo"
                      className="hover:text-white transition-colors font-medium text-white/90"
                    >
                      Live Driver Cockpit
                    </Link>
                  </li>
                  <li>
                    <a
                      href="#corridors"
                      className="hover:text-white transition-colors"
                    >
                      Transit Corridors
                    </a>
                  </li>
                </ul>
              </div>

              {/* Company & Ecosystem Column */}
              <div>
                <h4 className="text-[11px] font-mono tracking-widest text-white/50 uppercase font-semibold mb-3.5">
                  ECOSYSTEM
                </h4>

                <ul className="space-y-1.5 text-[12.5px] sm:text-[13px] text-white/80 font-normal">
                  <li>
                    <a
                      href="#ecosystem"
                      className="hover:text-white transition-colors"
                    >
                      Interoperability
                    </a>
                  </li>
                  <li>
                    <a
                      href="#news"
                      className="hover:text-white transition-colors"
                    >
                      Technical Briefings
                    </a>
                  </li>
                  <li>
                    <a
                      href="#contact"
                      className="hover:text-white transition-colors"
                    >
                      Fleet Inquiries
                    </a>
                  </li>
                </ul>
              </div>

            </div>

            {/* Social Icons & Inline Legal Links (Bottom-Right) */}
            <div className="mt-12 md:mt-16 flex items-center justify-start sm:justify-end gap-5 sm:gap-6 text-white/70">
              {/* Social Icons */}
              <div className="flex items-center gap-3 text-white/80">
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X formerly Twitter"
                  className="hover:text-white transition-colors"
                >
                  <XLogo size={15} weight="bold" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="hover:text-white transition-colors"
                >
                  <LinkedinLogo size={16} weight="bold" />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="hover:text-white transition-colors"
                >
                  <YoutubeLogo size={17} weight="bold" />
                </a>
              </div>

              {/* Inline Legal Links */}
              <div className="flex items-center gap-2.5 text-[11.5px] text-white/65">
                <a
                  href="#contact"
                  className="hover:text-white transition-colors"
                >
                  Terms of use
                </a>
                <span className="text-white/30">|</span>
                <a
                  href="#contact"
                  className="hover:text-white transition-colors"
                >
                  Privacy &amp; Cookies
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>
    </footer>
  );
}

/* AlertDrive Sensor Reticle Logo Glyph */
function AlertDriveLogo() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-white"
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
