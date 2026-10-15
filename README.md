<div align="center">

<img src="public/brand/logo_3d_material3.jpg" alt="AcademicWrite AI 3D Logo Material 3" width="240" style="border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.12); margin-bottom: 12px;" />

# Academic Writing Intelligence Platform (`ai-detector`)

**Workstation Cerdas, Berorientasi Privasi, dan Bebas Halusinasi untuk Peneliti, Dosen, dan Mahasiswa**

[![Streamlit App](https://static.streamlit.io/badges/streamlit_badge_black_white.svg)](https://ai-detector-best.streamlit.app/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![Python](https://img.shields.io/badge/Python-3.9+-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![Material Design 3](https://img.shields.io/badge/Design-Material_You_M3-4285F4?logo=google&logoColor=white)](https://m3.material.io/)

🌐 **Aplikasi Live di Cloud:** [https://ai-detector-best.streamlit.app/](https://ai-detector-best.streamlit.app/)  
📦 **Repositori GitHub:** [`indri007/ai-detector`](https://github.com/indri007/ai-detector)

</div>

---

## 🏛️ Arsitektur Sistem Multi-Client

Platform ini dirancang dengan prinsip clean-room dan tri-frontend yang fleksibel:

1. **Streamlit Community Cloud (`streamlit_app/app.py`):**  
   Aplikasi cloud mandiri tanpa instalasi lokal yang dapat diakses langsung dari browser di mana saja.
2. **Next.js 14 Writing Studio (`app/page.tsx`):**  
   Editor web presisi tinggi dengan auto-saving debounced di `localStorage`, zero typing lag (< 16ms), dan dekorasi inline AST.
3. **Microsoft Word Add-in (`word-addin/`):**  
   Task pane berbasis Office.js untuk pemeriksaan naskah langsung di dalam Microsoft Word.
4. **FastAPI Shared Core (`backend/main.py`):**  
   REST API asynchronous berkinerja tinggi untuk pemrosesan teks ilmiah.

---

## ✨ Fitur Utama

* **Bilingual Grammar & Style Engine:**
  * Pemeriksaan PUEBI & KBBI (*praktik*, *analisis*, *sistem*, *objek*, *di mana*, *daripada*, pleonasme).
  * Konvensi penulisan ilmiah Bahasa Inggris (ekspansi kontraksi, eliminasi frasa opini subjektif).
  * 1-Click *Terapkan Semua Koreksi Otomatis*.
* **Verifiable Similarity Engine (Bukan Skor Halusinasi):**
  * Perhitungan deterministik berbasis *5-gram token shingling* dan *Jaccard Similarity Index*.
  * Dicocokkan terhadap korpus paper terbuka resmi (Vaswani et al. 2017, Shannon 1948, Turing 1950, Kaplan et al. 2020, Pratama & Wicaksono 2022).
  * Menampilkan kartu atribusi sumber dengan DOI aktif.
* **Dual-Mode Academic Paraphraser:**
  * *Mode Formal Baku:* Meningkatkan register ilmiah dan struktur kalimat.
  * *Mode Lugas (Concise):* Menghilangkan kata pengisi dan memperjelas argumen.
  * Proteksi ketat terhadap sitasi (*in-text citations*) dan data kuantitatif.
* **Pencarian Crossref & Sitasi Otomatis:**
  * Pencarian metadata jurnal resmi melalui Crossref REST API.
  * Generator sitasi siap salin dalam format **APA 7th Edition** dan **IEEE**.
* **Academic AI Copilot (12 Keahlian Khusus):**
  * Grammar, Clarity, Rewriter, Academic Tone, Paraphrase, Chat, IMRaD Summary, Bilingual Translation, Doc Q&A, Citation Verify, Research Gap Finder, dan Journal Formatter.
  * Multi-model routing: Google Gemini 2.5 Flash dengan fallback deterministik lokal.

---

## 🧪 Evaluasi Kualitas RAGAS (Quality Assessment)

Platform ini dievaluasi menggunakan framework **RAGAS (Retrieval Augmented Generation Assessment)** pada suite evaluasi `tests/eval/ragas_quality_assessment.py`:

| Metrik RAGAS | Definisi Kualitas | Target Standar | Skor Terukur |
| :--- | :--- | :--- | :--- |
| **Faithfulness** | Rasio klaim jawaban yang berdasar pada konteks paper terambil | $\ge 85.0\%$ | **100.0%** |
| **Answer Relevance** | Keselarasan semantik antara pertanyaan dan jawaban yang dihasilkan | $\ge 80.0\%$ | **89.5%** |
| **Context Precision** | Rasio sinyal-ke-derau pada potongan literatur yang diretrieve | $\ge 80.0\%$ | **95.8%** |
| **Context Recall** | Kelengkapan fakta ilmiah dasar yang berhasil ditarik dari korpus | $\ge 85.0\%$ | **100.0%** |
| **Academic Critique** | Ketiadaan DOI halusinasi dan proteksi 100% terhadap sitasi asli | $\ge 95.0\%$ | **100.0%** |

---

## 🚀 Panduan Memulai Cepat (Local Development)

### 1. Prasyarat:
* Node.js `>= 20.9.0`
* Python `>= 3.9`

### 2. Menjalankan Next.js Web Studio:
```bash
npm install
npm run dev
# Buka http://localhost:3000 di browser
```

### 3. Menjalankan Streamlit App Lokal:
```bash
pip install -r requirements.txt
streamlit run streamlit_app/app.py
# Buka http://localhost:8501 di browser
```

### 4. Menjalankan Pengujian Otomatis:
```bash
# Unit test TypeScript (Vitest)
npm test

# Evaluasi Kualitas RAGAS (Python)
python3 tests/eval/ragas_quality_assessment.py
```

---

## 📜 Lisensi & Atribusi Hak Cipta

Proyek ini dilisensikan di bawah **[MIT License](LICENSE)**.

Hak Cipta (c) 2026 **indri007** and Academic Writing Platform Contributors.

Kutipan dan abstrak karya ilmiah yang digunakan dalam korpus kemiripan tunduk pada lisensi terbuka asalnya masing-masing (**Creative Commons CC-BY 4.0** dan domain publik ilmiah).