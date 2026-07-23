# 🎮 Bug Brawl — Live Demo Script

> **Duration:** ~10 minutes  
> **Setup:** 3 browser windows (or 3 devices) — Host, Player 2, Player 3  
> **URL:** https://bugbrawl.sparda.id

---

## Pre-Demo Setup

- [ ] Open 3 browser windows (incognito recommended) at https://bugbrawl.sparda.id
- [ ] Arrange windows side-by-side for visibility
- [ ] Ensure backend is running at https://bbapi.sparda.id

---

## Step 1: Register 3 Accounts

### Host (Window 1)

1. Navigate to https://bugbrawl.sparda.id
2. Click **Register** tab
3. Fill in:
   - Username: `ByteHunter`
   - Password: `Password123`
4. Click **Register**
5. ✅ Green banner: *"Account created!"* → Auto-switches to Login tab

### Player 2 (Window 2)

1. Click **Register** tab
2. Username: `CodeNinja` / Password: `Password123`
3. Register

### Player 3 (Window 3)

1. Click **Register** tab
2. Username: `BugSlayer` / Password: `Password123`
3. Register

> **🗣️ Narration:** _"Bug Brawl uses JWT authentication. Each player creates their own account to track scores and game history."_

---

## Step 2: Host Creates a Room

### Host (Window 1 — ByteHunter)

1. Log in as `ByteHunter` / `Password123`
2. After login, you're redirected to **/lobby**
3. Click **"Create Room"**
4. Room is created → A **Room Code** appears (e.g., `ABC123`)
5. Note the room code

> **🗣️ Narration:** _"The host creates a game room and gets a unique room code to share with other players — just like Jackbox or Kahoot."_

---

## Step 3: Participants Join the Room

### Player 2 (Window 2 — CodeNinja)

1. Log in as `CodeNinja` / `Password123`
2. On the lobby page, enter room code `ABC123`
3. Click **"Join Room"**
4. ✅ Player appears in the room lobby

### Player 3 (Window 3 — BugSlayer)

1. Log in as `BugSlayer` / `Password123`
2. Enter room code `ABC123` → **"Join Room"**
3. ✅ Player appears in the room lobby

### Host (Window 1)

- ✅ See both `CodeNinja` and `BugSlayer` in the room

> **🗣️ Narration:** _"Players join the room using the shared code. Socket.IO powers real-time updates — new participants appear instantly."_

---

## Step 4: Start the Game

### Host (Window 1)

1. All 3 players are in the room
2. Click **"Start Game"**
3. ⏱️ Countdown timer appears (3... 2... 1...)

### All Windows

- 🔄 Game view loads with:
  - **Code Snippet** panel (left) — buggy code displayed with syntax highlighting
  - **Answer** panel (right) — text editor to write the debug explanation
  - **Timer** (top) — round countdown
  - **Live Leaderboard** (sidebar) — real-time scores

> **🗣️ Narration:** _"When the game starts, all players see the same buggy code snippet simultaneously. They must identify and explain the bug before the timer runs out."_

---

## Step 5: Submit Answers → See AI Scoring

### All Windows

1. Read the code snippet in the left panel
2. Type the bug explanation in the right panel
3. Click **"Submit"** before the timer ends

### Host (Window 1 — submit first)

1. Type: _"The bug is a closure trap — the loop variable `i` is captured by reference, so all callbacks log the final value (5) instead of 0,1,2,3,4."_
2. Click **Submit**
3. ✅ Answer submitted → **DeepSeek AI evaluates** the answer
4. 📊 Score appears: e.g., **85 points** (AI evaluates correctness + completeness)

### Player 2 & 3 (Windows 2 & 3)

- Submit their own answers
- ⏱️ Timer counts down — if time runs out, auto-submit whatever is typed
- 📊 Scores appear after submission

> **🗣️ Narration:** _"Each answer is sent to DeepSeek AI for real-time evaluation. The AI compares the player's explanation against the known bug solution and awards points based on accuracy. No manual judging needed."_

---

## Step 6: Leaderboard → Game Over

### Round Progression

- 🔄 Multiple rounds (up to 5 rounds or configurable)
- After each round, the **Live Leaderboard** updates with cumulative scores
- Players see their ranking in real time

### Final Round

- After the last round finishes:
  - ⏱️ Timer reaches 0
  - 🎉 **Game Over** screen appears
  - Final leaderboard shows all players ranked by total score

> **🗣️ Narration:** _"After each round, the leaderboard updates live via WebSocket. When all rounds complete, the game ends and we see the final rankings."_

---

## Step 7: Winner Announcement

### All Windows

- 🏆 **Winner announcement** with confetti/animation
- Top 3 players highlighted:
  - 🥇 **1st Place** — highest score
  - 🥈 **2nd Place**
  - 🥉 **3rd Place**
- Each player sees their own rank and final score

### Host

- Option to **"Play Again"** or **"Back to Lobby"**

> **🗣️ Narration:** _"And that's Bug Brawl! A fully real-time, AI-powered debugging competition where developers compete to find and explain bugs. The entire experience — from room creation to winner announcement — is powered by WebSockets and AI scoring."_

---

## 🎯 What This Demo Shows

| Feature | Technology |
|---------|------------|
| Multiplayer real-time sync | Socket.IO WebSockets |
| JWT Authentication | bcryptjs + jsonwebtoken |
| AI-powered scoring | DeepSeek API |
| Code syntax highlighting | Prism.js |
| Responsive UI | React 19 + Tailwind CSS 4 |
| REST API documentation | Swagger / OpenAPI 3.0 |
| Database persistence | PostgreSQL + Sequelize ORM |

---

## 🐛 Troubleshooting

| Issue | Fix |
|-------|-----|
| Can't connect to backend | Check `VITE_API_URL` env, ensure backend is running |
| Room code not working | Regenerate room — codes are single-use |
| AI scoring fails | Verify `DEEPSEEK_API_KEY` is set in server `.env` |
| Socket disconnects | Refresh page, check network tab for WebSocket errors |
| Players not appearing in room | Ensure all players use the same backend instance |
