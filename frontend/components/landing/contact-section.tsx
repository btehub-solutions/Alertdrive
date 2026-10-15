"use client";

import Image from "next/image";
import { motion } from "motion/react";

export default function ContactSection() {
  return (
    <section
      id="contact"
      className="relative w-full bg-gradient-to-r from-[#E5E9F4] via-[#ECEFF7] to-[#FDEEEA] pt-16 md:pt-24 pb-20 md:pb-28 scroll-mt-20"
    >
      {/* Top Header: Get in touch */}
      <div className="max-w-[1020px] mx-auto px-4 sm:px-6 mb-10 md:mb-14">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-baseline"
        >
          <div className="md:col-span-5 lg:col-span-4">
            <h2 className="text-[28px] sm:text-[34px] md:text-[38px] font-semibold text-[#0B1528] tracking-[-0.03em] leading-tight">
              Get in touch
            </h2>
          </div>

          <div className="md:col-span-7 lg:col-span-8 max-w-[500px]">
            <p className="text-[16px] sm:text-[18px] md:text-[19px] font-light text-neutral-600 leading-relaxed">
              We&apos;re here to help commercial fleets and transport operators.
              If you have operational questions or trial requests, we want to hear from you.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Compacted, Smart & Fitted Checkerboard Card Monolith */}
      <div className="max-w-[1020px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 shadow-[0_2px_24px_rgba(0,0,0,0.04)] overflow-hidden">
          
          {/* ================= ROW 1: General Inquiries ================= */}
          <div className="relative h-[240px] sm:h-[280px] md:h-[310px] bg-neutral-900 overflow-hidden">
            <Image
              src="/driver-cab.jpg"
              alt="AlertDrive fleet operator and commercial transit"
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 500px"
            />
          </div>

          <div className="bg-white h-[240px] sm:h-[280px] md:h-[310px] px-8 sm:px-10 md:px-12 py-6 sm:py-8 flex flex-col justify-center">
            <h3 className="text-[22px] sm:text-[25px] md:text-[27px] font-semibold text-[#0B1528] tracking-tight leading-tight">
              General inquiries
            </h3>

            <div className="w-[200px] sm:w-[240px] max-w-full h-[1.5px] bg-[#62CBE4] my-3 sm:my-3.5" />

            <p className="text-[13.5px] sm:text-[14px] text-neutral-500 leading-normal mb-3 font-normal">
              Have a question, or looking to deploy AlertDrive across your fleet?
            </p>

            <div className="flex flex-col gap-1 text-[14px] sm:text-[14.5px]">
              <a
                href="mailto:hello@alertdrive.ai"
                className="text-[#485098] hover:underline font-medium transition-colors"
              >
                hello@alertdrive.ai
              </a>
              <span className="text-[#485098] font-medium font-mono text-[13.5px]">
                +234 1 888 2390
              </span>
            </div>
          </div>

          {/* ================= ROW 2: Press and Media ================= */}
          <div className="bg-white h-[240px] sm:h-[280px] md:h-[310px] px-8 sm:px-10 md:px-12 py-6 sm:py-8 flex flex-col justify-center order-2 md:order-1">
            <h3 className="text-[22px] sm:text-[25px] md:text-[27px] font-semibold text-[#0B1528] tracking-tight leading-tight">
              Press and media
            </h3>

            <div className="w-[200px] sm:w-[240px] max-w-full h-[1.5px] bg-[#62CBE4] my-3 sm:my-3.5" />

            <p className="text-[13.5px] sm:text-[14px] text-neutral-500 leading-normal mb-3 font-normal max-w-[320px]">
              Need technical commentary on road safety or to speak to our engineering team.
            </p>

            <div className="flex flex-col gap-1 text-[14px] sm:text-[14.5px]">
              <a
                href="mailto:media@alertdrive.ai"
                className="text-[#485098] hover:underline font-medium transition-colors"
              >
                media@alertdrive.ai
              </a>
            </div>
          </div>

          <div className="relative h-[240px] sm:h-[280px] md:h-[310px] bg-neutral-900 overflow-hidden order-1 md:order-2">
            <Image
              src="/card-deploy.jpg"
              alt="AlertDrive in-cabin optical sensor engineering and calibration"
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 500px"
            />
          </div>

          {/* ================= ROW 3: Partnerships ================= */}
          <div className="relative h-[240px] sm:h-[280px] md:h-[310px] bg-neutral-900 overflow-hidden order-3">
            <Image
              src="/card-monitor.jpg"
              alt="AlertDrive fleet operations room and partner collaboration"
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 500px"
            />
          </div>

          <div className="bg-white h-[240px] sm:h-[280px] md:h-[310px] px-8 sm:px-10 md:px-12 py-6 sm:py-8 flex flex-col justify-center order-4">
            <h3 className="text-[22px] sm:text-[25px] md:text-[27px] font-semibold text-[#0B1528] tracking-tight leading-tight">
              Partnerships
            </h3>

            <div className="w-[200px] sm:w-[240px] max-w-full h-[1.5px] bg-[#62CBE4] my-3 sm:my-3.5" />

            <p className="text-[13.5px] sm:text-[14px] text-neutral-500 leading-normal mb-3 font-normal max-w-[320px]">
              Interested in integrating AlertDrive with your telematics platform or fleet software?
            </p>

            <div className="flex flex-col gap-1 text-[14px] sm:text-[14.5px]">
              <a
                href="mailto:partners@alertdrive.ai"
                className="text-[#485098] hover:underline font-medium transition-colors"
              >
                partners@alertdrive.ai
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
