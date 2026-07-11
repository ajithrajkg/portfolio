"use client";

import {
  Building2,
  Calendar,
  Clock3,
  MapPin,
} from "lucide-react";
import { motion } from "framer-motion";

const milestones = [
  {
    title: "Secureload Systems Private Limited",
    role: "Senior UI Developer",
    period: "August 2025 – Present",
    duration: "9 Months",
    location: "Kochi, Kerala, India",
  },
  {
    title: "Gritstone Technologies",
    role: "Senior Engineering Lead - Front End",
    period: "Sep 2020 – June 2025",
    duration: "4 Years 10 Months",
    location: "Kozhikode, Kerala, India",
  },
  {
    title: "Majestic People Infotech",
    role: "Senior UI/UX Designer / Developer",
    period: "June 2017 – Oct 2020",
    duration: "3 Years 4 Months",
    location: "Coimbatore, Tamil Nadu",
  },
  {
    title: "ADOL Media",
    role: "UI Designer / Developer",
    period: "Dec 2012 – Feb 2016",
    duration: "3 Years 2 Months",
    location: "Coimbatore, Tamil Nadu",
  },
];

const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const item = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
    },
  },
};

export default function ExperienceTimeline() {
  return (
    <section className="bg-gradient-to-b from-slate-50 to-white py-20">
      <div className="mx-auto max-w-6xl px-6">

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-blue-600">
            Experience
          </p>

          <h2 className="mt-4 text-5xl font-bold text-slate-900">
            Career Timeline
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-slate-500">
            Over 10+ years of experience designing and developing modern,
            responsive web applications using Angular, React, Next.js,
            Tailwind CSS and enterprise UI frameworks.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative"
        >
          {/* Vertical Line */}

          <div className="absolute left-5 top-0 h-full w-[2px] bg-gradient-to-b from-blue-500 via-indigo-400 to-slate-200" />

          <div className="space-y-12">

            {milestones.map((job, index) => (

              <motion.div
                variants={item}
                key={index}
                className="relative flex gap-8"
              >

                {/* Timeline Dot */}

                <div className="relative z-10">

                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-sm font-bold text-white shadow-lg ring-8 ring-blue-50">
                    {index + 1}
                  </div>

                </div>

                {/* Card */}

                <motion.div
                  whileHover={{
                    y: -6,
                    transition: { duration: 0.25 },
                  }}
                  className="group flex-1 rounded-3xl border border-slate-200 bg-white/90 p-7 shadow-sm backdrop-blur-xl transition-all hover:border-blue-500 hover:shadow-xl"
                >

                  <div className="flex flex-wrap items-center justify-between gap-4">

                    <div>

                      <div className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                        Company #{index + 1}
                      </div>

                      <h3 className="mt-4 text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {job.title}
                      </h3>

                      <div className="mt-2 flex items-center gap-2 text-slate-600">

                        <Building2 size={18} />

                        <span className="font-medium">
                          {job.role}
                        </span>

                      </div>

                    </div>

                  </div>

                  <div className="mt-7 grid gap-4 md:grid-cols-3">

                    <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">

                      <Calendar
                        className="text-gray-400"
                        size={20}
                      />

                      <div>

                        <p className="text-xs uppercase text-slate-400">
                          Period
                        </p>

                        <p className="font-medium text-slate-700">
                          {job.period}
                        </p>

                      </div>

                    </div>

                    <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">

                      <Clock3
                        className="text-gray-400"
                        size={20}
                      />

                      <div>

                        <p className="text-xs uppercase text-slate-400">
                          Duration
                        </p>

                        <p className="font-medium text-slate-700">
                          {job.duration}
                        </p>

                      </div>

                    </div>

                    <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">

                      <MapPin
                        className="text-gray-400"
                        size={20}
                      />

                      <div>

                        <p className="text-xs uppercase text-slate-400">
                          Location
                        </p>

                        <p className="font-medium text-slate-700">
                          {job.location}
                        </p>

                      </div>

                    </div>

                  </div>

                </motion.div>

              </motion.div>

            ))}

          </div>
        </motion.div>

      </div>
    </section>
  );
}