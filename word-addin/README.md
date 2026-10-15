# Microsoft Word Add-in (`word-addin/`)
**Platform:** Academic Writing Intelligence Platform  
**Target:** Microsoft Word on macOS, Windows, and Word on the Web (Office 365)  
**Version:** 0.2.0-beta (Enterprise Resilient Edition)  
**Manifest:** `word-addin/manifest.xml`  

---

## 🌟 Gambaran Umum & Fitur

Word Add-in ini memungkinkan peneliti, dosen, dan mahasiswa melakukan audit naskah ilmiah **langsung di dalam aplikasi Microsoft Word** tanpa perlu bolak-balik menyalin teks ke browser:

1. **Ambil Teks dari Word:** Membaca teks yang sedang diblok menggunakan Word JavaScript API (`context.document.getSelection()`).
2. **Pemeriksaan PUEBI & Tata Bahasa:** Mendeteksi ejaan non-baku Indonesia (*praktik*, *analisis*, *sistem*, *objek*, *di mana*, *daripada*) dan konvensi akademik Bahasa Inggris (*kontraksi*, *frasa opini*).
3. **Ganti Otomatis di Word:** Tombol *"Ganti di Word"* langsung menimpa kata/kalimat yang salah di dokumen asli dengan koreksi baku secara atomik.
4. **Parafrase Kalimat:** Mode Formal Baku dan Mode Ringkas (eliminasi pleonasme) dengan rasional ilmiah.
5. **Pencarian Crossref & Sisipkan Sitasi:** Mencari judul/DOI di database Crossref dan menyisipkan format sitasi `(Author, Year)` langsung ke posisi kursor Word.
6. **Uji Kemiripan Korpus:** Menghitung indeks 5-gram Jaccard terhadap paper ilmiah terbuka terindeks.
7. **Resilient Offline Fallback:** Jika backend server lokal port 8000 tidak menyala, add-in **tetap berfungsi mandiri** menggunakan mesin aturan PUEBI client-side dan koneksi langsung ke Crossref REST API.

---

## 🚀 Panduan Sideloading (Menjalankan di Microsoft Word)

### Opsi A: Menjalankan Local Web Server untuk Task Pane
Task pane Add-in dilayani melalui web server lokal sederhana:
```bash
# Dari root proyek:
npx serve -l 3001 word-addin/
```
*Task pane akan dapat diakses di `http://localhost:3001/taskpane.html`.*

---

### Opsi B: Sideloading di Microsoft Word (macOS)
1. Buka **Finder** di Mac Anda.
2. Tekan kombinasi tombol `Cmd + Shift + G`, lalu masukkan path folder berikut:
   ```text
   ~/Library/Containers/com.microsoft.Word/Data/Documents/wef/
   ```
   *(Jika folder `wef` belum ada, buat folder baru dengan nama `wef`).*
3. Salin file `word-addin/manifest.xml` ke dalam folder `wef` tersebut.
4. Buka aplikasi **Microsoft Word** (restart jika sedang terbuka).
5. Buka tab ribbon **Insert** $\to$ klik panah kecil di samping tombol **My Add-ins** $\to$ pilih **AcademicWrite AI Assistant**.
6. Panel task pane akan terbuka di sisi kanan dokumen Word Anda.

---

### Opsi C: Sideloading di Word on the Web (Office 365 Browser)
1. Buka browser dan buka dokumen di [office.com](https://www.office.com/) / Word Online.
2. Klik tab **Insert** $\to$ klik **Add-ins** $\to$ pilih **Manage My Add-ins**.
3. Klik **Upload My Add-in** $\to$ pilih file `word-addin/manifest.xml`.
4. Add-in akan langsung muncul di panel samping dokumen Word Anda.

---

## 🔒 Kebijakan Privasi & Keamanan (Zero-Retention)
* Add-in hanya membaca teks yang secara eksplisit diblok oleh pengguna saat tombol *"Ambil Teks dari Word"* diklik.
* Teks dokumen **tidak pernah disimpan di cloud** dan tidak pernah dibagikan ke pihak ketiga.
