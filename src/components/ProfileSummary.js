"use client";

import { motion } from "framer-motion";
import {
  BriefcaseBusiness,
  Code2,
  Compass,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.14,
      duration: 1.4,
      ease: "easeOut",
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

const highlights = [
  {
    title: "Business impact",
    icon: BriefcaseBusiness,
    bullets: [
      "Scalable UI systems aligned to business goals",
      "Reliable delivery for enterprise workflows",
      "Clear product storytelling through interface design",
    ],
  },
  {
    title: "Technical strength",
    icon: Code2,
    bullets: [
      "Modern frontend development with React and Next.js",
      "Performance-first code and SEO-aware rendering",
      "Reusable component systems with maintainable architecture",
    ],
  },
  {
    title: "Team delivery",
    icon: Users,
    bullets: [
      "Smooth collaboration with design and backend teams",
      "Fast turnarounds for releases and critical fixes",
      "Readable, dependable codebases that scale over time",
    ],
  },
  {
    title: "User experience",
    icon: Sparkles,
    bullets: [
      "Accessible, responsive, and polished interfaces",
      "Strong visual hierarchy that improves engagement",
      "Product-focused UX with measurable business value",
    ],
  },
  {
    title: "Enterprise focus",
    icon: ShieldCheck,
    bullets: [
      "High-quality solutions for large-scale products",
      "Cross-browser reliability and performance tuning",
      "Production-ready implementation with strong standards",
    ],
  },
  {
    title: "Professional style",
    icon: Compass,
    bullets: [
      "Simple, elegant interfaces with a premium feel",
      "Consistent visual systems and careful craftsmanship",
      "Focused on clarity, usability, and long-term reliability",
    ],
  },
];

export default function ProfileSummary() {
  return (
    <motion.section
      id="professional-summary"
      className="relative overflow-hidden bg-[linear-gradient(135deg,_#f8fafc_0%,_#eef2ff_50%,_#f8fafc_100%)] px-6 py-24 sm:px-8 lg:px-10"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.14),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(139,92,246,0.14),_transparent_30%)]" />

      <div className="relative mx-auto max-w-6xl">
        <motion.div variants={cardVariants} className="mx-auto max-w-3xl text-center">
          <p className="inline-flex rounded-full border border-blue-200 bg-white/80 px-4 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-slate-600 shadow-sm">
            Professional Summary
          </p>
          <h2 className="mt-6 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            Building polished digital experiences with clarity, precision, and impact
          </h2>
          <p className="mx-auto mt-5 text-base leading-8 text-slate-600 sm:text-lg">
            I create modern, accessible, and high-performing frontend solutions that feel effortless to use and strong in business value.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {highlights.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                variants={cardVariants}
                className="rounded-2xl border border-slate-200 bg-white/85 p-6 shadow-[0_10px_40px_rgba(15,23,42,0.06)] backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_16px_50px_rgba(15,23,42,0.12)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 text-white shadow-lg">
                  <Icon size={20} />
                </div>
                <h3 className="mt-5 text-xl font-semibold text-slate-900">{item.title}</h3>
                <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
                  {item.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-500" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}
