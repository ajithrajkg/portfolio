"use client";

import { useEffect, useRef } from "react";
import { ArrowLeft } from "lucide-react";
import { formatMalayalamDate, formatTime } from "@/lib/panchangam/date-time";
import type { PanchangaValue, PanchangamRecord } from "@/lib/panchangam/types";

type PanchangamDetailsPageProps = {
  record: PanchangamRecord;
  onBack: () => void;
};

export default function PanchangamDetailsPage({ record, onBack }: PanchangamDetailsPageProps) {
  const backButton = useRef<HTMLButtonElement>(null);
  const duration = (start: string, end: string) => {
    const minutes = Math.round((new Date(end).getTime() - new Date(start).getTime()) / 60_000);
    return `${Math.floor(minutes / 60)} മണിക്കൂർ ${minutes % 60} മിനിറ്റ്`;
  };

  useEffect(() => {
    backButton.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onBack();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onBack]);

  function keepFocusInside(event: React.KeyboardEvent<HTMLElement>) {
    if (event.key !== "Tab") return;
    const dialog = event.currentTarget;
    const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ));
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (!first || !last) return;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  return (
    <section
      className="panch-details-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="panch-details-title"
      tabIndex={-1}
      lang="ml"
      onKeyDown={keepFocusInside}
    >
      <header className="panch-details-header">
        <button ref={backButton} type="button" onClick={onBack} className="panch-back-button">
          <ArrowLeft size={19} />
          <span>തിരികെ</span>
        </button>
        <span className="panch-details-location">{record.place.name}</span>
      </header>
      <div className="panch-details-content">
        <div className="panch-details-title">
          <span className="panch-eyebrow">ദിവസ പഞ്ചാംഗം</span>
          <h1 id="panch-details-title">ഇന്നത്തെ പഞ്ചാംഗം</h1>
          <p>{formatMalayalamDate(record.date, record.place.timeZone)}</p>
        </div>
        <div className="panch-details-grid">
          <article className="panch-details-card">
            <h2>പഞ്ചാംഗ ഘടകങ്ങൾ</h2>
            <dl>
              {([
                ["തിഥി", record.tithi],
                ["നക്ഷത്രം", record.nakshatra],
                ["യോഗം", record.yoga],
                ["കരണം", record.karana],
              ] as [string, PanchangaValue][]).map(([label, value]) => (
                <div className="panch-detail-element" key={label}>
                  <dt>{label}</dt>
                  <dd>{value.value}</dd>
                  <small>
                    {formatTime(value.start, record.place.timeZone)} – {formatTime(value.end, record.place.timeZone)}
                    {" · "}
                    {duration(value.start, value.end)}
                  </small>
                </div>
              ))}
              <div><dt>ചന്ദ്രരാശി</dt><dd>{record.moonSign}</dd></div>
              <div><dt>ജന്മനക്ഷത്രം</dt><dd>{record.birthReference.nakshatra}</dd></div>
              <div><dt>ജന്മചന്ദ്രരാശി</dt><dd>{record.birthReference.moonSign}</dd></div>
            </dl>
          </article>
          <article className="panch-details-card">
            <h2>സൂര്യോദയവും അസ്തമയവും</h2>
            <dl>
              <div><dt>സൂര്യോദയം</dt><dd>{formatTime(record.sunrise, record.place.timeZone)}</dd></div>
              <div><dt>സൂര്യാസ്തമയം</dt><dd>{formatTime(record.sunset, record.place.timeZone)}</dd></div>
              <div><dt>പ്രാദേശിക സമയമേഖല</dt><dd>{record.place.timeZone}</dd></div>
              <div><dt>സ്ഥലം</dt><dd>{record.place.name}</dd></div>
            </dl>
          </article>
          <article className="panch-details-card panch-details-periods">
            <h2>ശുഭവും അശുഭവുമായ സമയങ്ങൾ</h2>
            {record.periods.filter((period) => period.id !== "daylight").map((period) => (
              <div className="panch-details-period" key={period.id}>
                <div className={`panch-period-dot is-${period.kind}`} />
                <div>
                  <strong>{period.malayalamName}</strong>
                  <span>
                    {formatTime(period.start, record.place.timeZone)} – {formatTime(period.end, record.place.timeZone)}
                    {" · "}
                    {duration(period.start, period.end)}
                  </span>
                  <p>{period.explanation}</p>
                  <small>
                    {period.kind === "favorable" ? "പരമ്പരാഗതമായി ശുഭം" : "പരമ്പരാഗത സമയവിഭാഗം"}
                  </small>
                </div>
              </div>
            ))}
            {record.unavailable.map((item) => (
              <div className="panch-unavailable-row" key={item}>
                <span>{item.split(":")[0]}</span>
                <p>{item.split(":").slice(1).join(":").trim()}</p>
                <small>കണക്കാക്കിയിട്ടില്ല</small>
              </div>
            ))}
          </article>
          <article className="panch-details-card panch-planet-card">
            <h2>ഗ്രഹനിലയും ഗ്രഹമാറ്റങ്ങളും</h2>
            <p className="panch-muted-copy">
              തിരഞ്ഞെടുത്ത ദിവസത്തെ ഗ്രഹങ്ങളുടെ രാശിനില. സംക്രമണ തീയതികൾ ഈ പതിപ്പിൽ ലഭ്യമല്ല.
            </p>
            <div className="panch-planet-grid">
              {record.planets.map((planet) => (
                <div key={planet.name}>
                  <span>{planet.name}</span>
                  <strong>{planet.sign}</strong>
                </div>
              ))}
            </div>
          </article>
        </div>
        <div className="panch-calc-note">
          കണക്കാക്കിയ സമയം: {new Intl.DateTimeFormat("ml-IN", {
            timeZone: record.place.timeZone,
            dateStyle: "medium",
            timeStyle: "short",
          }).format(new Date(record.calculatedAt))}
          {" · "}ഗണന: {record.calculation.engine}, {record.calculation.ayanamsa}
        </div>
      </div>
    </section>
  );
}
