"use client";

import { useState } from "react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const formData = new FormData(event.currentTarget);
      const response = await fetch("/__forms.html", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData).toString(),
      });

      if (!response.ok) throw new Error("Form submission failed");

      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again or email me directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,_#f8fafc_0%,_#eef2ff_48%,_#ffffff_100%)] px-6 py-20 sm:px-8 lg:px-10">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <section className="pt-4">
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-blue-600">
            Contact me
          </p>
          <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-6xl">
            Let&apos;s talk about your next project.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-slate-600">
            Have a project, opportunity, or idea in mind? Send me a message and I&apos;ll get back to you as soon as possible.
          </p>
          <div className="mt-10 border-l-2 border-blue-600 pl-5 text-sm leading-7 text-slate-600">
            <p className="font-semibold text-slate-900">Ajith Raj</p>
            <p>Frontend Developer</p>
            <p>ajithrajkg007@gmail.com</p>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-[0_25px_80px_rgba(15,23,42,0.1)] sm:p-10">
          {submitted ? (
            <div className="py-16 text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-blue-600">
                Message sent
              </p>
              <h2 className="mt-4 text-3xl font-semibold text-slate-950">
                Thank you for reaching out.
              </h2>
              <p className="mt-4 text-slate-600">
                Your message has been submitted successfully. I&apos;ll be in touch soon.
              </p>
            </div>
          ) : (
            <form
              name="contact"
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <input type="hidden" name="form-name" value="contact" />
              <p className="hidden">
                <label>
                  Don&apos;t fill this out if you&apos;re human: <input name="bot-field" />
                </label>
              </p>

              <div className="grid gap-6 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-semibold text-slate-800">Your name</span>
                  <input
                    type="text"
                    name="name"
                    required
                    className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
                    placeholder="Your name"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-slate-800">Email address</span>
                  <input
                    type="email"
                    name="email"
                    required
                    className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
                    placeholder="you@example.com"
                  />
                </label>
              </div>

              <label className="block">
                <span className="text-sm font-semibold text-slate-800">Subject</span>
                <input
                  type="text"
                  name="subject"
                  required
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
                  placeholder="How can I help?"
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-slate-800">Message</span>
                <textarea
                  name="message"
                  required
                  rows={6}
                  className="mt-2 w-full resize-y rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
                  placeholder="Tell me about your project..."
                />
              </label>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-600/20"
              >
                {submitting ? "Sending..." : "Send message"}
              </button>
              {error && <p className="text-sm text-red-600">{error}</p>}
            </form>
          )}
        </section>
      </div>
    </main>
  );
}
