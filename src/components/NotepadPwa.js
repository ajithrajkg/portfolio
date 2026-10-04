"use client";

import { useEffect, useState } from "react";
import {
  Check,
  Download,
  FileText,
  NotebookPen,
  Plus,
  Search,
  Trash2,
} from "lucide-react";

const STORAGE_KEY = "ajith-notepad-notes-v1";
const ACTIVE_NOTE_KEY = "ajith-notepad-active-note-v1";

function createNote() {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    title: "Untitled note",
    content: "",
    updatedAt: Date.now(),
  };
}

export default function NotepadPwa() {
  const [notes, setNotes] = useState([]);
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [search, setSearch] = useState("");
  const [isReady, setIsReady] = useState(false);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [installHint, setInstallHint] = useState("");

  useEffect(() => {
    try {
      const storedNotes = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      const initialNotes = Array.isArray(storedNotes) && storedNotes.length
        ? storedNotes
        : [createNote()];
      const storedActiveId = localStorage.getItem(ACTIVE_NOTE_KEY);

      setNotes(initialNotes);
      setActiveNoteId(
        initialNotes.some((note) => note.id === storedActiveId)
          ? storedActiveId
          : initialNotes[0].id,
      );
    } catch {
      const initialNote = createNote();
      setNotes([initialNote]);
      setActiveNoteId(initialNote.id);
    }
    setIsReady(true);

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/notepad/" })
        .then(() => navigator.serviceWorker.ready)
        .then((registration) => registration.active?.postMessage({ type: "CACHE_NOTEPAD" }))
        .catch(() => {});
    }

    const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIos(isIosDevice);
    setIsInstalled(
      window.matchMedia("(display-mode: standalone)").matches ||
        window.navigator.standalone === true,
    );

    const handleInstallAvailable = (event) => {
      event.preventDefault();
      setInstallPrompt(event);
    };
    const handleInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleInstallAvailable);
    window.addEventListener("appinstalled", handleInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleInstallAvailable);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  useEffect(() => {
    if (!isReady) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    if (activeNoteId) localStorage.setItem(ACTIVE_NOTE_KEY, activeNoteId);
  }, [notes, activeNoteId, isReady]);

  const activeNote = notes.find((note) => note.id === activeNoteId);
  const visibleNotes = notes.filter((note) =>
    `${note.title} ${note.content}`.toLowerCase().includes(search.toLowerCase()),
  );
  const wordCount = activeNote?.content.trim()
    ? activeNote.content.trim().split(/\s+/).length
    : 0;

  function updateActiveNote(field, value) {
    setNotes((currentNotes) =>
      currentNotes.map((note) =>
        note.id === activeNoteId
          ? { ...note, [field]: value, updatedAt: Date.now() }
          : note,
      ),
    );
  }

  function addNote() {
    const note = createNote();
    setNotes((currentNotes) => [note, ...currentNotes]);
    setActiveNoteId(note.id);
  }

  function deleteActiveNote() {
    if (!activeNote) return;
    const remainingNotes = notes.filter((note) => note.id !== activeNote.id);
    const nextNotes = remainingNotes.length ? remainingNotes : [createNote()];
    setNotes(nextNotes);
    setActiveNoteId(nextNotes[0].id);
  }

  async function installApp() {
    if (!installPrompt) {
      setInstallHint(
        isIos
          ? "Tap Share, then choose Add to Home Screen."
          : "Open your browser menu and choose Install app or Add to Home Screen.",
      );
      return;
    }
    await installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
  }

  function exportNote() {
    if (!activeNote) return;
    const blob = new Blob([activeNote.content], { type: "text/plain;charset=utf-8" });
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `${activeNote.title.trim() || "note"}.txt`;
    link.click();
    URL.revokeObjectURL(downloadUrl);
  }

  return (
    <section className="notepad-page">
      <div className="notepad-topline">
        <div className="notepad-brand">
          <span className="notepad-brand-icon"><NotebookPen size={19} /></span>
          <span>FIELD NOTES <i>/</i> NOTEPAD</span>
        </div>
        <div className="notepad-top-actions">
          <span className="notepad-save-state"><Check size={15} /> {isReady ? "Saved on this device" : "Opening notes"}</span>
          {!isInstalled && (
            <button className="notepad-install-button" type="button" onClick={installApp}>
              <Download size={16} /> {installPrompt ? "Install app" : "Install on device"}
            </button>
          )}
        </div>
      </div>

      {installHint && <p className="notepad-install-hint" role="status">{installHint}</p>}

      <header className="notepad-heading">
        <div>
          <p className="notepad-eyebrow">A quiet place for your thoughts</p>
          <h1>Notepad<span>.</span></h1>
        </div>
        <p className="notepad-heading-note">Your notes stay in this browser.<br />No account, no sync, just writing.</p>
      </header>

      {isIos && !isInstalled && (
        <p className="notepad-ios-install">
          To install on iPhone or iPad, tap Share <span aria-hidden="true">↑</span> and choose “Add to Home Screen”.
        </p>
      )}

      <div className="notepad-workspace">
        <aside className="notepad-sidebar" aria-label="Notes list">
          <div className="notepad-sidebar-heading">
            <span>YOUR NOTES <small>{notes.length.toString().padStart(2, "0")}</small></span>
            <button className="notepad-icon-button" type="button" onClick={addNote} aria-label="Create a note" title="Create a note">
              <Plus size={18} />
            </button>
          </div>
          <label className="notepad-search">
            <Search size={16} />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Find a note" aria-label="Find a note" />
          </label>
          <div className="notepad-note-list">
            {visibleNotes.map((note) => (
              <button
                className={`notepad-note-item ${note.id === activeNoteId ? "is-active" : ""}`}
                key={note.id}
                type="button"
                onClick={() => setActiveNoteId(note.id)}
              >
                <span className="notepad-note-item-title">{note.title || "Untitled note"}</span>
                <span className="notepad-note-item-preview">{note.content || "No additional text"}</span>
                <span className="notepad-note-item-date">{new Date(note.updatedAt).toLocaleDateString()}</span>
              </button>
            ))}
            {visibleNotes.length === 0 && <p className="notepad-empty-search">No matching notes</p>}
          </div>
          <div className="notepad-sidebar-footer"><span className="notepad-local-dot" /> PRIVATE · STORED LOCALLY</div>
        </aside>

        <article className="notepad-editor">
          {activeNote && (
            <>
              <div className="notepad-editor-toolbar">
                <span><FileText size={15} /> PLAIN TEXT</span>
                <div>
                  <button className="notepad-icon-button" type="button" onClick={exportNote} aria-label="Download note as text file" title="Download note as text file">
                    <Download size={17} />
                  </button>
                  <button className="notepad-icon-button notepad-delete-button" type="button" onClick={deleteActiveNote} aria-label="Delete note" title="Delete note">
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
              <input
                className="notepad-title-input"
                value={activeNote.title}
                onChange={(event) => updateActiveNote("title", event.target.value)}
                placeholder="Untitled note"
                aria-label="Note title"
              />
              <textarea
                className="notepad-content-input"
                value={activeNote.content}
                onChange={(event) => updateActiveNote("content", event.target.value)}
                placeholder="Start writing..."
                aria-label="Note content"
                spellCheck="true"
              />
              <footer className="notepad-editor-footer">
                <span>{wordCount} {wordCount === 1 ? "word" : "words"} <i>·</i> {activeNote.content.length} characters</span>
                <span>Autosaved</span>
              </footer>
            </>
          )}
        </article>
      </div>
    </section>
  );
}