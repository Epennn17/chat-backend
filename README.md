# Chat Backend

Proxy backend untuk endpoint AI publik. Menerima pesan dari client, meneruskannya
ke upstream, mengembalikan hasilnya dalam format JSON yang seragam.

Dibuat sebagai lapisan tipis antara frontend dan `api.alwayscodex.eu.cc`.
Tujuannya sederhana: menyembunyikan URL upstream dari browser, memvalidasi input
di satu tempat, dan memberi struktur yang bisa dikembangkan.

---

## Apa yang Sebenarnya Dilakukan Proyek Ini

Tiga hal, tidak lebih:

1. Terima `POST /api/chat` dengan body `{ "teks": "..." }`
2. Teruskan ke upstream lewat GET
3. Kembalikan `{ "reply": "...", "timestamp": "..." }`

Itu saja. Tidak ada database. Tidak ada autentikasi. Tidak ada session.
Setiap request berdiri sendiri, tidak saling tahu.

---

## Yang Perlu Kamu Tahu Sebelum Pakai

Bagian ini penting. Banyak README menyembunyikan keterbatasan; ini tidak.

### Endpoint ini bukan milik kita

`api.alwayscodex.eu.cc` adalah layanan pihak ketiga. Kita tidak mengontrol:

- **Kapan layanan itu mati.** Kalau upstream down, backend ini ikut down. Tidak ada fallback.
- **Apa yang model-nya jawab.** Endpoint ini punya system prompt sendiri di sisi server.
  Kamu tidak bisa mengubahnya. Tidak ada parameter `system`, `model`, `temperature`,
  atau `max_tokens` yang bisa kamu kirim. Satu-satunya yang bisa kamu kirim adalah `teks`.
- **Rate limit mereka.** Kalau kamu spam, upstream bisa memblokir IP server kamu.
  Backend ini tidak punya proteksi terhadap itu.
- **Isi jawabannya.** Model di balik endpoint ini cukup ketat. Prompt yang dianggap
  sensitif akan ditolak dengan disclaimer, bukan dijawab. Ini perilaku upstream,
  bukan bug di kode ini.

### Tidak ada streaming

Respons datang sekaligus setelah upstream selesai. Tidak ada token-per-token.
Frontend tidak bisa menampilkan efek "mengetik" yang nyata — yang ada hanya ilusi
loading indicator sampai respons utuh tiba.

Konsekuensi praktis: untuk jawaban panjang, user menunggu dalam diam selama
beberapa detik. Tidak ada jalan keluar dari batasan ini tanpa ganti upstream.

### Tidak ada memori percakapan

Upstream tidak menerima history. Setiap `POST /api/chat` adalah percakapan baru
yang mandiri. Kalau user bilang "namaku Noer" lalu di pesan berikutnya bertanya
"siapa namaku?", model tidak akan tahu.

Untuk membuat model tampak "ingat", kamu harus menyatukan history ke dalam satu
field `teks` di sisi client — tapi itu hack, bukan solusi. Model akan menerima
seluruh percakapan sebagai satu pesan user tunggal, dan hasilnya tidak konsisten.

### Tidak ada autentikasi

Siapa pun yang tahu URL backend ini bisa memakainya. Tidak ada API key, tidak ada
login, tidak ada limit per user.

**Jangan deploy ini ke publik tanpa menambahkan rate limiting.** Satu orang iseng
bisa menghabiskan kuota upstream kamu, atau membuat IP server kamu diblokir.

### Tidak ada penyimpanan

Pesan tidak disimpan di mana pun. Refresh halaman, history hilang. Restart server,
tidak ada yang berubah karena memang tidak ada yang disimpan.

---

## Struktur
