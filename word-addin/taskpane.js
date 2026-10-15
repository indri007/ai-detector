/**
 * AcademicWrite AI - Microsoft Word Add-in Controller
 * Integrates Office.js with FastAPI backend (http://127.0.0.1:8000)
 */

const API_BASE = "http://127.0.0.1:8000";

let isOfficeInitialized = false;
let currentSelectionText = "";
let lastRewrittenText = "";

// Initialize Office.js
Office.onReady((info) => {
  if (info.host === Office.HostType.Word) {
    isOfficeInitialized = true;
    updateStatus("Terhubung ke Microsoft Word.");
  } else {
    updateStatus("Berjalan dalam mode pratinjau browser.");
  }
  setupEventListeners();
});

function updateStatus(msg) {
  const el = document.getElementById("statusIndicator");
  if (el) el.textContent = msg;
}

function setupEventListeners() {
  // Tab switching
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
      document.querySelectorAll(".tab-content").forEach((c) => c.classList.remove("active"));

      btn.classList.add("active");
      const targetId = btn.getAttribute("data-tab");
      const targetEl = document.getElementById(targetId);
      if (targetEl) targetEl.classList.add("active");
    });
  });

  // Read selected text from Word
  document.getElementById("btnReadSelection").addEventListener("click", readSelectionFromWord);

  // Check grammar
  document.getElementById("btnCheckGrammar").addEventListener("click", runGrammarCheck);

  // Run rewrite
  document.getElementById("btnRunRewrite").addEventListener("click", runRewrite);

  // Apply rewrite to Word
  document.getElementById("btnApplyRewriteToWord").addEventListener("click", () => {
    if (lastRewrittenText) {
      applyTextToWord(lastRewrittenText);
    }
  });

  // Search citations
  document.getElementById("btnSearchCitations").addEventListener("click", searchCitations);
}

/**
 * Reads user's selected text in Word document via Office.js
 */
async function readSelectionFromWord() {
  if (!isOfficeInitialized) {
    // Browser fallback
    const preview = document.getElementById("selectedTextPreview").value;
    if (preview) {
      currentSelectionText = preview;
      updateTextMetrics(preview);
      updateStatus("Teks dibaca dari textarea.");
    } else {
      alert("Mode pratinjau: Ketik beberapa kalimat langsung di kotak teks.");
    }
    return;
  }

  try {
    await Word.run(async (context) => {
      const selection = context.document.getSelection();
      selection.load("text");
      await context.sync();

      currentSelectionText = selection.text.trim();
      document.getElementById("selectedTextPreview").value = currentSelectionText;
      updateTextMetrics(currentSelectionText);
      updateStatus(`Teks terbaca (${currentSelectionText.split(/\s+/).filter(Boolean).length} kata).`);
    });
  } catch (err) {
    updateStatus("Gagal membaca dokumen Word.");
    console.error(err);
  }
}

function updateTextMetrics(text) {
  const words = text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0;
  document.getElementById("charCountDisplay").textContent = `${words} kata | ${text.length} karakter`;
}

/**
 * Replaces selected range in Word with corrected text
 */
async function applyTextToWord(replacementText) {
  if (!isOfficeInitialized) {
    document.getElementById("selectedTextPreview").value = replacementText;
    currentSelectionText = replacementText;
    updateTextMetrics(replacementText);
    alert("Pratinjau browser: Teks berhasil diganti di kotak preview.");
    return;
  }

  try {
    await Word.run(async (context) => {
      const selection = context.document.getSelection();
      selection.insertText(replacementText, Word.InsertLocation.replace);
      await context.sync();
      updateStatus("Teks di Word berhasil diperbarui!");
    });
  } catch (err) {
    updateStatus("Gagal mengganti teks di Word.");
    console.error(err);
  }
}

/**
 * Calls FastAPI Grammar Engine
 */
async function runGrammarCheck() {
  const text = currentSelectionText || document.getElementById("selectedTextPreview").value.trim();
  if (!text) {
    alert("Pilih atau masukkan teks terlebih dahulu.");
    return;
  }

  const lang = document.getElementById("langSelect").value;
  updateStatus("Memeriksa tata bahasa...");

  try {
    const res = await fetch(`${API_BASE}/api/v1/analyze/comprehensive`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, language: lang })
    });

    if (!res.ok) throw new Error("API backend error");
    const data = await res.json();
    renderGrammarResults(data.grammar.findings);
    updateStatus("Pemeriksaan selesai.");
  } catch (err) {
    updateStatus("Backend offline. Pastikan FastAPI berjalan di port 8000.");
  }
}

