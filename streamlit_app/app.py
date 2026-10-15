import streamlit as st
import requests
import json

st.set_page_config(
    page_title="AcademicWrite AI — Companion Dashboard",
    page_icon="🎓",
    layout="wide",
    initial_sidebar_state="expanded"
)

API_BASE = "http://127.0.0.1:8000"

# --- Sidebar Configuration ---
with st.sidebar:
    st.title("🎓 AcademicWrite AI")
    st.caption("Companion Dashboard & Corpus Explorer")
    
    language = st.selectbox(
        "Bahasa Naskah:",
        options=["id-ID", "en-US", "en-GB"],
        format_func=lambda x: "Bahasa Indonesia (PUEBI)" if x == "id-ID" else ("English (US)" if x == "en-US" else "English (UK)")
    )
    
    st.markdown("---")
    st.markdown("### 🔒 Kebijakan Privasi")
    st.info("Seluruh analisis teks diproses secara lokal. Naskah Anda tidak pernah disimpan permanen atau dibagikan ke pihak ketiga.")

# --- Main Workspace ---
st.header("Studio Penulisan & Analisis Akademik")

tab_editor, tab_citations, tab_corpus = st.tabs([
    "📝 Editor & Analisis Lengkap",
    "📚 Pencarian DOI & Referensi",
    "🏛️ Korpus Ilmiah Terindeks"
])

# TAB 1: Editor & Analysis
with tab_editor:
    col_input, col_results = st.columns([1.2, 1])
    
    with col_input:
        st.subheader("Naskah Akademik")
        default_sample = (
            "The dominant sequence transduction models are based on complex recurrent or convolutional neural networks. "
            "However, the author don't believe that praktek tanpa metode penelitian adalah solusi terbaik."
        )
        user_text = st.text_area(
            "Ketik atau tempelkan teks:",
            value=default_sample,
            height=380,
            help="Maksimal 20.000 karakter."
        )
        
        words = len(user_text.strip().split()) if user_text.strip() else 0
        chars = len(user_text)
        reading_time = max(1, (words + 199) // 200)
        
        st.caption(f"📊 **Statistik Langsung:** {words} kata | {chars} karakter | ~{reading_time} menit estimasi baca")
        
        btn_analyze = st.button("🔍 Jalankan Pemeriksaan Komprehensif", type="primary", use_container_width=True)

    with col_results:
        st.subheader("Hasil Pemeriksaan & Diagnostik")
        
        if btn_analyze and user_text.strip():
            with st.spinner("Menghubungi FastAPI backend..."):
                try:
                    payload = {"text": user_text, "language": language}
                    res = requests.post(f"{API_BASE}/api/v1/analyze/comprehensive", json=payload, timeout=5)
                    
                    if res.status_code == 200:
                        data = res.json()
                        grammar_data = data.get("grammar", {})
                        sim_data = data.get("similarity", {})
                        findings = grammar_data.get("findings", [])
                        
                        # Score Summary
                        col_g, col_s = st.columns(2)
                        with col_g:
                            st.metric("Temuan Tata Bahasa", len(findings))
                        with col_s:
                            sim_pct = sim_data.get("overall_percent", 0.0)
                            st.metric("Kemiripan Korpus", f"{sim_pct}%")
                        
                        # Grammar Findings
                        st.markdown("#### ✍️ Saran Tata Bahasa & Ejaan")
                        if not findings:
                            st.success("Tidak ditemukan kesalahan tata bahasa atau ejaan.")
                        else:
                            for f in findings:
                                with st.expander(f"⚠️ {f['original_text']} → {f.get('replacement_text', 'Periksa')}"):
                                    st.write(f"**Pesan:** {f['message']}")
                                    if f.get("explanation"):
                                        st.caption(f['explanation'])
                        
                        # Similarity Report
                        st.markdown("#### 📊 Kemiripan Naskah Terhadap Korpus")
                        st.caption(sim_data.get("disclaimer", ""))
                        sources = sim_data.get("matched_sources", [])
                        if not sources:
                            st.info("Tidak ditemukan kecocokan signifikan pada korpus terbuka.")
                        else:
                            for src in sources:
                                st.markdown(f"**[{src['match_percent']}%]** [{src['title']}]({src['url']}) — *{src['authors']}*")
                                for p in src.get("matched_passages", []):
                                    st.code(p, language="text")
                    else:
                        st.error(f"Backend error HTTP {res.status_code}")
                except Exception as e:
                    st.warning(f"FastAPI backend belum aktif di localhost:8000 ({e}).")

# TAB 2: DOI & Citation Search
with tab_citations:
    st.subheader("Pencarian Referensi Resmi via Crossref")
    q = st.text_input("Cari judul artikel, topik, atau DOI:", value="Attention Is All You Need")
    if st.button("Cari Referensi"):
        with st.spinner("Mencari metadata di Crossref..."):
            try:
                res = requests.get(f"{API_BASE}/api/v1/citations/search?q={q}", timeout=5)
                if res.status_code == 200:
                    items = res.json().get("results", [])
                    st.write(f"Ditemukan {len(items)} referensi terverifikasi:")
                    for item in items:
                        with st.container():
                            st.markdown(f"**{item['title']}**")
                            st.caption(f"Penulis: {', '.join(item['authors'])} ({item['year'] or 'n.d.'}) | DOI: `{item['doi']}`")
                            st.markdown(f"[Buka Tautan Jurnal ↗]({item['url']})")
                            st.divider()
                else:
                    st.error("Gagal mengambil data dari Crossref.")
            except Exception as e:
                st.error(f"Gagal menghubungkan ke backend: {e}")

# TAB 3: Indexed Corpus
with tab_corpus:
    st.subheader("Korpus Terbuka Berizin (Creative Commons & Public Domain)")
    st.caption("Digunakan sebagai dasar pembanding kemiripan teks.")
    st.table([
        {"Judul": "Attention Is All You Need", "Penulis": "Vaswani et al. (2017)", "Lisensi": "CC-BY 4.0 / arXiv"},
        {"Judul": "A Mathematical Theory of Communication", "Penulis": "Shannon (1948)", "Lisensi": "Public Domain"},
        {"Judul": "Analisis Sintaksis Bahasa Indonesia Akademik", "Penulis": "Pratama & Wicaksono (2022)", "Lisensi": "CC-BY-SA 4.0"}
    ])
