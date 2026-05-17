export default function Banner({ title, subtitle, ctaText, ctaLink }) {
  return (
    <div className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-20 px-6 shadow-lg h-[45rem] flex items-center justify-center">
      <div className="max-w-4xl text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          {title || "Welcome to Our Platform"}
        </h2>
        <p className="text-lg md:text-xl mb-8 opacity-95">
          {subtitle || "Build something amazing with our tools"}
        </p>
        {ctaText && (
          <a
            href={ctaLink || "#"}
            className="inline-block bg-white text-blue-600 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            {ctaText}
          </a>
        )}
      </div>
    </div>
  );
}