function renderGrammarResults(findings) {
  const list = document.getElementById("grammarResultsList");
  list.innerHTML = "";

  if (!findings || findings.length === 0) {
    list.innerHTML = '<div class="empty-state">✅ Tidak ditemukan kesalahan tata bahasa.</div>';
    return;
  }

  findings.forEach((f) => {
    const card = document.createElement("div");
    card.className = "finding-card";
    card.innerHTML = `
      <span class="category">${f.category}</span>
      <div class="message">${f.message}</div>
      <div class="explanation">${f.explanation || ""}</div>
      <div class="finding-actions">
        <span style="font-size:11px;">
          <s style="color:#94A3B8;">${f.original_text}</s> → <strong style="color:#059669;">${f.replacement_text || ""}</strong>
        </span>
        <button class="btn-secondary btn-apply" style="padding:2px 8px;">Terapkan</button>
      </div>
    `;

    card.querySelector(".btn-apply").addEventListener("click", () => {
      if (f.replacement_text) {
        applyTextToWord(f.replacement_text);
      }
    });

    list.appendChild(card);
  });
}

/**
 * Calls FastAPI Rewrite / Style Engine
 */
async function runRewrite() {
  const text = currentSelectionText || document.getElementById("selectedTextPreview").value.trim();
  if (!text) {
    alert("Pilih atau masukkan teks terlebih dahulu.");
    return;
  }

  const mode = document.getElementById("rewriteModeSelect").value;
  const lang = document.getElementById("langSelect").value;
  updateStatus("Melakukan parafrase akademik...");

  try {
    const res = await fetch(`${API_BASE}/api/v1/style/rewrite`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, mode, language: lang })
    });

    if (!res.ok) throw new Error("API backend error");
    const data = await res.json();

    lastRewrittenText = data.suggested_rewrite;
    document.getElementById("rewriteTextOutput").textContent = data.suggested_rewrite;
    document.getElementById("rewriteRationaleOutput").textContent = data.rationale;
    document.getElementById("rewriteResultArea").classList.remove("hidden");
    updateStatus("Saran parafrase siap.");
  } catch (err) {
    updateStatus("Gagal menghubungkan ke backend.");
  }
}

/**
 * Calls Crossref DOI / Citation Search
 */
async function searchCitations() {
  const query = document.getElementById("citationSearchInput").value.trim();
  if (!query) return;

  updateStatus("Mencari referensi resmi...");
  const list = document.getElementById("citationResultsList");
  list.innerHTML = '<div class="empty-state">Mencari di Crossref...</div>';

  try {
    const res = await fetch(`${API_BASE}/api/v1/citations/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    const results = data.results || [];

    list.innerHTML = "";
    if (results.length === 0) {
      list.innerHTML = '<div class="empty-state">Referensi tidak ditemukan.</div>';
      return;
    }

    results.forEach((item) => {
      const card = document.createElement("div");
      card.className = "citation-card";
      const citationText = `(${item.authors.join(", ")}, ${item.year || "n.d."})`;
      card.innerHTML = `
        <strong>${item.title}</strong>
        <p style="color:#64748B; margin: 2px 0;">${item.authors.join(", ")} (${item.year || "n.d."})</p>
        <span style="font-size:10px; color:#2563EB;">DOI: ${item.doi}</span>
        <div style="margin-top:6px; display:flex; justify-content:space-between;">
          <a href="${item.url}" target="_blank" style="color:#1E3A8A; text-decoration:none;">Buka DOI ↗</a>
          <button class="btn-secondary btn-insert-cite" style="padding:2px 6px;">Sisipkan Sitasi</button>
        </div>
      `;

      card.querySelector(".btn-insert-cite").addEventListener("click", () => {
        applyTextToWord(` ${citationText} `);
      });

      list.appendChild(card);
    });

    updateStatus(`Ditemukan ${results.length} referensi.`);
  } catch (err) {
    updateStatus("Gagal mencari referensi.");
  }
}
