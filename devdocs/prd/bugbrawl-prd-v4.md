# Bug Brawl — Product Requirements Document (PRD)

**Author:** Adrianto Puji Irawan  
**Team:** Martunis  
**Team Members:** M. Althaf Kiram (Ketua), Resky Saputra, Adrianto Puji Irawan (PM)  
**Status:** Draft v3  
**Date:** 22 Juli 2026

---

## One Pager

### Overview
Bug Brawl adalah platform kompetisi debugging multiplayer real-time di mana seorang host dapat membuat room dan mengundang peserta untuk adu skill dalam menganalisis dan mengidentifikasi bug pada premade code snippets. Setiap jawaban peserta dianalisis dan di-scoring secara otomatis oleh AI, dengan leaderboard yang diperbarui secara real-time via WebSocket.

### Problem
Bootcamp student sering kesulitan mengasah skill debugging secara engaging. Metode yang ada (mengerjakan challenge individu, review instructor) kurang kompetitif dan minim feedback instan. Selain itu, student butuh portofolio aplikasi realtime yang menunjukkan kemampuan teknis full-stack (React, WebSocket, AI integration) untuk dipresentasikan ke hiring partner.

### Objectives
1. Menyediakan platform multiplayer real-time untuk kompetisi debugging
2. Mengimplementasikan AI-powered scoring yang memberikan feedback instan ke peserta
3. Menghasilkan portfolio aplikasi full-stack (SPA + realtime + AI) untuk presentasi Hacktiv8

### Constraints
- Deadline: Kamis, 23 Juli 2026 jam 09:00 (presentasi)
- Stack wajib: Vite + React.js (SPA), WebSocket (Socket.IO), React Context
- Tim: 3 orang (Althaff, Resky, Adri) — semua harus ngoding
- AI scoring harus reliable dan konsisten — prompt engineering krusial

### Keterangan Marker
- 🏫 = Mandatory dari requirement Group Project Hacktiv8
- 🔧 = Inisiatif tim (bukan mandatory, tapi valuable)

### Persona

| Persona | Deskripsi |
|---------|-----------|
| **Host** | User yang membuat room dan mengelola kompetisi. Host juga ikut bermain (debugging) — bukan hanya admin. Semua player setara, host hanya punya tambahan kontrol room (create, start, kick). |
| **Participant** | User yang join room via room code, menerima code snippet, mengirim jawaban debugging, dan bersaing di leaderboard. Fungsionalitas identik dengan host saat game berjalan. |

**Strategic Decision — Host ikut bermain:**

| Opsi | Deskripsi | Tradeoff |
|------|-----------|----------|
| A. Host = admin only | Host buat room, start, monitor leaderboard, nggak ikut ngerjain soal | Tim 3 orang → cuma 2 yang main. Kurang seru, kurang engaging buat demo. |
| B. Host = player + admin ✅ | Host dapat soal, submit jawaban, masuk leaderboard. Punya tambahan tombol "Start Game" & "Kick Player". | Sedikit tambahan UI complexity (conditional rendering tombol admin), tapi make-or-break untuk tim kecil. |

**Keputusan: Opsi B.** Tim cuma 3 orang — semua harus bisa main. Host bukan wasit, host adalah player yang kebetulan punya kunci room.

### Use Cases

**Scenario 1 — Host membuat kompetisi (dan ikut bermain)**
1. Host login/register ke platform
2. Host membuat room baru dan mendapat room code
3. Host membagikan room code ke peserta lain
4. Semua player (termasuk host) sudah join, host memulai kompetisi
5. Sistem mendistribusikan buggy code snippet ke semua player
6. Semua player (termasuk host) submit jawaban, lihat leaderboard
7. Setelah waktu habis, pemenang diumumkan

**Scenario 2 — Participant mengikuti kompetisi**
1. Participant login/register ke platform
2. Participant memasukkan room code untuk join
3. Menunggu host memulai kompetisi
4. Menerima code snippet, menganalisis bug
5. Mengirim jawaban dalam bentuk natural language (textarea)
6. Menerima skor via notifikasi dan melihat leaderboard update
7. Lanjut ke soal berikutnya sampai waktu habis

---

## PRD

### Features In

| Priority | Feature | Description |
|----------|---------|-------------|
| P0 🏫 | **Register & Login** | User authentication (username + password). Dibutuhkan untuk identifikasi peserta dan leaderboard. |
| P0 🏫 | **Room System** | Host membuat room (dapat room code), participant join via room code. Room punya kapasitas maksimal. |
| P0 🏫 | **Real-Time Communication** | Socket.IO untuk semua event real-time: room join/leave, start game, soal dikirim, jawaban submit, score broadcast, leaderboard update. |
| P0 🏫 | **AI-Powered Scoring** | Setiap jawaban peserta dianalisis AI, dibandingkan dengan bug descriptions yang sudah disiapkan (premade). Output: skor + feedback. |
| P0 🏫 | **Leaderboard** | Real-time leaderboard diperbarui setiap kali ada skor baru. Ditampilkan di layar semua peserta (termasuk host). |
| P1 🏫 | **SPA + Router + Context** | Client menggunakan Vite + React.js, Single Page Application dengan React Router, state management pakai React Context. |
| P1 🏫 | **GitHub Workflow** | Wajib pakai GitHub Organization, branch + PR workflow, minimal 1 hari 4 commit dengan message deskriptif. |
| P1 | **Code Snippet Context** | Setiap soal disertai konteks (problem statement) agar user mengerti apa yang sedang di-debug. Feedback Sony 21/7. |
| P1 | **End-of-Game Summary** | Pemenang diumumkan, leaderboard final ditampilkan. |
| P2 🏫 | **Deploy** | Deploy client (wajib), deploy server (opsional). Bisa diakses publik untuk ditunjukkan ke hiring partner. |

### Features Out

| Feature | Alasan |
|---------|--------|
| Voice/Video Call | Scope terlalu besar untuk 1.5 hari. Fokus ke core realtime + AI dulu. |
| Custom Code Snippets (user-uploaded) | Meningkatkan kompleksitas AI scoring secara signifikan. Gunakan premade snippets dulu. |
| OAuth/Social Login | Simple username+password sudah cukup untuk MVP. |

### Features Out — Tradeoffs

