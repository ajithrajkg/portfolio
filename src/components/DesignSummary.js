"use client";

import { motion } from "framer-motion";

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.6, ease: "easeOut" } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.1, ease: "easeOut" } },
};

export default function DesignSummary() {
  return (
    <motion.section
      className="max-w-6xl mx-auto rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-sm mb-[100px]"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={sectionVariants}
    >
      <motion.div variants={cardVariants} className="mb-8">
        <p className="text-sm uppercase tracking-[0.3em] text-blue-600">UX/UI Design Summary</p>
        <h2 className="mt-3 text-3xl font-semibold text-slate-900">Creative UX/UI Designer with strong visual experience and AI-driven design workflows</h2>
        <p className="mt-4 text-base leading-8 text-slate-700">
          Creative and detail-oriented UX/UI Designer with a strong foundation in user-centered design principles, specializing in creating intuitive, engaging, and accessible digital experiences. Skilled in designing interactive mockups, product UI/UX workflows, and responsive web layouts using modern design tools like Figma, Adobe XD, and Photoshop. Experienced in leveraging AI-powered design workflows and modern creative tools to accelerate ideation, generate design concepts, improve user experience decisions, and streamline prototyping for faster and smarter product development.
        </p>
      </motion.div>

      <div className="grid gap-6 ">
<motion.div
  variants={cardVariants}
  className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-lg"
>

  <div className="" />

  <div className="mb-6 flex items-center justify-between">
    <div>
      <p className="text-2xl font-bold text-slate-900">
        UX Tools & Skills
      </p>
      <p className="mt-1 text-sm text-slate-500">
        Creative workflow & design expertise
      </p>
    </div>

  </div>

  {/* Skills Grid */}
  <div className="grid gap-4 sm:grid-cols-2">
    {[
      "UX Research",
      "Wireframing",
      "Figma & Adobe XD",
      "Photoshop & Illustrator",
      "Interaction Design",
      "Responsive UI Design",
      "Design Systems",
      "AI-Assisted Workflows",
    ].map((skill, index) => (
      <motion.div
        key={index}
        whileHover={{ scale: 1.03 }}
        className="group flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 transition-all duration-300 hover:border-blue-200 hover:bg-blue-50"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
          <div className="h-3 w-3 rounded-full bg-blue-600 group-hover:scale-125 transition-transform" />
        </div>

        <span className="text-sm font-medium text-slate-700">
          {skill}
        </span>
      </motion.div>
    ))}
  </div>
</motion.div>

<motion.div variants={cardVariants} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
  <p className="mb-4 text-xl font-semibold text-slate-900">
    Branding & Creative Skills
  </p>

  <div className="flex flex-wrap gap-4 text-slate-700">
    <span className="rounded-full bg-slate-100 px-3 py-2 text-sm">
      Branding & Logo Creation
    </span>

    <span className="rounded-full bg-slate-100 px-3 py-2 text-sm">
      Design Systems & UI Kits
    </span>

    <span className="rounded-full bg-slate-100 px-3 py-2 text-sm">
      Visual Identity Design
    </span>

    <span className="rounded-full bg-slate-100 px-3 py-2 text-sm">
      Wireframing & Prototyping
    </span>

    <span className="rounded-full bg-slate-100 px-3 py-2 text-sm">
      User Interface (UI) Design
    </span>

    <span className="rounded-full bg-slate-100 px-3 py-2 text-sm">
      User Experience (UX) Strategy
    </span>

    <span className="rounded-full bg-slate-100 px-3 py-2 text-sm">
      Typography & Color Theory
    </span>

    <span className="rounded-full bg-slate-100 px-3 py-2 text-sm">
      Creative Direction
    </span>

    <span className="rounded-full bg-slate-100 px-3 py-2 text-sm">
      Mobile App Design
    </span>

    <span className="rounded-full bg-slate-100 px-3 py-2 text-sm">
      Web & Landing Page Design
    </span>

    <span className="rounded-full bg-slate-100 px-3 py-2 text-sm">
      Interactive Prototype Design
    </span>

    <span className="rounded-full bg-slate-100 px-3 py-2 text-sm">
      AI-Assisted Design Workflows
    </span>

    <span className="rounded-full bg-slate-100 px-3 py-2 text-sm">
      Social Media Creative Design
    </span>

    <span className="rounded-full bg-slate-100 px-3 py-2 text-sm">
      Marketing & Promotional Creatives
    </span>

    <span className="rounded-full bg-slate-100 px-3 py-2 text-sm">
      Iconography & Visual Assets
    </span>

    <span className="rounded-full bg-slate-100 px-3 py-2 text-sm">
      Responsive Design Systems
    </span>

    <span className="rounded-full bg-slate-100 px-3 py-2 text-sm">
      Design Thinking & User-Centered Design
    </span>

    <span className="rounded-full bg-slate-100 px-3 py-2 text-sm">
      Pixel-Perfect UI Implementation
    </span>

    <span className="rounded-full bg-slate-100 px-3 py-2 text-sm">
      Component-Based Design Systems
    </span>

    <span className="rounded-full bg-slate-100 px-3 py-2 text-sm">
      Accessibility-Focused Design
    </span>
  </div>

  <div className="mt-6 rounded-3xl bg-slate-50 p-5">
    <p className="text-sm font-semibold text-slate-900">
      Creative Skills
    </p>

    <p className="mt-3 text-sm leading-7 text-slate-700">
      Mural Painting, Oil Painting, Sketching, Concept Art,
      Digital Illustration, Visual Storytelling & Creative Exploration
    </p>
  </div>
</motion.div>
      </div>
    </motion.section>
  );
}
