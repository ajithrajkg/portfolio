import Image from "next/image";

const galleryItems = [
  {
    title: "Creative UI Concepts",
    description: "Modern interface concepts for digital products and landing pages.",
    image: "/logo.png",
  },
  {
    title: "Visual Branding",
    description: "Clean and refined branding directions with a strong visual identity.",
    image: "/logo.png",
  },
  {
    title: "Product Design Ideas",
    description: "Thoughtful product experiences designed for clarity and usability.",
    image: "/logo.png",
  },
  {
    title: "Design System Samples",
    description: "Reusable interface patterns built for consistency and scale.",
    image: "/logo.png",
  },
];

export default function GalleryPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,_#f8fafc_0%,_#eef2ff_45%,_#f8fafc_100%)] px-6 py-24 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-slate-500">
            Gallery
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            A collection of creative design work and visual direction
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            This gallery showcases a selection of portfolio-style concepts that reflect my design thinking, UI direction, and creative process.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {galleryItems.map((item) => (
            <div
              key={item.title}
              className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.06)]"
            >
              <div className="relative h-60 w-full bg-slate-100">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h2 className="text-xl font-semibold text-slate-900">{item.title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
