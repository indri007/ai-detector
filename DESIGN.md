# SYSTEM DESIGN & UI/UX SPECIFICATION (`DESIGN.md`)
**Project:** Academic Writing Intelligence Platform  
**Status:** Approved for Implementation  
**Design Persona:** Clean Scholarly Precision (*"Oxford Modern Minimal"*)

---

## 1. Information Architecture & Sitemap

### 1.1 Sitemap
```text
/ (Home / Active Writing Studio)
├── #editor-canvas         (Primary document editing surface)
├── #inspection-rail       (Right-hand diagnostic panel: Grammar, Similarity, Metrics)
├── #source-inspector      (Drawer/modal for deep citation and source analysis)
├── /history               (Saved document versions - P1)
└── /settings              (Engine configurations & corpus provenance)
```

### 1.2 Layout Hierarchy (Desktop 3-Column / Dual-Pane Hybrid)
1. **Top Navigation Bar (Height: 56px / `h-14`):**
   * Left: Platform Brandmark (*"Veritas Academic"*) + Document Title (inline editable).
   * Center: Language Selector (`Bahasa Indonesia` / `English (US)` / `English (UK)`) + Mode Switcher.
   * Right: Word Count Badge, Run Check Button (`Cmd/Ctrl + Enter`), Export Action, Clear Canvas.
2. **Main Workspace (`flex-1 flex overflow-hidden`):**
   * **Left / Center Canvas (`w-full lg:w-7/12 xl:w-2/3`):** Uncluttered distraction-free typing surface with line numbers and margin gutter for diagnostic flags.
   * **Right Diagnostic Rail (`w-full lg:w-5/12 xl:w-1/3`):** Fixed-width inspection panel with tabs:
     * Tab 1: **Issues & Suggestions** (Grammar, Spelling, Punctuation).
     * Tab 2: **Similarity & Sources** (Overall percentage, matched shingle list, citation references).
     * Tab 3: **Document Metrics** (Reading time, lexical density, sentence count).

---

## 2. Design System & Tokens

### 2.1 Color Palette (WCAG 2.1 AA Compliant)
We avoid generic web app colors in favor of a bespoke, high-contrast academic palette:

```css
:root {
  /* Surfaces */
  --bg-primary: #FDFDFE;          /* Clean ivory-tinted paper white */
  --bg-surface: #F8F9FA;          /* Neutral workbench grey */
  --bg-panel: #FFFFFF;            /* Pure white for elevation cards */
  --border-subtle: #E2E8F0;       /* Slate 200 */
  --border-strong: #CBD5E1;       /* Slate 300 */

  /* Typography */
  --text-primary: #0F172A;        /* Deep Slate 900 for laser-sharp readability */
  --text-secondary: #475569;      /* Slate 600 */
  --text-muted: #94A3B8;          /* Slate 400 */

  /* Brand / Action Accent */
  --accent-primary: #1E3A8A;      /* Deep Academic Navy (Blue 900) */
  --accent-hover: #172554;        /* Blue 950 */
  --accent-light: #EFF6FF;        /* Blue 50 */

  /* Diagnostic Semantic Tokens */
  --diagnostic-error-text: #991B1B;   /* Red 800 */
  --diagnostic-error-bg: #FEF2F2;     /* Red 50 */
  --diagnostic-error-border: #F87171; /* Red 400 */
  --diagnostic-error-line: #DC2626;   /* Red 600 (Wavy underline) */

  --diagnostic-sim-text: #92400E;     /* Amber 800 */
  --diagnostic-sim-bg: #FFFBEB;       /* Amber 50 */
  --diagnostic-sim-border: #FBBF24;   /* Amber 400 */
  --diagnostic-sim-line: #D97706;     /* Amber 600 (Dashed underline) */

  --diagnostic-style-text: #065F46;   /* Emerald 800 */
  --diagnostic-style-bg: #ECFDF5;     /* Emerald 50 */
  --diagnostic-style-border: #34D399; /* Emerald 400 */
}
```