| Feature yang di-drop | Kenapa valuable | Kenapa tetep di-drop |
|----------------------|-----------------|----------------------|
| Voice/Video Call | Real-time multiplayer lebih immersive dengan voice | Butuh WebRTC + STUN/TURN server, minimal 2-3 hari development. Bisa di-pitch sebagai "future roadmap" saat presentasi. |
| Custom Snippets | User bisa bikin soal sendiri, replayability tinggi | AI scoring reliability bergantung pada bug descriptions yang well-crafted. Kalo user yang bikin descriptions-nya, quality nggak kejamin → scoring ngawur. |
| OAuth/Social Login | UX better, nggak perlu ingat password | Butuh setup OAuth provider + callback handling. 2-3 jam yang bisa dipakai buat fitur core. Username+password cukup untuk 3 orang main. |

### Game Mechanics

**Room Lifecycle:**
```
[Host Create Room] → [Players Join] → [Host Start] → [Round 1..N] → [Game Over]
```
Host ikut bermain — host menerima soal, submit jawaban, dan masuk leaderboard seperti peserta lain.

**Per-Round Flow:**
```
[Soal dikirim via Socket] → [Timer mulai] → [Semua player submit jawaban]
    → [AI scoring per jawaban] → [Skor di-broadcast] → [Leaderboard update] → [Next round]
```

**Strategic Decision — Timer Model:**

| Opsi | Cara Kerja | Tradeoff |
|------|-----------|----------|
| A. Client-side timer | Masing-masing browser hitung mundur sendiri | Simple implementasi, tapi risk desync. Player bisa manipulasi JS console. |
| B. Server-authoritative timer ✅ | Server yang tentukan kapan round mulai & selesai, broadcast ke semua client via socket | Butuh sedikit lebih banyak socket events (`round:start`, `round:end`), tapi semua player sinkron & nggak bisa dicurangi. |

**Keputusan: Opsi B.** Kompetisi harus fair. Server jadi source of truth untuk timing.

**Scoring Model:**

| Aspek | Detail | Tradeoff |
|-------|--------|----------|
| Input | AI menerima: context, code, expected bugs (key answer), jawaban user | Prompt harus strict JSON output, kalau nggak parsing gagal. |
| Skoring | AI bandingkan jawaban user vs bug descriptions. Skor berdasarkan coverage + kualitas. | Subjektivitas AI — dua jawaban mirip bisa beda skor. Perlu eval. |
| Max score per soal | Fixed per snippet, ditentukan saat bikin soal | Fair — semua peserta dapat max_score yang sama. |
| Jawaban ngawor | Skor 0 + feedback "Jawaban tidak relevan" | Butuh deteksi di prompt: "If answer is nonsensical, return score 0" |

---

## API Contract v3

Tujuan: frontend & backend bisa development paralel tanpa saling tunggu. Backend build sesuai spec, frontend mock API pakai MSW.

### REST API

**Base URL:** `http://localhost:3000/api`

#### Auth

| Method | Endpoint | Request Body | Response | Notes |
|--------|----------|-------------|----------|-------|
| `POST` | `/auth/register` | `{ username, password }` | `{ id, username}` | Hash password (bcrypt), Return 201 "Account has been created successfully" |
| `POST` | `/auth/login` | `{ username, password }` | `{ token }` | Return JWT |
| `GET` | `/auth/me` | — (Header: `Authorization: Bearer <token>`) | `{ id, username }` | Token validation |

#### Rooms

| Method | Endpoint | Request | Response | Notes |
|--------|----------|---------|----------|-------|
| `POST` | `/rooms` | — (Auth header) | `{ id, code, host_id, status, created_at }` | Auto-generate 6-char room code |
| `POST` | `/rooms/:code/join` | — (Auth header) | `{ room_id, code, players: [...] }` | Return list player |
| `GET` | `/rooms/:code` | — | `{ id, code, host_id, status, players, created_at }` | Info room + player list |
| `POST` | `/rooms/:code/start` | — (Auth, must be host) | `{ status: "playing", started_at }` | Trigger game start |

#### Snippets

| Method | Endpoint | Request | Response | Notes |
|--------|----------|---------|----------|-------|
| `GET` | `/snippets/random` | — | `{ id, title, context, code, max_score }` | Random snippet. Bug descriptions NOT returned. |
| `GET` | `/snippets/:id` | — | `{ id, title, context, code, max_score }` | Specific snippet by ID. No bug descriptions. |
| `GET` | `/snippets` | — | `[{ id, title }, ...]` | List all snippets (admin/debugging). |

#### Scoring (NEW)

| Method | Endpoint | Purpose | Request | Response |
|--------|----------|---------|---------|----------|
| `POST` | `/scores/submit` | Submit & score jawaban (REST fallback) | `{ roomCode, snippetId, answer }` | `{ score, maxScore, feedback, bugsFound, bugsPartial, bugsMissed }` |
| `GET` | `/rooms/:code/leaderboard` | Leaderboard terkini | — | `[{ username, totalScore }, ...]` |
| `GET` | `/rooms/:code/results` | Hasil akhir (setelah game over) | — | `{ winner, finalLeaderboard, rounds: [...] }` |

**Kenapa ada REST scoring endpoint? Bukannya udah Socket.IO?**

| Alasan | Detail |
|--------|--------|
| Development & testing | Developer bisa test scoring tanpa full socket flow |
| LLM eval | Adri bisa panggil REST langsung buat test prompt vs dummy answer |
| Fallback | Socket disconnect pas submit → retry via REST |
| Debugging | Lebih gampang debug scoring logic lewat Thunder Client |

Flow utama tetap Socket.IO — REST sebagai companion & fallback, bukan pengganti.

### Socket.IO Events

**Namespace:** `/game`

```
Client → Server:
  game:join         { roomCode }                              → join room
  game:leave        { roomCode }                              → leave room
  game:submit       { roomCode, snippetId, answer }           → submit jawaban
  game:ready        { roomCode }                              → signal "udah lihat skor, siap next round"

Server → Client:
  game:player-joined   { username, playerCount }              → broadcast
  game:player-left     { username, playerCount }              → broadcast
  game:started         { totalRounds, roundDuration }         → broadcast
  game:round-start     { round, snippet: {id,title,context,code}, timeLimit }  → soal & timer
  game:round-end       { round }                              → round selesai
  game:score           { username, score, maxScore, feedback, bugsFound, bugsPartial, bugsMissed }  → skor per player
  game:all-submitted   { round }                              → semua submit, trigger leaderboard
  game:leaderboard     [{ username, totalScore }, ...]        → real-time leaderboard
  game:over            { winner, finalLeaderboard }           → game selesai
```

### Per-Round Sequence Diagram

