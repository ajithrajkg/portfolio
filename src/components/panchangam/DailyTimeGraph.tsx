"use client";

import { useEffect, useMemo, useState } from "react";
import { addCalendarDays, dateInTimeZone, formatTime, zonedDateTimeToUtc } from "@/lib/panchangam/date-time";
import type { PanchangamRecord, PeriodKind, TimePeriod } from "@/lib/panchangam/types";

type GraphRow = {
  id: string;
  title: string;
  explanation: string;
  kind: PeriodKind | "daylight";
  start: Date;
  end: Date;
  isDaylight: boolean;
};

const COLORS: Record<GraphRow["kind"], string> = {
  favorable: "#52bcff",
  neutral: "#ad7412",
  inauspicious: "#d0362e",
  daylight: "#246f9e",
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
  const rows: GraphRow[] = [{
    id: "daylight",
    title: "സൂര്യോദയം – സൂര്യാസ്തമയം",
    explanation: "കണക്കാക്കിയ പ്രാദേശിക സൂര്യോദയത്തിനും അസ്തമയത്തിനും ഇടയിലുള്ള സമയം.",
    kind: "daylight",
    start: new Date(record.sunrise),
    end: new Date(record.sunset),
    isDaylight: true,
  }];

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
      isDaylight: false,
    });
  }

  return {
    start,
    end,
    rows: rows.sort((left, right) => (
      left.isDaylight ? -1 : right.isDaylight ? 1 : left.start.getTime() - right.start.getTime()
    )),
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
  const rangeStart = graph?.start.getTime() ?? 0;
  const rangeEnd = graph?.end.getTime() ?? rangeStart;
  const rangeDuration = rangeEnd - rangeStart;
  const now = currentTime === null ? null : new Date(currentTime);
  const isCurrentDay = now !== null && record.date === dateInTimeZone(now, record.place.timeZone);
  const nowPosition = isCurrentDay && rangeDuration && now
    ? ((now.getTime() - rangeStart) / rangeDuration) * 100
    : -1;
  const ticks = graph
    ? [0, 0.5, 1].map((fraction) => ({
      fraction,
      time: new Date(rangeStart + rangeDuration * fraction).toISOString(),
    }))
    : [];

  useEffect(() => {
    const updateCurrentTime = () => setCurrentTime(Date.now());
    updateCurrentTime();
    const interval = window.setInterval(updateCurrentTime, 15_000);
    return () => window.clearInterval(interval);
  }, []);

  function choosePeriod(row: GraphRow) {
    if (row.isDaylight) {
      setSelected(row);
      return;
    }
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
          <span><i className="is-abhijit" /> അഭിജിത് മുഹൂർത്തം</span>
          <span><i className="is-inauspicious" /> ശ്രദ്ധിക്കേണ്ടത്</span>
          <span><i className="is-daylight" /> സൂര്യോദയം – അസ്തമയം</span>
        </div>
      ) : null}
      {graph?.rows.length ? (
        <>
          <div className="panch-timeline" aria-label={fullDay ? "24 മണിക്കൂർ സമയരേഖ" : "സൂര്യോദയം മുതൽ അസ്തമയം വരെയുള്ള സമയരേഖ"}>
            <div className="panch-timeline-rows">
              {graph.rows.map((row) => {
                const left = Math.max(
                  0,
                  ((row.start.getTime() - rangeStart) / rangeDuration) * 100,
                );
                const right = Math.min(
                  100,
                  ((row.end.getTime() - rangeStart) / rangeDuration) * 100,
                );
                const width = Math.max(0, right - left);

                return (
                  <button
                    className={`panch-timeline-row is-${row.kind}${row.isDaylight ? " is-daylight" : ""}`}
                    key={row.id}
                    type="button"
                    title={`${row.title}: ${formatTime(row.start.toISOString(), record.place.timeZone)} – ${formatTime(row.end.toISOString(), record.place.timeZone)}. ${row.explanation}`}
                    aria-label={`${row.title}, ${formatTime(row.start.toISOString(), record.place.timeZone)} മുതൽ ${formatTime(row.end.toISOString(), record.place.timeZone)} വരെ. ${row.explanation}`}
                    onClick={() => choosePeriod(row)}
                  >
                    <span className="panch-timeline-track">
                      <span
                        className={`panch-timeline-line is-${row.kind}${row.id === "abhijit" ? " is-abhijit" : ""}`}
                        style={{
                          left: `${left}%`,
                          width: `${width}%`,
                          backgroundColor: row.id === "abhijit" ? "#14e08e" : COLORS[row.kind],
                        }}
                      />
                      {nowPosition >= 0 && nowPosition <= 100 && (
                        <span
                          className="panch-timeline-now"
                          style={{ left: `${nowPosition}%` }}
                          aria-hidden="true"
                        >
                          <i />
                          {row.isDaylight && <span>ഇപ്പോൾ</span>}
                        </span>
                      )}
                    </span>
                    <span className="panch-timeline-label">
                      <strong>
                        {formatTime(row.start.toISOString(), record.place.timeZone)}
                        {" – "}
                        {formatTime(row.end.toISOString(), record.place.timeZone)}
                      </strong>
                      <span>{row.title}</span>
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="panch-timeline-axis" aria-hidden="true">
              <span className="panch-timeline-axis-times">
                <span>{ticks[0] && formatTime(ticks[0].time, record.place.timeZone)}</span>
                <span>{ticks[1] && formatTime(ticks[1].time, record.place.timeZone)}</span>
                <span>{ticks[2] && formatTime(ticks[2].time, record.place.timeZone)}</span>
              </span>
              <span />
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
