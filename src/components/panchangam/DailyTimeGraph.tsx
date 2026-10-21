"use client";

import { useEffect, useMemo, useState } from "react";
import { addCalendarDays, formatTime, zonedDateTimeToUtc } from "@/lib/panchangam/date-time";
import type { PanchangamRecord, PeriodKind, TimePeriod } from "@/lib/panchangam/types";

type GraphRow = {
  id: string;
  title: string;
  explanation: string;
  kind: PeriodKind;
  start: Date;
  end: Date;
};

const COLORS: Record<PeriodKind, string> = {
  favorable: "#0869e8",
  neutral: "#ad7412",
  inauspicious: "#ff1717",
};

function createRows(record: PanchangamRecord, fullDay: boolean): {
  rows: GraphRow[];
  start: Date;
  end: Date;
} | null {
  if (!record.sunrise || !record.sunset) return null;
  const start = fullDay
    ? zonedDateTimeToUtc(record.date, 0, 0, record.place.timeZone)
    : new Date(record.sunrise);
  const end = fullDay
    ? zonedDateTimeToUtc(addCalendarDays(record.date, 1), 0, 0, record.place.timeZone)
    : new Date(record.sunset);
  const rows: GraphRow[] = [];

  for (const period of record.periods) {
    if (period.id === "daylight") continue;
    const periodStart = new Date(period.start);
    const periodEnd = new Date(period.end);
    if (periodEnd <= start || periodStart >= end) continue;
    rows.push({
      id: period.id,
      title: period.malayalamName,
      explanation: period.explanation,
      kind: period.kind,
      start: new Date(Math.max(periodStart.getTime(), start.getTime())),
      end: new Date(Math.min(periodEnd.getTime(), end.getTime())),
    });
  }

  return {
    start,
    end,
    rows: rows.sort((left, right) => left.start.getTime() - right.start.getTime()),
  };
}

type DailyTimeGraphProps = {
  record: PanchangamRecord;
};

