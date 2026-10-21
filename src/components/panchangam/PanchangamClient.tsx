"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  ChevronRight,
  Clock3,
  House,
  MapPin,
  Moon,
  ShieldCheck,
  Sun,
} from "lucide-react";
import BirthDetailsForm from "./BirthDetailsForm";
import DailyTimeGraph from "./DailyTimeGraph";
import PanchangamDetailsPage from "./PanchangamDetailsPage";
import PWAInstallButton from "./PWAInstallButton";
import VimshottariSummary from "./VimshottariSummary";
import { calculateDailyPanchangam, calculateThreeMonths } from "@/lib/panchangam/astronomy";
import { addCalendarDays, dateInTimeZone, formatMalayalamDate, formatTime } from "@/lib/panchangam/date-time";
import { isKeralaDistrictPlace } from "@/lib/panchangam/kerala-districts";
import { LocalPanchangamStore } from "@/lib/panchangam/store";
import type { BirthProfile, PanchangamRecord } from "@/lib/panchangam/types";

const FRESH_FOR_MS = 24 * 60 * 60 * 1000;
const CACHE_LENGTH_DAYS = 92;

export default function PanchangamClient() {
  const [profile, setProfile] = useState<BirthProfile | null>(null);
  const [record, setRecord] = useState<PanchangamRecord | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [today, setToday] = useState("");
  const [editing, setEditing] = useState(true);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [storageReady, setStorageReady] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [online, setOnline] = useState(true);
  const [stale, setStale] = useState(false);
  const detailsTrigger = useRef<HTMLButtonElement>(null);
  const restoreDetailsFocus = useRef(false);

  const selectableDates = today
    ? Array.from({ length: 7 }, (_, index) => addCalendarDays(today, index))
    : [];

  const calculateAndSave = useCallback(async (selectedProfile: BirthProfile, startDate: string) => {
    setBusy(true);
    setProgress(0);
    setError("");
    try {
      const records = await calculateThreeMonths(selectedProfile.dailyPlace, startDate, (complete, total) => {
        setProgress(Math.round((complete / total) * 100));
      }, selectedProfile);
      await LocalPanchangamStore.saveRecords(records, startDate);
      const current = records.find((item) => item.date === startDate);
      if (!current) throw new Error("The calculated date is missing from the Panchangam result.");
      setRecord(current);
      setSelectedDate(startDate);
      setToday(startDate);
      setStale(false);
      setEditing(false);
      setStorageReady(true);
    } catch (cause) {
      console.error("Panchangam calculation failed.", cause);
      setError(cause instanceof Error ? cause.message : String(cause));
      setStorageReady(true);
    } finally {
      setBusy(false);
    }
  }, []);

  useEffect(() => {
    setOnline(navigator.onLine);
    const onOnline = () => setOnline(true);
    const onOffline = () => setOnline(false);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);

    let cancelled = false;
    async function restore() {
      try {
        const savedProfile = LocalPanchangamStore.loadProfile();
        if (!savedProfile) {
          if (!cancelled) setStorageReady(true);
          return;
        }
        const currentDate = dateInTimeZone(new Date(), savedProfile.dailyPlace.timeZone);
        if (cancelled) return;
        setProfile(savedProfile);
        setToday(currentDate);
        setSelectedDate(currentDate);
        const hasKeralaDistricts = isKeralaDistrictPlace(savedProfile.placeOfBirth)
          && isKeralaDistrictPlace(savedProfile.dailyPlace);
        if (!hasKeralaDistricts) {
          setEditing(true);
          setStorageReady(true);
          return;
        }

        const cached = await LocalPanchangamStore.getRecord(currentDate, savedProfile.dailyPlace.id);
        if (cancelled) return;
        if (cached) {
          setRecord(cached);
          setEditing(false);
          const isStale = Date.now() - new Date(cached.calculatedAt).getTime() > FRESH_FOR_MS;
          setStale(isStale);
          setStorageReady(true);
          if (isStale && navigator.onLine) {
            await calculateAndSave(savedProfile, currentDate);
          }
        } else if (navigator.onLine) {
          await calculateAndSave(savedProfile, currentDate);
        } else {
          setEditing(false);
          setStorageReady(true);
          setError("ഈ തീയതിക്കായി ഓഫ്‌ലൈനിൽ സൂക്ഷിച്ച ഡാറ്റയില്ല. ഇന്റർനെറ്റ് ലഭിക്കുമ്പോൾ വീണ്ടും ശ്രമിക്കുക.");
        }
      } catch (cause) {
        if (cancelled) return;
        setStorageReady(true);
        setError(cause instanceof Error ? cause.message : "സംരക്ഷിച്ച വിവരങ്ങൾ വായിക്കാനായില്ല.");
      }
    }

    void restore();
    return () => {
      cancelled = true;
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, [calculateAndSave]);

  useEffect(() => {
    const onPopState = () => {
      setDetailsOpen(false);
      document.body.style.overflow = "";
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    document.body.style.overflow = detailsOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [detailsOpen]);

  useEffect(() => {
    if (restoreDetailsFocus.current && !detailsOpen) {
      restoreDetailsFocus.current = false;
      detailsTrigger.current?.focus();
    }
  }, [detailsOpen]);

  const loadDate = useCallback(async (date: string) => {
    if (!profile || date < today || date > addCalendarDays(today, 6)) return;
    setSelectedDate(date);
    setError("");
    try {
      const cached = await LocalPanchangamStore.getRecord(date, profile.dailyPlace.id);
      if (cached) {
        const isStale = Date.now() - new Date(cached.calculatedAt).getTime() > FRESH_FOR_MS;
        if (isStale && navigator.onLine) {
          const freshRecord = calculateDailyPanchangam(date, profile.dailyPlace, profile);
          await LocalPanchangamStore.saveRecords([freshRecord], today);
          setRecord(freshRecord);
          setStale(false);
        } else {
          setRecord(cached);
          setStale(isStale);
        }
      } else {
        setBusy(true);
        const calculated = calculateDailyPanchangam(date, profile.dailyPlace, profile);
        await LocalPanchangamStore.saveRecords([calculated], today);
        setRecord(calculated);
        setStale(false);
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "ഈ ദിവസത്തെ പഞ്ചാംഗം ലഭ്യമല്ല.");
    } finally {
      setBusy(false);
    }
  }, [profile, today]);

  const openPanchangamSetup = useCallback(() => {
    setEditing(true);
    setDetailsOpen(false);
  }, []);

  function submitProfile(nextProfile: BirthProfile) {
    try {
      LocalPanchangamStore.saveProfile(nextProfile);
      setProfile(nextProfile);
      const startDate = dateInTimeZone(new Date(), nextProfile.dailyPlace.timeZone);
      setToday(startDate);
      setRecord(null);
      void calculateAndSave(nextProfile, startDate);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "പ്രൊഫൈൽ സംരക്ഷിക്കാനായില്ല.");
    }

  }

  async function refreshSelectedDate() {
    if (!profile) return;
    setBusy(true);
    setError("");
    try {
      const freshRecord = calculateDailyPanchangam(selectedDate, profile.dailyPlace, profile);
      await LocalPanchangamStore.saveRecords([freshRecord], today);
      setRecord(freshRecord);
      setStale(false);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "ഈ ദിവസത്തെ പഞ്ചാംഗം പുതുക്കാനായില്ല.");
    } finally {
      setBusy(false);
    }
  }

  function openDetails() {
    if (!record) return;
    restoreDetailsFocus.current = true;
    window.history.pushState({ panchangamDetails: true }, "", `${window.location.pathname}#details`);
    setDetailsOpen(true);
  }

  const closeDetails = useCallback(() => {
    if (window.history.state?.panchangamDetails) {
      window.history.back();
    } else {
      setDetailsOpen(false);
    }
  }, []);

  if (!storageReady) {
    return (
      <main className="panch-app" lang="ml">
        <div className="panch-loading-shell" aria-label="പഞ്ചാംഗം ലോഡ് ചെയ്യുന്നു">
          <div className="panch-skeleton panch-skeleton-title" />
          <div className="panch-skeleton panch-skeleton-card" />
          <div className="panch-skeleton panch-skeleton-chart" />
        </div>
      </main>
    );
  }

  if (detailsOpen && record) {
    return <PanchangamDetailsPage record={record} onBack={closeDetails} />;
  }

  return (
    <main className="panch-app" lang="ml">
      <div className="panch-shell">
        <header className="panch-app-header">
          <Link href="/" className="panch-back-link" aria-label="പോർട്ട്ഫോളിയോയിലേക്ക് മടങ്ങുക">
            <House size={16} />
            <span>പോർട്ട്ഫോളിയോ</span>
          </Link>
          <div className="panch-app-brand">
            <div className="panch-brand-mark"><Moon size={21} /></div>
            <div>
              <strong>Personal Panchangam</strong>
              <span>വ്യക്തിഗത ദിനപഞ്ചാംഗം</span>
            </div>
          </div>
          <div className="panch-header-actions">
            <PWAInstallButton />
            {profile && !editing && (
              <button className="panch-icon-button" type="button" onClick={openPanchangamSetup} aria-label="പഞ്ചാംഗം ഹോമിലേക്ക് മടങ്ങുക">
                <House size={19} />
              </button>
            )}
          </div>
        </header>

        <div className="panch-location-bar">
          <MapPin size={16} />
          <span>
            {profile && isKeralaDistrictPlace(profile.dailyPlace)
              ? profile.dailyPlace.name
              : "കേരളത്തിലെ ജില്ല തിരഞ്ഞെടുക്കുക"}
          </span>
          {profile && isKeralaDistrictPlace(profile.dailyPlace) && <small>{profile.dailyPlace.timeZone}</small>}
          <span className={`panch-network-badge ${online ? "is-online" : "is-offline"}`}>
            <i />{online ? "ഓൺലൈൻ" : "ഓഫ്‌ലൈൻ"}
          </span>
        </div>

        {error && (
          <div className="panch-error-banner" role="alert">
            <span>{error}</span>
            {profile && (
              <button type="button" onClick={() => void calculateAndSave(profile, today || dateInTimeZone(new Date(), profile.dailyPlace.timeZone))}>
                വീണ്ടും ശ്രമിക്കുക
              </button>
            )}
          </div>
        )}

        {editing || !profile ? (
          <section className="panch-intro">
            <div className="panch-hero-copy">
              <span className="panch-eyebrow"><Sun size={14} /> പ്രാദേശിക സമയവും പരമ്പരാഗത കണക്കുകളും</span>
              <h1>ദിവസത്തിന്റെ താളം,<br /><em>നിങ്ങളുടെ സമയത്ത്.</em></h1>
              <p>
                ജനനവിവരങ്ങൾ ഒരിക്കൽ നൽകൂ. നിങ്ങൾ തിരഞ്ഞെടുത്ത സ്ഥലത്തിനായി
                അടുത്ത മൂന്ന് മാസത്തെ പഞ്ചാംഗം ഈ ഉപകരണത്തിൽ തയ്യാറാക്കാം.
              </p>
            </div>
            <BirthDetailsForm
              key={profile ? "editing-profile" : "new-profile"}
              initialProfile={profile}
              busy={busy}
              onSubmit={submitProfile}
            />
            <div className="panch-privacy-note"><ShieldCheck size={16} /> നിങ്ങളുടെ വിവരങ്ങൾ നിങ്ങളുടെ ഉപകരണത്തിൽ മാത്രം സൂക്ഷിക്കുന്നു.</div>
          </section>
        ) : (
          <>
            <section className="panch-dashboard-heading">
              <div className="panch-dashboard-title">
                <div className="panch-dashboard-title-line">
                  <span className="panch-eyebrow"><CalendarDays size={14} /> ദിന പഞ്ചാംഗം</span>
                  <h1>ഇന്നത്തെ പഞ്ചാംഗം</h1>
                  <p>{record ? formatMalayalamDate(selectedDate, record.place.timeZone) : "തീയതി തിരഞ്ഞെടുക്കുക"}</p>
                </div>
                {profile && selectedDate && (
                  <VimshottariSummary profile={profile} date={selectedDate} compact />
                )}
              </div>
              <div className="panch-date-controls">
                <span className="panch-date-label">Select your day</span>
                <div className="panch-day-selector" role="group" aria-label="Select a day for Panchangam">
                  {selectableDates.map((date) => {
                    const day = new Date(`${date}T12:00:00Z`);
                    const weekday = new Intl.DateTimeFormat("ml-IN", {
                      weekday: "short",
                      timeZone: "UTC",
                    }).format(day);
                    const dayNumber = new Intl.DateTimeFormat("en", {
                      day: "numeric",
                      timeZone: "UTC",
                    }).format(day);
                    const month = new Intl.DateTimeFormat("ml-IN", {
                      month: "short",
                      timeZone: "UTC",
                    }).format(day);
                    return (
                      <button
                        className={`panch-day-option${selectedDate === date ? " is-selected" : ""}`}
                        key={date}
                        type="button"
                        aria-label={formatMalayalamDate(date, profile?.dailyPlace.timeZone ?? "Asia/Kolkata")}
                        aria-pressed={selectedDate === date}
                        onClick={() => void loadDate(date)}
                      >
                        <span>{date === today ? "ഇന്ന്" : weekday}</span>
                        <strong>{dayNumber}</strong>
                        <small>{month}</small>
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>

            {busy ? (
              <section className="panch-card panch-progress-card" aria-live="polite">
                <div className="panch-progress-top"><Clock3 size={18} /><span>അടുത്ത മൂന്ന് മാസത്തെ പഞ്ചാംഗം കണക്കാക്കുന്നു</span><strong>{progress}%</strong></div>
                <div className="panch-progress-track"><i style={{ width: `${progress}%` }} /></div>
                <p>ആകാശഗണിതം ഈ ഉപകരണത്തിൽ പ്രാദേശികമായി കണക്കാക്കുന്നു. കണക്കുകൾ ലഭ്യമാക്കുമ്പോൾ പേജ് തുറന്നുവെക്കുക.</p>
              </section>
            ) : record && record.date === selectedDate ? (
              <>
                {stale && (
                  <div className="panch-stale-banner" role="status">
                    ഈ വിവരങ്ങൾ ഒരു ദിവസത്തിലധികം പഴക്കമുള്ളതാണ്. {online ? "കണക്ക് പുതുക്കുക." : "ഓൺലൈനാകുമ്പോൾ പുതുക്കുക."}
                    {online && (
                      <button type="button" onClick={() => void refreshSelectedDate()}>
                        ഇപ്പോൾ പുതുക്കുക
                      </button>
                    )}
                  </div>
                )}
                <div className="panch-dashboard-priority">
                  <DailyTimeGraph record={record} />
                </div>

                <button
                  ref={detailsTrigger}
                  className="panch-details-button"
                  type="button"
                  onClick={openDetails}
                >
                  പൂർണ്ണ പഞ്ചാംഗ വിവരങ്ങൾ കാണുക <ChevronRight size={18} />
                </button>

              </>
            ) : (
              <div className="panch-empty-state">
                <CalendarDays size={24} />
                <strong>ഈ ദിവസത്തെ വിവരങ്ങൾ ലഭ്യമല്ല.</strong>
                <p>തീയതി പരിധിക്കുള്ളിൽ തിരഞ്ഞെടുക്കുക അല്ലെങ്കിൽ വീണ്ടും കണക്കാക്കുക.</p>
              </div>
            )}
          </>
        )}

      </div>
    </main>
  );
}
