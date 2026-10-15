import streamlit as st
import os
import sys
import re
import json

# Ensure parent and current directories are on sys.path for direct module import
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)
APP_DIR = os.path.dirname(os.path.abspath(__file__))
if APP_DIR not in sys.path:
    sys.path.insert(0, APP_DIR)

from backend.nlp_engine import (
    OPEN_ACCESS_CORPUS,
    analyze_grammar_rules,
    calculate_similarity_shingles,
    rewrite_academic_style,
    search_crossref_dois,
    execute_academic_copilot,
    SKILL_PROMPTS
)

# --- Streamlit Page Configuration ---
st.set_page_config(
    page_title="AcademicWrite AI — Academic Writing & Intelligence Platform",
    page_icon="🎓",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Initialize Session State
if "document_text" not in st.session_state:
    st.session_state.document_text = (
        "The dominant sequence transduction models are based on complex recurrent or convolutional neural networks. "
        "However, the author don't believe that praktek tanpa analisa dan metode penelitian adalah solusi terbaik dalam rangka untuk mencapai hasil maksimal."
    )
if "custom_corpus" not in st.session_state:
    st.session_state.custom_corpus = []
if "chat_history" not in st.session_state:
    st.session_state.chat_history = []

# --- Sidebar Configuration ---
with st.sidebar:
    st.title("🎓 AcademicWrite AI")
    st.caption("Cloud Academic Writing & Intelligence Platform")
    st.markdown("---")
    
    st.markdown("### 🌐 Pengaturan Bahasa")
    language = st.selectbox(
        "Bahasa Naskah:",
        options=["id-ID", "en-US", "en-GB"],
        format_func=lambda x: "🇮🇩 Bahasa Indonesia (PUEBI/KBBI)" if x == "id-ID" else ("🇺🇸 English (US Scholarly)" if x == "en-US" else "🇬🇧 English (UK Scholarly)")
    )
    
    st.markdown("---")
    st.markdown("### 🔑 Kunci API AI (Opsional)")
    
    # Retrieve API key from secrets, env, or user input
    default_key = ""
    try:
        if "GEMINI_API_KEY" in st.secrets:
            default_key = st.secrets["GEMINI_API_KEY"]
    except Exception:
        pass
    if not default_key:
        default_key = os.getenv("GEMINI_API_KEY", os.getenv("GEMINI_API_KEY_1", ""))

    with st.expander("Konfigurasi Gemini AI", expanded=False):
        user_api_key = st.text_input(
            "Google Gemini API Key:",
            value=default_key,
            type="password",
            help="Masukkan kunci Gemini API untuk mengaktifkan Copilot AI generatif penuh (Gemini 2.5 Flash)."
        )
        st.caption("Jika dikosongkan, seluruh fitur tetap berjalan 100% menggunakan Mesin Deterministik Lokal.")

    st.markdown("---")
    st.markdown("### 🔒 Kebijakan Privasi & Keamanan")
    st.info("Seluruh analisis teks dieksekusi secara mandiri. Naskah Anda tidak disimpan permanen atau dibagikan ke pihak ketiga.")
    st.caption("v1.2.0 • Cloud Ready • Local NLP Enabled")

# --- Header Banner ---
st.title("Studio Penulisan & Kecerdasan Akademik")
st.markdown(
    "Platform asistensi penulisan karya ilmiah: tata bahasa & PUEBI, parafrase gaya akademik, "
    "pemeriksaan kemiripan naskah berbasis korpus terbuka berizin, dan pencarian referensi resmi Crossref."
)

# --- Workspace Tabs ---
tab_editor, tab_rewrite, tab_copilot, tab_citations, tab_corpus = st.tabs([
    "📝 Editor & Analisis Lengkap",
    "✍️ Parafrase & Gaya Akademik",
    "🤖 Academic AI Copilot (12 Skills)",
    "📚 Pencarian DOI & Referensi",
    "🏛️ Korpus Ilmiah Terindeks"
])

# ==============================================================================
# TAB 1: Editor & Analisis Lengkap
# ==============================================================================
with tab_editor:
    col_input, col_results = st.columns([1.15, 1])
    
    with col_input:
        st.subheader("Naskah Akademik")
        
        # Sample buttons
        c_btn1, c_btn2, c_btn3 = st.columns([1, 1, 1])
        with c_btn1:
            if st.button("📄 Contoh Teks (ID)", use_container_width=True):
                st.session_state.document_text = (
                    "Penelitian ini mengkaji praktek penulisan naskah ilmiah di mana banyak ditemukan analisa yang belum optimal. "
                    "Tujuan daripada riset ini adalah merubah pola penyusunan metodologi penelitian agar sesuai standar."
                )
                st.rerun()
        with c_btn2:
            if st.button("📄 Contoh Teks (EN)", use_container_width=True):
                st.session_state.document_text = (
                    "The dominant sequence transduction models are based on complex recurrent or convolutional neural networks. "
                    "However, we can't ignore that I think a lot of researchers need better attention mechanisms."
                )
                st.rerun()
        with c_btn3:
            if st.button("🗑️ Bersihkan Teks", use_container_width=True):
                st.session_state.document_text = ""
                st.rerun()

        text_input = st.text_area(
            "Ketik atau tempel naskah artikel / tugas akhir di sini:",
            value=st.session_state.document_text,
            height=380,
            key="main_text_area",
            help="Maksimal 20.000 karakter."
        )
        st.session_state.document_text = text_input

        # Live Word/Char Metrics
        raw_words = text_input.strip().split() if text_input.strip() else []
        word_count = len(raw_words)
        char_count = len(text_input)
        reading_time = max(1, (word_count + 199) // 200)

        st.caption(f"📊 **Statistik Dokumen:** **{word_count}** kata | **{char_count}** karakter | ~**{reading_time}** menit estimasi baca")
        
        btn_run_analysis = st.button("🔍 Jalankan Pemeriksaan Komprehensif", type="primary", use_container_width=True)

    with col_results:
        st.subheader("Hasil Pemeriksaan & Diagnostik")
        
        if btn_run_analysis and text_input.strip():
            with st.spinner("Memproses tata bahasa, PUEBI, dan perbandingan korpus..."):
                findings = analyze_grammar_rules(text_input, language)
                sim_data = calculate_similarity_shingles(text_input, custom_corpus=st.session_state.custom_corpus)
                
                # Metrics Cards
                m1, m2, m3 = st.columns(3)
                with m1:
                    st.metric("Temuan Tata Bahasa", len(findings))
                with m2:
                    st.metric("Kemiripan Korpus", f"{sim_data['overall_percent']}%")
                with m3:
                    st.metric("Estimasi Baca", f"{reading_time} mnt")

                # Quick action: Apply all corrections
                if findings:
                    with st.expander("⚡ Terapkan Semua Koreksi Otomatis"):
                        corrected_text = text_input
                        for f in findings:
                            if f.get("replacement_text") and not "\\" in f["replacement_text"] and not "/" in f["replacement_text"]:
                                corrected_text = re.sub(r"\b" + re.escape(f["original_text"]) + r"\b", f["replacement_text"], corrected_text, flags=re.IGNORECASE)
                        
                        st.text_area("Pratinjau Hasil Koreksi:", value=corrected_text, height=140)
                        if st.button("✅ Simpan Hasil Koreksi ke Editor"):
                            st.session_state.document_text = corrected_text
                            st.rerun()

                # Grammar Findings Detail
                st.markdown("#### ✍️ Saran Tata Bahasa, Ejaan & Gaya")
                if not findings:
                    st.success("🎉 Tidak ditemukan kesalahan tata bahasa, ejaan baku, atau kontradiksi gaya pada teks Anda!")
                else:
                    for idx, f in enumerate(findings):
                        with st.expander(f"⚠️ [{f['category'].upper()}] {f['original_text']} → {f.get('replacement_text', 'Periksa')}"):
                            st.markdown(f"**Pesan:** {f['message']}")
                            if f.get("explanation"):
                                st.caption(f['explanation'])
                            st.caption(f"Tingkat Keparahan: `{f['severity']}` | Rule ID: `{f['rule_id']}`")

                # Similarity Findings Detail
                st.markdown("#### 📊 Laporan Kemiripan Korpus Terbuka")
                st.caption(sim_data.get("disclaimer", ""))
                
                sources = sim_data.get("matched_sources", [])
                if not sources:
                    st.info("ℹ️ Tidak ditemukan kecocokan 5-gram yang signifikan dengan korpus terbuka terindeks.")
                else:
                    for src in sources:
                        st.markdown(f"**[{src['match_percent']}%]** [{src['title']}]({src['url']}) — *{src['authors']} ({src.get('year', 'n.d.')})*")
                        st.caption(f"Lisensi: `{src.get('license', 'Open Access')}`")
                        for p in src.get("matched_passages", []):
                            st.code(p, language="text")

                # Export Analysis Report
                st.markdown("---")
                report_content = f"# Laporan Diagnostik AcademicWrite AI\n\n"
                report_content += f"- **Jumlah Kata:** {word_count}\n- **Jumlah Karakter:** {char_count}\n"
                report_content += f"- **Temuan Tata Bahasa:** {len(findings)}\n- **Kemiripan Korpus:** {sim_data['overall_percent']}%\n\n"
                report_content += "## Temuan Tata Bahasa & Ejaan\n"
                for f in findings:
                    report_content += f"- [{f['category'].upper()}] {f['original_text']} -> {f.get('replacement_text', '')}: {f['message']}\n"
                report_content += "\n## Sumber Korpus Terkait\n"
                for src in sources:
                    report_content += f"- [{src['match_percent']}%] {src['title']} ({src['authors']})\n"

                st.download_button(
                    label="📥 Unduh Laporan Diagnostik (.md)",
                    data=report_content,
                    file_name="laporan_analisis_akademik.md",
                    mime="text/markdown"
                )
        elif not text_input.strip():
            st.info("Silakan ketik atau tempel naskah Anda di kolom sebelah kiri, lalu klik tombol 'Jalankan Pemeriksaan Komprehensif'.")

# ==============================================================================
# TAB 2: Parafrase & Gaya Akademik
# ==============================================================================
with tab_rewrite:
    st.subheader("Parafrase & Penyempurnaan Gaya Akademik")
    st.markdown("Ubah kalimat informal, bertele-tele, atau kurang objektif menjadi kalimat akademik yang presisi.")
    
    col_rw_in, col_rw_out = st.columns(2)
    
    with col_rw_in:
        rewrite_input = st.text_area(
            "Teks yang ingin disempurnakan:",
            value=st.session_state.document_text[:800] if st.session_state.document_text else "",
            height=200,
            help="Masukkan satu atau beberapa kalimat."
        )
        
        mode_choice = st.radio(
            "Pilih Mode Gaya:",
            options=["academic_formal", "concise"],
            format_func=lambda x: "🎓 Akademik Baku (Formal & Objektif)" if x == "academic_formal" else "⚡ Lugas & Ringkas (Concise)"
        )
        
        btn_rewrite = st.button("✨ Tulis Ulang Teks", type="primary")

    with col_rw_out:
        st.markdown("#### Hasil Saran Penulisan:")
        if btn_rewrite and rewrite_input.strip():
            res_rewrite = rewrite_academic_style(rewrite_input, mode=mode_choice, language=language)
            st.success("Teks berhasil disempurnakan:")
            st.text_area("Saran Kalimat Baru:", value=res_rewrite["suggested"], height=160)
            st.info(f"💡 **Rasional Perubahan:** {res_rewrite['rationale']}")
            
            if st.button("📋 Salin ke Dokumen Utama"):
                st.session_state.document_text = res_rewrite["suggested"]
                st.success("Teks telah disalin ke tab Editor Utama!")
        else:
            st.caption("Pilih mode gaya dan klik 'Tulis Ulang Teks' untuk melihat saran perbaikan.")

# ==============================================================================
# TAB 3: Academic AI Copilot (12 Skills)
# ==============================================================================
with tab_copilot:
    st.subheader("🤖 Academic AI Copilot")
    st.caption("Asisten riset dan penulisan berbasis 12 keahlian akademik spesifik.")
    
    skill_options = {
        "grammar_spell": "1. Grammar & Spell Checker (Tata Bahasa & Ejaan Baku)",
        "clarity_conciseness": "2. Clarity & Conciseness (Lugas, Ringkas & Padat)",
        "sentence_rewriter": "3. Sentence Rewriter (Restrukturisasi Sintaksis)",
        "academic_tone": "4. Academic Tone (Formalitas & Nada Objektif)",
        "paraphrase": "5. Paraphrase (Parafrase Preservasi Sitasi)",
        "academic_chat": "6. Academic Chat & Consultation (Konsultasi Riset)",
        "summarize": "7. Executive Summary (Ringkasan IMRaD)",
        "bilingual_translate": "8. Bilingual Translate (Penerjemahan Istilah Ilmiah)",
        "document_qa": "9. Document Q&A (Evaluasi Kritis & Reviewer Naskah)",
        "citation_verify": "10. Citation Verification (Verifikasi Validitas Sitasi)",
        "research_gap": "11. Research Gap & Novelty (Identifikasi Kebaruan Riset)",
        "journal_formatter": "12. Journal Formatter (Audit Struktur Template Jurnal)"
    }
    
    col_skill_select, col_skill_lang = st.columns([2, 1])
    with col_skill_select:
        selected_skill = st.selectbox(
            "Pilih Keahlian Asisten:",
            options=list(skill_options.keys()),
            format_func=lambda x: skill_options[x]
        )
    with col_skill_lang:
        copilot_lang = st.selectbox(
            "Bahasa Target Asisten:",
            options=["id-ID", "en-US"],
            format_func=lambda x: "Bahasa Indonesia" if x == "id-ID" else "English (US)"
        )
        
    copilot_context = st.text_input(
        "Konteks / Instruksi Tambahan (Opsional):",
        placeholder="Misal: 'Target jurnal terindeks Scopus Q1' atau 'Fokus pada metodologi penelitian kuantitatif'",
    )
    
    copilot_text = st.text_area(
        "Teks Masukan untuk Asisten:",
        value=st.session_state.document_text[:1200] if st.session_state.document_text else "",
        height=180
    )
    
    if st.button("🚀 Eksekusi Asisten AI", type="primary"):
        if not copilot_text.strip():
            st.warning("Silakan masukkan teks terlebih dahulu.")
        else:
            with st.spinner("Menganalisis dengan Academic AI Copilot..."):
                active_api_key = user_api_key if user_api_key else None
                copilot_result = execute_academic_copilot(
                    skill_id=selected_skill,
                    text=copilot_text,
                    context=copilot_context,
                    target_language=copilot_lang,
                    api_key=active_api_key
                )
                
                st.markdown(f"**Penyedia Mesin:** `{copilot_result['provider']}` | **Model:** `{copilot_result['model_used']}`")
                st.markdown("---")
                st.markdown(copilot_result["output"])

# ==============================================================================
# TAB 4: Pencarian DOI & Referensi Resmi Crossref
# ==============================================================================
with tab_citations:
    st.subheader("📚 Pencarian Referensi & Sitasi Resmi via Crossref")
    st.caption("Pencarian metadata langsung ke database resmi Crossref tanpa pihak ketiga.")
    
    q_col1, q_col2 = st.columns([3, 1])
    with q_col1:
        search_query = st.text_input("Cari judul artikel, topik riset, atau nomor DOI:", value="Attention Is All You Need")
    with q_col2:
        search_rows = st.selectbox("Jumlah Hasil:", options=[3, 5, 10], index=1)
        
    if st.button("🔍 Cari Referensi Terverifikasi", type="primary"):
        with st.spinner("Menghubungi Crossref API..."):
            try:
                results = search_crossref_dois(search_query, rows=search_rows)
                if not results:
                    st.info("Tidak ditemukan referensi yang cocok dengan kata kunci tersebut.")
                else:
                    st.success(f"Ditemukan {len(results)} artikel terverifikasi:")
                    for idx, item in enumerate(results):
                        with st.container():
                            st.markdown(f"### {idx+1}. {item['title']}")
                            st.caption(f"**Penulis:** {', '.join(item['authors'])} ({item['year'] or 'n.d.'}) | **Jurnal:** *{item['journal'] or 'Publikasi Ilmiah'}*")
                            if item["doi"]:
                                st.markdown(f"**DOI:** [`{item['doi']}`]({item['url']})")
                            
                            c_apa, c_ieee = st.columns(2)
                            with c_apa:
                                st.markdown("**Sitasi Format APA 7:**")
                                st.code(item["apa"], language="text")
                            with c_ieee:
                                st.markdown("**Sitasi Format IEEE:**")
                                st.code(item["ieee"], language="text")
                            st.divider()
            except Exception as e:
                st.error(f"Gagal menghubungi server Crossref: {e}")

# ==============================================================================
# TAB 5: Korpus Ilmiah Terindeks & Custom Corpus
# ==============================================================================
with tab_corpus:
    st.subheader("🏛️ Korpus Ilmiah Terbuka Berizin")
    st.caption("Karya ilmiah berlisensi Creative Commons dan Public Domain yang dijadikan dasar perbandingan kemiripan teks.")
    
    # Table of standard corpus
    st.dataframe(
        [
            {
                "Judul Artikel": art["title"],
                "Penulis & Tahun": f"{art['authors']} ({art.get('year', 'n.d.')})",
                "Lisensi": art.get("license", "Open Access"),
                "Tautan Resmi": art.get("url", "#")
            }
            for art in OPEN_ACCESS_CORPUS
        ],
        use_container_width=True
    )
    
    with st.expander("📖 Lihat Kutipan Teks Korpus Terindeks"):
        for art in OPEN_ACCESS_CORPUS:
            st.markdown(f"**{art['title']}** — *{art['authors']}*")
            st.text(art["text"])
            st.markdown("---")

    st.markdown("### ➕ Tambahkan Dokumen Pembanding Sendiri (Sesi Ini)")
    st.caption("Tambahkan artikel rujukan atau skripsi Anda sendiri untuk diikutsertakan dalam penghitungan kemiripan.")
    
    new_doc_title = st.text_input("Judul Dokumen Baru:", placeholder="Contoh: Skripsi Bab 1-3 Referensi")
    new_doc_authors = st.text_input("Penulis / Sumber:", placeholder="Contoh: Ahmad et al. (2024)")
    new_doc_text = st.text_area("Isi Teks Dokumen Pembanding:", height=150)
    
    if st.button("➕ Daftarkan Dokumen ke Korpus Sesi"):
        if new_doc_title.strip() and new_doc_text.strip():
            st.session_state.custom_corpus.append({
                "id": f"custom_{len(st.session_state.custom_corpus)+1}",
                "title": new_doc_title,
                "authors": new_doc_authors or "Dokumen Pengguna",
                "year": "2026",
                "license": "Dokumen Lokal Pengguna",
                "url": "#",
                "text": new_doc_text
            })
            st.success(f"Dokumen '{new_doc_title}' berhasil ditambahkan! Total dokumen tambahan: {len(st.session_state.custom_corpus)}")
        else:
            st.warning("Harap isi judul dan teks dokumen.")
            
    if st.session_state.custom_corpus:
        st.markdown(f"**Dokumen Tambahan Anda ({len(st.session_state.custom_corpus)}):**")
        for doc in st.session_state.custom_corpus:
            st.write(f"- 📄 **{doc['title']}** ({doc['authors']})")
