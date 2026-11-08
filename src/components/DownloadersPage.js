"use client";

import { useState } from "react";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";

const platforms = [
  {
    id: "youtube",
    name: "YouTube",
    placeholder: "https://www.youtube.com/watch?v=...",
    icon: FaYoutube,
    active: "border-red-500 bg-red-50 text-red-600",
    button: "bg-red-600 hover:bg-red-700",
    domains: ["youtube.com", "youtu.be"],
  },
  {
    id: "facebook",
    name: "Facebook",
    placeholder: "https://www.facebook.com/.../videos/...",
    icon: FaFacebookF,
    active: "border-blue-500 bg-blue-50 text-blue-600",
    button: "bg-blue-600 hover:bg-blue-700",
    domains: ["facebook.com", "fb.watch"],
  },
  {
    id: "instagram",
    name: "Instagram",
    placeholder: "https://www.instagram.com/reel/.../",
    icon: FaInstagram,
    active: "border-pink-500 bg-pink-50 text-pink-600",
    button: "bg-pink-600 hover:bg-pink-700",
    domains: ["instagram.com"],
  },
];

export default function DownloadersPage() {
  const [platform, setPlatform] = useState(platforms[0]);
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function selectPlatform(nextPlatform) {
    setPlatform(nextPlatform);
    setUrl("");
    setResult(null);
    setError("");
  }

  async function handleDownload(event) {
    event.preventDefault();
    setResult(null);
    setError("");

    let parsed;
    try {
      parsed = new URL(url.trim());
    } catch {
      setError("Enter a valid video URL.");
      return;
    }

    const hostname = parsed.hostname.replace(/^www\./, "");
    if (!platform.domains.some((domain) => hostname === domain || hostname.endsWith(`.${domain}`))) {
      setError(`Enter a valid ${platform.name} URL.`);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/video-download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: parsed.toString() }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "This video could not be downloaded.");
      }

      setResult(data);
    } catch (requestError) {
      setError(requestError.message || "Unable to process this video.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f5f7] px-5 py-20 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Media tools</p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-stone-900 sm:text-6xl">Video Downloader</h1>
          <p className="mx-auto mt-5 max-w-xl text-stone-600">
            Paste a public video link from YouTube, Facebook, or Instagram.
          </p>
        </div>

        <section className="mt-12 rounded-3xl bg-white p-5 shadow-[0_20px_60px_rgba(68,58,46,0.12)] sm:p-8">
          <div className="grid grid-cols-3 gap-2 rounded-2xl bg-stone-100 p-2 sm:gap-3">
            {platforms.map((item) => {
              const Icon = item.icon;
              const active = platform.id === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => selectPlatform(item)}
                  className={`flex min-h-16 items-center justify-center gap-2 rounded-xl border-2 border-transparent px-2 text-sm font-semibold transition sm:text-base ${
                    active ? item.active : "text-stone-500 hover:bg-white hover:text-stone-800"
                  }`}
                >
                  <Icon className="text-xl" />
                  <span className="hidden sm:inline">{item.name}</span>
                </button>
              );
            })}
          </div>

          <form onSubmit={handleDownload} className="mt-7">
            <label htmlFor="video-url" className="mb-2 block text-sm font-semibold text-stone-700">
              {platform.name} video URL
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                id="video-url"
                type="url"
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                placeholder={platform.placeholder}
                required
                className="min-w-0 flex-1 rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none transition focus:border-stone-500 focus:ring-4 focus:ring-stone-200"
              />
              <button
                type="submit"
                disabled={loading}
                className={`rounded-xl px-6 py-3 font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${platform.button}`}
              >
                {loading ? "Fetching..." : "Get video"}
              </button>
            </div>
          </form>

          {error && (
            <p role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}

          {result && (
            <div className="mt-7 rounded-2xl border border-stone-200 bg-stone-50 p-5">
              <p className="font-semibold text-stone-900">{result.title || "Video ready"}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {(result.downloads || []).map((download, index) => (
                  <a
                    key={`${download.url}-${index}`}
                    href={download.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`rounded-xl px-5 py-3 text-sm font-semibold text-white transition ${platform.button}`}
                  >
                    Download{download.label ? ` - ${download.label}` : ""}
                  </a>
                ))}
              </div>
            </div>
          )}
        </section>

        <p className="mt-5 text-center text-xs leading-5 text-stone-500">
          Only download content you own or are authorized to use.
        </p>
      </div>
    </main>
  );
}
