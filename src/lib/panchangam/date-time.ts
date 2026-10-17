export function dateInTimeZone(date: Date, timeZone: string): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
}

export function zonedDateTimeToUtc(
  date: string,
  hour: number,
  minute: number,
  timeZone: string,
): Date {
  const [year, month, day] = date.split("-").map(Number);
  const targetUtc = Date.UTC(year, month - 1, day, hour, minute);
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });
  const localParts = (instant: number) => {
    const values = Object.fromEntries(
      formatter.formatToParts(new Date(instant)).map(({ type, value }) => [type, value]),
    );
    return {
      year: Number(values.year),
      month: Number(values.month),
      day: Number(values.day),
      hour: Number(values.hour),
      minute: Number(values.minute),
      second: Number(values.second),
    };
  };
  const requested = `${date}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
  const offsets = new Set<number>();

  for (let offsetHours = -36; offsetHours <= 36; offsetHours += 12) {
    const sample = targetUtc + offsetHours * 60 * 60 * 1000;
    const parts = localParts(sample);
    offsets.add(Date.UTC(
      parts.year,
      parts.month - 1,
      parts.day,
      parts.hour,
      parts.minute,
      parts.second,
    ) - sample);
  }

  const candidates = [...offsets].map((offset) => targetUtc - offset);
  const exactMatches = candidates
    .filter((candidate) => {
      const parts = localParts(candidate);
      return parts.year === year
        && parts.month === month
        && parts.day === day
        && parts.hour === hour
        && parts.minute === minute;
    })
    .sort((left, right) => left - right);

  if (exactMatches.length) return new Date(exactMatches[0]);

  const nextValidLocalTimes = candidates
    .map((candidate) => {
      const parts = localParts(candidate);
      const localStamp = Date.UTC(
        parts.year,
        parts.month - 1,
        parts.day,
        parts.hour,
        parts.minute,
        parts.second,
      );
      return { candidate, localStamp, parts };
    })
    .filter(({ localStamp, parts }) => (
      parts.year === year
      && parts.month === month
      && parts.day === day
      && localStamp > targetUtc
      && localStamp - targetUtc <= 3 * 60 * 60 * 1000
    ))
    .sort((left, right) => left.localStamp - right.localStamp);

  if (nextValidLocalTimes.length) return new Date(nextValidLocalTimes[0].candidate);
  throw new RangeError(`Local date and time do not exist in ${timeZone}.`);
}

export function addCalendarDays(date: string, days: number): string {
  const [year, month, day] = date.split("-").map(Number);
  const next = new Date(Date.UTC(year, month - 1, day + days));
  return next.toISOString().slice(0, 10);
}

export function formatTime(date: string | null, timeZone: string): string {
  if (!date) return "ലഭ്യമല്ല";
  return new Intl.DateTimeFormat("en-IN", {
    timeZone,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(date));
}

export function formatMalayalamDate(date: string, timeZone: string): string {
  const instant = zonedDateTimeToUtc(date, 12, 0, timeZone);
  return new Intl.DateTimeFormat("ml-IN", {
    timeZone,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(instant);
}
