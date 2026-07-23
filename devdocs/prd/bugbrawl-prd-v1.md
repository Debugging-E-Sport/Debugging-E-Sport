# Bug Brawl — Product Requirements Document (PRD)

**Author:** Adrianto Puji Irawan
**Team:** Martunis  
**Team Members:** M. Althaf Kiram, Resky Saputra, Adrianto Puji Irawan  
**Status:** Draft v1  
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
- Deadline: Kamis, 23 Juli 2026 jam 13:00 (presentasi)
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

**Catatan:** Tidak ada perbedaan antara Host dan Participant selama kompetisi berlangsung. Semua orang — termasuk host — menerima soal, submit jawaban, dan masuk leaderboard.

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
| Voice/Video Call | Scope terlalu besar untuk 4 minggu. Fokus ke core realtime + AI dulu. |
| Custom Code Snippets (user-uploaded) | Meningkatkan kompleksitas AI scoring secara signifikan. Gunakan premade snippets dulu. |
| OAuth/Social Login | Simple username+password sudah cukup untuk MVP. |
| Mobile App | SPA desktop-only sesuai brief. |

### Game Mechanics

**Room Lifecycle:**
```
[Host Create Room] → [Players Join] → [Host Start] → [Round 1..N] → [Game Over]
```
Host ikut bermain — host menerima soal, submit jawaban, dan masuk leaderboard seperti peserta lain.

**Per-Round Flow:**
```
[Soal dikirim via Socket] → [Timer mulai] → [Peserta submit jawaban]
    → [AI scoring] → [Skor di-broadcast] → [Leaderboard update] → [Next round]
```

**Scoring Model:**
- Setiap soal memiliki `max_score` dan daftar `bug_descriptions` (kunci jawaban)
- AI membandingkan jawaban peserta dengan bug descriptions
- Skor dihitung berdasarkan: coverage bug yang ditemukan + kualitas analisis
- Jawaban yang tidak relevan/asal-asalan dapat skor 0

### AI Integration Spec

**Prompt Structure (per jawaban):**
```
System: You are a strict but fair code reviewer scoring debugging answers.
Context: [problem statement]
Code: [buggy snippet]
Expected bugs: [list of bug descriptions with assigned points]
User answer: [participant's answer]

Output: JSON { score: number, max_score: number, feedback: string, bugs_found: string[] }
```

**Error Handling:**
- AI timeout/unavailable → tampilkan "Scoring in progress..." dan retry
- AI returns invalid JSON → fallback parsing atau minta human review (host override)

### Technical Considerations

**Client (Vite + React.js):**
- SPA dengan React Router
- State management: React Context (sesuai brief)
- Socket.IO client untuk real-time events
- Component tree: `App → { Login, Register, Lobby, GameRoom, Leaderboard, GameOver }`

**Server (Express + Socket.IO):**
- REST API: `/api/auth/*`, `/api/rooms/*`, `/api/scores/*`
- Socket.IO events:
  - `room:join`, `room:leave`, `room:start`
  - `round:start`, `round:submit`, `round:score`
  - `leaderboard:update`, `game:over`
- AI service module: panggil OpenAI/DeepSeek API untuk scoring

**AI Provider:**
- Primary: DeepSeek API (via Bifrost — hemat, $0.0028/1M tokens)
- Fallback: OpenRouter

**Database:**
- Tabel User: `id, username, password_hash, created_at`
- Tabel Room: `id, host_id, code, status, created_at`
- Tabel Snippet: `id, title, context, code, bug_descriptions (JSON), max_score`
- Tabel Score: `id, room_id, user_id, snippet_id, score, answer, feedback, created_at`

### Success Metrics

| Metric | Target |
|--------|--------|
| AI scoring accuracy (subjective) | >80% sesuai ekspektasi vs human review |
| Socket latency (submit → score broadcast) | <3 detik |
| Concurrent users supported | 100+ users per room (Socket.IO lightweight) |
| Zero critical bugs at presentation | ✓ |

### Open Issues

1. **AI scoring consistency** — perlu testing dengan berbagai variasi jawaban (benar, sebagian benar, ngawur) untuk validasi prompt
2. **Soal konten** — siapa yang bikin premade code snippets + bug descriptions? Butuh minimal 10-15 soal
3. **User capacity** — Socket.IO lightweight, harusnya bisa ratusan concurrent. Yang jadi bottleneck adalah AI scoring (rate limit API). Solusi: queue scoring request.
4. **Timer sync** — bagaimana memastikan timer semua peserta sinkron? Server-authoritative timer?

### Q&A

| Asked by | Question | Answer |
|-----------|----------|--------|
| Tim | Gimana kalo ada yang nyontek jawaban peserta lain? | Karena scoring real-time setelah submit dan soal random, window buat nyontek kecil. Tapi bisa di-mitigasi dengan randomize urutan soal per peserta. |
| Sony (feedback) | User bingung ini kodingan apa, gimana solusinya? | Setiap soal sekarang punya `context` field yang menjelaskan problem statement sebelum kode ditampilkan. |

### Feature Timeline & Phasing

| Phase | Feature | Target |
|-------|---------|--------|
| Hari 1 (22 Jul) | Setup project, Register/Login, Room system (create + join), Socket.IO setup | Rabu malam |
| Hari 2 pagi (23 Jul) | Game flow: start → soal → submit → AI scoring → leaderboard | Kamis pagi |
| Hari 2 siang (23 Jul) | Final polish, deploy, presentasi rehearsal | Kamis 11:00 |
| 🎯 **Demo** | Presentasi ke instructor | **Kamis 13:00** |

---

*PRD ini adalah living document — update sesuai feedback instructor dan stakeholder.*
