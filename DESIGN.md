# SYSTEM DESIGN & UI/UX SPECIFICATION (`DESIGN.md`)
**Project:** Academic Writing Intelligence Platform  
**Version:** 0.2.0-beta (Material 3 & 3D Spatial UI Upgrade)  
**Status:** Approved for Implementation  
**Design Philosophy:** *Google Material Design 3 (Material You) + 3D Tactile Precision & Micro-Animations*  
**Live URL:** [https://ai-detector-best.streamlit.app/](https://ai-detector-best.streamlit.app/)  
**Brand Asset:** `public/brand/logo_3d_material3.jpg`

---

## 1. Brand Identity & 3D Material 3 Animated Logo

### 1.1 Brand Identity & Concept
The brandmark embodies **academic rigor, technological transparency, and ethical research intelligence**. It rejects punitive, menacing scanner iconography in favor of an empowering scholarly companion.

![3D Material 3 Animated Logo](file:///Users/jevin/AI%20CHECKER/public/brand/logo_3d_material3.jpg)

### 1.2 Symbolic Architecture:
1. **The 3D Sculpted Fountain Pen Nib:**
   * Hand-finished metallic titanium and frosted glass body.
   * Symbolizes authorial sovereignty, scholarly precision, and original voice.
2. **The Glowing Iridescent Neural Möbius Loop:**
   * Translucent holographic ribbon woven through the pen nib, illuminated with spectral cyan, cobalt, and coral bioluminescent nodes.
   * Symbolizes the 12-skill Academic AI Copilot, continuous language evaluation, and transparent AST token analysis.
3. **The Layered Translucent Open Book Foundation:**
   * Tactile soft-matte cobalt base with frosted glass pages that emit subtle ambient light.
   * Symbolizes open-access literature provenance (CC-BY, arXiv, DOAJ) and ethical, verifiable attribution.

### 1.3 3D Spatial States & Micro-Animation Specifications

```css
/* 3D Material 3 Spatial Physics & Micro-Animation Keyframes */

/* 1. Idle Floating Animation (Tactile Levitation) */
@keyframes float3d {
  0% {
    transform: translateY(0px) rotateX(2deg) rotateY(-3deg);
    filter: drop-shadow(0 12px 20px rgba(26, 115, 232, 0.18));
  }
  50% {
    transform: translateY(-8px) rotateX(4deg) rotateY(2deg);
    filter: drop-shadow(0 20px 30px rgba(26, 115, 232, 0.28));
  }
  100% {
    transform: translateY(0px) rotateX(2deg) rotateY(-3deg);
    filter: drop-shadow(0 12px 20px rgba(26, 115, 232, 0.18));
  }
}

/* 2. Analyzing State: Neural Ribbon Pulse & Orbit */
@keyframes neuralOrbit {
  0% {
    transform: rotate(0deg) scale(1);
    filter: drop-shadow(0 0 16px rgba(56, 189, 248, 0.6));
  }
  50% {
    transform: rotate(180deg) scale(1.04);
    filter: drop-shadow(0 0 26px rgba(168, 85, 247, 0.8));
  }
  100% {
    transform: rotate(360deg) scale(1);
    filter: drop-shadow(0 0 16px rgba(56, 189, 248, 0.6));
  }
}

/* 3. Success / Check Complete (Haptic Spring Pulse) */
@keyframes tactileSuccessBounce {
  0% { transform: scale(0.92); }
  45% { transform: scale(1.08); }
  70% { transform: scale(0.97); }
  100% { transform: scale(1.0); }
}

/* 4. Interactive 3D Card Hover Tilt */
.m3-3d-card {
  perspective: 1000px;
  transform-style: preserve-3d;
  transition: transform 300ms cubic-bezier(0.2, 0.0, 0, 1.0),
              box-shadow 300ms cubic-bezier(0.2, 0.0, 0, 1.0);
}

.m3-3d-card:hover {
  transform: translateY(-4px) perspective(1000px) rotateX(1.5deg) rotateY(-1.5deg);
  box-shadow: 0 16px 32px -8px rgba(15, 23, 42, 0.12),
              0 4px 12px -2px rgba(26, 115, 232, 0.08);
}
```

---

## 2. Material Design 3 (Material You) Design System

### 2.1 M3 Tonal Palette & Dynamic Color Tokens
We strictly adhere to the Material Design 3 Tonal Palette system, balancing scholarly sobriety with tactile vitality:

```css
:root {
  /* =====================================================================
     PRIMARY PALETTE (Academic Cobalt & Deep Azure)
     ===================================================================== */
  --md-sys-color-primary: #1A73E8;               /* M3 Primary Key */
  --md-sys-color-on-primary: #FFFFFF;
  --md-sys-color-primary-container: #D3E3FD;     /* Soft Azure Tonal Container */
  --md-sys-color-on-primary-container: #041E49;  /* Deep Navy Content */

  /* =====================================================================
     SECONDARY PALETTE (Scholarly Slate & Indigo)
     ===================================================================== */
  --md-sys-color-secondary: #4A5C92;
  --md-sys-color-on-secondary: #FFFFFF;
  --md-sys-color-secondary-container: #DDE1FF;
  --md-sys-color-on-secondary-container: #001453;

  /* =====================================================================
     TERTIARY PALETTE (AI Copilot Iris & Amethyst)
     ===================================================================== */
  --md-sys-color-tertiary: #7C5295;
  --md-sys-color-on-tertiary: #FFFFFF;
  --md-sys-color-tertiary-container: #F2DAFF;
  --md-sys-color-on-tertiary-container: #310B4B;

  /* =====================================================================
     SURFACES & ELEVATION CONTAINERS (M3 Elevation Model)
     ===================================================================== */
  --md-sys-color-surface: #FDFBFF;               /* Ivory-white canvas */
  --md-sys-color-on-surface: #1A1C1E;            /* High-contrast Slate 950 */
  --md-sys-color-surface-variant: #E1E2EC;
  --md-sys-color-on-surface-variant: #44474F;
  --md-sys-color-surface-container-lowest: #FFFFFF;
  --md-sys-color-surface-container-low: #F7F2FA; /* Subtle Section Tint */
  --md-sys-color-surface-container: #F3EDF7;     /* Standard Resting Card */
  --md-sys-color-surface-container-high: #ECE6F0;/* Hovered Container */
  --md-sys-color-surface-container-highest: #E6E0E9;
  --md-sys-color-outline: #74777F;
  --md-sys-color-outline-variant: #C4C7C5;

  /* =====================================================================
     SEMANTIC DIAGNOSTIC TOKENS (PUEBI, Similarity, Style)
     ===================================================================== */
  /* Error (Spelling / Grammar / PUEBI Flaws) */
  --md-sys-color-error: #BA1A1A;
  --md-sys-color-on-error: #FFFFFF;
  --md-sys-color-error-container: #FFDAD6;
  --md-sys-color-on-error-container: #410002;
  --md-sys-color-error-underline: #DC2626;

  /* Warning / Similarity Attribution */
  --md-sys-color-similarity: #B25E00;
  --md-sys-color-on-similarity: #FFFFFF;
  --md-sys-color-similarity-container: #FFE0B2;
  --md-sys-color-on-similarity-container: #4E2600;
  --md-sys-color-similarity-underline: #D97706;

  /* Style / Paraphrase Recommendation */
  --md-sys-color-style: #006D44;
  --md-sys-color-on-style: #FFFFFF;
  --md-sys-color-style-container: #9BF6BF;
  --md-sys-color-on-style-container: #002111;
}
```

### 2.2 Material 3 Elevation System (0 to 5) with 3D Spatial Lighting
Unlike legacy flat shadows, M3 uses **tonal surface elevation** combined with soft volumetric ambient diffusion:

| Elevation Level | Surface Tint | 3D Volumetric Box Shadow | Component Usage |
| :--- | :--- | :--- | :--- |
| **Level 0** (0dp) | `surface` | `none` | Background workspace canvas, editor text page |
| **Level 1** (1dp) | `surface-container-low` | `0 1px 3px 1px rgba(0,0,0,0.06), 0 1px 2px 0 rgba(0,0,0,0.1)` | Diagnostic rail panel, stats counter badge |
| **Level 2** (3dp) | `surface-container` | `0 4px 8px 3px rgba(0,0,0,0.07), 0 1px 3px 0 rgba(0,0,0,0.12)` | Resting card, matched source preview card |
| **Level 3** (6dp) | `surface-container-high` | `0 8px 16px 4px rgba(0,0,0,0.08), 0 2px 6px 0 rgba(0,0,0,0.14)` | Hovered 3D card, Floating Action Button (FAB) |
| **Level 4** (8dp) | `surface-container-highest` | `0 12px 24px 6px rgba(15,23,42,0.14)` | Coordinate-anchored suggestion popover |
| **Level 5** (12dp)| `surface-container-highest` | `0 24px 48px 12px rgba(15,23,42,0.2)` | Crossref citation modal, fullscreen drawer |

### 2.3 Expressive M3 Shape Tokens (Border Radii)
* **Shape Small (`rounded-lg` / `8px`):** Inline suggestion replacement pills, search inputs.
* **Shape Medium (`rounded-xl` / `12px`):** Diagnostic rule cards, language dropdowns.
* **Shape Large (`rounded-2xl` / `16px`):** Matched source cards, editor canvas border wrapper.
* **Shape Extra Large (`rounded-3xl` / `28px`):** Floating dialogs, Copilot chat bubbles, navigation drawers.
* **Shape Full (`rounded-full` / `9999px`):** Primary action buttons, FABs, status chips, avatar circles.

### 2.4 Typography (Google M3 Expressive Scale)
* **Display Large / Brandmark:** `Google Sans` / `Outfit` (`57px`, weight 400).
* **Headlines (H1, H2, H3):** `Google Sans` / `Inter` (`32px` / `24px` / `20px`, weight 600).
* **Editor Reading Surface (Academic Body):** `Newsreader` / `Lora` (Serif, `18px`, line height `1.75`) for extended manuscript reading comfort.
* **Interface Body & Diagnostics:** `Inter` / `Roboto Flex` (`14px` / `16px`, line height `1.5`).
* **Monospace / Statistics / DOI:** `JetBrains Mono` (`13px`, tabular figures for zero jitter during live typing counter).

---

## 3. UI/UX Information Architecture & Dual-Pane Canvas

```text
/ (Academic Writing Studio)
├── #top-app-bar           (Brandmark 3D Logo, Language Switcher, Action Cluster)
├── #editor-workspace      (Center stage ivory writing surface with line guides)
│   └── #tiptap-surface    (ProseMirror AST decorations + floating popover)
├── #floating-fab          (M3 Extended Floating Action Button: "Jalankan Analisis")
├── #diagnostic-rail       (Collapsible right-hand drawer with 4 specialized tabs)
│   ├── Tab 1: Tata Bahasa & Ejaan (PUEBI/KBBI + English conventions)
│   ├── Tab 2: Kemiripan & Sumber (5-gram Jaccard matches + Crossref DOI links)
│   ├── Tab 3: Parafrase & Gaya (Formal vs Concise dual-mode cards)
│   └── Tab 4: Academic Copilot (12 specialized interactive skills)
└── #crossref-modal        (Direct DOI/literature search with APA 7 & IEEE generator)
```

---

## 4. Key Component Design Specifications

### 4.1 M3 Extended Floating Action Button (FAB)
* **Dimensions:** Height: `56px`, Padding: `24px`, Shape: `rounded-full` (`9999px`).
* **Surface:** `md-sys-color-primary-container` (`#D3E3FD`) with `on-primary-container` (`#041E49`).
* **Resting Elevation:** Level 3 (`box-shadow: 0 8px 16px ...`).
* **Hover State:** Level 4 + gentle 3D bounce (`tactileSuccessBounce`).
* **Content:** 3D Sparkle / Pen Icon + *"Jalankan Analisis Menyeluruh (Cmd + Enter)"*.

### 4.2 Bilingual Segmented Button (M3)
* **Usage:** Switch active linguistic evaluation between **Bahasa Indonesia (PUEBI)** and **English (Academic)**.
* **Visual Structure:** Connected pill container with sliding active pill selector (`transition: all 250ms cubic-bezier(0.2, 0, 0, 1)`).
* **Active State:** Deep Azure fill with white text; Inactive State: Transparent with subtle outline.

### 4.3 3D Coordinate-Anchored Suggestion Popover
When a user clicks on an inline highlighted token:
* Anchors within `8px` of the target token's DOM bounding rect.
* **Surface:** Frosted glass with `backdrop-filter: blur(16px)` and M3 Level 4 elevation.
* **Layout:**
  1. Header chip: `PUEBI Baku` / `Contraction Expansion` with category color.
  2. Rationale card: *"Ubah 'praktek' menjadi 'praktik' sesuai pedoman KBBI V."*
  3. Action Pill: `[ Terapkan: praktik ]` with green ripple ink effect.
  4. Dismiss icon: `[ Abaikan ]` with soft neutral hover.

### 4.4 Dual-Mode Academic Paraphraser Cards
* Rendered side-by-side or stacked in the diagnostic rail:
  * **Card A (Mode Formal Baku):** Tinted with `secondary-container`, emphasizing elevated scholarly tone and passive syntactic structures.
  * **Card B (Mode Lugas / Concise):** Tinted with `primary-container`, emphasizing crisp delivery, active verbs, and eliminated filler phrases.
* Includes explicit visual badge: `✅ Sitasi & Fakta Terlindungi` (e.g. `(Vaswani et al., 2017)` remains preserved).

### 4.5 Official Crossref Citation Inspector Card
```text
┌─────────────────────────────────────────────────────────────────┐
│ 📚 HASIL PENCARIAN CROSSREF                                     │
│ Judul: Deep Residual Learning for Image Recognition             │
│ Penulis: He, K., Zhang, X., Ren, S., & Sun, J. (2016)           │
│ Jurnal: IEEE Conference on Computer Vision and Pattern Rec.     │
│ DOI: 10.1109/CVPR.2016.90                                      │
├─────────────────────────────────────────────────────────────────┤
│ FORMAT SITASI SIAP SALIN:                                       │
│ [APA 7]                                                         │
│ He, K., Zhang, X., Ren, S., & Sun, J. (2016). Deep residual...  │
│ [ Salin APA 7 📋 ]                                              │
│                                                                 │
│ [IEEE]                                                          │
│ K. He, X. Zhang, S. Ren, and J. Sun, "Deep residual...", 2016. │
│ [ Salin IEEE 📋 ]                                               │
└─────────────────────────────────────────────────────────────────┘
```

---

## 5. Motion, Physics & Micro-Animation System

### 5.1 Easing Tokens (M3 Motion Curves)
* **Emphasized Decelerate (Incoming elements):** `cubic-bezier(0.05, 0.7, 0.1, 1.0)` — 400ms duration.
* **Emphasized Accelerate (Exiting elements):** `cubic-bezier(0.3, 0.0, 0.8, 0.15)` — 200ms duration.
* **Standard Spring (Interactive buttons / 3D tilt):** `cubic-bezier(0.2, 0.0, 0, 1.0)` — 250ms duration.

### 5.2 Accessibility (`prefers-reduced-motion`)
All 3D tilts, orbital rotations, and floating keyframes are wrapped with motion-safety media queries:
```css
@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    transform: none !important;
  }
}
```

---

## 6. Component Inventory & Asset Registry

| Component / Asset | Location | Material 3 Tokens Used | Description |
| :--- | :--- | :--- | :--- |
| **3D M3 Brand Logo** | `public/brand/logo_3d_material3.jpg` | Primary, Tertiary, Translucent Clay | High-res 3D icon with floating levitation & orbital glow |
| **Top Navigation Bar** | `components/layout/TopNavbar.tsx` | `surface-container-low`, Shape Large | Responsive header with word counter and language segmented button |
| **Editor Canvas** | `components/editor/AcademicEditor.tsx` | `surface`, Newsreader/Inter, Level 0 | Zero-lag typing surface with AST decoration renderer |
| **Diagnostic Rail** | `components/reports/DiagnosticRail.tsx` | `surface-container`, Level 1 | 4-tab diagnostic inspector with 3D tilt cards |
| **Streamlit 3D Theme** | `streamlit_app/app.py` | Custom CSS injection | Streamlit Cloud deployment styled with M3 color scheme and 3D logo |
| **Word Add-in Pane** | `word-addin/taskpane.html` | Fluent + M3 Hybrid | Office.js task pane with selection reading and in-situ replacement |
