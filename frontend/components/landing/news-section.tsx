"use client";

import Image from "next/image";
import { ArrowRight } from "@phosphor-icons/react";
import { motion } from "motion/react";

interface NewsItem {
  id: string;
  source: string;
  headline: string;
  href: string;
  imageSrc?: string;
  isBrandCard?: boolean;
  brandLockup?: {
    left: string;
    right: string;
  };
}

const featuredNews: NewsItem[] = [
  {
    id: "corridor-study",
    source: "CORRIDOR RESEARCH",
    headline:
      "Fatigue telemetry across West African freight corridors: Quantifying nocturnal drowsiness dynamics along high-density haulage routes",
    href: "#platform",
    imageSrc: "/corridor-lagos.jpg",
  },
  {
    id: "ddaw-standards",
    source: "REGULATORY COMPLIANCE",
    headline:
      "Benchmarking in-cabin edge vision against UNECE DDAW Regulation 2021/1341 standards for commercial vehicles",
    href: "#platform",
    imageSrc: "/driver-african.jpg",
  },
];

const secondaryNews: NewsItem[] = [
  {
    id: "edge-architecture",
    source: "ENGINEERING SPEC",
    headline:
      "Sub-50ms MobileNet quantization on embedded automotive silicon: Eliminating cloud latency in remote transit zones",
    href: "#platform",
    isBrandCard: true,
    brandLockup: {
      left: "SYSTEM ARCHITECTURE",
      right: "alertdrive",
    },
  },
  {
    id: "fleet-telematics",
    source: "FLEET TELEMATICS",
    headline:
      "Integration protocols for commercial telematics: Interfacing localized PERCLOS alerts with dispatch operations",
    href: "#platform",
    imageSrc: "/driver-nigeria.jpg",
  },
  {
    id: "data-privacy",
    source: "DATA GOVERNANCE",
    headline:
      "Zero-streaming edge privacy: Safeguarding driver biometric data through local vector extraction under NDPR and GDPR",
    href: "#platform",
    imageSrc: "/safety-ojota.jpg",
  },
];

export default function NewsSection() {
  return (
    <section
      id="news"
      className="relative w-full bg-white px-6 md:px-10 lg:px-14 pb-28 md:pb-36 scroll-mt-20"
    >
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        className="mb-8 md:mb-12"
      >
        <h2 className="text-[34px] sm:text-[42px] md:text-[50px] font-semibold text-[#0B1528] tracking-[-0.03em] leading-[1.08]">
          Research &amp; Technical Briefings
        </h2>
      </motion.div>

      {/* Row 1: Two Large Featured News Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6 mb-5 lg:mb-6">
        {featuredNews.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              duration: 0.7,
              delay: idx * 0.1,
              ease: [0.25, 0.1, 0.25, 1],
            }}
          >
            <a href={item.href} className="group block">
              <div className="relative aspect-[16/10] sm:aspect-[16/9] rounded-2xl md:rounded-3xl overflow-hidden bg-[#0A0D14] shadow-sm">
                {item.imageSrc && (
                  <Image
                    src={item.imageSrc}
                    alt={item.headline}
                    fill
                    className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20 z-[1]" />

                <div className="absolute top-5 right-6 md:top-7 md:right-8 z-[2]">
                  <span className="font-serif tracking-widest text-[13px] md:text-[15px] font-bold text-white/90 drop-shadow-sm border border-white/20 px-2.5 py-1 rounded bg-black/30 backdrop-blur-xs">
                    {item.source}
                  </span>
                </div>

                <div className="absolute inset-x-0 bottom-0 z-[2] p-6 sm:p-8 md:p-9 flex flex-col justify-end">
                  <h3 className="text-[17px] sm:text-[20px] md:text-[22px] font-medium tracking-tight text-white leading-snug max-w-[480px]">
                    {item.headline}
                  </h3>

                  <div className="mt-4 flex items-center gap-1.5 text-[13px] font-medium text-white/80 group-hover:text-white transition-colors duration-200">
                    <span>Explore technical brief</span>
                    <ArrowRight
                      size={13}
                      weight="bold"
                      className="transition-transform duration-200 group-hover:translate-x-1"
                    />
                  </div>
                </div>
              </div>
            </a>
          </motion.div>
        ))}
      </div>

      {/* Row 2: Three Secondary News Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
        {secondaryNews.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              duration: 0.7,
              delay: idx * 0.1,
              ease: [0.25, 0.1, 0.25, 1],
            }}
          >
            <a href={item.href} className="group block">
              <div
                className={`relative aspect-[4/3] sm:aspect-[16/11] md:aspect-[4/3] rounded-2xl md:rounded-3xl overflow-hidden shadow-sm ${
                  item.isBrandCard
                    ? "bg-[#48121A] text-white"
                    : "bg-[#0A0D14]"
                }`}
              >
                {item.imageSrc && (
                  <Image
                    src={item.imageSrc}
                    alt={item.headline}
                    fill
                    className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                )}

                {!item.isBrandCard && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/25 z-[1]" />
                )}

                {item.isBrandCard && item.brandLockup && (
                  <div className="absolute inset-0 z-[2] flex flex-col justify-center px-6 sm:px-8 pb-20">
                    <div className="flex items-center gap-4">
                      <span className="text-[22px] sm:text-[24px] font-bold tracking-tight text-white/95 uppercase font-sans">
                        {item.brandLockup.left}
                      </span>
                      <div className="w-[1px] h-8 bg-white/30" />
                      <div className="flex items-center gap-2">
                        <AlertDriveGlyph />
                        <span className="text-[17px] font-semibold text-white/95">
                          {item.brandLockup.right}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="absolute top-5 right-6 z-[2]">
                  <span className="text-[11px] sm:text-[12px] font-mono tracking-wider font-semibold text-white/85 uppercase drop-shadow-sm border border-white/20 px-2 py-0.5 rounded bg-black/20 backdrop-blur-xs">
                    {item.source}
                  </span>
                </div>

                <div className="absolute inset-x-0 bottom-0 z-[2] p-5 sm:p-6 md:p-7 flex flex-col justify-end">
                  <h3 className="text-[15px] sm:text-[16px] md:text-[17px] font-medium tracking-tight text-white leading-snug">
                    {item.headline}
                  </h3>

                  <div className="mt-3 flex items-center gap-1.5 text-[12.5px] font-medium text-white/80 group-hover:text-white transition-colors duration-200">
                    <span>Read briefing</span>
                    <ArrowRight
                      size={12}
                      weight="bold"
                      className="transition-transform duration-200 group-hover:translate-x-1"
                    />
                  </div>
                </div>
              </div>
            </a>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function AlertDriveGlyph() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-white shrink-0"
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
      <circle cx="14" cy="14" r="7" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="14" cy="14" r="2.5" fill="currentColor" />
    </svg>
  );
}
