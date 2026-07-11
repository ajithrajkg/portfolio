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

                  <p className="text-sm uppercase tracking-[0.32em] text-slate-500">UX/UI Design Summary</p>
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

<motion.div
  variants={cardVariants}
  whileHover={{ y: -5 }}
  className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:shadow-xl"
>
  <div className="mb-8 flex items-center justify-between">
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">
        Design Expertise
      </p>

      <h3 className="mt-2 text-3xl font-bold text-slate-900">
        Branding & Creative Skills
      </h3>
    </div>

    <div className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
      20+ Skills
    </div>
  </div>

  <div className="flex flex-wrap gap-3">
    {creativeSkills.map((skill) => (
      <motion.span
        key={skill}
        whileHover={{
          scale: 1.05,
          y: -2,
        }}
        className="cursor-default rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-blue-500 hover:bg-blue-600 hover:text-white"
      >
        {skill}
      </motion.span>
    ))}
  </div>

  <div className="mt-8 rounded-3xl border border-blue-100 bg-gradient-to-r from-blue-50 via-slate-50 to-white p-6">
    <div className="flex items-center gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-xl text-white">
        🎨
      </div>

      <div>
        <h4 className="text-lg font-semibold text-slate-900">
          Creative Passion
        </h4>
        <p className="text-sm text-slate-500">
          Art inspires my design thinking.
        </p>
      </div>
    </div>

    <p className="mt-5 leading-8 text-slate-700">
      Beyond UI development, I enjoy creating visual experiences through
      <span className="font-semibold text-slate-900"> Mural Painting</span>,
      <span className="font-semibold text-slate-900"> Oil Painting</span>,
      <span className="font-semibold text-slate-900"> Sketching</span>,
      <span className="font-semibold text-slate-900"> Concept Art</span>,
      <span className="font-semibold text-slate-900"> Digital Illustration</span>,
      and
      <span className="font-semibold text-slate-900"> Visual Storytelling</span>.
      These creative pursuits strengthen my ability to design intuitive,
      engaging, and visually appealing user experiences.
    </p>
  </div>
</motion.div>
      </div>
    </motion.section>
  );
}
