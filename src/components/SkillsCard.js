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
import { FiCode, FiSmartphone, FiSearch, FiLayers, FiGlobe, FiImage, FiPenTool } from "react-icons/fi";

const containerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.2,
      duration: 2,
      ease: "easeOut",
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: "easeOut" } },
};

export default function SkillsCard() {
  return (
    <motion.section
      className="w-full my-24 bg-[#f8fafb] py-20"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      <div className="container mx-auto px-6">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] items-start">
          <motion.div variants={cardVariants} className="rounded-[10px] border border-slate-200 bg-white p-8 shadow-[0_40px_80px_rgba(15,23,42,0.08)]">
            <span className="inline-flex rounded-full bg-indigo-100 px-4 py-2 text-sm font-semibold text-indigo-700">
              Skillset Overview
            </span>
            <h2 className="mt-6 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
              Modern frontend and design skills for polished digital experiences
            </h2>
            <p className="mt-6 text-base leading-8 text-slate-600">
              I build responsive, accessible, and performance-focused web interfaces using modern frontend technologies and scalable UI architectures. My experience includes developing component-based applications, creating reusable design systems, optimizing user experiences, and implementing SEO-friendly solutions for modern web platforms.
            </p>
            <p className="mt-6 text-base leading-8 text-slate-600">
              I specialize in crafting clean, visually polished interfaces with attention to responsiveness, accessibility, maintainability, and cross-browser compatibility. I enjoy transforming complex requirements into intuitive digital experiences using modern frameworks, UI libraries, and design tools.
            </p>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Highlights</p>
                <ul className="mt-4 space-y-3 text-slate-700">
                  <li>Fast, responsive UI architecture</li>
                  <li>Reusable component-driven workflows</li>
                  <li>Clean layout and visual hierarchy</li>
                  <li>Pixel-perfect interfaces</li>
                  <li>Reusable frontend components</li>
                </ul>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">CORE STRENGTHS</p>
                <ul className="mt-4 space-y-3 text-slate-700">
                  <li>Scalable UI development</li>
                  <li>Performance-focused design</li>
                  <li>Clean and maintainable code</li>
                  <li>nteractive user experiences</li>
                </ul>
              </div>
            </div>
          </motion.div>

          <motion.div variants={cardVariants} className="space-y-5">
            <motion.div variants={cardVariants} className="rounded-[10px] border border-slate-200 bg-white px-3 py-3 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">Frontend</h3>
                  <p className="text-[12px] text-slate-500">Hands on experience</p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-2 py-1 text-sm text-slate-700">
                  <SiReact className="rounded-full bg-white p-1 text-sky-600" size={18} />
                  <span>React</span>
                </div>
                <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-2 py-1 text-sm text-slate-700">
                  <SiAngular className="rounded-full bg-white p-1 text-red-600" size={18} />
                  <span>Angular</span>
                </div>
                <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-2 py-1 text-sm text-slate-700">
                  <SiNextdotjs className="rounded-full bg-white p-1 text-slate-900" size={18} />
                  <span>Next.js</span>
                </div>
              </div>
            </motion.div>

            <motion.div variants={cardVariants} className="rounded-[10px] border border-slate-200 bg-white px-3 py-3 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900">Languages</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-2 py-1 text-sm text-slate-700">
                  <SiJavascript className="rounded-full bg-white p-1 text-yellow-500" size={18} />
                  <span>JavaScript</span>
                </div>
                <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-2 py-1 text-sm text-slate-700">
                  <SiTypescript className="rounded-full bg-white p-1 text-sky-700" size={18} />
                  <span>TypeScript</span>
                </div>
                <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-2 py-1 text-sm text-slate-700">
                  <FiCode className="rounded-full bg-white p-1 text-slate-700" size={18} />
                  <span>JSON</span>
                </div>
                <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-2 py-1 text-sm text-slate-700">
                  <SiJquery className="rounded-full bg-white p-1 text-blue-600" size={18} />
                  <span>jQuery</span>
                </div>
                <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-2 py-1 text-sm text-slate-700">
                  <SiHtml5 className="rounded-full bg-white p-1 text-orange-500" size={18} />
                  <span>HTML</span>
                </div>
                <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-2 py-1 text-sm text-slate-700">
                  <SiCss className="rounded-full bg-white p-1 text-blue-500" size={18} />
                  <span>CSS</span>
                </div>
              </div>
            </motion.div>

            <motion.div variants={cardVariants} className="rounded-[10px] border border-slate-200 bg-white px-3 py-3 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900">Frameworks / UI Libraries</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-2 py-1 text-sm text-slate-700">
                  <SiHtml5 className="rounded-full bg-white p-1 text-orange-500" size={18} />
                  <span>Angular Material UI</span>
                </div>
                <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-2 py-1 text-sm text-slate-700">
                  <SiMaterialdesign className="rounded-full bg-white p-1 text-sky-600" size={18} />
                  <span>MUI (Material-UI)</span>
                </div>
                <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-2 py-1 text-sm text-slate-700">
                  <FiLayers className="rounded-full bg-white p-1 text-slate-700" size={18} />
                  <span>PrimeNG</span>
                </div>
              </div>
            </motion.div>

            <motion.div variants={cardVariants} className="rounded-[10px] border border-slate-200 bg-white px-3 py-3 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900">Web Development</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-2 py-1 text-sm text-slate-700">
                  <SiHtml5 className="rounded-full bg-white p-1 text-orange-500" size={18} />
                  <span>HTML5</span>
                </div>
                <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-2 py-1 text-sm text-slate-700">
                  <SiCss className="rounded-full bg-white p-1 text-blue-500" size={18} />
                  <span>CSS3</span>
                </div>
                <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-2 py-1 text-sm text-slate-700">
                  <SiSass className="rounded-full bg-white p-1 text-pink-600" size={18} />
                  <span>SASS / SCSS</span>
                </div>
                <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-2 py-1 text-sm text-slate-700">
                  <FiSmartphone className="rounded-full bg-white p-1 text-slate-700" size={18} />
                  <span>Responsive Design</span>
                </div>
                <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-2 py-1 text-sm text-slate-700">
                  <FiSearch className="rounded-full bg-white p-1 text-slate-700" size={18} />
                  <span>SEO</span>
                </div>
                <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-2 py-1 text-sm text-slate-700">
                  <SiTailwindcss className="rounded-full bg-white p-1 text-sky-500" size={18} />
                  <span>Tailwind CSS</span>
                </div>
                <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-2 py-1 text-sm text-slate-700">
                  <SiBootstrap className="rounded-full bg-white p-1 text-violet-600" size={18} />
                  <span>Bootstrap</span>
                </div>
                <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-2 py-1 text-sm text-slate-700">
                  <FiSmartphone className="rounded-full bg-white p-1 text-slate-700" size={18} />
                  <span>Mobile-First Design</span>
                </div>
                <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-2 py-1 text-sm text-slate-700">
                  <FiGlobe className="rounded-full bg-white p-1 text-slate-700" size={18} />
                  <span>Web Performance Optimization</span>
                </div>
                <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-2 py-1 text-sm text-slate-700">
                  <FiCode className="rounded-full bg-white p-1 text-slate-700" size={18} />
                  <span>Flexbox & Grid</span>
                </div>
                <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-2 py-1 text-sm text-slate-700">
                  <FiGlobe className="rounded-full bg-white p-1 text-slate-700" size={18} />
                  <span>REST API Integration</span>
                </div>
                <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-2 py-1 text-sm text-slate-700">
                  <FiGlobe className="rounded-full bg-white p-1 text-slate-700" size={18} />
                  <span>SSR / SSG</span>
                </div>
                <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-2 py-1 text-sm text-slate-700">
                  <FiGlobe className="rounded-full bg-white p-1 text-slate-700" size={18} />
                  <span>Responsive UI Development</span>
                </div>
                <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-2 py-1 text-sm text-slate-700">
                  <FiGlobe className="rounded-full bg-white p-1 text-slate-700" size={18} />
                  <span>Progressive Web Apps (PWA)</span>
                </div>
                <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-2 py-1 text-sm text-slate-700">
                  <FiLayers className="rounded-full bg-white p-1 text-slate-700" size={18} />
                  <span>Component-Based Architecture</span>
                </div>
              </div>
            </motion.div>

            <motion.div variants={cardVariants} className="rounded-[10px] border border-slate-200 bg-white px-3 py-3 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900">Graphic Design</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-2 py-1 text-sm text-slate-700">
                  <FiImage className="rounded-full bg-white p-1 text-sky-700" size={18} />
                  <span>Photoshop</span>
                </div>
                <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-2 py-1 text-sm text-slate-700">
                  <FiGlobe className="rounded-full bg-white p-1 text-slate-700" size={18} />
                  <span>Adobe XD</span>
                </div>
                <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-2 py-1 text-sm text-slate-700">
                  <SiFigma className="rounded-full bg-white p-1 text-pink-500" size={18} />
                  <span>Figma</span>
                </div>
                <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-2 py-1 text-sm text-slate-700">
                  <FiPenTool className="rounded-full bg-white p-1 text-orange-500" size={18} />
                  <span>Illustrator</span>
                </div>
              </div>
            </motion.div>

            <motion.div variants={cardVariants} className="rounded-[10px] border border-slate-200 bg-white px-3 py-3 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900">Debugging Tools</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-2 py-1 text-sm text-slate-700">
                  <FiGlobe className="rounded-full bg-white p-1 text-slate-700" size={18} />
                  <span>Firebug</span>
                </div>
                <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-2 py-1 text-sm text-slate-700">
                  <SiGooglechrome className="rounded-full bg-white p-1 text-red-500" size={18} />
                  <span>Chrome Developer</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
