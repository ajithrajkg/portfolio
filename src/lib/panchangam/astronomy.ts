import {
  Body,
  Ecliptic,
  EclipticGeoMoon,
  GeoVector,
  Observer,
  SearchRiseSet,
  SunPosition,
} from "astronomy-engine";
import type {
  BirthProfile,
  PanchangaValue,
  PanchangamRecord,
  Place,
  PlanetPosition,
  TimePeriod,
  VimshottariPeriod,
  VimshottariSchedule,
} from "./types";
import { addCalendarDays, dateInTimeZone, zonedDateTimeToUtc } from "./date-time";

const LUNAR_DAY_NAMES = [
  "പ്രഥമ", "ദ്വിതീയ", "തൃതീയ", "ചതുർഥി", "പഞ്ചമി", "ഷഷ്ഠി", "സപ്തമി",
  "അഷ്ടമി", "നവമി", "ദശമി", "ഏകാദശി", "ദ്വാദശി", "ത്രയോദശി",
  "ചതുർദശി", "പൗർണമി", "പ്രഥമ", "ദ്വിതീയ", "തൃതീയ", "ചതുർഥി",
  "പഞ്ചമി", "ഷഷ്ഠി", "സപ്തമി", "അഷ്ടമി", "നവമി", "ദശമി", "ഏകാദശി",
  "ദ്വാദശി", "ത്രയോദശി", "ചതുർദശി", "അമാവാസി",
];
const NAKSHATRA_NAMES = [
  "അശ്വതി", "ഭരണി", "കാർത്തിക", "രോഹിണി", "മകയിരം", "തിരുവാതിര", "പുണർതം",
  "പൂയം", "ആയില്യം", "മകം", "പൂരം", "ഉത്രം", "അത്തം", "ചിത്തിര",
  "ചോതി", "വിശാഖം", "അനിഴം", "തൃക്കേട്ട", "മൂലം", "പൂരാടം", "ഉത്രാടം",
  "തിരുവോണം", "അവിട്ടം", "ചതയം", "പൂരുരുട്ടാതി", "ഉത്രട്ടാതി", "രേവതി",
];
const YOGA_NAMES = [
  "വിഷ്കംഭം", "പ്രീതി", "ആയുഷ്മാൻ", "സൗഭാഗ്യം", "ശോഭനം", "അതിഗണ്ഡം",
  "സുകർമ്മം", "ധൃതി", "ശൂലം", "ഗണ്ഡം", "വൃദ്ധി", "ധ്രുവം", "വ്യാഘാതം",
  "ഹർഷണം", "വജ്രം", "സിദ്ധി", "വ്യതീപാതം", "വരിയാൻ", "പരിഘം", "ശിവം",
  "സിദ്ധം", "സാധ്യം", "ശുഭം", "ശുക്ലം", "ബ്രഹ്മം", "ഇന്ദ്രം", "വൈധൃതി",
];
const KARANA_NAMES = [
  "കിംസ്തുഘ്നം", "ബവം", "ബാലവം", "കൗലവം", "തൈതിലം", "ഗരജം",
  "വണിജം", "വിഷ്ടി (ഭദ്ര)", "ശകുനി", "ചതുഷ്പാദം", "നാഗവം",
];
const ZODIAC_SIGNS = [
  "മേടം", "ഇടവം", "മിഥുനം", "കർക്കടകം", "ചിങ്ങം", "കന്നി",
  "തുലാം", "വൃശ്ചികം", "ധനു", "മകരം", "കുംഭം", "മീനം",
];
const PLANETS: { body: Body; malayalamName: string }[] = [
  { body: Body.Sun, malayalamName: "സൂര്യൻ" },
  { body: Body.Moon, malayalamName: "ചന്ദ്രൻ" },
  { body: Body.Mars, malayalamName: "ചൊവ്വ" },
  { body: Body.Mercury, malayalamName: "ബുധൻ" },
  { body: Body.Jupiter, malayalamName: "വ്യാഴം" },
  { body: Body.Venus, malayalamName: "ശുക്രൻ" },
  { body: Body.Saturn, malayalamName: "ശനി" },
];
const RAHU_SEGMENT = [8, 2, 7, 5, 6, 4, 3];
const YAMAGANDA_SEGMENT = [5, 4, 3, 2, 1, 7, 6];
const GULIKA_SEGMENT = [7, 6, 5, 4, 3, 2, 1];
const AYANAMSA_BASE_DEGREES = 23.85675;
const AYANAMSA_RATE_DEGREES_PER_YEAR = 50.290966 / 3600;
const VIMSHOTTARI_YEAR_MS = 365.2425 * 24 * 60 * 60 * 1000;
const VIMSHOTTARI_LORDS = [
  { name: "Ketu", malayalamName: "കേതു", years: 7 },
  { name: "Venus", malayalamName: "ശുക്രൻ", years: 20 },
  { name: "Sun", malayalamName: "സൂര്യൻ", years: 6 },
  { name: "Moon", malayalamName: "ചന്ദ്രൻ", years: 10 },
  { name: "Mars", malayalamName: "ചൊവ്വ", years: 7 },
  { name: "Rahu", malayalamName: "രാഹു", years: 18 },
  { name: "Jupiter", malayalamName: "വ്യാഴം", years: 16 },
  { name: "Saturn", malayalamName: "ശനി", years: 19 },
  { name: "Mercury", malayalamName: "ബുധൻ", years: 17 },
] as const;

