"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";

interface FeatureTab {
  id: string;
  label: string;
  pill: string;
  description: string;
}

const features: FeatureTab[] = [
  {
    id: "edge-inference",
    label: "Quantized Edge Inference",
    pill: "Edge Inference",
    description:
      "A 5.18 MB MobileNet vision model executing sub-50ms inference locally in-cabin with zero cloud latency, operating uninterrupted across unlit corridors.",
  },
  {
    id: "perclos-tracking",
    label: "High-Frequency PERCLOS Tracking",
    pill: "PERCLOS Telemetry",
    description:
      "Continuous percentage of eyelid closure (PERCLOS) calculated over rolling temporal windows at 60 FPS, identifying cognitive fatigue and microsleep onset before physical head nodding occurs.",
  },
  {
    id: "universal-fleet",
    label: "Universal Fleet Fit",
    pill: "Universal Fleet Fit",
    description:
      "Direct compatibility with standard commercial dashcams, optical cabin clusters, and OEM infrared hardware across transit vans, coaches, and heavy haulers.",
  },
  {
    id: "active-intervention",
    label: "Acoustic Intervention Protocols",
    pill: "Instant Warning Sweep",
    description:
      "Dual-frequency synthesized audio warnings (800Hz / 1200Hz) and visual cockpit alert escalation triggered immediately upon confirmed drowsiness classification.",
  },
];

export default function FeatureShowcase() {
  const [activeIndex, setActiveIndex] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % features.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [activeIndex]);

  return (
    <section
      id="features"
      className="relative w-full bg-white pb-20 md:pb-28 scroll-mt-20"
    >
      {/* Sleek Panoramic Letterbox Band */}
      <div className="relative w-full h-[400px] sm:h-[440px] md:h-[480px] lg:h-[500px] overflow-hidden bg-[#0A0D14]">
        {/* Real-World African Commercial Driver Photograph */}
        <div className="absolute inset-0">
          <Image
            src="/driver-nigeria.jpg"
            alt="Commercial fleet driver in Lagos Nigeria with AlertDrive in-cabin optical monitoring"
            fill
            priority
            className="object-cover object-[center_30%] scale-[1.01]"
            sizes="100vw"
          />

          {/* High-contrast scrim on left for crystal-clear text readability over image */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-transparent w-full md:w-[60%] z-[1]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 z-[1]" />
        </div>

        {/* Interactive Feature Controls (Left Side Overlay - 100% Wayve Geometry) */}
        <div className="relative z-10 h-full flex items-center px-6 sm:px-10 md:px-14 lg:px-20">
          <div className="flex items-start gap-4 sm:gap-6 max-w-[420px]">
            {/* Vertical Pill Progress Indicator Track */}
            <div className="relative w-[3px] self-stretch my-2 bg-white/20 rounded-full overflow-hidden shrink-0">
              <motion.div
                className="absolute w-full bg-white rounded-full"
                initial={false}
                animate={{
                  top: `${(activeIndex / features.length) * 100}%`,
                  height: `${100 / features.length}%`,
                }}
                transition={{ type: "spring", stiffness: 350, damping: 35 }}
              />
            </div>

            {/* Feature Tabs List */}
            <div className="flex flex-col gap-3.5 sm:gap-4 py-1">
              {features.map((item, index) => {
                const isActive = index === activeIndex;

                return (
                  <div key={item.id} className="relative">
                    {isActive ? (
                      <motion.div
                        layout
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="flex flex-col items-start"
                      >
                        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/25 text-white text-[13px] md:text-[14px] font-medium tracking-tight shadow-sm select-none">
                          {item.pill}
                        </div>

                        <p className="mt-2.5 text-white/90 text-[13.5px] sm:text-[14.5px] leading-relaxed font-normal max-w-[330px]">
                          {item.description}
                        </p>
                      </motion.div>
                    ) : (
                      <button
                        onClick={() => setActiveIndex(index)}
                        className="group flex items-center gap-3.5 text-left text-white/55 hover:text-white transition-colors duration-200 cursor-pointer select-none py-0.5"
                      >
                        <span className="relative flex items-center justify-center w-3.5 h-3.5 rounded-full border border-white/40 group-hover:border-white transition-colors duration-200 shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-white/60 group-hover:bg-white transition-colors duration-200" />
                        </span>

                        <span className="text-[14.5px] sm:text-[15.5px] font-medium tracking-tight">
                          {item.label}
                        </span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