```
Server                              Client A           Client B
  │                                    │                  │
  ├─ game:round-start ──────────────→  │                  │
  ├─ game:round-start ────────────────│────────────────→  │
  │                                    │                  │
  │                game:submit ←───────│                  │
  │  (AI scoring via DeepSeek API)     │                  │
  ├─ game:score ────────────────────→  │  (skor A aja)    │
  │                game:ready ←────────│                  │
  │                                                       │
  │                                    │   game:submit ←──│
  │  (AI scoring via DeepSeek API)     │                  │
  ├─ game:score ──────────────────────│────────────────→  │  (skor B aja)
  │                                    │   game:ready ←───│
  │                                                       │
  ├─ game:all-submitted ───────────→  │  (semua selesai)  │
  ├─ game:all-submitted ──────────────│────────────────→  │
  ├─ game:leaderboard ─────────────→  │  (update bareng)  │
  ├─ game:leaderboard ────────────────│────────────────→  │
  ├─ game:round-end ───────────────→  │                  │
  ├─ game:round-end ──────────────────│────────────────→  │
  │                                                       │
  (next round or game:over)
```

### Strategic Notes

**Kenapa Socket.IO bukan REST untuk game flow?**
- REST stateless, game flow stateful → WebSocket natural fit
- Scoring harus real-time broadcast, REST polling terlalu lambat & wasteful
- 🏫 Mandatory: "Wajib implementasi Real Time Communication"

**Kenapa bug descriptions nggak dikirim ke client?**
- Hanya `context` + `code` yang dikirim ke client
- Bug descriptions (kunci jawaban) disimpan server → dikirim ke AI bersama jawaban user
- Mencegah peserta inspect network tab buat lihat jawaban

**Kenapa `game:score` per-player, bukan broadcast?**
- Tiap player submit di waktu berbeda → scoring async
- Broadcast skor individual begitu scoring selesai → player lihat skornya sendiri dulu
- Pas semua submit (`game:all-submitted`), baru broadcast `game:leaderboard` barengan → reveal semua skor

---

## Mock API Strategy

**Tujuan:** Frontend bisa mulai development sekarang, paralel dengan backend, tanpa bergantung pada server yang belum jadi.

### Tools Comparison

| Tool | Approach | Kelebihan | Kekurangan | Verdict |
|------|----------|-----------|------------|---------|
| **MSW (Mock Service Worker)** | Intercept di network level (Service Worker) | • Mock REST + WebSocket • Realistic: request beneran jalan, cuma di-intercept • Works di browser & Node (testing) • DX modern, TypeScript support • Nggak perlu separate process | • Setup handler per endpoint • Learning curve kecil (perlu paham `rest.get()`, `ws.link()`) | ⭐ **Rekomendasi** |
| **json-server** | File JSON → REST API otomatis | • Cepet banget (<5 menit setup) • Zero code • Auto CRUD | • REST-only, nggak bisa mock WebSocket • No auth simulation • Static data, nggak bisa simulate state changes | ❌ Gak bisa mock socket |
| **Custom Express mock server** | Server Express sederhana dengan hardcoded response | • Kontrol penuh • Bisa mock Socket.IO juga • Real TCP connection | • Harus coding (routes + socket handlers) • Perlu running separate process • Lebih lambat setup dibanding MSW | ✅ Alternatif bagus |
| **Stoplight Prism** | OpenAPI spec → mock server | • Validasi request/response against spec • Bagus buat tim besar | • Setup OpenAPI spec dulu (overhead) • No WebSocket support • Overkill buat 1.5 hari | ❌ Overkill |
| **Postman Mock Server** | GUI-based, cloud-hosted mock | • Gampang share ke tim • Bisa simulate delay | • REST-only • Free tier terbatas • Ketergantungan ke Postman cloud | ❌ REST-only |

### Decision: MSW + fallback Custom Express

**Kenapa MSW:**
1. Mock WebSocket — ini dealbreaker. Tools lain REST-only.
2. Frontend bisa develop tanpa backend process sama sekali — `npm run dev` langsung bisa interaksi dengan mock
3. Handler yang sama bisa dipakai buat testing (Vitest/Jest) — nggak perlu bikin mock lagi
4. Realistic: fetch request beneran jalan, cuma di-intercept di network layer. Begitu backend udah jadi, tinggal matiin MSW.

**Fallback: Custom Express mock server** kalo MSW ada kendala (misal Service Worker conflict). Express mock bisa serve REST + Socket.IO dari satu process.

### Mock Implementation Plan

1. Setup MSW di project client
2. Define handlers untuk semua REST endpoint (auth, rooms, snippets)
3. Define Socket.IO mock events menggunakan `ws.link()`
4. Seed data: 3 user dummy, 5-10 premade snippets
5. Frontend develop pakai mock → backend develop sesuai API contract yang sama

---

## AI Integration Spec

**Provider:** DeepSeek V4 Pro (via DeepSeek API Platform)

**Strategic Decision — Provider:**

| Opsi | Kelebihan | Kekurangan | Verdict |
|------|-----------|------------|---------|
| DeepSeek V4 Pro (direct) ✅ | $0.0028/1M tokens, latensi rendah, output JSON konsisten | Rate limit ketat, single provider risk | Primary |
| OpenRouter (fallback) | Akses banyak model, auto-retry | $0.014/1M (5x lebih mahal), latency fluktuatif | Fallback only |

**Prompt Structure (per jawaban):**
```
System: You are a strict but fair code reviewer scoring debugging answers.
        Return ONLY valid JSON, no markdown, no explanation outside the JSON.

Context: [problem statement]
Code: [buggy snippet]
Expected bugs (with points): [{id, description, points}, ...]
User answer: [participant's answer]

Evaluate the user's answer against the expected bugs. For each bug:
- AWARD if user correctly identified and explained it
- PARTIAL if user mentioned it but explanation is incomplete
- MISS if user didn't mention it at all

Output valid JSON only:
{
  "score": number,
  "maxScore": number,
  "feedback": "brief encouraging feedback in 1-2 sentences",
  "bugsFound": ["bug_id_1", "bug_id_2"],
  "bugsPartial": ["bug_id_3"],
  "bugsMissed": ["bug_id_4"]
}
```

**Error Handling:**

| Skenario | Response ke User | Backend Action |
|----------|-----------------|----------------|
| AI timeout (>5s) | "Scoring in progress..." spinner | Retry 2x, fallback ke OpenRouter |
| AI returns invalid JSON | Tampilkan error + retry | Parse dengan regex fallback, log raw response |
| AI unavailable (semua provider down) | "Scoring temporarily unavailable" | Tampilkan jawaban mentah, host bisa override manual |
| Jawaban kosong | Auto score 0 | Skip AI call, return langsung |

