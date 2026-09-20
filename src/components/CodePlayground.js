"use client";

import { useState } from "react";
import { Code2, Copy, ExternalLink, Play, RotateCcw, Sparkles } from "lucide-react";

const starterCode = {
  html: `<main class="card">
  <span class="eyebrow">Hello, web</span>
  <h1>Build something <em>bright.</em></h1>
  <p>Edit the code, then run it to see your idea come alive.</p>
  <button onclick="sayHello()">Say hello</button>
</main>`,
  css: `:root {
  font-family: system-ui, sans-serif;
  color: #121317;
  background: #f5f3ed;
}

body { margin: 0; }

.card {
  max-width: 520px;
  margin: 12vh auto;
  padding: 48px;
  border: 1px solid #d5ded3;
  border-radius: 24px;
  background: #fffdf8;
  box-shadow: 0 24px 60px #17332f18;
}

.eyebrow { color: #477eff; font-weight: 700; }
h1, h2, h3, h4 { color: #121317; }
h1 { font-size: clamp(2.5rem, 7vw, 4.5rem); line-height: .95; margin: 18px 0; }
em { color: #477eff; font-style: normal; }
p { color: #64736f; line-height: 1.7; }
button { border: 0; border-radius: 999px; padding: 13px 20px; background: #17332f; color: white; cursor: pointer; }`,
  js: `function sayHello() {
  alert("Hello from your playground!");
}`,
};

function createPreview(html, css, js) {
  return `<!doctype html><html><head><meta name="viewport" content="width=device-width, initial-scale=1"><style>${css}</style></head><body>${html}<script>${js}<\/script></body></html>`;
}

export default function CodePlayground() {
  const [activeTab, setActiveTab] = useState("html");
  const [code, setCode] = useState(starterCode);
  const [preview, setPreview] = useState(() => createPreview(starterCode.html, starterCode.css, starterCode.js));
  const [runCount, setRunCount] = useState(1);
  const [copied, setCopied] = useState(false);

  const runCode = () => {
    setPreview(createPreview(code.html, code.css, code.js));
    setRunCount((count) => count + 1);
  };

  const resetCode = () => {
    setCode(starterCode);
    setPreview(createPreview(starterCode.html, starterCode.css, starterCode.js));
    setRunCount((count) => count + 1);
  };

  const copyCode = async () => {
    await navigator.clipboard.writeText(code[activeTab]);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };

  return (
    <section className="playground-shell">
      <div className="playground-intro">
        <div className="mt-[15]">
          <h2 className="text-2xl font-bold">Code, preview, <span>repeat.</span></h2>
          <p>A tiny, friendly space to turn an idea into a working web page.</p>
        </div>
        <div className="playground-badge"><Code2 size={17} /> HTML / CSS / JS</div>
      </div>

      <div className="playground-toolbar">
        <div className="workspace-label"><span className="live-dot" /> Untitled project <small>saved locally</small></div>
        <div className="toolbar-actions">
          <button type="button" className="tool-button" onClick={resetCode}><RotateCcw size={15} /> Reset</button>
          <button type="button" className="run-button" onClick={runCode}><Play size={15} fill="currentColor" /> Run code <kbd>⌘ ↵</kbd></button>
        </div>
      </div>

      <div className="playground-grid">
        <div className="editor-panel">
          <div className="editor-tabs" role="tablist" aria-label="Code files">
            {Object.keys(code).map((tab) => (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={activeTab === tab}
                className={`editor-tab ${activeTab === tab ? "is-active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                <span className={`file-dot ${tab}`} /> {tab === "html" ? "index.html" : tab === "css" ? "styles.css" : "script.js"}
              </button>
            ))}
            <button type="button" className="copy-button" onClick={copyCode} aria-label="Copy current code" title="Copy current code">
              <Copy size={15} /> {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <div className="code-editor">
            <div className="line-numbers" aria-hidden="true">{code[activeTab].split("\n").map((_, index) => <span key={index}>{index + 1}</span>)}</div>
            <textarea
              value={code[activeTab]}
              onChange={(event) => setCode({ ...code, [activeTab]: event.target.value })}
              spellCheck="false"
              aria-label={`${activeTab} source code`}
            />
          </div>
          <div className="editor-footer"><span>UTF-8</span><span>Lines: {code[activeTab].split("\n").length}</span><span>Ready</span></div>
        </div>

        <div className="preview-panel">
          <div className="preview-header"><span><span className="window-dots"><i /><i /><i /></span> Preview</span><a href="#preview" aria-label="Preview in a new tab"><ExternalLink size={15} /></a></div>
          <iframe id="preview" key={runCount} title="Live code preview" srcDoc={preview} sandbox="allow-scripts" />
          <div className="console-bar"><span>Console</span><span className="console-status">● No errors</span></div>
        </div>
      </div>
    </section>
  );
}