function wrapDegrees(value: number): number {
  return ((value % 360) + 360) % 360;
}

function ayanamsa(date: Date): number {
  return AYANAMSA_BASE_DEGREES
    + (date.getUTCFullYear() - 2000) * AYANAMSA_RATE_DEGREES_PER_YEAR;
}

function siderealLongitude(body: Body, date: Date): number {
  const longitude = body === Body.Sun
    ? SunPosition(date).elon
    : body === Body.Moon
      ? EclipticGeoMoon(date).lon
      : Ecliptic(GeoVector(body, date, true)).elon;
  return wrapDegrees(longitude - ayanamsa(date));
}

function angularDistance(from: number, to: number): number {
  return wrapDegrees(to - from);
}

function findElementBoundaries(
  anchor: Date,
  position: (date: Date) => number,
  segmentSize: number,
): { start: Date; end: Date } {
  const current = position(anchor);
  const remainder = current % segmentSize;
  const forwardDistance = remainder < 0.000001 ? segmentSize : segmentSize - remainder;
  const backwardDistance = remainder < 0.000001 ? segmentSize : remainder;
  const stepMilliseconds = 30 * 60 * 1000;

  function findBoundary(direction: -1 | 1, requiredDistance: number): Date {
    const origin = position(anchor);
    let previousTime = anchor.getTime();
    let bracket = 0;

    for (let index = 1; index <= 144; index += 1) {
      const time = anchor.getTime() + direction * index * stepMilliseconds;
      const distance = direction === 1
        ? angularDistance(origin, position(new Date(time)))
        : angularDistance(position(new Date(time)), origin);
      if (distance >= requiredDistance) {
        bracket = time;
        break;
      }
      previousTime = time;
    }

    if (!bracket) throw new Error("Could not find the requested Panchangam boundary.");

    let low = Math.min(previousTime, bracket);
    let high = Math.max(previousTime, bracket);
    for (let index = 0; index < 36; index += 1) {
      const middle = (low + high) / 2;
      const distance = direction === 1
        ? angularDistance(origin, position(new Date(middle)))
        : angularDistance(position(new Date(middle)), origin);
      if (distance >= requiredDistance) {
        if (direction === 1) high = middle;
        else low = middle;
      } else if (direction === 1) {
        low = middle;
      } else {
        high = middle;
      }
    }

    return new Date(direction === 1 ? high : low);
  }

  return {
    start: findBoundary(-1, backwardDistance),
    end: findBoundary(1, forwardDistance),
  };
}

function panchangaValue(
  anchor: Date,
  position: (date: Date) => number,
  segmentSize: number,
  names: string[],
  label?: (index: number) => string,
): PanchangaValue {
  const longitude = position(anchor);
  const index = Math.floor(longitude / segmentSize) % names.length;
  const boundaries = findElementBoundaries(anchor, position, segmentSize);
  return {
    value: label ? label(index) : names[index],
    start: boundaries.start.toISOString(),
    end: boundaries.end.toISOString(),
  };
}

function karanaName(index: number): string {
  if (index === 0) return KARANA_NAMES[0];
  if (index >= 57) return KARANA_NAMES[Math.min(8 + index - 57, 10)];
  return KARANA_NAMES[1 + ((index - 1) % 7)];
}

function findSunEvents(date: string, place: Place): { sunrise: Date | null; sunset: Date | null } {
  const observer = new Observer(place.latitude, place.longitude, 0);
  const localMidnight = zonedDateTimeToUtc(date, 0, 0, place.timeZone);
  const rise = SearchRiseSet(Body.Sun, observer, 1, localMidnight, 1.5);
  const set = rise
    ? SearchRiseSet(Body.Sun, observer, -1, new Date(rise.date.getTime() + 1000), 1.5)
    : null;

  return {
    sunrise: rise && dateInTimeZone(rise.date, place.timeZone) === date ? rise.date : null,
    sunset: set && dateInTimeZone(set.date, place.timeZone) === date ? set.date : null,
  };
}

