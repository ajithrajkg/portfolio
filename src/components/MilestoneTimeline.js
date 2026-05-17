"use client";

import { motion } from "framer-motion";

const milestones = [
  {
    title: "Secureload Systems Private Limited",
    role: "Senior UI Developer",
    period: "August 2025 – Present",
    duration: "9 months",
    location: "Kochi, Kerala, India",
  },
  {
    title: "Gritstone Technologies",
    role: "Senior Engineering Lead - Front End",
    period: "20 Sep 2020 – June 2025",
    duration: "4 years and 10 months",
    location: "Kozhikodu, Kerala, India",
  },
  {
    title: "Majestic People Infotech",
    role: "Senior UI/UX Designer/Developer",
    period: "19 June 2017 – 6 October 2020",
    duration: "3 years and 4 months",
    location: "Coimbatore, Tamilnadu, India",
  },
  {
    title: "ADOL Media",
    role: "UI Designer/Developer",
    period: "5 December 2012 – 27 February 2016",
    duration: "3 years and 2 months",
    location: "Coimbatore, Tamilnadu, India",
  },
];

const containerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.2,
      duration: 1.4,
      ease: "easeOut",
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.95, ease: "easeOut" } },
};

export default function MilestoneTimeline() {
  return (
    <motion.section
      className="max-w-6xl mx-auto rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      <motion.div variants={itemVariants} className="mb-8">
        <p className="text-sm uppercase tracking-[0.3em] text-blue-600">Organizational Experience</p>
        <h2 className="mt-3 text-3xl font-semibold text-slate-900">Milestone Timeline</h2>
      </motion.div>

      <div className="space-y-8">
        {milestones.map((item, index) => (
          <motion.div key={item.title} variants={itemVariants} className="grid gap-4 lg:grid-cols-[auto_1fr] lg:items-start">
            <div className="flex flex-col items-center lg:items-start">
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white shadow-lg">
                {index + 1}
              </div>
              {index < milestones.length - 1 && <div className="h-full w-px bg-slate-200"></div>}
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-2 text-sm font-medium text-slate-700">{item.role}</p>
              <div className="mt-4 flex flex-col gap-2 text-sm text-slate-600 sm:flex-row sm:items-center sm:gap-6">
                <span>{item.period}</span>
                <span>• {item.duration}</span>
              </div>
              <p className="mt-4 text-sm text-slate-600">{item.location}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