### LLM Evaluation Strategy

**Pertanyaan: Apakah kita perlu eval hasil analisis LLM?**

**Jawaban: Ya, wajib.** AI scoring adalah core feature. Kalau scoring-nya ngawur, seluruh value proposition aplikasi runtuh.

**Kenapa perlu eval:**

| Alasan | Elaborasi |
|--------|-----------|
| Scoring fairness | Dua jawaban yang sama-sama benar harus dapat skor mirip. Tanpa eval, kita nggak tahu apakah AI konsisten. |
| Prompt reliability | Prompt yang kita tulis mungkin punya blind spot (misal: selalu kasih skor tinggi, atau selalu harsh). Eval mendeteksi ini. |
| Edge case handling | Gimana AI handle jawaban absurd? Jawaban kosong? Jawaban dalam bahasa Indonesia campur Inggris? Harus di-test. |
| Demo credibility | Saat presentasi, kita harus bisa jawab: "Seberapa akurat AI scoring-nya?" → jawab dengan data eval, bukan feeling. |

**Evaluation Approach (Lightweight — cocok buat 1.5 hari):**

```
Phase 1: Manual Validation (30 menit)
  - Siapkan 3-5 soal dengan kunci jawaban (bug descriptions)
  - Untuk tiap soal, siapkan 3 tipe jawaban:
    a. Jawaban sempurna (sebutin semua bug dengan baik)
    b. Jawaban sebagian (sebutin 1-2 bug, kurang detail)
    c. Jawaban ngawor ("kayaknya sih udah bener semua")
  - Jalankan scoring lewat API, bandingkan hasil dengan ekspektasi
  - Catat: akurasi, konsistensi, blind spot

Phase 2: Prompt Iteration (15 menit)
  - Adjust prompt berdasarkan temuan Phase 1
  - Re-test dengan jawaban yang sama, lihat perbaikan
  - Finalize prompt v1

Phase 3: Production Monitoring (ongoing)
  - Log semua scoring result ke database
  - Host bisa flag "unfair score" → review manual
```

**Tool: promptfoo**

| Aspek | Kenapa promptfoo |
|-------|-----------------|
| Setup | CLI-based, `npx promptfoo init` → 5 menit |
| Test cases | Define dalam YAML: input + expected output |
| Assertions | Bisa assert format JSON, score range, field presence |
| Output | Tabel hasil, mana yang pass/fail |
| Tradeoff | Butuh bikin test cases dulu. Worth it karena bisa dipakai lagi pas final project Phase 3. |

---

## Technical Considerations

**Architecture:**
```
Browser (React SPA)
    │
    ├── REST (fetch) ────── Express Server ───── SQLite
    │                            │
    └── WebSocket ─── Socket.IO ─┤
                                 │
                            DeepSeek API
```

### Client (Vite + React.js)

| Decision | Opsi | Tradeoff | Pilihan |
|----------|------|----------|---------|
| State management | React Context vs Redux/Zustand | Context: cukup untuk 3-4 state global (auth, room, game). Redux: overkill untuk app kecil, boilerplate banyak. | React Context ✅ (🏫 mandatory) |
| Routing | React Router v6 vs TanStack Router | React Router: familiar, doc lengkap. TanStack: lebih modern tapi learning curve. | React Router ✅ |
| Styling | Tailwind vs CSS Modules vs Styled Components | Tailwind: cepet, no context switch antar file. CSS Modules: familiar buat semua. Styled Components: runtime overhead. | Tailwind (bisa mix dengan CSS) |
| HTTP client | fetch vs axios | fetch: built-in, no deps. axios: interceptor enak buat auth header, tapi tambahan dependency. | axios |

**Component Tree:**
```
App
├── LoginPage
├── RegisterPage
├── LobbyPage
│   ├── CreateRoom
│   ├── JoinRoom
│   └── PlayerList
├── GamePage
│   ├── SnippetViewer (context + code)
│   ├── AnswerForm (textarea + submit)
│   ├── ScoreNotification (toast/overlay)
│   └── Timer
├── LeaderboardPage
└── GameOverPage
```

### Server (Express + Socket.IO)

| Decision | Opsi | Tradeoff | Pilihan |
|----------|------|----------|---------|
| Bahasa | Node.js vs Go/Python | Node.js: stack seragam dengan frontend (JS everywhere), Socket.IO native. Go/Python: mungkin lebih performan, tapi tim skill JS. | Node.js ✅ |
| Database | PostgreSQL vs SQLite vs JSON file | PG: production-grade, tapi perlu setup. SQLite: zero setup, cukup buat 3 user. JSON file: paling simpel, tapi no query. | PostgreSQL ✅|
| Auth | JWT vs Session | JWT: stateless, enak buat scale. Session: perlu session store. | JWT ✅ |
| Password hashing | bcrypt vs crypto.pbkdf2 | bcrypt: industry standard, built-in salt. | bcrypt ✅ |

**Socket.IO Events:**
- `game:join`, `game:leave`, `game:submit` (client → server)
- `game:player-joined`, `game:player-left`, `game:started`, `game:round-start`, `game:round-end`, `game:score`, `game:leaderboard`, `game:over` (server → client)

### Database Schema

