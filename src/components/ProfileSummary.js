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
      className="max-w-5xl mx-auto bg-white p-10 my-16 shadow-[0_20px_50px_rgba(15,23,42,0.06)] rounded-[32px]"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
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
          <motion.div variants={cardVariants} className="rounded-[24px] border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Business impact</p>
            <ul className="mt-5 space-y-4 text-slate-700">
              <li>Scalable UI systems aligned to business goals</li>
              <li>Reliable delivery for enterprise workflows</li>
              <li>Clear product messaging through design</li>
            </ul>
          </motion.div>

          <motion.div variants={cardVariants} className="rounded-[24px] border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Technical strength</p>
            <ul className="mt-5 space-y-4 text-slate-700">
              <li>Modern frontend with React, Angular, and Next.js</li>
              <li>Performance-first code and SEO-aware markup</li>
              <li>Robust UI patterns with reusable components</li>
            </ul>
          </motion.div>

          <motion.div variants={cardVariants} className="rounded-[24px] border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Team delivery</p>
            <ul className="mt-5 space-y-4 text-slate-700">
              <li>Collaborates smoothly with design and backend teams</li>
              <li>Fast turnarounds on releases and hotfixes</li>
              <li>Maintains readable, maintainable codebases</li>
            </ul>
          </motion.div>

          <motion.div variants={cardVariants} className="rounded-[24px] border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">User experience</p>
            <ul className="mt-5 space-y-4 text-slate-700">
              <li>Accessible, responsive, and polished interfaces</li>
              <li>Strong visual hierarchy for better conversion</li>
              <li>Product-focused UX with real business value</li>
            </ul>
          </motion.div>

          <motion.div variants={cardVariants} className="rounded-[24px] border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Enterprise focus</p>
            <ul className="mt-5 space-y-4 text-slate-700">
              <li>High-quality solutions for large-scale projects</li>
              <li>Cross-browser compatibility and performance tuning</li>
              <li>Strong security and production readiness</li>
            </ul>
          </motion.div>

          <motion.div variants={cardVariants} className="rounded-[24px] border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Professional style</p>
            <ul className="mt-5 space-y-4 text-slate-700">
              <li>Simple, elegant interfaces with a polished feel</li>
              <li>Consistent visual systems and quality delivery</li>
              <li>Focused on clarity, usability, and reliability</li>
            </ul>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
