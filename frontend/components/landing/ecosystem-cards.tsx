"use client";

import Image from "next/image";
import { ArrowRight } from "@phosphor-icons/react";
import { motion } from "motion/react";

interface CardItem {
  id: string;
  title: string;
  description: string;
  ctaText: string;
  ctaHref: string;
  imageSrc: string;
  imageAlt: string;
}

const cards: CardItem[] = [
  {
    id: "safety",
    title: "Fatigue Prevention",
    description:
      "A proactive approach that addresses driver exhaustion through the lens of continuous edge intelligence, eyelid closure analysis, and sub-12ms PERCLOS computation.",
    ctaText: "View Architecture",
    ctaHref: "#platform",
    imageSrc: "/safety-ojota.jpg",
    imageAlt: "Expressway and pedestrian transit corridor in Lagos Nigeria",
  },
  {
    id: "corridors",
    title: "African Corridors",
    description:
      "Telemetry benchmarking across high-density haulage routes: Lagos-Ibadan Expressway, Benin-Ore corridor, and trans-African freight arteries.",
    ctaText: "Corridor Data",
    ctaHref: "#corridors",
    imageSrc: "/corridor-lagos.jpg",
    imageAlt: "Jubilee Bridge expressway corridor in Lagos Nigeria",
  },
  {
    id: "fleet-integration",
    title: "Fleet Operations",
    description:
      "Collaborating with commercial haulage operators, logistics dispatch platforms, and safety regulators to deploy alertness intelligence at scale.",
    ctaText: "Fleet Inquiries",
    ctaHref: "#contact",
    imageSrc: "/driver-cab.jpg",
    imageAlt: "Commercial transport operator in Lagos Nigeria",
  },
];

const partners = [
  { name: "GEOTAB AFRICA", sub: "TELEMATICS" },
  { name: "SAMSARA", sub: "CONNECTED FLEETS" },
  { name: "BOSCH", sub: "MOBILITY SOLUTIONS" },
  { name: "KOBO360", sub: "GLOBAL LOGISTICS" },
  { name: "LAMATA", sub: "TRANSIT AUTHORITY" },
  { name: "NVIDIA", sub: "INCEPTION" },
];

export default function EcosystemCards() {
  return (
    <section id="corridors" className="relative w-full bg-white pt-12 md:pt-16 pb-24 md:pb-36 scroll-mt-20">
      {/* Part 1: 3-Column Card Grid */}
      <div className="px-6 md:px-10 lg:px-14 pb-24 md:pb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
          {cards.map((card, idx) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.7,
                delay: idx * 0.12,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              <a href={card.ctaHref} className="group block">
                <div className="relative aspect-[4/5] sm:aspect-[3/4] md:aspect-[2/3] lg:aspect-[3/4] rounded-2xl lg:rounded-3xl overflow-hidden bg-[#0A0D14] shadow-sm">
                  <Image
                    src={card.imageSrc}
                    alt={card.imageAlt}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />

                  <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/30 to-black/75 z-[1]" />

                  <div className="absolute inset-0 z-[2] flex flex-col justify-start p-7 md:p-8 lg:p-9">
                    <h3 className="text-[26px] sm:text-[28px] lg:text-[32px] font-semibold tracking-[-0.025em] text-white leading-[1.15]">
                      {card.title}
                    </h3>

                    <p className="mt-3.5 text-[14px] sm:text-[14.5px] leading-relaxed text-white/80 max-w-[320px] font-normal">
                      {card.description}
                    </p>

                    <div className="mt-6">
                      <span className="inline-flex items-center gap-2 text-[13px] font-medium text-white border border-white/35 bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-full transition-all duration-200 group-hover:bg-white/20 group-hover:border-white/60">
                        {card.ctaText}
                        <ArrowRight
                          size={14}
                          weight="bold"
                          className="transition-transform duration-200 group-hover:translate-x-1"
                        />
                      </span>
                    </div>
                  </div>
                </div>
              </a>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Part 2: Ecosystem & Telematics Partners */}
      <div id="ecosystem" className="px-6 md:px-10 lg:px-14 scroll-mt-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="max-w-[760px]"
        >
          <h2 className="text-[34px] sm:text-[42px] md:text-[48px] font-semibold text-[#0B1528] tracking-[-0.03em] leading-[1.1]">
            Interoperability &amp; Fleet Ecosystem
          </h2>

          <p className="mt-4 text-[16px] sm:text-[17px] md:text-[18px] text-neutral-600 leading-relaxed font-normal">
            Engineered for direct interoperability with leading commercial telematics platforms,
            vehicle bus architectures (CAN bus / J1939), and transit authorities across African
            commercial freight arteries.
          </p>

          <div className="mt-7">
            <a
              href="#contact"
              className="inline-flex items-center gap-2.5 bg-[#0B1528] hover:bg-[#16253E] text-white px-6 py-3 rounded-full text-[13px] font-medium transition-all duration-200 group shadow-sm active:scale-[0.98]"
            >
              Contact Fleet Team
              <ArrowRight
                size={14}
                weight="bold"
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </a>
          </div>
        </motion.div>

        {/* Monochrome Technical Partner Emblems */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-16 md:mt-20 pt-10 border-t border-black/[0.08]"
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-between">
            {partners.map((partner) => (
              <div
                key={partner.name}
                className="flex flex-col items-center sm:items-start opacity-60 hover:opacity-100 transition-opacity duration-200 cursor-default select-none"
              >
                <span className="text-[17px] sm:text-[19px] font-bold tracking-tight text-[#0B1528] font-sans">
                  {partner.name}
                </span>
                <span className="text-[9.5px] font-mono tracking-widest text-neutral-400 uppercase mt-0.5">
                  {partner.sub}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