```sql
-- User: minimal — username + password hash
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Room: status = waiting | playing | finished
CREATE TABLE rooms (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  host_id INTEGER NOT NULL REFERENCES users(id),
  code TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'waiting',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Snippet: premade questions. bug_descriptions as JSON array
CREATE TABLE snippets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  context TEXT NOT NULL,
  code TEXT NOT NULL,
  bug_descriptions TEXT NOT NULL,  -- JSON: [{id, description, points}]
  max_score INTEGER NOT NULL
);

-- Score: per player per round. Tracks answer + AI feedback
CREATE TABLE scores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  room_id INTEGER NOT NULL REFERENCES rooms(id),
  user_id INTEGER NOT NULL REFERENCES users(id),
  snippet_id INTEGER NOT NULL REFERENCES snippets(id),
  round INTEGER NOT NULL,
  score INTEGER NOT NULL,
  answer TEXT NOT NULL,
  feedback TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## Team Roles & Responsibilities

**Dual Leadership:**
- **Althaff (Ketua)** — team coordination, decision finalizer kalo deadlock, git management, semua merge lewat dia
- **Adri (PM)** — product direction, scope, compliance, unblocker teknis

Kerja keroyokan, semua megang semua — tapi tiap pos ada penanggung jawab (PJ) yang memastikan nggak ada yang kelewat.

| Role | PJ | Responsibilities | Shared With |
|------|-----|-----------------|-------------|
| **Backend** | Althaff | Express server, REST API, JWT auth, SQLite schema, API contract compliance | Adri, Resky |
| **Socket Server** | Althaff | Socket.IO server setup, event handlers, room state management, timer orchestration | Resky |
| **Git Management** | Althaff | GitHub Organization setup, branch protection, PR review gate, commit quality check (🏫 4 commit/hari). Ketua yang merge semua PR. | All |
| **Frontend** | Resky | Vite + React SPA, React Router, React Context, UI components, Tailwind styling | Althaff, Adri |
| **Socket Client** | Resky | Socket.IO client integration, real-time state sync (leaderboard, scores, timer), MSW mock handlers | Althaff |
| **AI Implementation** | Adri | DeepSeek API integration, prompt engineering, scoring pipeline, error handling, fallback logic | Althaff |
| **Client-Server Integration** | Adri | Wiring frontend ke backend (migrasi MSW mock → real server), pastikan API contract compliance end-to-end, Socket.IO event flow verification | Resky, Althaff |
| **Deployment & Infrastructure** | Adri | Client deploy (Cloudflare Pages), server deploy (Railway/Render), Tailscale networking, environment variables, demo readiness | Resky |
| **QA & Testing** | Adri | LLM eval (promptfoo), API testing, socket testing, end-to-end flow validation, bug tracking | All |
| **Assignment Compliance** | Adri | Memastikan semua 🏫 requirement terpenuhi: SPA, Router, Context, GitHub Workflow, Deploy, Real-Time | All |

**Working Model:**
- Semua orang ngoding di semua area, tapi PJ bertanggung jawab memastikan areanya nggak broken.
- PR di-review oleh PJ area yang disentuh, **Ketua (Althaff) yang merge** ke main.
- Adri sebagai PM/compliance gatekeeper: sebelum demo, checklist semua 🏫 mandatory requirement.

---

## Testing & QA Strategy

**PJ: Adri — semua ikut testing.**

### Testing Layers

| Layer | Apa yang di-test | Tool | Who | Kapan |
|-------|-----------------|------|-----|-------|
| **LLM Eval** | AI scoring accuracy, consistency, edge cases | promptfoo | Adri | Hari 1 malam — Hari 2 pagi |
| **API Testing** | REST endpoint: register, login, create room, join room | Thunder Client / REST Client (VS Code) | Althaff + Adri | Setelah endpoint jadi |
| **Socket Testing** | Socket.IO events: join, submit, score broadcast, leaderboard | Socket.IO DevTools / manual client | Resky + Althaff | Setelah socket server ready |
| **Integration** | Full flow: register → create room → join → start → submit → score → leaderboard → game over | Manual (browser) | All 3 | Hari 2 pagi |
| **UI/UX** | Component rendering, responsive, error states, loading states | Manual (browser) | Resky | Hari 2 siang |
| **Pre-Demo Smoke Test** | End-to-end demo scenario, zero critical bugs | Checklist | Adri | Kamis 07:00 |

### LLM Eval Test Cases (Minimum)

Bikin minimal 3 soal × 3 tipe jawaban = 9 test cases:

| # | Tipe Jawaban | Ekspektasi |
|---|-------------|-----------|
| 1 | Sempurna (semua bug dijelaskan) | Score ~100% max_score, semua bugsFound |
| 2 | Sebagian (1-2 bug, kurang detail) | Score ~50-70%, campuran bugsFound + bugsPartial |
| 3 | Ngawor ("udah bener semua kok") | Score <20% atau 0, feedback menyebutkan jawaban tidak relevan |
| 4 | Kosong / whitespace only | Score 0, tereksekusi tanpa error |
| 5 | Bahasa Indonesia campur Inggris | Tetep di-score dengan benar, nggak bias bahasa |
| 6 | Jawaban benar tapi nyebutin bug yang nggak ada (false positive) | Bug yang nggak ada di expected tidak dihitung sebagai found |

### Pre-Demo Checklist (Compliance Gatekeeper — Adri)

- [ ] 🏫 SPA pakai Vite + React
- [ ] 🏫 React Router implemented (minimal 3 routes)
- [ ] 🏫 React Context untuk state management
- [ ] 🏫 Real-Time Communication via Socket.IO berjalan
- [ ] 🏫 GitHub Organization dibuat, semua instructor di-invite
- [ ] 🏫 Minimal 4 commit per orang di hari development
- [ ] 🏫 Client deployed & bisa diakses publik
- [ ] 🏫 Server deployed (jika ada) / API documentation
- [ ] 🔧 AI scoring berfungsi (ada skor + feedback)
- [ ] 🔧 Leaderboard real-time update
- [ ] 🔧 No console errors saat demo
- [ ] 🔧 Fallback path available (AI down → graceful degradation)

### Bug Severity Classification

| Severity | Definition | Demo Impact |
|----------|-----------|-------------|
| **P0 — Blocker** | App crash, tidak bisa login, scoring gagal total, socket disconnect permanen | Demo gagal |
| **P1 — Critical** | Fitur utama broken tapi ada workaround (misal leaderboard nggak update tanpa refresh) | Perlu dijelaskan saat demo |
| **P2 — Minor** | UI glitch, typo, styling inconsistent | Acceptable, mention as "known issue" |
| **P3 — Cosmetic** | Warna, spacing, font | Nggak perlu disebutkan |

---

## Success Metrics

| Metric | Target | Notes |
|--------|--------|-------|
| AI scoring accuracy | >80% sesuai ekspektasi vs ground truth | Diukur via eval Phase 1 |
| Scoring consistency | Score variance <10% untuk jawaban ekuivalen | Dua jawaban mirip → skor mirip |
| Socket latency (submit → score broadcast) | <3 detik | Termasuk AI API call time |
| Concurrent users | 100+ per room | Socket.IO lightweight, bottleneck di AI rate limit |
| Zero critical bugs at presentation | ✓ | Fallback path untuk tiap failure mode |

---

## Open Issues

| # | Issue | Status | Mitigation |
|---|-------|--------|------------|
| 1 | **AI scoring consistency** | In progress | Eval Phase 1-2 dengan promptfoo, iterasi prompt |
| 2 | **Soal konten** | Blocker | Butuh minimal 5-10 premade snippets. Tim harus bikin sekarang. Assign ke 1 orang. |
| 3 | **AI rate limit** | Risk | DeepSeek API rate limit? Queue scoring request, jangan paralel semua sekaligus. |
| 4 | **Timer sync** | Resolved | Server-authoritative timer via socket events. |
| 5 | **Deploy target** | Open | Client wajib deploy. Server opsional. Opsi: Cloudflare Pages (client), Railway/Render (server). |

---

## Q&A

| Asked by | Question | Answer |
|-----------|----------|--------|
| Tim | Gimana kalo ada yang nyontek jawaban peserta lain? | Soal random order per peserta → jawaban beda urutan. Window waktu kecil karena real-time scoring. |
| Sony (feedback) | User bingung ini kodingan apa? | Setiap soal punya `context` field — problem statement sebelum kode muncul. |
| Tim | Kenapa nggak pake open-source LLM lokal aja? | Setup inference server >3 jam. DeepSeek API instant & reliable. Cost per session ~$0.01. |
| Tim | Apa host bisa ganti soal di tengah game? | MVP: nggak. Soal di-random dari pool snippets. Future: host bisa pilih difficulty. |

---

## Feature Timeline & Phasing

| Phase | Feature | Target |
|-------|---------|--------|
| Hari 1 (22 Jul) | Setup project, API contract finalization, Register/Login, Room system (create + join), Socket.IO setup, MSW mock setup | Rabu malam |
| Hari 2 pagi (23 Jul) | Game flow: start → soal → submit → AI scoring → leaderboard, LLM eval | Kamis 06:00 |
| Hari 2 (23 Jul) | Final polish, deploy client, presentasi rehearsal | Kamis 08:00 |
| 🎯 **Demo** | Presentasi ke instructor | **Kamis 13:00** |

### Epic Breakdown

#### Epic 1: Foundation (Hari 1 — Rabu, target: selesai sebelum tidur)

| ID | Task | PJ | Dependency | Acceptance |
|----|------|-----|-----------|------------|
| E1.1 | Init project monorepo: client (Vite+React) + server (Express+Socket.IO) | Althaff | — | `npm run dev` jalan di client & server |
| E1.2 | Setup MSW di client, define REST handlers (auth, rooms, snippets) | Resky | E1.1 | Semua endpoint mock return data sesuai API contract |
| E1.3 | Setup MSW Socket.IO mock handlers | Resky | E1.1 | Socket events (join, leave, submit) bisa di-trigger dari browser |
| E1.4 | Setup SQLite schema + migration (users, rooms, snippets, scores) | Althaff | E1.1 | Tabel terbuat, bisa insert/select manual |
| E1.5 | REST POST `/auth/register` + `/auth/login` + JWT middleware | Althaff | E1.4 | Register → return JWT, login → return JWT, `/auth/me` verify |
| E1.6 | REST POST `/rooms` (create) + `/:code/join` + `GET /:code` | Althaff | E1.5 | Room code auto-generate, join return player list |
| E1.7 | Client: LoginPage + RegisterPage components + AuthContext | Resky | E1.2, E1.5 | User bisa register & login via UI |
| E1.8 | Client: LobbyPage — CreateRoom + JoinRoom + PlayerList | Resky | E1.6, E1.7 | User bisa buat room (dapat code) & join room |

#### Epic 2: Game Core (Hari 1 malam → Hari 2 pagi)

| ID | Task | PJ | Dependency | Acceptance |
|----|------|-----|-----------|------------|
| E2.1 | Socket.IO server: room join/leave/start events + room state management | Althaff | E1.6 | Multiple client bisa connect & join room yang sama |
| E2.2 | Socket.IO server: round lifecycle — start, submit, end timer | Althaff | E2.1 | Server-authoritative timer, broadcast `round:start` & `round:end` |
| E2.3 | Client: SocketContext + socket client integration | Resky | E2.1, E1.3 | Socket connect, join room, receive events |
| E2.4 | Client: GamePage — SnippetViewer + AnswerForm + Timer | Resky | E2.3 | Soal muncul, textarea submit, timer countdown |
| E2.5 | AI scoring pipeline: DeepSeek API call + prompt + JSON parse | Adri | E2.2 | Submit jawaban → AI return JSON valid → score tersimpan |
| E2.6 | Server: `game:score` broadcast + leaderboard calculation | Althaff | E2.5 | Skor muncul di semua client dalam <3 detik |
| E2.7 | Client: ScoreNotification (toast) + LeaderboardPage | Resky | E2.6 | Leaderboard live update |
| E2.8 | Client: GameOverPage — winner announcement | Resky | E2.6 | Pemenang + final leaderboard ditampilkan |

#### Epic 3: Content & Polish (Hari 2 pagi — deadline deploy)

| ID | Task | PJ | Dependency | Acceptance |
|----|------|-----|-----------|------------|
| E3.1 | Bikin 5-10 premade code snippets + bug descriptions (JSON) | Adri | — | Snippets bisa di-insert ke DB, tiap soal ada context + code + bugs |
| E3.2 | Seed database dengan snippets | Adri | E3.1, E1.4 | `GET /snippets/random` return soal |
| E3.3 | LLM eval: 6 test cases pakai promptfoo | Adri | E2.5, E3.1 | Semua test case pass, accuracy >80% |
| E3.4 | Pre-demo checklist compliance check | Adri | All | 12 item checklist tercentang |
| E3.5 | Deploy client ke Cloudflare Pages | Adri | E2.8 | URL publik bisa diakses |
| E3.6 | UI polish: loading states, error states, empty states | Resky | E2.7 | Tiap state ada feedback visual, nggak stuck loading forever |
| E3.7 | GitHub: invite instructor, finalize README, branch cleanup | Althaff | — | Instructor bisa lihat repo + commit history |

#### Dependency Graph
```
E1.1 ──┬── E1.2 ── E1.7 ──┬── E1.8
       │                    │
       ├── E1.3 ────────────┤
       │                    │
       └── E1.4 ── E1.5 ── E1.6 ──┬── E2.1 ──┬── E2.2 ──┬── E2.5 ── E2.6 ──┬── E2.7 ── E2.8 ── E3.6
                                   │          │          │                   │
                                   │          └── E2.3 ── E2.4 ──────────────┤
                                   │                     │                   │
                                   │                     └── E2.6 ────────────┤
                                   │                                          │
                                   └── E3.1 ── E3.2 ─────────────────────────┘

