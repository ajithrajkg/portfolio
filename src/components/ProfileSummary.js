"use client";

import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.24,
      duration: 2.2,
      ease: "easeOut",
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.95, ease: "easeOut" } },
};

export default function ProfileSummary() {
  return (
    <motion.section
      id="professional-summary"
      className="mx-auto scroll-mt-24 bg-[#edecec] p-[100px]"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      <div className="max-w-5xl mx-auto">

     
      <div className="space-y-10">
        <motion.div variants={cardVariants} className="text-center">
          <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Professional Summary</p>
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            Reliable frontend leadership for enterprise-grade digital products
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-slate-600">
            Experienced frontend developer with a strong record of delivering modern, accessible, and polished web applications. I focus on clean architecture, performance, and user-first design, especially in enterprise and collaborative environments.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <motion.div variants={cardVariants} className="rounded-[10px] border border-slate-200 bg-slate-50 p-6 ">
            <p className="text-[20px] font-semibold  text-[#383838]">Business impact</p>
            <ul className="mt-5 space-y-4 text-slate-700">
              <li className="text-[#71717a]">Scalable UI systems aligned to business goals</li>
              <li className="text-[#71717a]">Reliable delivery for enterprise workflows</li>
              <li className="text-[#71717a]">Clear product messaging through design</li>
            </ul>
          </motion.div>

          <motion.div variants={cardVariants} className="rounded-[10px] border border-slate-200 bg-slate-50 p-6 ">
            <p className="text-[20px] font-semibold  text-[#383838]">Technical strength</p>
            <ul className="mt-5 space-y-4 text-slate-700">
              <li className="text-[#71717a]">Modern frontend with React, Angular, and Next.js</li>
              <li className="text-[#71717a]">Performance-first code and SEO-aware markup</li>
              <li className="text-[#71717a]">Robust UI patterns with reusable components</li>
            </ul>
          </motion.div>

          <motion.div variants={cardVariants} className="rounded-[10px] border border-slate-200 bg-slate-50 p-6 ">
            <p className="text-[20px] font-semibold  text-[#383838]">Team delivery</p>
            <ul className="mt-5 space-y-4 text-slate-700">
              <li className="text-[#71717a]">Collaborates smoothly with design and backend teams</li>
              <li className="text-[#71717a]">Fast turnarounds on releases and hotfixes</li>
              <li className="text-[#71717a]">Maintains readable, maintainable codebases</li>
            </ul>
          </motion.div>

          <motion.div variants={cardVariants} className="rounded-[10px] border border-slate-200 bg-slate-50 p-6 ">
            <p className="text-[20px] font-semibold  text-[#383838]">User experience</p>
            <ul className="mt-5 space-y-4 text-slate-700">
              <li className="text-[#71717a]">Accessible, responsive, and polished interfaces</li>
              <li className="text-[#71717a]">Strong visual hierarchy for better conversion</li>
              <li className="text-[#71717a]">Product-focused UX with real business value</li>
            </ul>
          </motion.div>

          <motion.div variants={cardVariants} className="rounded-[10px] border border-slate-200 bg-slate-50 p-6 ">
            <p className="text-[20px] font-semibold  text-[#383838]">Enterprise focus</p>
            <ul className="mt-5 space-y-4 text-slate-700">
              <li className="text-[#71717a]">High-quality solutions for large-scale projects</li>
              <li className="text-[#71717a]">Cross-browser compatibility and performance tuning</li>
              <li className="text-[#71717a]">Strong security and production readiness</li>
            </ul>
          </motion.div>

          <motion.div variants={cardVariants} className="rounded-[10px] border border-slate-200 bg-slate-50 p-6">
            <p className="text-[20px] font-semibold  text-[#383838]">Professional style</p>
            <ul className="mt-5 space-y-4 text-slate-700">
              <li className="text-[#71717a]">Simple, elegant interfaces with a polished feel</li>
              <li className="text-[#71717a]">Consistent visual systems and quality delivery</li>
              <li className="text-[#71717a]">Focused on clarity, usability, and reliability</li>
            </ul>
          </motion.div>
        </div>
      </div>
 </div>
    </motion.section>
  );
}
