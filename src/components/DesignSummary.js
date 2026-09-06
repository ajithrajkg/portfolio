"use client";

import { motion } from "framer-motion";
import {
  FiLayers,
  FiPenTool,
  FiSearch,
  FiPenTool as FiSketch,
  FiFigma,
  FiImage,
  FiMonitor,
  FiZap,
  FiBox,
} from "react-icons/fi";
import { SiFigma, SiAdobe, SiOpenai } from "react-icons/si";

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.4, ease: "easeOut" } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const creativeSkills = [
  "Branding & Logo Creation",
  "Design Systems & UI Kits",
  "Visual Identity Design",
  "Wireframing & Prototyping",
  "User Interface (UI) Design",
  "User Experience (UX) Strategy",
  "Typography & Color Theory",
  "Creative Direction",
  "Mobile App Design",
  "Web & Landing Page Design",
  "Interactive Prototype Design",
  "AI-Assisted Design Workflows",
  "Social Media Creative Design",
  "Marketing & Promotional Creatives",
  "Iconography & Visual Assets",
  "Responsive Design Systems",
  "Design Thinking & User-Centered Design",
  "Pixel-Perfect UI Implementation",
  "Component-Based Design Systems",
  "Accessibility-Focused Design",
];

const tools = [
  { label: "UX Research", icon: FiSearch },
  { label: "Wireframing", icon: FiPenTool },
  { label: "Figma & Adobe XD", icon: SiFigma },
  { label: "Photoshop & Illustrator", icon: FiImage },
  { label: "Interaction Design", icon: FiMonitor },
  { label: "Responsive UI Design", icon: FiZap },
  { label: "Design Systems", icon: FiBox },
  { label: "AI-Assisted Workflows", icon: SiOpenai },
];

export default function DesignSummary() {
  return (
    <motion.section
      className="mx-auto mt-[50px] mb-20 max-w-6xl rounded-[28px] border border-slate-200 bg-[linear-gradient(135deg,_#f8fafc_0%,_#eef2ff_50%,_#f8fafc_100%)] p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-8 lg:p-10"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={sectionVariants}
    >
      <motion.div variants={cardVariants} className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.32em] text-slate-500">
          UX/UI Design Summary
        </p>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
          Creative UX/UI design with a strong visual eye and thoughtful, user-centered thinking
        </h2>
        <p className="mt-5 text-base leading-8 text-slate-600">
          I design intuitive, accessible, and visually compelling digital experiences that balance creativity with usability. My process blends research, storytelling, polished interface design, and modern AI-assisted workflows to create products that feel both elegant and effective.
        </p>
      </motion.div>

      <div className="mt-8 space-y-5">
        <motion.div
          variants={cardVariants}
          className="rounded-[24px] border border-slate-200 bg-white/90 p-6 shadow-[0_16px_45px_rgba(15,23,42,0.06)] backdrop-blur-sm"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 text-white shadow-lg">
              <FiLayers size={20} />
            </div>
            <div>
              <p className="text-xl font-semibold text-slate-900">UX Tools & Skills</p>
              <p className="text-sm text-slate-500">Creative workflow and design expertise</p>
            </div>
          </div>

          <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
            {tools.map((skill) => {
              const Icon = skill.icon;
              return (
                <div
                  key={skill.label}
                  className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-slate-700 shadow-sm">
                    <Icon size={16} />
                  </div>
                  <span className="text-sm font-medium text-slate-700">{skill.label}</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          variants={cardVariants}
          className="rounded-[24px] border border-slate-200 bg-white/90 p-6 shadow-[0_16px_45px_rgba(15,23,42,0.06)] backdrop-blur-sm"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">
                Design Expertise
              </p>
              <h3 className="mt-2 text-2xl font-semibold text-slate-900">
                Branding & Creative Skills
              </h3>
            </div>
            <div className="rounded-full bg-blue-100 px-3 py-1.5 text-sm font-semibold text-blue-700">
              20+ Skills
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {creativeSkills.map((skill) => (
              <motion.span
                key={skill}
                whileHover={{ scale: 1.03, y: -2 }}
                className="cursor-default rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-blue-500 hover:bg-blue-600 hover:text-white"
              >
                {skill}
              </motion.span>
            ))}
          </div>

          <div className="mt-6 rounded-[20px] border border-blue-100 bg-gradient-to-r from-blue-50 via-slate-50 to-white p-4.5">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 text-white shadow-lg">
                <FiPenTool size={20} />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-slate-900">Creative Passion</h4>
                <p className="text-sm text-slate-500">Art inspires my design thinking.</p>
              </div>
            </div>

            <p className="mt-4 text-sm leading-8 text-slate-700 sm:text-base">
              Beyond UI work, I enjoy creating visual experiences through mural painting, oil painting, sketching, concept art, digital illustration, and visual storytelling. These practices strengthen my ability to craft intuitive, engaging, and memorable user experiences.
            </p>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
