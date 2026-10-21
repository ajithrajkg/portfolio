"use client";

import { useMemo } from "react";
import { calculateVimshottariSchedule } from "@/lib/panchangam/astronomy";
import { dateInTimeZone } from "@/lib/panchangam/date-time";
import type { BirthProfile, VimshottariPeriod } from "@/lib/panchangam/types";

type VimshottariSummaryProps = {
  profile: BirthProfile;
  date: string;
  compact?: boolean;
};

function formatPeriodDate(date: string, timeZone: string): string {
  const localDate = dateInTimeZone(new Date(date), timeZone);
  const formatter = new Intl.DateTimeFormat("ml-IN", {
    timeZone: "UTC",
    day: "numeric",
    month: "short",
    year: "2-digit",
  });
  return formatter.format(new Date(`${localDate}T12:00:00Z`));
}

function formatPeriodDuration(start: string, end: string): string {
  const durationMs = new Date(end).getTime() - new Date(start).getTime();
  const totalMonths = Math.round(durationMs / (365.2425 * 24 * 60 * 60 * 1000 / 12));
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  if (years && months) return `${years} വർഷം ${months} മാസം`;
  if (years) return `${years} വർഷം`;
  if (months) return `${months} മാസം`;

  const days = Math.max(1, Math.round(durationMs / (24 * 60 * 60 * 1000)));
  return `${days} ദിവസം`;
}

export default function VimshottariSummary({ profile, date, compact = false }: VimshottariSummaryProps) {
  const schedule = useMemo(
    () => calculateVimshottariSchedule(profile, date),
    [profile, date],
  );
  const periods = [
    { label: "ദശ", period: schedule.mahadasha },
    { label: "അപഹാരം", period: schedule.antardasha },
    { label: "പ്രത്യന്തരദശ (ചിദ്രം)", period: schedule.pratyantardasha },
  ];

  return (
    <section className={`panch-dasha-card${compact ? " is-compact" : ""}`} aria-label="വിംശോത്തരി ദശാക്രമം">
      <h2 className="panch-dasha-heading">{compact ? "ദശാക്രമം" : "തിരഞ്ഞെടുത്ത ദിവസത്തെ ദശാക്രമം"}</h2>
      <div className="panch-dasha-periods">
        {periods.map(({ label, period }) => (
          <div className="panch-dasha-period" key={label}>
            <span className="panch-dasha-label">{label}</span>
            <strong>{period.malayalamLord}</strong>
            <span className="panch-dasha-period-info">
              <span className="panch-dasha-dates">
                <time dateTime={period.start}>{formatPeriodDate(period.start, profile.placeOfBirth.timeZone)}</time>
                <span aria-hidden="true">–</span>
                <time dateTime={period.end}>{formatPeriodDate(period.end, profile.placeOfBirth.timeZone)}</time>
              </span>
              <span className="panch-dasha-duration">{formatPeriodDuration(period.start, period.end)}</span>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