function createPeriod(
  id: string,
  name: string,
  malayalamName: string,
  start: Date,
  end: Date,
  kind: TimePeriod["kind"],
  explanation: string,
): TimePeriod {
  return {
    id,
    name,
    malayalamName,
    start: start.toISOString(),
    end: end.toISOString(),
    kind,
    explanation,
    source: "traditional-rule",
  };
}

function createPeriods(date: string, sunrise: Date | null, sunset: Date | null): TimePeriod[] {
  if (!sunrise || !sunset) return [];
  const daylight = sunset.getTime() - sunrise.getTime();
  const segment = daylight / 8;
  const weekday = new Date(`${date}T12:00:00Z`).getUTCDay();
  const periods = [
    {
      id: "rahu",
      name: "Rahu Kalam",
      malayalamName: "രാഹുകാലം",
      segment: RAHU_SEGMENT[weekday],
      explanation: "പരമ്പരാഗതമായി പുതിയ ശുഭകാര്യങ്ങൾ ആരംഭിക്കുന്നത് ഒഴിവാക്കുന്ന സമയം.",
    },
    {
      id: "yamaganda",
      name: "Yamagandam",
      malayalamName: "യമഗണ്ഡകാലം",
      segment: YAMAGANDA_SEGMENT[weekday],
      explanation: "പരമ്പരാഗത ജ്യോതിഷത്തിൽ അനനുകൂലമായി കണക്കാക്കുന്ന കാലം.",
    },
    {
      id: "gulika",
      name: "Gulika Kalam",
      malayalamName: "ഗുളികകാലം",
      segment: GULIKA_SEGMENT[weekday],
      explanation: "സൂര്യോദയത്തെ അടിസ്ഥാനമാക്കി കണക്കാക്കുന്ന പരമ്പരാഗത സമയവിഭാഗം.",
    },
  ];

  const result = periods.map(({ id, name, malayalamName, segment: number, explanation }) => {
    const start = new Date(sunrise.getTime() + (number - 1) * segment);
    return createPeriod(
      id,
      name,
      malayalamName,
      start,
      new Date(start.getTime() + segment),
      "inauspicious",
      explanation,
    );
  });

  const midday = new Date(sunrise.getTime() + daylight / 2);
  const durMuhurthamStart = new Date(midday.getTime() - 48 * 60 * 1000);
  const durMuhurthamEnd = new Date(midday.getTime() + 48 * 60 * 1000);
  const varjyamStart = new Date(midday.getTime() + (weekday % 3) * 45 * 60 * 1000 + 30 * 60 * 1000);
  const varjyamEnd = new Date(varjyamStart.getTime() + 90 * 60 * 1000);
  const amritaStart = new Date(sunset.getTime() - 90 * 60 * 1000 - (weekday % 2) * 30 * 60 * 1000);
  const amritaEnd = new Date(sunset.getTime() - (weekday % 2) * 30 * 60 * 1000);

  result.push(
    createPeriod(
      "abhijit",
      "Abhijit Muhurtham",
      "അഭിജിത് മുഹൂർത്തം",
      new Date(midday.getTime() - 24 * 60 * 1000),
      new Date(midday.getTime() + 24 * 60 * 1000),
      "favorable",
      "പകൽ സമയത്തിന്റെ മധ്യത്തിൽ വരുന്ന, പരമ്പരാഗതമായി ശുഭമായി കണക്കാക്കുന്ന മുഹൂർത്തം.",
    ),
    createPeriod(
      "durmuhurtham",
      "Dur Muhurtham",
      "ദുർമ്മുഹൂർത്തം",
      durMuhurthamStart,
      durMuhurthamEnd,
      "inauspicious",
      "പാരമ്പര്യമായി നന്മ നേരിടാൻ അല്ലെങ്കിൽ സുവർണ്ണകാര്യങ്ങൾ ആരംഭിക്കാൻ ഒഴിവാക്കിവിടുന്ന ഒരു ചെറുകാലം.",
    ),
    createPeriod(
      "varjyam",
      "Varjyam",
      "വർജ്യം",
      new Date(Math.max(sunrise.getTime(), varjyamStart.getTime())),
      new Date(Math.min(sunset.getTime(), varjyamEnd.getTime())),
      "inauspicious",
      "പാരമ്പര്യമനുസരിച്ച് നക്ഷത്ര-ദിവസ വിഭജനത്തിൽ ലഭിക്കുന്ന നന്മ കുറയ്ക്കുന്ന കാലം.",
    ),
    createPeriod(
      "amritakalam",
      "Amrita Kalam",
      "അമൃതകാലം",
      amritaStart,
      amritaEnd,
      "favorable",
      "പാരമ്പര്യം അനുസരിച്ച് പുണ്യം, പഠനം, ശുഭകാരണങ്ങൾ എന്നിവയ്ക്ക് അനുയോജ്യമായ അമൃതാവസ്ഥയുള്ള സമയം.",
    ),
    createPeriod(
      "daylight",
      "Daylight",
      "പകൽ സമയം",
      sunrise,
      sunset,
      "neutral",
      "സൂര്യോദയത്തിനും അസ്തമയത്തിനും ഇടയിലുള്ള പകൽ സമയം.",
    ),
    createPeriod(
      "brahma",
      "Brahma Muhurtham",
      "ബ്രഹ്മമുഹൂർത്തം",
      new Date(sunrise.getTime() - 96 * 60 * 1000),
      new Date(sunrise.getTime() - 48 * 60 * 1000),
      "favorable",
      "സൂര്യോദയത്തിന് മുമ്പുള്ള പരമ്പരാഗതമായി ധ്യാനത്തിനും പഠനത്തിനും അനുയോജ്യമെന്ന് കരുതുന്ന സമയം.",
    ),
  );

  return result.sort((left, right) => left.start.localeCompare(right.start));
}

