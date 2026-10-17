"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { KERALA_DISTRICTS } from "@/lib/panchangam/kerala-districts";
import type { Place } from "@/lib/panchangam/types";

type PlaceSelectorProps = {
  id: string;
  label: string;
  value: Place | null;
  onChange: (place: Place | null) => void;
  error?: string;
};

export default function PlaceSelector({ id, label, value, onChange, error }: PlaceSelectorProps) {
  const selectedDistrict = KERALA_DISTRICTS.find((district) => district.id === value?.district);
  const [query, setQuery] = useState(selectedDistrict?.malayalamName ?? "");
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (selectedDistrict) setQuery(selectedDistrict.malayalamName);
  }, [selectedDistrict?.id]);

  const results = useMemo(() => {
    const search = query.trim().toLocaleLowerCase();
    if (!search) return KERALA_DISTRICTS;
    return KERALA_DISTRICTS.filter((district) => (
      district.name.toLocaleLowerCase().includes(search)
      || district.malayalamName.includes(search)
      || district.id.includes(search)
    ));
  }, [query]);

  function chooseDistrict(districtId: string) {
    const district = KERALA_DISTRICTS.find((item) => item.id === districtId);
    if (!district) return;

    onChange({
      id: `kerala-district:${district.id}`,
      district: district.id,
      name: `${district.name} District, Kerala, India`,
      latitude: district.latitude,
      longitude: district.longitude,
      timeZone: "Asia/Kolkata",
    });
    setQuery(district.malayalamName);
    setShowResults(false);
  }

  return (
    <div className="panch-field">
      <label htmlFor={id}>{label}</label>
      <div className="panch-place-wrap">
        <div className="panch-place-search">
          <input
            id={id}
            autoComplete="off"
            value={query}
            onFocus={() => {
              if (!selectedDistrict) setShowResults(true);
            }}
            onChange={(event) => {
              setQuery(event.target.value);
              setShowResults(true);
              onChange(null);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                if (results.length === 1) chooseDistrict(results[0].id);
                else setShowResults(true);
              }
              if (event.key === "Escape") setShowResults(false);
            }}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `place-error-${id}` : undefined}
            aria-autocomplete="list"
            aria-expanded={showResults && results.length > 0}
            aria-controls={`${id}-district-results`}
            placeholder="കേരളത്തിലെ ജില്ല തിരയുക"
          />
          <button
            type="button"
            onClick={() => setShowResults((current) => !current)}
            aria-label="ജില്ലകൾ കാണിക്കുക"
            aria-expanded={showResults}
          >
            <Search size={15} />
          </button>
        </div>
        {showResults && (
          <ul className="panch-place-results" id={`${id}-district-results`} role="listbox" aria-label="കേരളത്തിലെ ജില്ലകൾ">
            {results.length ? results.map((district) => (
              <li key={district.id} role="option" aria-selected={value?.district === district.id}>
                <button
                  type="button"
                  onClick={() => chooseDistrict(district.id)}
                  className={value?.district === district.id ? "is-selected" : ""}
                >
                  <span>{district.malayalamName}</span>
                  <small>{district.name} ജില്ല, കേരളം</small>
                </button>
              </li>
            )) : (
              <li className="panch-place-no-results" role="status">ജില്ല കണ്ടെത്തിയില്ല. കേരളത്തിലെ 14 ജില്ലകളിൽ ഒന്ന് തിരയുക.</li>
            )}
          </ul>
        )}
      </div>
      {value && (
        <p className="panch-field-hint">
          {value.district && selectedDistrict
            ? `${selectedDistrict.name} ജില്ലയുടെ സൂചനാകേന്ദ്രം · `
            : ""}
          {value.latitude.toFixed(4)}, {value.longitude.toFixed(4)} · {value.timeZone}
        </p>
      )}
      <p className="panch-field-hint">കേരളത്തിലെ ജില്ലകൾ മാത്രം തിരഞ്ഞെടുക്കാം. OpenStreetMap സംഭാവകരുടെ ജില്ലാ സൂചനാകേന്ദ്രങ്ങളാണ് ഉപയോഗിക്കുന്നത്.</p>
      {error && (
        <p className="panch-form-error" id={error ? `place-error-${id}` : undefined} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
