"use client";

import { useState } from "react";
import { Plus } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "motion/react";

interface AccordionItem {
  id: string;
  title: string;
  summary: string;
  metrics: { label: string; value: string }[];
}

const platformItems: AccordionItem[] = [
  {
    id: "facial-telemetry",
    title: "Adaptive Facial State Telemetry: Evaluating EAR and temporal PERCLOS",
    summary:
      "AlertDrive neural vision models analyze facial landmark vectors, eye aspect ratios (EAR), and head pose angles in real time. The system computes rolling temporal PERCLOS metrics, detecting cognitive fatigue and microsleep vulnerability before physical head nodding occurs.",
    metrics: [
      { label: "SAMPLING LATENCY", value: "<12ms" },
      { label: "FRAME EVALUATION", value: "60 FPS" },
      { label: "SAFETY SPEC", value: "UNECE DDAW" },
    ],
  },
  {
    id: "quantized-model",
    title: "Quantized Edge Model Architecture: 5.18 MB MobileNet for zero latency",
    summary:
      "Powered by an ultra-compact quantized MobileNet TFLite neural network running directly on local vehicle compute. Evaluates 224x224 RGB frames in sub-50ms with zero cloud roundtrip dependency, ensuring continuous safety monitoring across network dead zones.",
    metrics: [
      { label: "MODEL WEIGHT", value: "5.18 MB" },
      { label: "INPUT RESOLUTION", value: "224x224 RGB" },
      { label: "EDGE INFERENCE", value: "<50ms" },
    ],
  },
  {
    id: "offline-autonomy",
    title: "Mapless Offline Autonomy: Resilient tracking across rural corridors",
    summary:
      "All driver state inference runs directly on in-cabin hardware. AlertDrive operates with 100% autonomy along remote highway arteries without cellular network access, queueing compressed telemetry metrics locally for opportunistic cloud sync once fleet base is reached.",
    metrics: [
      { label: "OFFLINE OPERATION", value: "100%" },
      { label: "POWER DRAW", value: "4.8W" },
      { label: "TELEMETRY SYNC", value: "OPPORTUNISTIC" },
    ],
  },
  {
    id: "acoustic-intervention",
    title: "Acoustic & Visual Intervention: Dual-frequency fatigue alerts",
    summary:
      "When eyelid closure exceeds safety thresholds, the native Web Audio synthesizer triggers an immediate dual-frequency acoustic sweep (800Hz / 1200Hz) coupled with high-contrast cockpit visual flashing, halting micro-nodding events before vehicle drift occurs.",
    metrics: [
      { label: "TONE FREQUENCIES", value: "800 / 1200 Hz" },
      { label: "AUDIO LATENCY", value: "<5ms BUFFER" },
      { label: "ESCALATION TIERS", value: "3-STAGE" },
    ],
  },
  {
    id: "fleet-hardware",
    title: "Commercial Fleet Hardware: Automotive thermal and vibration tolerance",
    summary:
      "Built to industrial standards to withstand intense cabin heat and violent road vibrations across West African transit arteries. Featuring an operating range from -20°C to 70°C, vibration-dampened optical mounts, and REST/WebSocket hooks for dispatch telematics integration.",
    metrics: [
      { label: "OPERATING RANGE", value: "-20°C TO 70°C" },
      { label: "INGRESS RATING", value: "IP54 CABIN" },
      { label: "DISPATCH API", value: "REST / WEBSOCKET" },
    ],
  },
];

export default function PlatformAccordion() {
  const [openId, setOpenId] = useState<string | null>("facial-telemetry");

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="platform"
      className="relative w-full bg-white pt-20 md:pt-28 pb-20 md:pb-28 scroll-mt-20"
    >
      {/* Centered Display Title */}
      <div className="max-w-[1020px] mx-auto px-4 sm:px-6 mb-12 sm:mb-16 md:mb-20">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-[34px] sm:text-[46px] md:text-[54px] lg:text-[58px] font-semibold text-[#0B1528] tracking-[-0.03em] leading-[1.08] text-center"
        >
          The AlertDrive Vision Platform
        </motion.h2>
      </div>

      {/* Accordion List Container */}
      <div className="max-w-[1020px] mx-auto px-4 sm:px-6">
        <div className="border-t border-neutral-200">
          {platformItems.map((item) => {
            const isOpen = openId === item.id;

            return (
              <div
                key={item.id}
                className="border-b border-neutral-200 transition-colors"
              >
                <button
                  onClick={() => toggleItem(item.id)}
                  className="w-full py-6 sm:py-7 flex items-center justify-between gap-6 text-left cursor-pointer group select-none"
                  aria-expanded={isOpen}
                >
                  <span className="text-[17px] sm:text-[19px] md:text-[20px] font-medium text-[#0B1528] group-hover:text-black tracking-tight leading-snug">
                    {item.title}
                  </span>

                  <span
                    className={`shrink-0 text-neutral-800 transition-transform duration-300 ${
                      isOpen ? "rotate-45" : "rotate-0"
                    }`}
                  >
                    <Plus size={20} weight="bold" />
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pb-7 sm:pb-8 pt-1 max-w-[840px]">
                        <p className="text-[15px] sm:text-[16px] text-neutral-600 leading-relaxed font-normal">
                          {item.summary}
                        </p>

                        <div className="mt-5 pt-4 border-t border-neutral-100 grid grid-cols-3 gap-4">
                          {item.metrics.map((metric) => (
                            <div key={metric.label} className="flex flex-col">
                              <span className="text-[10px] font-mono text-neutral-400 tracking-wider uppercase">
                                {metric.label}
                              </span>
                              <span className="text-[13px] font-mono tabular-nums font-semibold text-[#0B1528] mt-0.5">
                                {metric.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
