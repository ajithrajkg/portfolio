export type Place = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  timeZone: string;
  district?: string;
};

export type BirthProfile = {
  dateOfBirth: string;
  timeOfBirth: string;
  placeOfBirth: Place;
  dailyPlace: Place;
};

export type PeriodKind = "favorable" | "neutral" | "inauspicious";

export type TimePeriod = {
  id: string;
  name: string;
  malayalamName: string;
  start: string;
  end: string;
  kind: PeriodKind;
  explanation: string;
  source: "astronomical" | "traditional-rule";
};

export type PanchangaValue = {
  value: string;
  start: string;
  end: string;
};

export type PlanetPosition = {
  name: string;
  sign: string;
  longitude: number;
};

export type VimshottariPeriod = {
  lord: string;
  malayalamLord: string;
  start: string;
  end: string;
};

export type VimshottariSchedule = {
  mahadasha: VimshottariPeriod;
  antardasha: VimshottariPeriod;
  pratyantardasha: VimshottariPeriod;
};

export type PanchangamRecord = {
  date: string;
  place: Place;
  sunrise: string | null;
  sunset: string | null;
  tithi: PanchangaValue;
  nakshatra: PanchangaValue;
  yoga: PanchangaValue;
  karana: PanchangaValue;
  moonSign: string;
  birthReference: {
    nakshatra: string;
    moonSign: string;
  };
  planets: PlanetPosition[];
  periods: TimePeriod[];
  unavailable: string[];
  calculatedAt: string;
  calculation: {
    engine: string;
    engineVersion: string;
    ayanamsa: string;
    source: string;
  };
};
