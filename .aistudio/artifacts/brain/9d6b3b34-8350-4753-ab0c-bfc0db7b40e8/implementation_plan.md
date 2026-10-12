# Revisi Aplikasi Belajar Membilang Angka 1–10 (TK A)

Pembaruan menyeluruh pada aplikasi belajar membilang 1–10 untuk menghadirkan suara anak (child-like voice), dukungan dwibahasa (Indonesia & Inggris) dengan tombol pilihan bahasa, pengaturan warna font judul dan instruksi berbasis usia (merah untuk 4–5 tahun dan hitam untuk 5–6 tahun), serta penerapan huruf kecil secara menyeluruh pada semua teks.

> [!IMPORTANT] Keputusan yang Telah Dikonfirmasi Pengguna:
> - **Penyajian Dwibahasa**: Sediakan tombol pilihan bahasa (*toggle* bahasa Indonesia `id` dan Inggris `en`). Teks dan suara akan menyesuaikan bahasa yang aktif.
> - **Warna Font Merah & Hitam**: Disesuaikan berdasarkan kelompok usia anak. Sediakan tombol pilihan usia: **4–5 tahun** (font judul dan instruksi berwarna merah) dan **5–6 tahun** (font judul dan instruksi berwarna hitam).
> - **Penggunaan Huruf Kecil**: Semua teks di seluruh aplikasi menggunakan huruf kecil (*lowercase*) secara konsisten untuk mendukung metode pengenalan huruf awal anak TK A.
> - **Karakteristik Suara Anak**: Pengaturan sintesis suara (*speech synthesis*) disesuaikan dengan nada tinggi (*high pitch* 1.4–1.5) dan tempo santai (0.9) agar menyerupai suara anak yang ceria dan ramah.

---

## 1. Ikhtisar & Konsep Utama

- **Tujuan Aplikasi**: Membantu anak usia 4–6 tahun (TK A) mengenal simbol angka 1–10, menghitung benda secara visual-taktil, dan memahami urutan angka melalui pengalaman belajar dwibahasa yang ceria dan ramah anak.
- **Pengguna Utama**: Anak TK A (usia 4–6 tahun) didampingi oleh orang tua atau guru.
- **Nilai Tambah Revisi**:
  - Pengalaman audio yang lebih dekat dan ramah anak melalui modulasi suara anak (*child voice modulation*).
  - Pembelajaran bilingual dini (*early bilingual literacy*) Indonesia - Inggris.
  - Diferensiasi visual berbasis kesiapan membaca anak (warna merah kontras untuk usia 4–5 tahun, warna hitam untuk 5–6 tahun).
  - Teks huruf kecil (*lowercase*) yang sesuai dengan standar pedagogi pengenalan aksara awal PAUD/TK.

---

## 2. Pengalaman Pengguna & Desain Visual

### A. Kontrol Bilah Atas (Top Bar / Header)
- **Tombol Kembali & Judul**: Menampilkan tombol kembali ke menu dan judul aktivitas dalam huruf kecil.
- **Pemilih Usia (4–5 Tahun / 5–6 Tahun)**: Tombol dwipilihan usia yang mudah diakses untuk mengganti skema warna judul & instruksi secara instan (merah vs hitam).
- **Pemilih Bahasa (ID / EN)**: Tombol label dwibahasa (`🇮🇩 id` / `🇬🇧 en`) yang mengubah nama angka, teks instruksi, dan suara pembicara.
- **Tombol Tes Suara & Status Audio**: Tombol tes audio anak dan tombol mute/unmute yang tetap responsif dan mudah disentuh.

### B. Hierarki Warna & Tipografi
- **Skema Warna Berdasarkan Usia**:
  - **Mode 4–5 Tahun**: Judul aktivitas, instruksi, dan pertanyaan menggunakan warna merah cerah (`#DC2626` / `#B91C1C`).
  - **Mode 5–6 Tahun**: Judul aktivitas, instruksi, dan pertanyaan menggunakan warna hitam pekat (`#111827` / `#000000`).
- **Disiplin Huruf Kecil (*Strict Lowercase*)**:
  - Seluruh teks antarmuka dikonversi ke huruf kecil yang bersih dan ramah anak (contoh: `ayo berhitung!`, `belajar angka`, `aktivitas membilang`, `urutkan angka`, `tebak jumlah`, `satu`, `one`, `dua`, `two`, `sentuh setiap benda`, `hebat sekali!`, `coba lagi ya!`).
- **Font Ramah Anak**: Font sans-serif bundar yang terbaca jelas dengan angka tebal dan target sentuh berukuran minimal 48px–64px untuk jari anak.