function getBirthReference(profile?: BirthProfile): { nakshatra: string; moonSign: string } {
  if (!profile) return { nakshatra: "ലഭ്യമല്ല", moonSign: "ലഭ്യമല്ല" };
  const [hour, minute] = profile.timeOfBirth.split(":").map(Number);
  const birthInstant = zonedDateTimeToUtc(
    profile.dateOfBirth,
    hour,
    minute,
    profile.placeOfBirth.timeZone,
  );
  const birthMoon = siderealLongitude(Body.Moon, birthInstant);
  return {
    nakshatra: NAKSHATRA_NAMES[Math.floor(birthMoon / (360 / 27))],
    moonSign: ZODIAC_SIGNS[Math.floor(birthMoon / 30)],
  };
}

function findCurrentSubperiod(
  parentStart: number,
  parentEnd: number,
  parentLordIndex: number,
  target: number,
): VimshottariPeriod | null {
  let start = parentStart;
  const parentDuration = parentEnd - parentStart;

  for (let index = 0; index < VIMSHOTTARI_LORDS.length; index += 1) {
    const lordIndex = (parentLordIndex + index) % VIMSHOTTARI_LORDS.length;
    const lord = VIMSHOTTARI_LORDS[lordIndex];
    const end = index === VIMSHOTTARI_LORDS.length - 1
      ? parentEnd
      : start + parentDuration * lord.years / 120;
    if (target >= start && target < end) {
      return {
        lord: lord.name,
        malayalamLord: lord.malayalamName,
        start: new Date(start).toISOString(),
        end: new Date(end).toISOString(),
      };
    }
    start = end;
  }
  return null;
}

export function calculateVimshottariSchedule(
  profile: BirthProfile,
  targetDate: string,
): VimshottariSchedule {
  const [hour, minute] = profile.timeOfBirth.split(":").map(Number);
  const birthInstant = zonedDateTimeToUtc(
    profile.dateOfBirth,
    hour,
    minute,
    profile.placeOfBirth.timeZone,
  ).getTime();
  const targetInstant = zonedDateTimeToUtc(
    targetDate,
    12,
    0,
    profile.dailyPlace.timeZone,
  ).getTime();
  const moonLongitude = siderealLongitude(Body.Moon, new Date(birthInstant));
  const nakshatraSize = 360 / 27;
  const nakshatraIndex = Math.floor(moonLongitude / nakshatraSize);
  const progress = (moonLongitude - nakshatraIndex * nakshatraSize) / nakshatraSize;
  const firstLordIndex = nakshatraIndex % VIMSHOTTARI_LORDS.length;
  const firstLord = VIMSHOTTARI_LORDS[firstLordIndex];
  const firstMahadashaDuration = firstLord.years * VIMSHOTTARI_YEAR_MS;
  let mahadashaStart = birthInstant - firstMahadashaDuration * progress;
  let mahadasha: VimshottariPeriod | null = null;
  let mahadashaLordIndex = firstLordIndex;

  for (let index = 0; index < 1000; index += 1) {
    mahadashaLordIndex = (firstLordIndex + index) % VIMSHOTTARI_LORDS.length;
    const lord = VIMSHOTTARI_LORDS[mahadashaLordIndex];
    const duration = index === 0
      ? firstMahadashaDuration
      : lord.years * VIMSHOTTARI_YEAR_MS;
    const mahadashaEnd = mahadashaStart + duration;
    if (targetInstant >= mahadashaStart && targetInstant < mahadashaEnd) {
      mahadasha = {
        lord: lord.name,
        malayalamLord: lord.malayalamName,
        start: new Date(mahadashaStart).toISOString(),
        end: new Date(mahadashaEnd).toISOString(),
      };
      break;
    }
    mahadashaStart = mahadashaEnd;
  }

  if (!mahadasha) {
    throw new RangeError("Could not find the active Vimshottari Mahadasha.");
  }

  const antardasha = findCurrentSubperiod(
    new Date(mahadasha.start).getTime(),
    new Date(mahadasha.end).getTime(),
    mahadashaLordIndex,
    targetInstant,
  );
  if (!antardasha) {
    throw new RangeError("Could not find the active Vimshottari Antardasha.");
  }

  const pratyantardashaLordIndex = VIMSHOTTARI_LORDS.findIndex(
    (lord) => lord.name === antardasha.lord,
  );
  const pratyantardasha = findCurrentSubperiod(
    new Date(antardasha.start).getTime(),
    new Date(antardasha.end).getTime(),
    pratyantardashaLordIndex,
    targetInstant,
  );
  if (!pratyantardasha) {
    throw new RangeError("Could not find the active Vimshottari Pratyantardasha.");
  }

  return { mahadasha, antardasha, pratyantardasha };
}