### 2.2 Typography
* **Editorial Canvas Font:** `Newsreader` / `Lora` (Serif, standard academic reading typeface) or `Inter` (sans-serif toggle for technical reports). Font size: `1.125rem` (`18px`), Line height: `1.75` (`leading-relaxed`) for optimal ocular stamina during long-form reading.
* **UI Interface & Diagnostic Font:** `Inter`, `ui-sans-serif, system-ui`.
* **Monospace / Code / Metrics:** `JetBrains Mono`, `ui-monospace`.

### 2.3 Spacing & Radius
* Radius: `rounded-lg` (`8px`) for cards; `rounded-md` (`6px`) for buttons and badges.
* Elevation: Subtle borders (`border border-slate-200`) with soft low-blur shadows (`shadow-sm` / `shadow-md`).

---

## 3. Editor Interaction & Highlight States

### 3.1 Decoration Styles in TipTap / ProseMirror
* **Grammar / Spelling Error:**
  * CSS Class: `.decoration-grammar-error`
  * Visual: Subtle red highlight background with a 1.5px solid or squiggly underline (`text-decoration-color: #DC2626`).
* **Similarity Match:**
  * CSS Class: `.decoration-similarity-match`
  * Visual: Soft amber/yellow highlighter background (`rgba(251, 191, 36, 0.25)`) with a discrete amber border.
* **Active Selected Highlight:**
  * When clicked or navigated via keyboard, the highlight transitions to a focus state (`ring-2 ring-blue-500 ring-offset-1`).

### 3.2 Floating Suggestion Popover
When a user clicks on an inline highlighted token:
* A contextual popover appears directly anchored to the selection coordinates.
* **Contents:**
  1. Header: Rule Category badge (`Spelling`, `Subject-Verb Agreement`, or `Similarity`).
  2. Contextual Explanation: *"Consider changing 'go' to 'went' to align with past tense temporal marker 'yesterday'."*
  3. Action Button: Replacement pill (`[ went ]` with green hover state).
  4. Dismiss Button: Ignore rule (`[ Ignore ]` with icon).
* **Keyboard Navigation:**
  * `Tab` cycles focus between replacement pill and ignore button.
  * `Enter` commits the replacement.
  * `Esc` closes the popover without making changes.

---

## 4. Similarity Report & Diagnostic Rail UI

### 4.1 Similarity Score Header
* **Radial / Bar Gauge:** Displays total document match percentage (e.g., `14%`).
* **Status Legend:**
  * `< 15%`: Green tint — Normal citation / common phrase overlap.
  * `15% - 25%`: Amber tint — Moderate shared phrasing; review suggested.
  * `> 25%`: Rose tint — High concentration of matched phrasing; verify citations.
* **Mandatory Subtitle:** *"Calculated against 50 indexed Open Access papers. Similarity indicates shared phrase structure, not plagiarism."*

### 4.2 Matched Source Item Card
```text
┌────────────────────────────────────────────────────────┐
│ [1] 8.4% Match • 4 Matched Sentences                   │
│ Title: "Attention Is All You Need"                     │
│ Authors: Vaswani et al. (2017)                         │
│ Source: arXiv:1706.03762 [cs.CL]                       │
├────────────────────────────────────────────────────────┤
│ Matched Text Snippet:                                  │
│ "...recurrent neural networks have been firmly         │
│ established as state of the art approaches in..."      │
│                                                        │
│ [ Jump to Section in Document ]  [ View Source DOI ↗ ] │
└────────────────────────────────────────────────────────┘
```

---

## 5. System States (Loading, Empty, Error)

### 5.1 Empty State (Initial Load)
* Canvas contains a tasteful watermark placeholder:
  *"Type or paste your academic manuscript here to begin... (Supports up to 3,000 words in English and Indonesian)"*
* Diagnostic rail displays a checklist of active engines with ready indicators.

### 5.2 Loading / Checking State
* The "Run Check" button switches to a subtle indeterminate spinner with text: *"Analyzing syntax and corpus fingerprints..."*
* The editor remains editable (non-blocking). Typing during an active check gracefully invalidates stale pending requests.