E3.3, E3.5, E3.7, E3.4 — parallel, independent
```

### Parallel Workstream Strategy

| Waktu | Althaff (Ketua) | Resky | Adri (PM) |
|-------|-----------------|-------|-----------|
| **Rabu siang** | E1.1, E1.4, E1.5, E1.6 (server + DB + auth) | E1.2, E1.3, E1.7, E1.8 (mock + auth UI + lobby) | E3.1 (bikin soal), E3.5 (setup Cloudflare) |
| **Rabu malam** | E2.1, E2.2 (socket server) | E2.3, E2.4 (socket client + game UI) | E2.5 (AI pipeline) |
| **Kamis pagi** | E2.6, E3.7 (leaderboard + GitHub) | E2.7, E2.8, E3.6 (leaderboard UI + polish) | E3.3, E3.4 (eval + compliance) |
| **Kamis 07:00** | Smoke test + rehearsal | Smoke test + rehearsal | 🎯 Compliance gatekeeper final check |
| **Kamis 09:00** | **DEMO** | **DEMO** | **DEMO** |

---

## SDLC — Super Agile (3 orang, 1 hari)

### Dual Leadership Model

| Aspek | Althaff (Ketua) | Adri (PM) |
|-------|-----------------|-----------|
| Fokus | Orang & proses | Produk & kualitas |
| Tanggung jawab | Koordinasi tim, git management, decision finalizer kalo deadlock | Product direction, scope, compliance, unblocker teknis |
| Merge control | Semua PR ke main lewat dia | — |
| Checkpoint | "Semua udah selesai? Ada yang blocked?" | "Fitur udah sesuai spec? 🏫 compliance terpenuhi?" |

Keduanya complementary — nggak ada yang "di atas". Ketua handle tim & eksekusi, PM handle produk & kualitas.

### Prinsip

| Prinsip | Kenapa |
|---------|--------|
| **No ceremony** | 3 orang — chat grup cukup. Ketua & PM cek sesekali. |
| **API contract as source of truth** | Frontend & backend paralel. MSW mock = kontrak enforceable. |
| **Parallel by default** | Dependency chain udah di-map di epic breakdown. Jangan ada yang idle. |
| **Ship early, iterate** | Deploy jam 3 pagi juga gapapa — yang penting ada sesuatu yang jalan sebelum demo. |
| **PR as checkpoint** | Bukan formal code review, tapi sinyal "ini udah bisa di-test bareng." Ketua yang merge. |
| **🏫 compliance non-negotiable** | GitHub workflow + SPA + Router + Context + Socket.IO + Deploy harus ada. PM gatekeeper. |

### Fase SDLC

```
[Align] ──→ [Build: Parallel Sprints] ──→ [Integrate] ──→ [Harden] ──→ [Demo]
 30min          Phase 1      Phase 2        bridge        polish     09:00
              (4-5 jam)    (3-4 jam)      (1-2 jam)     (1-2 jam)