export function calculateDailyPanchangam(
  date: string,
  place: Place,
  birthProfile?: BirthProfile,
): PanchangamRecord {
  const anchor = zonedDateTimeToUtc(date, 12, 0, place.timeZone);
  const sunLongitude = (instant: Date) => siderealLongitude(Body.Sun, instant);
  const moonLongitude = (instant: Date) => siderealLongitude(Body.Moon, instant);
  const elongation = (instant: Date) => wrapDegrees(moonLongitude(instant) - sunLongitude(instant));
  const yogaLongitude = (instant: Date) => wrapDegrees(moonLongitude(instant) + sunLongitude(instant));
  const sunEvents = findSunEvents(date, place);
  const karanaIndex = Math.floor(elongation(anchor) / 6);

  const planets: PlanetPosition[] = PLANETS.map(({ body, malayalamName }) => {
    const longitude = siderealLongitude(body, anchor);
    return {
      name: malayalamName,
      sign: ZODIAC_SIGNS[Math.floor(longitude / 30)],
      longitude: Number(longitude.toFixed(2)),
    };
  });

  return {
    date,
    place,
    sunrise: sunEvents.sunrise?.toISOString() ?? null,
    sunset: sunEvents.sunset?.toISOString() ?? null,
    tithi: panchangaValue(
      anchor,
      elongation,
      12,
      LUNAR_DAY_NAMES,
      (index) => `${index < 15 ? "ശുക്ലപക്ഷം" : "കൃഷ്ണപക്ഷം"} ${LUNAR_DAY_NAMES[index]}`,
    ),
    nakshatra: panchangaValue(anchor, moonLongitude, 360 / 27, NAKSHATRA_NAMES),
    yoga: panchangaValue(anchor, yogaLongitude, 360 / 27, YOGA_NAMES),
    karana: panchangaValue(
      anchor,
      elongation,
      6,
      KARANA_NAMES,
      () => karanaName(karanaIndex),
    ),
    moonSign: ZODIAC_SIGNS[Math.floor(moonLongitude(anchor) / 30)],
    birthReference: getBirthReference(birthProfile),
    planets,
    periods: createPeriods(date, sunEvents.sunrise, sunEvents.sunset),
    unavailable: [],
    calculatedAt: new Date().toISOString(),
    calculation: {
      engine: "Astronomy Engine",
      engineVersion: "2.1.19",
      ayanamsa: "Lahiri linearized approximation",
      source: "Astronomy Engine geocentric ephemeris; sunrise/sunset by observer coordinates",
    },
  };
}

export async function calculateThreeMonths(
  place: Place,
  startDate: string,
  onProgress: (completed: number, total: number) => void,
  birthProfile?: BirthProfile,
): Promise<PanchangamRecord[]> {
  const total = 92;
  const records: PanchangamRecord[] = [];
  for (let index = 0; index < total; index += 1) {
    records.push(calculateDailyPanchangam(addCalendarDays(startDate, index), place, birthProfile));
    onProgress(index + 1, total);
    if (index % 3 === 2) {
      await new Promise<void>((resolve) => window.setTimeout(resolve, 0));
    }
  }
  return records;
}
