# AGENTS.md — Development Guidelines & Visual Standards

## Core Philosophy: 100% Human-Curated Engineering

This project adheres to the visual, technical, and typographic discipline of an elite engineering team with decades of UI/UX craft. Any pattern that resembles automated, generic, or machine-generated interface design is strictly prohibited.

---

## 1. Zero Tolerance Prohibitions

All contributors and autonomous agents working on this codebase must enforce these rules without exception:

1. **No AI Emojis or Decorative Symbols**:
   * Strictly banned: 🤖, 🧠, ✨, 🚀, 💡, ⚡, 🔮, 🛠️, or any adjacent emoji styling.
   * Visual meaning must be communicated through typography, color states, and technical iconography.

2. **No Em Dashes**:
   * Do not use em dashes (`—`) in copy, documentation, commit messages, or interface labels. Use hyphens, colons, or clean syntactic restructuring instead.

3. **No AI Aesthetic Tropes**:
   * No purple-to-pink gradient cards or borders.
   * No "Powered by Next-Gen AI" badges or marketing fluff.
   * No vague marketing adjectives ("revolutionary", "cutting-edge", "seamless", "tapestry", "delve").
   * Copy must read like an aerospace, automotive, or industrial computer vision manual.

4. **No Lucide Icons**:
   * Strictly prohibited: `lucide-react`. Lucide icons carry the recognizable footprint of generic templates.
   * Permitted: **Phosphor Icons** (`@phosphor-icons/react`) with regular, bold, or duotone technical weights, or custom hand-crafted SVG path definitions.

---

## 2. Design System Reference: Wayve.ai

The visual reference for AlertDrive is [Wayve.ai](https://wayve.ai) (autonomous vehicle intelligence):

### 2.1 Surfaces & Geometry
* **Background Base**: `#08090C` (Deep obsidian black, low glare for vehicle cockpits).
* **Card & Panel Surfaces**: `#101218` and `#161923`.
* **Hairline Borders**: `1px solid rgba(255, 255, 255, 0.08)`. Never heavy bevels or drop shadows.
* **Corner Radii**: Precise, compact geometry (`rounded-sm` or `rounded-md`). Avoid oversized pill-shaped cards unless used for status tags.

### 2.2 Functional Palette
* **Nominal / Nominal Tracking**: `#00F5A0` (Wayve Emerald)
* **Alert / Emergency Fatigue State**: `#FF3B30` (High-visibility automotive warning red)
* **Secondary Warnings**: `#FFB020` (Caution amber)
* **Telemetry Text**: `#717684` (Metadata labels) and `#F4F5F7` (Metric readouts)

### 2.3 Typography & Tabular Alignment
* **Headings**: Plus Jakarta Sans or Geist Sans. Clean, authoritative, geometric.
* **Telemetry & Numeric Displays**: Monospace font (`font-mono`) with `tabular-nums` enabled. Numbers must never cause layout shift during active updates.
* **HUD Reticles**: Subtle corner brackets, crosshairs, and millimeter tick marks modeled on real dashcam and automotive calibration monitors.

---

## 3. Technology Stack Requirements

* **Framework**: Next.js 16 (App Router)
* **Runtime**: React 19
* **Styling**: Tailwind CSS 4 (CSS-first variable tokens via `@theme`, no bloated legacy config)
* **Components**: shadcn/ui (Tailwind 4 compatible primitives)
* **Icons**: `@phosphor-icons/react`
* **Physics & Micro-Interactions**: Motion (`motion`)
* **Scroll Engine**: Lenis (`lenis/react`)

---

## 4. Code Standards & Integrity

1. **State Isolation**: Real-time webcam frame sampling must not block the main React render thread. Off-screen canvas processing and request throttling are mandatory.
2. **Error Recovery**: Camera disconnects, permission rejections, and backend timeouts must display clear, technical fallback notices with actionable recovery controls.
3. **No Placeholders**: Never leave mock placeholder text ("Lorem ipsum", "Coming soon", "Feature X"). All data must reflect actual automotive metrics, PERCLOS computations, and real API schemas.
