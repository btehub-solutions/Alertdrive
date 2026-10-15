"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CaretUp } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "motion/react";

export default function Mission() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="relative bg-white">
      {/* Mission Statement Block */}
      <div className="px-6 md:px-10 lg:px-14 pt-20 md:pt-28 lg:pt-36 pb-16 md:pb-24 lg:pb-28">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{
            duration: 0.8,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="max-w-[760px] font-normal tracking-[-0.025em] text-[28px] sm:text-[34px] md:text-[40px] lg:text-[44px] leading-[1.22] select-none"
        >
          <div className="text-[#1C365D] font-medium">AlertDrive is building an</div>
          <div className="text-[#356290]">edge-native driver state</div>
          <div className="text-[#5E84AA]">intelligence that learns</div>
          <div>
            <span className="text-[#A66F96] font-medium">from</span>{" "}
            <span className="text-[#B4B8C2]">data to prevent fatigue,</span>
          </div>
          <div className="text-[#C6CAD2]">microsleeps, and transit</div>
          <div className="text-[#D4D7DE]">collisions across Africa.</div>
        </motion.div>
      </div>

      {/* Feature Cards Grid (Two Direct Paths: Explore Platform or Launch Demo) */}
      <div className="px-6 md:px-10 lg:px-14 pb-20 md:pb-28 lg:pb-36">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Card 1: Edge Vision Telemetry */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{
              duration: 0.7,
              ease: [0.25, 0.1, 0.25, 1],
            }}
          >
            <a href="#platform" className="group block">
              <div className="relative aspect-[4/5] md:aspect-[3/4] rounded-xl overflow-hidden bg-[#0A0D14]">
                <Image
                  src="/card-deploy.jpg"
                  alt="In-cabin driver monitoring camera sensor module"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />

                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/60 z-[1]" />

                <div className="absolute inset-0 z-[2] flex flex-col justify-between p-7 md:p-9">
                  <div>
                    <h3 className="text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.1] tracking-[-0.02em] font-light text-white">
                      Edge Vision Telemetry
                    </h3>
                    <p className="mt-3 text-[14px] leading-relaxed text-white/80 max-w-[340px]">
                      Explore our quantized MobileNet architecture, off-screen canvas processing, and high-frequency PERCLOS temporal analysis pipeline.
                    </p>
                  </div>

                  <div>
                    <span className="inline-flex items-center gap-2.5 text-[13px] font-medium text-[#08090C] bg-white hover:bg-white/90 pl-5 pr-4 py-2.5 rounded-full transition-all duration-200 group-hover:shadow-lg">
                      Explore Platform
                      <ArrowRight
                        size={14}
                        weight="bold"
                        className="transition-transform duration-200 group-hover:translate-x-0.5"
                      />
                    </span>
                  </div>
                </div>
              </div>
            </a>
          </motion.div>

          {/* Card 2: Live Driver Cockpit (Leads to Demo Page) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{
              duration: 0.7,
              delay: 0.1,
              ease: [0.25, 0.1, 0.25, 1],
            }}
          >
            <Link href="/demo" className="group block">
              <div className="relative aspect-[4/5] md:aspect-[3/4] rounded-xl overflow-hidden bg-[#0A0D14]">
                <Image
                  src="/card-monitor.jpg"
                  alt="Fleet operations manager testing driver telemetry demo"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />

                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/60 z-[1]" />

                <div className="absolute inset-0 z-[2] flex flex-col justify-between p-7 md:p-9">
                  <div>
                    <h3 className="text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.1] tracking-[-0.02em] font-light text-white">
                      Live Driver Cockpit
                    </h3>
                    <p className="mt-3 text-[14px] leading-relaxed text-white/80 max-w-[340px]">
                      Test the localized vision model with your camera. Experience real-time PERCLOS computation and audio-visual fatigue escalation.
                    </p>
                  </div>

                  <div>
                    <span className="inline-flex items-center gap-2.5 text-[13px] font-medium text-[#08090C] bg-white hover:bg-white/90 pl-5 pr-4 py-2.5 rounded-full transition-all duration-200 group-hover:shadow-lg">
                      Launch Live Demo
                      <ArrowRight
                        size={14}
                        weight="bold"
                        className="transition-transform duration-200 group-hover:translate-x-0.5"
                      />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Floating Back to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            onClick={scrollToTop}
            aria-label="Back to top"
            className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-40 w-11 h-11 md:w-12 md:h-12 rounded-full border border-black/10 bg-white/90 backdrop-blur-md shadow-sm hover:shadow-md flex items-center justify-center text-[#101218] hover:bg-neutral-50 transition-all duration-200 active:scale-95 cursor-pointer"
          >
            <CaretUp size={18} weight="bold" />
          </motion.button>
        )}
      </AnimatePresence>
    </section>
  );
}