### C. Alur Aktivitas
1. **Menu Utama (`main menu`)**: Pilihan 4 aktivitas utama dengan kartu bergradien cerah, teks huruf kecil, dan audio suara anak saat dipilih.
2. **Belajar Angka (`learn`)**: Menampilkan angka besar 1–10, kata angka dwibahasa (misal: `satu` / `one`), serta objek visual yang dapat disentuh satu per satu.
3. **Aktivitas Membilang (`count`)**: Menghitung objek dengan bantuan hitung otomatis atau sentuhan manual, memilih kartu angka jawaban, dan umpan balik suara anak.
4. **Urutkan Angka (`sequence`)**: Melengkapi gerbong kereta angka yang hilang dengan pilihan kartu angka 1–10.
5. **Tebak Jumlah (`guess`)**: Menghitung cepat kelompok benda dan menebak jumlah dengan pilihan tombol besar.
6. **Layar Selesai (`completion`)**: Pesan penyemangat bernada positif dalam huruf kecil dan tombol `main lagi`.

---

## 3. Strategi Teknis & Audio Suara Anak

### A. Modulasi Suara Anak (*Child-Like Voice Engine*)
```
Web Speech API (SpeechSynthesisUtterance)
  ├── Pitch: 1.45 (nada tinggi anak-anak)
  ├── Rate: 0.90 (tempo bicara lembut & jelas)
  ├── Voice Selection:
  │     ├── Indonesia (id-ID) suara wanita/muda berfrekuensi tinggi
  │     └── English (en-US / en-GB) natural voice
  └── Dual Audio Fallback:
        └── Web Audio API marimba pentatonic tones (selalu berbunyi tanpa dependensi sistem)
```

### B. Struktur Data Dwibahasa & Teks
Memperluas `NUMBER_DATA` dan kamus teks terjemahan (`translations`) untuk mencakup:
- Nama angka: `satu` ↔ `one`, `dua` ↔ `two`, ... `sepuluh` ↔ `ten`.
- Nama benda jamak/tunggal: `apel` ↔ `apples`, `bintang` ↔ `stars`, `kucing` ↔ `cats`, dll.
- Instruksi & dialog: `berapa jumlah apel?` ↔ `how many apples?`, `hebat sekali!` ↔ `great job!`, `coba lagi ya!` ↔ `try again!`.

### C. Diagram Arsitektur Komponen

```
┌────────────────────────────────────────────────────────┐
│                        App.tsx                         │
│  State: language ('id' | 'en'), ageGroup ('4-5' | '5-6')│
│  State: currentActivity, soundSettings                │
└───────────────────────────┬────────────────────────────┘
                            │
       ┌────────────────────┼────────────────────┐
       ▼                    ▼                    ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Header.tsx  │     │ Activities   │     │   audio.ts   │
│ - [id | en]  │     │ - Learn      │     │ - child voice│
│ - [4-5 | 5-6]│     │ - Count      │     │ - speech id  │
│ - [tes suara]│     │ - Sequence   │     │ - speech en  │
│ - [mute]     │     │ - Guess      │     │ - marimba sfx│
└──────────────┘     └──────────────┘     └──────────────┘
```

---

## 4. Rencana Tahapan Eksekusi

1. **Pembaruan Utilitas Audio (`src/utils/audio.ts`)**:
   - Menambahkan parameter bahasa (`id` / `en`) dan modulasi suara anak (pitch `1.45`, rate `0.90`).
   - Menyediakan frasa suara anak dwibahasa untuk pujian, instruksi hitung, dan pelafalan angka.
2. **Kamus Terjemahan & Data Dwibahasa (`src/types.ts`)**:
   - Menambahkan kosakata angka dwibahasa dan teks instruksi huruf kecil.
   - Menambahkan tipe `AgeGroup` (`'4-5'` | `'5-6'`) dan `Language` (`'id'` | `'en'`).
3. **Pembaruan Bilah Atas (`src/components/Header.tsx`)**:
   - Menambahkan kontrol pilihan bahasa (`id` / `en`) dan pilihan usia (`4-5 tahun` / `5-6 tahun`).
   - Menerapkan warna merah/hitam dan huruf kecil.
4. **Pembaruan Komponen Aktivitas**:
   - `src/components/MainMenu.tsx`: Teks huruf kecil, warna judul/instruksi adaptif sesuai usia, label dwibahasa.
   - `src/components/LearnNumbers.tsx`: Nama angka dwibahasa, suara anak dwibahasa, teks instruksi adaptif merah/hitam.
   - `src/components/CountingActivity.tsx`: Bantuan hitung dwibahasa, suara anak saat menyentuh benda, teks merah/hitam.
   - `src/components/SequenceActivity.tsx`: Suara dan teks instruksi dwibahasa dalam huruf kecil.
   - `src/components/GuessQuantityActivity.tsx`: Soal dan pujian dwibahasa dalam suara anak.
   - `src/components/CompletionScreen.tsx`: Apresiasi huruf kecil dwibahasa dengan suara anak.
5. **Verifikasi & Pengujian**:
   - Menjalankan `lint_applet` dan `compile_applet`.
   - Menguji peralihan bahasa, peralihan usia (warna font merah vs hitam), suara anak, dan huruf kecil.
