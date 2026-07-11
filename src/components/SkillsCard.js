"use client";

import { motion } from "framer-motion";
import {
  SiReact,
  SiAngular,
  SiNextdotjs,
  SiJavascript,
  SiTypescript,
  SiHtml5,
  SiCss,
  SiSass,
  SiTailwindcss,
  SiBootstrap,
  SiFigma,
  SiJquery,
  SiMaterialdesign,
  SiGooglechrome,
} from "react-icons/si";
import {
  FiCode,
  FiGlobe,
  FiImage,
  FiLayers,
  FiMonitor,
  FiPenTool,
  FiSearch,
  FiShield,
  FiSmartphone,
  FiZap,
} from "react-icons/fi";

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

const focusAreas = [
  {
    title: "Accessible UI",
    text: "Clean, responsive interfaces built for all users and devices.",
    icon: FiSmartphone,
  },
  {
    title: "Performance First",
    text: "Fast-loading experiences optimized for speed and reliability.",
    icon: FiZap,
  },
  {
    title: "Design Systems",
    text: "Reusable components and consistent visual language across products.",
    icon: FiLayers,
  },
];

const skillGroups = [
  {
    title: "Frontend",
    subtitle: "Hands-on experience",
    items: [
      { icon: SiReact, label: "React", color: "text-sky-600" },
      { icon: SiAngular, label: "Angular", color: "text-red-600" },
      { icon: SiNextdotjs, label: "Next.js", color: "text-slate-900" },
    ],
  },
  {
    title: "Languages",
    subtitle: "Core web technologies",
    items: [
      { icon: SiJavascript, label: "JavaScript", color: "text-yellow-500" },
      { icon: SiTypescript, label: "TypeScript", color: "text-sky-700" },
      { icon: FiCode, label: "JSON", color: "text-slate-700" },
      { icon: SiJquery, label: "jQuery", color: "text-blue-600" },
      { icon: SiHtml5, label: "HTML", color: "text-orange-500" },
      { icon: SiCss, label: "CSS", color: "text-blue-500" },
    ],
  },
  {
    title: "UI Libraries",
    subtitle: "Framework and styling tools",
    items: [
      { icon: SiMaterialdesign, label: "MUI", color: "text-sky-600" },
      { icon: FiLayers, label: "PrimeNG", color: "text-slate-700" },
      { icon: SiTailwindcss, label: "Tailwind", color: "text-sky-500" },
      { icon: SiBootstrap, label: "Bootstrap", color: "text-violet-600" },
      { icon: SiSass, label: "SCSS", color: "text-pink-600" },
    ],
  },
  {
    title: "Design & Tools",
    subtitle: "Creative workflow",
    items: [
      { icon: FiImage, label: "Photoshop", color: "text-sky-700" },
      { icon: SiFigma, label: "Figma", color: "text-pink-500" },
      { icon: FiPenTool, label: "Illustrator", color: "text-orange-500" },
      { icon: SiGooglechrome, label: "Chrome DevTools", color: "text-red-500" },
      { icon: FiSearch, label: "SEO", color: "text-slate-700" },
    ],
  },
  {
    title: "Quality & Delivery",
    subtitle: "Reliable implementation",
    items: [
      { icon: FiShield, label: "Production Ready", color: "text-emerald-600" },
      { icon: FiMonitor, label: "Responsive UI", color: "text-slate-700" },
      { icon: FiGlobe, label: "API Integration", color: "text-slate-700" },
      { icon: FiGlobe, label: "SSR / SSG", color: "text-slate-700" },
    ],
  },
];

export default function SkillsCard() {
  return (
    <motion.section
      className="w-full bg-[linear-gradient(135deg,_#f8fafc_0%,_#eef2ff_45%,_#f8fafc_100%)] py-24"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-start gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div
            variants={cardVariants}
            className="rounded-[24px] border border-slate-200 bg-white/90 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.08)] backdrop-blur-sm sm:p-10"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-slate-500">
              Skillset Overview
            </p>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
              Modern frontend expertise for polished, high-performing digital products
            </h2>
            <p className="mt-6 text-base leading-8 text-slate-600">
              I build responsive, accessible, and performance-focused interfaces with a strong emphasis on clean architecture, user experience, and scalable UI systems.
            </p>
            <p className="mt-4 text-base leading-8 text-slate-600">
              From component-driven applications to polished design systems, I create web experiences that feel intuitive, reliable, and business-ready.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {focusAreas.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 text-white shadow-md">
                      <Icon size={18} />
                    </div>
                    <h3 className="mt-3 text-base font-semibold text-slate-900">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
                  </div>
                );
              })}
            </div>
          </motion.div>

          <motion.div variants={cardVariants} className="space-y-4">
            {skillGroups.map((group) => (
              <div
                key={group.title}
                className="rounded-[20px] border border-slate-200 bg-white/90 p-5 shadow-[0_14px_45px_rgba(15,23,42,0.06)] backdrop-blur-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">{group.title}</h3>
                    <p className="text-sm text-slate-500">{group.subtitle}</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.label}
                        className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"
                      >
                        <Icon className={`shrink-0 ${item.color}`} size={16} />
                        <span>{item.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
