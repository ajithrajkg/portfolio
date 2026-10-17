"use client";

import { useState } from "react";
import { MapPin, Sparkles } from "lucide-react";
import PlaceSelector from "./PlaceSelector";
import { isKeralaDistrictPlace } from "@/lib/panchangam/kerala-districts";
import type { BirthProfile, Place } from "@/lib/panchangam/types";

type BirthDetailsFormProps = {
  initialProfile?: BirthProfile | null;
  busy: boolean;
  onSubmit: (profile: BirthProfile) => void;
};

export default function BirthDetailsForm({
  initialProfile,
  busy,
  onSubmit,
}: BirthDetailsFormProps) {
  const [dateOfBirth, setDateOfBirth] = useState(initialProfile?.dateOfBirth ?? "");
  const [timeOfBirth, setTimeOfBirth] = useState(initialProfile?.timeOfBirth ?? "");
  const [birthPlace, setBirthPlace] = useState<Place | null>(
    initialProfile?.placeOfBirth && isKeralaDistrictPlace(initialProfile.placeOfBirth)
      ? initialProfile.placeOfBirth
      : null,
  );
  const [dailyPlace, setDailyPlace] = useState<Place | null>(
    initialProfile?.dailyPlace && isKeralaDistrictPlace(initialProfile.dailyPlace)
      ? initialProfile.dailyPlace
      : null,
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!dateOfBirth) nextErrors.date = "ജനനത്തീയതി നൽകുക.";
    else if (dateOfBirth > new Date().toISOString().slice(0, 10)) {
      nextErrors.date = "ജനനത്തീയതി ഭാവിയിലാകരുത്.";
    }
    if (!timeOfBirth) nextErrors.time = "ജനനസമയം നൽകുക.";
    if (!birthPlace) nextErrors.birthPlace = "ജനനസ്ഥലം തിരഞ്ഞെടുക്കുക.";
    if (!dailyPlace) nextErrors.dailyPlace = "ദൈനംദിന പഞ്ചാംഗത്തിനുള്ള സ്ഥലം തിരഞ്ഞെടുക്കുക.";
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length || !birthPlace || !dailyPlace) return;
    onSubmit({ dateOfBirth, timeOfBirth, placeOfBirth: birthPlace, dailyPlace });
  }

  return (
    <form className="panch-profile-card" onSubmit={submit} noValidate>
      <div className="panch-form-heading">
        <div className="panch-icon-tile"><Sparkles size={20} /></div>
        <div>
          <span className="panch-eyebrow">സ്വകാര്യ പഞ്ചാംഗം</span>
          <h2>{initialProfile ? "വിവരങ്ങൾ തിരുത്തുക" : "നിങ്ങളുടെ വിവരങ്ങൾ ചേർക്കുക"}</h2>
          <p>ജനനവിവരങ്ങൾ ഈ ഉപകരണത്തിൽ മാത്രം സൂക്ഷിക്കുന്നു.</p>
        </div>
      </div>
      <div className="panch-form-grid">
        <div className="panch-field">
          <label htmlFor="birth-date">ജനനത്തീയതി</label>
          <input
            id="birth-date"
            type="date"
            max={new Date().toISOString().slice(0, 10)}
            value={dateOfBirth}
            onChange={(event) => setDateOfBirth(event.target.value)}
            aria-invalid={Boolean(errors.date)}
            aria-describedby={errors.date ? "birth-date-error" : undefined}
          />
          {errors.date && <p className="panch-form-error" id="birth-date-error">{errors.date}</p>}
        </div>
        <div className="panch-field">
          <label htmlFor="birth-time">ജനനസമയം</label>
          <input
            id="birth-time"
            type="time"
            value={timeOfBirth}
            onChange={(event) => setTimeOfBirth(event.target.value)}
            aria-invalid={Boolean(errors.time)}
            aria-describedby={errors.time ? "birth-time-error" : undefined}
          />
          {errors.time && <p className="panch-form-error" id="birth-time-error">{errors.time}</p>}
        </div>
        <PlaceSelector
          id="birth-place"
          label="ജനനസ്ഥലം"
          value={birthPlace}
          onChange={setBirthPlace}
          error={errors.birthPlace}
        />
        <PlaceSelector
          id="daily-place"
          label="ദൈനംദിന പഞ്ചാംഗത്തിനുള്ള സ്ഥലം"
          value={dailyPlace}
          onChange={setDailyPlace}
          error={errors.dailyPlace}
        />
      </div>
      <div className="panch-location-note">
        <MapPin size={16} />
        <span>സൂര്യോദയം, അസ്തമയം, സമയങ്ങൾ എന്നിവ തിരഞ്ഞെടുത്ത സ്ഥലത്തിന്റെ സമയമേഖലയിൽ കണക്കാക്കും.</span>
      </div>
      <button className="panch-primary-button" type="submit" disabled={busy}>
        {busy ? "പഞ്ചാംഗം കണക്കാക്കുന്നു…" : "പഞ്ചാംഗം കാണുക"}
      </button>
    </form>
  );
}