### 5.3 Error States (Resilience)
* **LanguageTool Offline:** If the local LanguageTool server is unreachable:
  * Banner in rail: *"Grammar Engine unreachable. Retrying locally or check Docker status."*
  * The rest of the app (Editor, Word Counter, Similarity Engine) continues working without crashing.
* **Text Exceeds Limit:**
  * If word count exceeds 3,000 words: Visual warning badge in header turns amber with helpful suggestion to split by chapter/section.

---

## 6. Accessibility & Keyboard Navigation (WCAG 2.1 AA)
* **Contrast:** All text colors against their respective backgrounds pass a minimum contrast ratio of `4.5:1` (Large text `3.0:1`).
* **Keyboard Shortcuts:**
  * `Cmd/Ctrl + Enter`: Trigger full analysis.
  * `Cmd/Ctrl + Shift + C`: Clear canvas with confirmation prompt.
  * `Alt + [` and `Alt + ]`: Navigate to previous / next diagnostic finding.
* **Screen Reader Announcers:** ARIA live regions (`aria-live="polite"`) announce: *"Check complete: 3 grammar suggestions, 1 source match found."*

---

## 7. Reusable Component Inventory

| Component Name | File Path | Props / Contract | Primary Role |
| :--- | :--- | :--- | :--- |
| **`TopNavbar`** | `components/layout/TopNavbar.tsx` | `wordCount`, `charCount`, `isAnalyzing`, `onRunCheck`, `onClear` | Top control strip with language dropdown and action trigger |
| **`EditorCanvas`** | `components/editor/EditorCanvas.tsx` | `content`, `onChange`, `decorations`, `onSelectDecoration` | Rich text editor (TipTap) surface rendering inline diagnostic decorations |
| **`DiagnosticRail`** | `components/reports/DiagnosticRail.tsx` | `grammarIssues`, `similarityReport`, `activeTab`, `onSelectIssue` | Right tabbed drawer showing categorized diagnostic cards |
| **`SuggestionPopover`** | `components/editor/SuggestionPopover.tsx` | `issue`, `anchorPosition`, `onApply`, `onDismiss` | Floating coordinate-anchored popover over flagged text tokens |
| **`SimilarityGauge`** | `components/reports/SimilarityGauge.tsx` | `overallPercent`, `totalSentences`, `matchedSentences` | Radial/bar gauge with academic disclaimer subtitle |
| **`MatchedSourceCard`** | `components/reports/MatchedSourceCard.tsx` | `source`, `matchRatio`, `onJumpToOffset` | Expandable source attribution card with external DOI link |
| **`StatusBadge`** | `components/ui/StatusBadge.tsx` | `variant` (`error`, `warning`, `info`, `success`), `label` | Micro-pill indicating issue category (e.g., Spelling vs Grammar) |

---

## 8. Functional Acceptance Criteria for MVP Screens

### AC-SCREEN-01: Writing Canvas (`/`)
* **AC-01.1:** Renders within 100ms with a clear ivory background (`#FDFDFE`) and no horizontal scrollbars on desktop (`>= 1024px`) or tablet (`>= 768px`).
* **AC-01.2:** Typing speed maintains 60 FPS without cursor jumping, character drops, or layout shifts.
* **AC-01.3:** Top navigation bar displays accurate real-time word count incrementing/decrementing on each whitespace boundary.

### AC-SCREEN-02: Suggestion Popover Interaction
* **AC-02.1:** Clicking on an inline red-highlighted span anchors the popover within 8px of the target token's client bounding rectangle.
* **AC-02.2:** Pressing `Enter` when the replacement pill is focused applies the correction and moves the cursor immediately after the corrected word.
* **AC-02.3:** Pressing `Escape` closes the popover and restores focus to the editor canvas at the previous selection offset.

### AC-SCREEN-03: Similarity Report Rail
* **AC-03.1:** Display the exact match percentage calculated against the local open-access corpus.
* **AC-03.2:** Each matched source card must render author, year, title, and a verified URL/DOI.
* **AC-03.3:** Clicking "Jump to Section" scrolls the editor viewport directly to the matching sentence and briefly applies an emphasis pulse animation.