```

#### Phase 0: Align (30 menit)

| Siapa | Ngapain |
|-------|---------|
| **Althaff (Ketua)** | Setup GitHub Org, invite semua, buat repo, setup branch protection |
| **Adri (PM)** | Walkthrough PRD + API contract ke tim, pastikan semua paham task pertama |
| **Resky** | Clone repo, init Vite project |

Output: repo siap, semua orang tahu task pertama, nggak ada pertanyaan menggantung.

#### Phase 1: Foundation Sprint (4-5 jam — Rabu siang ~ sore)

| Siapa | Deliverable |
|-------|------------|
| **Althaff (Ketua)** | Monorepo → SQLite schema → REST auth → REST rooms. Server bisa register/login + create/join room. Merge semua PR. |
| **Resky** | Init Vite → MSW REST mock → Login/Register UI → Lobby UI. Client bisa form login + lobby. |
| **Adri (PM)** | Unblock Althaff/Resky, mulai bikin snippets, setup Cloudflare Pages project, siapkan promptfoo. |

**Ketua check-in:** "Resky udah bisa login dari UI? Althaff server udah bisa return JWT? Kalo udah kita test bareng." → 5 menit.

#### Phase 2: Game Core Sprint (3-4 jam — Rabu malam)

| Siapa | Deliverable |
|-------|------------|
| **Althaff (Ketua)** | Socket.IO server (join/leave/start/round lifecycle) → leaderboard calculation. Merge semua socket PR. |
| **Resky** | Socket client → GamePage (snippet viewer + answer form + timer). |
| **Adri (PM)** | AI pipeline + prompt → test dummy answer → iterasi prompt sampai JSON valid. |

**Ketua check-in:** "Coba full flow — register → create room → join → start → submit → skor muncul?" → 5 menit.

#### Phase 3: Integrate (1-2 jam — Kamis dini hari)

- Frontend switch MSW → real server
- Socket.IO client ↔ server live
- AI scoring plug ke socket: `game:submit` → AI → `game:score` broadcast
- Leaderboard tested
- **Ketua**: pastikan nggak ada branch nyangkut, semua merge
- **PM**: end-to-end test, catat bug P0/P1, priority-kan fix

#### Phase 4: Harden (1-2 jam — Kamis pagi)

- Bug fixing P0 dulu, P1 kalo sempet
- LLM eval formal (promptfoo)
- UI polish: loading, error, empty states
- Deploy client ke Cloudflare Pages
- **PM**: compliance checklist (12 item 🏫)
- 07:00 — smoke test + rehearsal

### PM Toolkit (Adri)

| Kapan | Apa | Tool |
|-------|-----|------|
| Sebelum mulai | Pastikan tim paham PRD + API contract | markserv |
| Selama dev | Cek dependency — siapa blocked siapa? | Epic dependency graph |
| Setelah tiap phase | Quick integration test | Manual browser |
| Sebelum deploy | Compliance checklist | 12-item list |
| Setelah deploy | Smoke test | Script: register → room → play → win |

### Risk Mitigation

| Risk | Chance | Mitigation |
|------|--------|------------|
| AI scoring inconsistent | High | Eval after Phase 2. Fallback: binary score (found/not found) instead of nuanced. |
| Socket.IO unstable | Medium | Fallback: polling 2 detik untuk leaderboard (nggak real-time, tapi jalan). |
| Nggak sempat deploy server | Medium | 🏫 Server deploy opsional. Client wajib deploy ke Cloudflare Pages. Server bisa jalan dari laptop via Tailscale. |
| Belum ada snippets pas Phase 2 | Medium | Hardcode 3 snippet di server, skip DB seed dulu. |

### Working Agreement

- **"Blokir? Bilang ke Ketua/PM."** — Jangan stuck >15 menit sendirian.
- **"Ketua yang merge."** — Semua PR ke main lewat Althaff. Dia yang jaga kualitas & branch integrity.
- **"Malam ini selesai, besok pagi polish."** — Core fitur jalan sebelum jam 6 pagi. Jangan optimis "nanti pagi bisa."
- **"Compliance dulu, kerenan nanti."** — 🏫 mandatory > nice-to-have. Fitur AI canggih tapi GitHub workflow nggak jalan → FAIL.
- **"PAGI bukan MALAM."** — Target: semua fitur core jalan sebelum jam 6 pagi.

---

## Git Branching & Conflict Strategy

### Branching Model: Trunk-Based Light

```
main
  ├── feat/auth-backend       (Althaff)
  ├── feat/auth-frontend      (Resky)
  ├── feat/room-backend       (Althaff)
  ├── feat/socket-server      (Althaff)
  ├── feat/socket-client      (Resky)
  ├── feat/ai-scoring         (Adri)
  ├── feat/snippets           (Adri)
  └── feat/deploy-polish      (Adri/Resky)
