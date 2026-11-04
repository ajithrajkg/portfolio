"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff, Info, Layers, Moon, Plus, Settings, Sun, Trash2, X } from "lucide-react";

const examples = [
  { id: 1, word: "ഡിസ്‌ക്രിപ്ഷൻ", english: "description" },
  { id: 2, word: "സബ്മിഷൻസ്", english: "submissions" },
  { id: 3, word: "വെൽക്കം", english: "welcome" },
  { id: 4, word: "കോൺടെന്റ് ഹോം", english: "content home" },
  { id: 5, word: "യൂസർ മാനുവൽ", english: "user manual" },
];

export default function LearnSpellingApp() {
  const [text, setText] = useState("");
  const [items, setItems] = useState([]);
  const [shown, setShown] = useState({});
  const [showAll, setShowAll] = useState(false);
  const [dark, setDark] = useState(false);
  const [dialog, setDialog] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    let active = true;
    async function loadItems() {
      try {
        const response = await fetch("/.netlify/functions/entries");
        const body = await response.json();
        if (!response.ok) throw new Error(body.error || "Could not load saved text.");
        const savedItems = (Array.isArray(body) ? body : []).map((item) => ({
          id: item.id,
          word: item.malayalam || item.english,
          english: item.english,
          malayalam: item.malayalam,
        }));
        if (active) setItems(savedItems);
      } catch (error) {
        if (active) setStatus(error.message || "Could not load saved text.");
      } finally {
        if (active) setLoading(false);
      }
    }
    loadItems();
    return () => { active = false; };
  }, []);

  async function addText(event) {
    event.preventDefault();
    const value = text.trim();
    if (!value || saving) return;
    setSaving(true);
    setStatus("");
    try {
      const response = await fetch("/.netlify/functions/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ english: value }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Could not save text.");
      const item = body.entry;
      setItems((current) => [...current, {
        id: item.id,
        word: item.malayalam || item.english,
        english: item.english,
        malayalam: item.malayalam,
      }]);
      setShowAll(true);
      setText("");
      setStatus("Saved to Netlify Blobs");
    } catch (error) {
      setStatus(error.message || "Could not save text.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteItem(id) {
    setStatus("");
    try {
      const response = await fetch("/.netlify/functions/entries?id=" + encodeURIComponent(id), { method: "DELETE" });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Could not delete saved text.");
      setItems((current) => current.filter((item) => item.id !== id));
      setShown((current) => {
        const next = { ...current };
        delete next[id];
        return next;
      });
    } catch (error) {
      setStatus(error.message || "Could not delete saved text.");
    }
  }
  return (
    <div className={"e2m-shell" + (dark ? " e2m-dark" : "")}>
      <header className="e2m-header">
        <a className="e2m-brand" href="/learn-spelling/" aria-label="E2M home">
          <span className="e2m-mark">E2M</span><span className="e2m-name">E2M</span>
        </a>
        <span className="e2m-divider" />
        <div className="e2m-heading">
          <strong>English <span>→</span> മലയാളം</strong>
          <small>Phonetic Transliteration</small>
        </div>
        <div className="e2m-tools">
          <button aria-label="Toggle theme" onClick={() => setDark(!dark)}>{dark ? <Sun /> : <Moon />}</button>
          <button aria-label="About E2M" onClick={() => setDialog("about")}><Info /></button>
          <button aria-label="Settings" onClick={() => setDialog("settings")}><Settings /></button>
        </div>
      </header>
      <main className="e2m-card">
        <form className="e2m-entry" onSubmit={addText}>
          <label htmlFor="e2m-input">Text</label>
          <div className="e2m-entry-row">
            <input id="e2m-input" value={text} onChange={(event) => setText(event.target.value)} placeholder="Type English text here..." autoComplete="off" />
            <button className="e2m-add" type="submit" disabled={saving || loading}><Plus /> {saving ? "Saving..." : "Add"}</button>
            <button className="e2m-all" type="button" onClick={() => setShowAll(!showAll)}><Layers /> {showAll ? "Show less" : "Show all"}</button>
          </div>
        </form>
        {status && <p className="e2m-status" role="status">{status}</p>}
        <section className="e2m-list" aria-label="Transliterated words">
          {loading ? <p className="e2m-empty">Loading saved words...</p> : items.length === 0 ? <p className="e2m-empty">No saved words yet. Add text above.</p> : (showAll ? items : items.slice(0, 5)).map((item) => {
            const isShown = !!shown[item.id];
            return <article className="e2m-item" key={item.id}>
              <span lang={isShown ? "en" : "ml"}>{isShown ? item.english : item.word}</span>
              <div className="e2m-item-actions">
                <button type="button" onClick={() => setShown((current) => ({ ...current, [item.id]: !isShown }))}>
                  {isShown ? <EyeOff /> : <Eye />} {isShown ? "Hide" : "Show"}
                </button>
                <button className="e2m-delete" type="button" aria-label={"Delete " + item.english} title="Delete" onClick={() => deleteItem(item.id)}>
                  <Trash2 />
                </button>
              </div>
            </article>;
          })}
        </section>
      </main>
      {dialog && <div className="e2m-dialog-backdrop" onClick={() => setDialog("")}>
        <section className="e2m-dialog" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
          <button className="e2m-dialog-close" aria-label="Close" onClick={() => setDialog("")}><X /></button>
          <h2>{dialog === "about" ? "About E2M" : "Settings"}</h2>
          <p>{dialog === "about" ? "Type English words and see their Malayalam phonetic spelling." : "Use the moon button to switch the page appearance."}</p>
        </section>
      </div>}
    </div>
  );
}