export default function DailyTimeGraph({ record }: DailyTimeGraphProps) {
  const [fullDay, setFullDay] = useState(false);
  const [selected, setSelected] = useState<GraphRow | null>(null);
  const [currentTime, setCurrentTime] = useState<number | null>(null);
  const graph = useMemo(() => createRows(record, fullDay), [record, fullDay]);
  const rulerStart = fullDay
    ? graph?.start ?? zonedDateTimeToUtc(record.date, 0, 0, record.place.timeZone)
    : zonedDateTimeToUtc(record.date, 6, 0, record.place.timeZone);
  const rulerEnd = fullDay
    ? graph?.end ?? zonedDateTimeToUtc(addCalendarDays(record.date, 1), 0, 0, record.place.timeZone)
    : zonedDateTimeToUtc(record.date, 18, 0, record.place.timeZone);
  const rulerStartTime = rulerStart.getTime();
  const rulerDuration = rulerEnd.getTime() - rulerStartTime;
  const tickHours = fullDay
    ? Array.from({ length: 13 }, (_, index) => index * 2)
    : Array.from({ length: 13 }, (_, index) => index + 6);
  const tickTimes = tickHours.map((hour) => {
    const tickDate = fullDay && hour === 24
      ? zonedDateTimeToUtc(addCalendarDays(record.date, 1), 0, 0, record.place.timeZone)
      : zonedDateTimeToUtc(record.date, hour, 0, record.place.timeZone);
    return {
      label: new Intl.DateTimeFormat("en-US", {
        timeZone: record.place.timeZone,
        hour: "numeric",
      }).format(tickDate).replace(" ", "").toLowerCase(),
      position: ((tickDate.getTime() - rulerStartTime) / rulerDuration) * 100,
    };
  });
  const now = currentTime === null ? null : new Date(currentTime);
  useEffect(() => {
    const updateCurrentTime = () => setCurrentTime(Date.now());
    updateCurrentTime();
    const interval = window.setInterval(updateCurrentTime, 15_000);
    return () => window.clearInterval(interval);
  }, []);

  function choosePeriod(row: GraphRow) {
    const period: TimePeriod | undefined = record.periods.find((item) => item.id === row.id);
    setSelected(period ? { ...row, explanation: period.explanation } : row);
  }

  return (
    <section className="panch-card panch-graph-card" aria-labelledby="time-graph-title">
      <div className="panch-section-heading">
        <div>
          <span className="panch-eyebrow">സമയവിശകലനം</span>
          <h2 id="time-graph-title">നല്ലതും ശ്രദ്ധിക്കേണ്ടതുമായ സമയം</h2>
        </div>
        <div className="panch-graph-actions">
          <div className="panch-sun-times" role="group" aria-label="സൂര്യോദയവും സൂര്യാസ്തമയവും">
            <span><small>ഉദയം</small><time>{formatTime(record.sunrise, record.place.timeZone)}</time></span>
            <span><small>അസ്തമയം</small><time>{formatTime(record.sunset, record.place.timeZone)}</time></span>
          </div>
          {now && (
            <span className="panch-current-time" aria-live="off">
              <i aria-hidden="true" />
              ഇപ്പോൾ <time dateTime={now.toISOString()}>{formatTime(now.toISOString(), record.place.timeZone)}</time>
            </span>
          )}
          <label className="panch-toggle">
            <input type="checkbox" checked={fullDay} onChange={(event) => setFullDay(event.target.checked)} />
            <span>24 മണിക്കൂർ</span>
          </label>
        </div>
      </div>
      {graph?.rows.length ? (
        <div className="panch-chart-legend" aria-label="സമയങ്ങളുടെ അടയാളങ്ങൾ">
          <span><i className="is-favorable" /> ശുഭം</span>
          <span><i className="is-abhijit" /> അഭിജിത് മുഹൂർത്തം (ശുഭം)</span>
          <span><i className="is-inauspicious" /> ശ്രദ്ധിക്കേണ്ടത്</span>
        </div>
      ) : null}
      {graph?.rows.length ? (
        <>
          <div className="panch-timeline" aria-label={fullDay ? "24 മണിക്കൂർ സമയരേഖ" : "സൂര്യോദയം മുതൽ അസ്തമയം വരെയുള്ള സമയരേഖ"}>
            <div className="panch-timeline-rows">
              {graph.rows.map((row) => {
                const left = Math.max(
                  0,
                  ((row.start.getTime() - rulerStartTime) / rulerDuration) * 100,
                );
                const right = Math.min(
                  100,
                  ((row.end.getTime() - rulerStartTime) / rulerDuration) * 100,
                );
                const width = Math.max(0, right - left);

                return (
                  <button
                    className={`panch-timeline-row is-${row.kind}`}
                    key={row.id}
                    type="button"
                    title={`${row.title}: ${formatTime(row.start.toISOString(), record.place.timeZone)} – ${formatTime(row.end.toISOString(), record.place.timeZone)}. ${row.explanation}`}
                    aria-label={`${row.title}, ${formatTime(row.start.toISOString(), record.place.timeZone)} മുതൽ ${formatTime(row.end.toISOString(), record.place.timeZone)} വരെ. ${row.explanation}`}
                    onClick={() => choosePeriod(row)}
                  >
                    <span className="panch-period-ruler" aria-hidden="true">
                      <span className="panch-period-ruler-labels">
                        {tickTimes.map((tick, index) => (
                          <span key={`${tick.label}-${index}`}>{tick.label}</span>
                        ))}
                      </span>
                      <span className="panch-timeline-track">
                        {tickTimes.map((tick, index) => (
                          <i
                            className="panch-timeline-tick"
                            key={`${tick.label}-${index}`}
                            style={{ left: `${tick.position}%` }}
                          />
                        ))}
                        <span
                          className={`panch-timeline-line is-${row.kind}${row.id === "abhijit" ? " is-abhijit" : ""}`}
                          style={{
                            left: `${left}%`,
                            width: `${width}%`,
                            backgroundColor: row.id === "abhijit" ? "#14a86c" : COLORS[row.kind],
                          }}
                        />
                      </span>
                    </span>
                    <span className="panch-timeline-label">
                      <span>{row.title}</span>
                      <strong>
                        {formatTime(row.start.toISOString(), record.place.timeZone)}
                        {" – "}
                        {formatTime(row.end.toISOString(), record.place.timeZone)}
                      </strong>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          {selected && (
            <div className="panch-selected-period" role="status">
              <button type="button" onClick={() => setSelected(null)} aria-label="Close period details">×</button>
              <strong>{selected.title}</strong>
              <span>
                {formatTime(selected.start.toISOString(), record.place.timeZone)}
                {" – "}
                {formatTime(selected.end.toISOString(), record.place.timeZone)}
              </span>
              <p>{selected.explanation}</p>
            </div>
          )}
        </>
      ) : (
        <div className="panch-empty-state">
          <strong>സൂര്യോദയ സമയങ്ങൾ കണക്കാക്കാനായില്ല.</strong>
          <p>ഈ സ്ഥലത്തും തീയതിയിലും സൂര്യോദയം/അസ്തമയം ലഭ്യമല്ല. മറ്റൊരു തീയതിയോ സ്ഥലമോ തിരഞ്ഞെടുക്കുക.</p>
        </div>
      )}
    </section>
  );
}
