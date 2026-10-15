"use client";

import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";
import { motion } from "motion/react";

export default function Hero() {
  return (
    <section className="relative w-full h-screen min-h-[600px] max-h-[1200px] overflow-hidden">
      {/* Background media layer */}
      <div className="absolute inset-0">
        {/* Top vignette for navbar legibility */}
        <div className="absolute inset-x-0 top-0 h-[200px] bg-gradient-to-b from-black/60 to-transparent z-[2]" />

        {/* Bottom vignette for headline legibility */}
        <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-black/85 via-black/40 to-transparent z-[2]" />

        {/* Subtle general darkening overlay */}
        <div className="absolute inset-0 bg-black/25 z-[1]" />

        {/* Hero background video / image */}
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/hero-poster.jpg"
          className="w-full h-full object-cover"
        />

        {/* Fallback gradient when no video/image is present */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#08090C] via-[#0f1520] to-[#0a1a12] -z-[1]" />
      </div>

      {/* Content: bottom-left anchored */}
      <div className="relative z-10 h-full flex flex-col justify-end px-6 md:px-10 lg:px-14 pb-14 md:pb-18 lg:pb-22">
        {/* Display headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.2,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="text-[clamp(2.5rem,5.5vw,4.5rem)] leading-[1.06] tracking-[-0.03em] font-light text-white max-w-[720px]"
        >
          Driver State Intelligence
        </motion.h1>

        {/* Actions: Primary Demo Button + Secondary Platform Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: 0.35,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="mt-7 md:mt-9 flex flex-wrap items-center gap-4"
        >
          <Link
            href="/demo"
            className="inline-flex items-center gap-2.5 text-[13px] font-medium text-[#08090C] bg-white hover:bg-white/90 pl-5 pr-4 py-2.5 rounded-full transition-all duration-200 group active:scale-[0.97] shadow-lg"
          >
            <span>Launch Live Demo</span>
            <ArrowRight
              size={14}
              weight="bold"
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </Link>

          <a
            href="#platform"
            className="inline-flex items-center gap-2 text-[13px] font-medium text-white/80 hover:text-white px-5 py-2.5 rounded-full border border-white/20 hover:border-white/50 backdrop-blur-xs transition-all duration-200"
          >
            Explore Platform
          </a>
        </motion.div>
      </div>

      {/* HUD corner brackets: subtle reticle overlay */}
      <div className="absolute inset-0 z-[3] pointer-events-none hidden lg:block">
        <div className="absolute top-28 left-14">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <path
              d="M0 12V1.5C0 0.672 0.672 0 1.5 0H12"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="1"
            />
          </svg>
        </div>
        <div className="absolute top-28 right-14">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <path
              d="M40 12V1.5C40 0.672 39.328 0 38.5 0H28"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="1"
            />
          </svg>
        </div>
        <div className="absolute bottom-14 left-14">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <path
              d="M0 28V38.5C0 39.328 0.672 40 1.5 40H12"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="1"
            />
          </svg>
        </div>
        <div className="absolute bottom-14 right-14">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <path
              d="M40 28V38.5C40 39.328 39.328 40 38.5 40H28"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="1"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
