import Image from "next/image";

const strengths = [
  {
    title: "Frontend craft",
    text: "I build responsive interfaces with React, Next.js, JavaScript, and modern CSS, keeping the code clean and maintainable.",
  },
  {
    title: "Design thinking",
    text: "I care about visual hierarchy, accessibility, and the small details that make digital products feel clear and natural to use.",
  },
  {
    title: "Reliable delivery",
    text: "I work closely with designers and development teams to turn ideas into polished, production-ready experiences.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,_#f8fafc_0%,_#eef2ff_48%,_#ffffff_100%)] px-6 py-20 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <section className="grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="relative mx-auto w-full max-w-sm">
            <div className="absolute -inset-4 rounded-[2rem] bg-blue-600/10 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white bg-white p-3 shadow-[0_25px_80px_rgba(15,23,42,0.14)]">
              <Image
                src="/ajithraj.jpg"
                alt="Ajith Raj profile photo"
                width={640}
                height={800}
                className="aspect-[4/5] w-full rounded-[1.5rem] object-cover"
                priority
              />
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-blue-600">
              About me
            </p>
            <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-6xl">
              I create digital experiences that are clear, useful, and built to last.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600">
              I am Ajith Raj, a frontend developer focused on building polished and dependable web experiences. I combine practical engineering with a strong eye for design to help products communicate clearly and work beautifully across devices.
            </p>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
              My work spans component-driven applications, responsive interfaces, design systems, and performance-focused frontend implementation. I enjoy turning complex requirements into simple, thoughtful interfaces that support both people and business goals.
            </p>
          </div>
        </section>

        <section className="mt-24 border-t border-slate-200 pt-12">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-slate-500">
              What I bring
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Thoughtful work from first idea to final interface.
            </h2>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {strengths.map((strength, index) => (
              <article
                key={strength.title}
                className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-[0_14px_45px_rgba(15,23,42,0.06)]"
              >
                <span className="text-sm font-semibold text-blue-600">0{index + 1}</span>
                <h3 className="mt-8 text-xl font-semibold text-slate-900">{strength.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{strength.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-20 rounded-[2rem] bg-slate-950 px-7 py-10 text-white shadow-2xl sm:px-12 sm:py-14">
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-blue-300">
            My approach
          </p>
          <p className="mt-5 max-w-4xl text-2xl leading-relaxed text-slate-100 sm:text-3xl">
            Listen carefully, simplify the problem, build with intention, and keep improving until the experience feels effortless.
          </p>
        </section>
      </div>
    </main>
  );
}
