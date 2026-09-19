"use client";

import { useState } from "react";
import {
  BedDouble,
  CarFront,
  Check,
  Copy,
  Droplets,
  Sparkles,
  Target,
  Utensils,
  Wifi,
} from "lucide-react";

const icons = [
  { label: "Swimming pool", icon: Droplets },
  { label: "Wi-Fi", icon: Wifi },
  { label: "Bed", icon: BedDouble },
  { label: "Parking", icon: CarFront },
  { label: "Restaurant", icon: Utensils },
  { label: "Target", icon: Target },
];

const presets = ["#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899"];

function normalizeHex(value) {
  const cleanValue = value.trim().replace(/^#/, "");
  if (/^[0-9a-f]{3}$/i.test(cleanValue)) {
    return `#${cleanValue.split("").map((character) => character.repeat(2)).join("")}`.toLowerCase();
  }
  if (/^[0-9a-f]{6}$/i.test(cleanValue)) return `#${cleanValue.toLowerCase()}`;
  return null;
}

function hexToHsl(hex) {
  const red = parseInt(hex.slice(1, 3), 16) / 255;
  const green = parseInt(hex.slice(3, 5), 16) / 255;
  const blue = parseInt(hex.slice(5, 7), 16) / 255;
  const maximum = Math.max(red, green, blue);
  const minimum = Math.min(red, green, blue);
  const lightness = (maximum + minimum) / 2;
  const difference = maximum - minimum;
  let hue = 0;
  let saturation = 0;

  if (difference) {
    saturation = difference / (1 - Math.abs(2 * lightness - 1));
    if (maximum === red) hue = ((green - blue) / difference) % 6;
    if (maximum === green) hue = (blue - red) / difference + 2;
    if (maximum === blue) hue = (red - green) / difference + 4;
    hue = Math.round(hue * 60);
    if (hue < 0) hue += 360;
  }

  return { hue, saturation, lightness };
}

function buildFilter(hex) {
  const { hue, saturation, lightness } = hexToHsl(hex);
  const invert = Math.round(28 + lightness * 58);
  const brightness = Math.round(82 + lightness * 45);
  const contrast = Math.round(88 + saturation * 32);
  const saturate = Math.round(650 + saturation * 850);

  return `brightness(0) saturate(100%) invert(${invert}%) sepia(100%) saturate(${saturate}%) hue-rotate(${hue - 35}deg) brightness(${brightness}%) contrast(${contrast}%)`;
}

export default function AssetTintStudio() {
  const [selectedIcon, setSelectedIcon] = useState(0);
  const [color, setColor] = useState("#ef4444");
  const [copied, setCopied] = useState(false);
  const normalizedColor = normalizeHex(color);
  const activeColor = normalizedColor || "#ef4444";
  const filter = buildFilter(activeColor);
  const ActiveIcon = icons[selectedIcon].icon;
  const cssSnippet = `.tinted-mark {\n  filter: ${filter};\n}`;

  const updateColor = (value) => setColor(value);

  const copyCss = async () => {
    await navigator.clipboard.writeText(cssSnippet);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <main className="asset-tint-page">
      <section className="asset-tint-hero">
        <div className="asset-tint-eyebrow"><Sparkles size={15} /> Asset tint studio</div>
        <h1 className="text-2xl font-bold">Give your assets a new signal.</h1>
        <p>Select a mark and a destination color. Create a reusable CSS treatment without changing the source artwork.</p>
      </section>

      <section className="asset-tint-tool" aria-label="Asset tint studio">
        <div className="asset-tint-sidebar">
          <div className="filter-section-heading">
            <span>01</span>
              <div><strong>Choose a mark</strong><small>Begin with a neutral source</small></div>
          </div>
          <div className="filter-icon-grid">
            {icons.map(({ label, icon: Icon }, index) => (
              <button
                key={label}
                type="button"
                className={`filter-icon-option ${selectedIcon === index ? "is-selected" : ""}`}
                onClick={() => setSelectedIcon(index)}
                aria-label={`Use ${label} icon`}
                aria-pressed={selectedIcon === index}
              >
                <Icon size={27} strokeWidth={1.8} />
                <span>{label}</span>
              </button>
            ))}
          </div>

        </div>

        <div className="asset-tint-main">
          <div className="filter-preview-grid">
            <div className="filter-preview-card">
              <span className="preview-label">Source mark</span>
              <div className="icon-preview original-icon"><ActiveIcon size={94} strokeWidth={1.35} /></div>
              <span className="preview-caption">{icons[selectedIcon].label}</span>
            </div>
            <div className="preview-arrow" aria-hidden="true">→</div>
            <div className="filter-preview-card colored-preview-card">
              <span className="preview-label">Tinted result</span>
              <div className="icon-preview"><ActiveIcon size={94} strokeWidth={1.35} style={{ filter }} /></div>
              <span className="preview-caption" style={{ color: activeColor }}>{activeColor}</span>
            </div>
          </div>

          <div className="preview-tone-controls">
            <div className="filter-section-heading">
              <span>02</span>
              <div><strong>Choose a tone</strong><small>Apply it to the tinted result</small></div>
            </div>
            <div className="color-input-row">
              <label className="color-swatch" style={{ backgroundColor: activeColor }}>
                <input type="color" value={activeColor} onChange={(event) => updateColor(event.target.value)} aria-label="Choose target color" />
              </label>
              <input
                className={`hex-input ${normalizedColor ? "" : "has-error"}`}
                value={color}
                onChange={(event) => updateColor(event.target.value)}
                aria-label="Target hex color"
                spellCheck="false"
              />
            </div>
            <div className="preset-colors" aria-label="Color presets">
              {presets.map((preset) => <button key={preset} type="button" style={{ backgroundColor: preset }} onClick={() => updateColor(preset)} aria-label={`Use ${preset}`} />)}
            </div>
            {!normalizedColor && <p className="color-error">Enter a valid 3 or 6 digit hex color.</p>}
          </div>

          <div className="generated-filter">
            <div className="generated-filter-header"><div><span className="filter-status-dot" /> Ready-to-use rule</div><button type="button" onClick={copyCss}>{copied ? <Check size={14} /> : <Copy size={14} />} {copied ? "Copied" : "Copy"}</button></div>
            <pre><code><span className="code-selector">.tinted-mark</span> {'{'}{"\n"}  <span className="code-property">filter</span>: {filter};{ "\n"}{'}'}</code></pre>
          </div>
        </div>
      </section>

      <section className="asset-tint-how-it-works">
        <div><span className="asset-tint-eyebrow">A small transformation</span><h2>Turn one source asset into a flexible palette.</h2></div>
        <div className="how-it-works-grid">
          {["Select a source", "Set a tone", "Review the result", "Take the rule"].map((title, index) => <div key={title} className="how-step"><span>0{index + 1}</span><strong>{title}</strong><p>{["Choose a simple mark from the local library.", "Use the native picker or enter a precise hex code.", "Compare the source and treated versions side by side.", "Copy the compact rule into your stylesheet."][index]}</p></div>)}
        </div>
      </section>
    </main>
  );
}