```

**Kenapa bukan Git Flow?** `develop` branch nggak nambah value buat tim 3 orang 1 hari — cuma nambah 1 layer merge. Trunk-based dengan short-lived feature branches lebih cocok.

**Aturan:**
- Satu branch = satu epic task. Hidup maksimal 4 jam — merge begitu selesai.
- Commit kecil & sering: `<100 lines`, message deskriptif, minimal 4 commit/hari/orang (🏫).
- PR ke `main`, Ketua (Althaff) review & merge. **Merge commit (regular)** — preserve history tiap commit dari branch, terlihat kontribusi per orang.

**Branch Naming:** `feat/<scope>`, `fix/<desc>`, `chore/<task>`

**Commit Convention:** `<type>: <imperative description>` — `feat: add JWT middleware`, `fix: empty answer NaN score`

### PR Flow

```
Developer: git checkout -b feat/xxx → coding + commit sering
Developer: git pull --rebase origin main   ← resolve conflict di lokal
Developer: git push origin feat/xxx → buka PR, tag Ketua
Ketua:     review → merge commit ke main
Developer: git checkout main && git pull
```

### Merge Strategy Tradeoff (Diskusi Tim)

| Aspek | Squash Merge | Merge Commit (Regular) ✅ |
|--------|-------------|--------------------------|
| **History main** | 1 commit per PR — bersih, linier | N commit per PR — bercabang, verbose |
| **Commit authorship** | 1 author (yang merge). Commit individual dari branch hilang. | Semua author dari branch tetap terlihat di history main |
| **🏫 4 commit/hari bukti** | Instructor harus lihat branch yang udah di-delete. Susah nge-track kontribusi. | Instructor lihat `git log main` langsung keliatan semua commit per orang |
| **Debugging** | `git bisect` cuma bisa ke level PR, nggak bisa ke commit individual | `git bisect` bisa pinpoint commit mana yang introduce bug |
| **Revert** | Revert 1 PR = revert semua changes dalam PR itu | Bisa revert commit spesifik tanpa nge-revert yang lain |
| **Conflict resolution** | Lebih sedikit konflik karena cuma 1 commit | Lebih banyak merge commit di history, tapi tiap commit terisolasi |
| **Cocok buat** | Tim besar, PR besar, history bersih prioritas | Tim kecil, butuh traceability, bootcamp/Hacktiv8 compliance |

**Rekomendasi: Merge commit regular.** Di konteks Hacktiv8:
- 🏫 Instructor harus bisa lihat bukti commit per orang — merge commit preserve authorship
- 3 orang 1 hari = branch kecil & sering merge — nggak bakal terlalu rame
- History verbose justru bagus buat portofolio & penilaian
- Kalo ternyata history terlalu rame nanti, bisa switch ke squash merge di hari terakhir

**Keputusan final di tangan Ketua (Althaff) setelah diskusi tim.**

### Modular Structure (Conflict Prevention)

File ownership & modular layout untuk minimalkan konflik paralel:

```
server/
├── index.js              ← setup Express + Socket.IO, jarang disentuh
├── routes/
│   ├── auth.js           ← Althaff
│   └── rooms.js          ← Althaff
├── socket/
│   ├── handlers.js       ← Althaff
│   └── events.js         ← Althaff
├── services/
│   └── ai.js             ← Adri
├── db/
│   └── schema.js         ← Althaff
└── middleware/
    └── auth.js           ← Althaff
```

### Conflict Risk Map

| File | Disentuh oleh | Risiko | Mitigation |
|------|--------------|--------|------------|
| `server/index.js` | Althaff, Adri | High | Modular — `index.js` cuma wiring, logic di modules |
| `client/src/App.jsx` | Resky, Adri | High | Route registration only, components di file terpisah |
| `package.json` | Semua | Medium | Koordinasi di grup sebelum nambah dep |

### Resolution Protocol

**Rule #1: Jangan panic-merge. Panggil Ketua.**

```
git pull --rebase origin main
# Konflik ditandai <<<<<<< / >>>>>>>
# Buka file, pilih changes yang benar (atau accept both)
git add <file>
git rebase --continue
# Test ulang
git push --force-with-lease   ← aman, cuma update branch sendiri
```

**Default resolver by domain:** `server/*` → Althaff, `client/*` → Resky, `ai/*` → Adri, `package.json` → Althaff (Ketua finalize).

### Disaster Recovery

| Scenario | Recovery |
|----------|----------|
| Force push ke main | `git reflog` → cari commit sebelum force → `git reset --hard <sha>` |
| Commit di branch salah | `git checkout -b feat/xxx` → `git checkout main` → `git reset --hard origin/main` |
| Conflict spiral (resolve→conflict→resolve...) | Stop. Re-create branch dari main terbaru, cherry-pick commit penting |
| Lupa pull sebelum commit | `git pull --rebase origin main` — mending sekarang daripada nanti |

### GitHub Org Setup (🏫 Althaff)

```
github.com/martunis-bugbrawl
├── bugbrawl (monorepo)
├── Branch protection: main → require PR + 1 approval
├── Merge strategy: regular merge commit (lihat tradeoff table)
├── Invite: semua instructor Phase 2
```

---

*PRD ini adalah living document — update sesuai feedback instructor dan stakeholder.*
