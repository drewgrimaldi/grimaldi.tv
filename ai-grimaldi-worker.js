const HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>AI GRIMALDI — Sports Prediction Engine</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --black:    #0D0D0D;
    --near-black: #111111;
    --panel:    #181818;
    --border:   #2A2A2A;
    --steel:    #888888;
    --white:    #F5F5F5;
    --gold:     #D4A017;
    --gold-dim: #8B6A10;
    --red:      #8B1A1A;
    --green:    #1A6B3A;
    --pending:  #4A4A20;
  }

  html, body {
    height: 100%;
    background: var(--black);
    color: var(--white);
    font-family: 'Inter', sans-serif;
    overflow: hidden;
  }

  /* ── SCOREBOARD STRIP ── */
  .scoreboard {
    height: 60px;
    background: var(--near-black);
    border-bottom: 1px solid var(--gold);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    flex-shrink: 0;
    position: relative;
    z-index: 10;
    gap: 20px;
  }

  .scoreboard-logo {
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
  }

  .logo-mark {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 22px;
    letter-spacing: 0.12em;
    color: var(--gold);
    line-height: 1;
  }

  .logo-mark span {
    color: var(--white);
    opacity: 0.4;
    font-size: 10px;
    letter-spacing: 0.05em;
    display: block;
    margin-top: -1px;
  }

  .divider-v {
    width: 1px;
    height: 30px;
    background: var(--border);
    flex-shrink: 0;
  }

  /* ── VERSUS SCOREBOARD ── */
  .versus-block {
    display: flex;
    align-items: center;
    gap: 0;
    flex: 1;
    justify-content: center;
    background: var(--panel);
    border: 1px solid var(--border);
    border-radius: 6px;
    overflow: hidden;
    max-width: 620px;
  }

  .competitor {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 8px 20px;
    flex: 1;
  }

  .competitor.claude {
    border-right: none;
    justify-content: flex-end;
  }

  .competitor.chatgpt {
    border-left: none;
    justify-content: flex-start;
  }

  .comp-name {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 16px;
    letter-spacing: 0.15em;
    line-height: 1;
  }

  .comp-name.claude-name  { color: var(--gold); }
  .comp-name.chatgpt-name { color: #10A37F; }

  .comp-stats {
    display: flex;
    gap: 12px;
    align-items: center;
  }

  .comp-stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1px;
  }

  .comp-stat-val {
    font-family: 'JetBrains Mono', monospace;
    font-size: 18px;
    font-weight: 600;
    line-height: 1;
  }

  .comp-stat-val.green  { color: #3DBE71; }
  .comp-stat-val.red    { color: #E05555; }
  .comp-stat-val.gold   { color: var(--gold); }
  .comp-stat-val.teal   { color: #10A37F; }
  .comp-stat-val.steel  { color: var(--steel); }

  .comp-stat-lbl {
    font-family: 'JetBrains Mono', monospace;
    font-size: 8px;
    letter-spacing: 0.18em;
    color: var(--steel);
    text-transform: uppercase;
  }

  .vs-center {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0 14px;
    border-left: 1px solid var(--border);
    border-right: 1px solid var(--border);
    gap: 2px;
    min-width: 56px;
  }

  .vs-label {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 18px;
    letter-spacing: 0.2em;
    color: var(--steel);
    line-height: 1;
  }

  .vs-pending {
    font-family: 'JetBrains Mono', monospace;
    font-size: 8px;
    letter-spacing: 0.12em;
    color: var(--gold);
    opacity: 0.7;
    white-space: nowrap;
  }

  /* ── RIGHT TAGS ── */
  .scoreboard-right {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
  }

  .tag-live {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.15em;
    color: #3DBE71;
    border: 1px solid #3DBE71;
    padding: 2px 8px;
    border-radius: 2px;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .tag-live::before {
    content: '';
    display: block;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #3DBE71;
    animation: pulse 1.8s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.2; }
  }

  .tag-sport {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.1em;
    color: var(--steel);
    background: var(--border);
    padding: 2px 8px;
    border-radius: 2px;
  }

  .record-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 9px;
    color: var(--steel);
    letter-spacing: 0.15em;
    text-transform: uppercase;
  }

  .record-value {
    font-family: 'JetBrains Mono', monospace;
    font-size: 15px;
    font-weight: 600;
    letter-spacing: 0.05em;
  }

  .record-value.green { color: #3DBE71; }
  .record-value.red   { color: #E05555; }
  .record-value.gold  { color: var(--gold); }
  .record-value.steel { color: var(--steel); }

  /* ── MAIN LAYOUT ── */
  .layout {
    display: flex;
    height: calc(100vh - 52px);
  }

  /* ── SIDEBAR ── */
  .sidebar {
    width: 280px;
    min-width: 280px;
    background: var(--near-black);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .sidebar-header {
    padding: 16px 20px 12px;
    border-bottom: 1px solid var(--border);
    flex-shrink: 0;
  }

  .sidebar-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 13px;
    letter-spacing: 0.2em;
    color: var(--steel);
  }

  .sidebar-scroll {
    overflow-y: auto;
    flex: 1;
    padding: 12px 0;
  }

  .sidebar-scroll::-webkit-scrollbar { width: 4px; }
  .sidebar-scroll::-webkit-scrollbar-track { background: transparent; }
  .sidebar-scroll::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

  .pick-card {
    padding: 12px 20px;
    border-bottom: 1px solid var(--border);
    cursor: pointer;
    transition: background 0.15s;
  }

  .pick-card:hover { background: var(--panel); }

  .pick-card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 5px;
  }

  .pick-matchup {
    font-size: 12px;
    font-weight: 500;
    color: var(--white);
    line-height: 1.3;
    flex: 1;
    padding-right: 8px;
  }

  .pick-badge {
    font-family: 'JetBrains Mono', monospace;
    font-size: 9px;
    letter-spacing: 0.1em;
    padding: 2px 5px;
    border-radius: 2px;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .badge-hit      { background: rgba(61,190,113,0.15); color: #3DBE71; border: 1px solid rgba(61,190,113,0.3); }
  .badge-miss     { background: rgba(224,85,85,0.15);  color: #E05555; border: 1px solid rgba(224,85,85,0.3); }
  .badge-pending  { background: rgba(212,160,23,0.1);  color: var(--gold); border: 1px solid rgba(212,160,23,0.2); }

  .pick-winner {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    color: var(--steel);
  }

  .pick-winner strong { color: var(--gold); }

  .pick-date {
    font-size: 10px;
    color: #555;
    margin-top: 3px;
  }

  /* ── CHAT AREA ── */
  .chat-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: var(--black);
  }

  .chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 32px 40px;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .chat-messages::-webkit-scrollbar { width: 4px; }
  .chat-messages::-webkit-scrollbar-track { background: transparent; }
  .chat-messages::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

  /* Hero state when no messages */
  .hero-state {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 32px;
    text-align: center;
    padding: 40px;
  }

  .hero-wordmark {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }

  .hero-ai {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 100px;
    line-height: 0.85;
    letter-spacing: -0.02em;
    color: var(--gold);
    position: relative;
  }

  .hero-grimaldi {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 40px;
    letter-spacing: 0.35em;
    color: var(--white);
    opacity: 0.85;
  }

  .hero-sub {
    font-size: 13px;
    color: var(--steel);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    font-family: 'JetBrains Mono', monospace;
  }

  .hero-divider {
    width: 1px;
    height: 48px;
    background: linear-gradient(to bottom, transparent, var(--gold), transparent);
  }

  .suggestion-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    max-width: 560px;
    width: 100%;
  }

  .suggestion-chip {
    background: var(--panel);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 12px 16px;
    text-align: left;
    cursor: pointer;
    transition: border-color 0.15s, background 0.15s;
  }

  .suggestion-chip:hover {
    border-color: var(--gold);
    background: rgba(212,160,23,0.04);
  }

  .chip-label {
    font-size: 11px;
    font-family: 'JetBrains Mono', monospace;
    color: var(--gold);
    letter-spacing: 0.1em;
    margin-bottom: 4px;
  }

  .chip-text {
    font-size: 13px;
    color: var(--white);
    line-height: 1.35;
  }

  /* Messages */
  .msg {
    display: flex;
    flex-direction: column;
    gap: 6px;
    max-width: 760px;
  }

  .msg.user { align-items: flex-end; align-self: flex-end; }
  .msg.ai   { align-items: flex-start; align-self: flex-start; }

  .msg-role {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.15em;
    color: var(--steel);
    text-transform: uppercase;
  }

  .msg.ai .msg-role { color: var(--gold); }

  .msg-bubble {
    padding: 14px 18px;
    border-radius: 8px;
    font-size: 14px;
    line-height: 1.65;
  }

  .msg.user .msg-bubble {
    background: var(--panel);
    border: 1px solid var(--border);
    color: var(--white);
    border-top-right-radius: 2px;
  }

  .msg.ai .msg-bubble {
    background: rgba(212,160,23,0.06);
    border: 1px solid rgba(212,160,23,0.18);
    color: var(--white);
    border-top-left-radius: 2px;
  }

  .msg-bubble strong { color: var(--gold); font-weight: 600; }
  .msg-bubble em { color: #3DBE71; font-style: normal; font-family: 'JetBrains Mono', monospace; font-size: 12px; }

  /* Prediction card inside AI message */
  .pred-card {
    margin-top: 12px;
    background: var(--near-black);
    border: 1px solid var(--gold);
    border-radius: 6px;
    overflow: hidden;
  }

  .pred-card-header {
    background: rgba(212,160,23,0.1);
    padding: 8px 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .pred-card-title {
    font-family: 'Bebas Neue', sans-serif;
    letter-spacing: 0.15em;
    font-size: 14px;
    color: var(--gold);
  }

  .pred-card-conf {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    color: var(--steel);
  }

  .pred-card-body {
    padding: 12px 14px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 12px;
  }

  .pred-stat { display: flex; flex-direction: column; gap: 2px; }

  .pred-stat-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 9px;
    letter-spacing: 0.15em;
    color: var(--steel);
    text-transform: uppercase;
  }

  .pred-stat-value {
    font-family: 'JetBrains Mono', monospace;
    font-size: 14px;
    font-weight: 600;
    color: var(--white);
  }

  .pred-stat-value.gold { color: var(--gold); }

  /* Thinking indicator */
  .thinking {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 0;
  }

  .thinking-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--gold);
    animation: blink 1.2s infinite;
  }

  .thinking-dot:nth-child(2) { animation-delay: 0.2s; }
  .thinking-dot:nth-child(3) { animation-delay: 0.4s; }

  @keyframes blink {
    0%, 80%, 100% { opacity: 0.2; transform: scale(0.85); }
    40%            { opacity: 1;   transform: scale(1); }
  }

  .thinking-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    color: var(--steel);
    letter-spacing: 0.1em;
  }

  /* ── INPUT BAR ── */
  .input-bar {
    padding: 20px 40px 24px;
    border-top: 1px solid var(--border);
    background: var(--near-black);
    flex-shrink: 0;
  }

  .input-wrap {
    display: flex;
    align-items: flex-end;
    gap: 10px;
    background: var(--panel);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 12px 16px;
    transition: border-color 0.15s;
    max-width: 900px;
    margin: 0 auto;
  }

  .input-wrap:focus-within {
    border-color: var(--gold);
  }

  #user-input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    color: var(--white);
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    line-height: 1.5;
    resize: none;
    max-height: 120px;
    overflow-y: auto;
    placeholder-color: var(--steel);
  }

  #user-input::placeholder { color: #444; }

  .send-btn {
    background: var(--gold);
    border: none;
    border-radius: 5px;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    flex-shrink: 0;
    transition: background 0.15s, opacity 0.15s;
  }

  .send-btn:hover   { background: #C49010; }
  .send-btn:active  { background: #A87A0D; }
  .send-btn:disabled { opacity: 0.3; cursor: not-allowed; }

  .send-btn svg { fill: var(--black); }

  .input-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 8px;
    max-width: 900px;
    margin-left: auto;
    margin-right: auto;
  }

  .input-hint {
    font-size: 11px;
    font-family: 'JetBrains Mono', monospace;
    color: #444;
    letter-spacing: 0.08em;
  }

  .input-sport-pills {
    display: flex;
    gap: 6px;
  }

  .sport-pill {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.1em;
    color: var(--steel);
    background: var(--border);
    padding: 3px 8px;
    border-radius: 3px;
    cursor: pointer;
    border: 1px solid transparent;
    transition: all 0.12s;
  }

  .sport-pill:hover, .sport-pill.active {
    color: var(--gold);
    border-color: var(--gold-dim);
    background: rgba(212,160,23,0.08);
  }

  /* Responsive */
  @media (max-width: 768px) {
    .sidebar { display: none; }
    .chat-messages { padding: 20px 16px; }
    .input-bar { padding: 12px 16px 16px; }
    .hero-ai { font-size: 64px; }
    .hero-grimaldi { font-size: 26px; }
    .suggestion-grid { grid-template-columns: 1fr; }
  }

  @media (prefers-reduced-motion: reduce) {
    .thinking-dot, .tag-live::before { animation: none; }
  }
</style>
</head>
<body>

<!-- SCOREBOARD -->
<div class="scoreboard">

  <!-- LOGO -->
  <div class="scoreboard-logo">
    <div class="logo-mark">
      AI GRIMALDI
      <span>MOTOR CITY PREDICTION ENGINE</span>
    </div>
  </div>

  <div class="divider-v"></div>

  <!-- VERSUS BLOCK -->
  <div class="versus-block">

    <!-- CLAUDE -->
    <div class="competitor claude">
      <div class="comp-stats">
        <div class="comp-stat">
          <span class="comp-stat-val green" id="claude-wins">5</span>
          <span class="comp-stat-lbl">W</span>
        </div>
        <div class="comp-stat">
          <span class="comp-stat-val red" id="claude-losses">2</span>
          <span class="comp-stat-lbl">L</span>
        </div>
        <div class="comp-stat">
          <span class="comp-stat-val gold" id="claude-pct">71%</span>
          <span class="comp-stat-lbl">PCT</span>
        </div>
      </div>
      <div class="comp-name claude-name">CLAUDE</div>
    </div>

    <!-- VS CENTER -->
    <div class="vs-center">
      <span class="vs-label">VS</span>
      <span class="vs-pending" id="stat-pending">16 PENDING</span>
    </div>

    <!-- CHATGPT -->
    <div class="competitor chatgpt">
      <div class="comp-name chatgpt-name">CHATGPT</div>
      <div class="comp-stats">
        <div class="comp-stat">
          <span class="comp-stat-val green" id="gpt-wins">—</span>
          <span class="comp-stat-lbl">W</span>
        </div>
        <div class="comp-stat">
          <span class="comp-stat-val red" id="gpt-losses">—</span>
          <span class="comp-stat-lbl">L</span>
        </div>
        <div class="comp-stat">
          <span class="comp-stat-val teal" id="gpt-pct">—</span>
          <span class="comp-stat-lbl">PCT</span>
        </div>
      </div>
    </div>

  </div>

  <!-- RIGHT TAGS -->
  <div class="scoreboard-right">
    <span class="tag-live">LIVE</span>
    <span class="tag-sport" id="active-sport">UFC</span>
    <span class="tag-sport">NBA</span>
    <span class="tag-sport">NFL</span>
  </div>

</div>

<!-- LAYOUT -->
<div class="layout">

  <!-- SIDEBAR -->
  <aside class="sidebar">
    <div class="sidebar-header">
      <div class="sidebar-title">Recent Picks</div>
    </div>
    <div class="sidebar-scroll" id="picks-list">
      <!-- Populated by JS -->
    </div>
  </aside>

  <!-- CHAT -->
  <main class="chat-area">
    <div class="chat-messages" id="chat-messages">

      <!-- HERO STATE -->
      <div class="hero-state" id="hero-state">
        <div class="hero-wordmark">
          <div class="hero-ai">AI</div>
          <div class="hero-grimaldi">GRIMALDI</div>
        </div>
        <div class="hero-sub">Sports Prediction Engine &nbsp;·&nbsp; Detroit</div>
        <div class="hero-divider"></div>
        <div class="suggestion-grid">
          <button class="suggestion-chip" onclick="sendSuggestion(this)">
            <div class="chip-label">UFC</div>
            <div class="chip-text">Predict the Fiziev vs Torres main event</div>
          </button>
          <button class="suggestion-chip" onclick="sendSuggestion(this)">
            <div class="chip-label">RECORD</div>
            <div class="chip-text">What's Claude's current prediction record?</div>
          </button>
          <button class="suggestion-chip" onclick="sendSuggestion(this)">
            <div class="chip-label">BREAKDOWN</div>
            <div class="chip-text">Break down Aliskerov vs Ferreira round by round</div>
          </button>
          <button class="suggestion-chip" onclick="sendSuggestion(this)">
            <div class="chip-label">COMPARE</div>
            <div class="chip-text">How does Claude's accuracy compare to ChatGPT?</div>
          </button>
        </div>
      </div>

    </div>

    <!-- INPUT BAR -->
    <div class="input-bar">
      <div class="input-wrap">
        <textarea
          id="user-input"
          rows="1"
          placeholder="Ask for a prediction, breakdown, or record..."
          onkeydown="handleKey(event)"
          oninput="autoResize(this)"
        ></textarea>
        <button class="send-btn" id="send-btn" onclick="sendMessage()" title="Send">
          <svg width="16" height="16" viewBox="0 0 16 16">
            <path d="M2 14L14 8 2 2v4.5l8 1.5-8 1.5z"/>
          </svg>
        </button>
      </div>
      <div class="input-meta">
        <span class="input-hint">Shift+Enter for new line · Powered by Claude Sonnet</span>
        <div class="input-sport-pills">
          <span class="sport-pill active">UFC</span>
          <span class="sport-pill">NBA</span>
          <span class="sport-pill">NFL</span>
          <span class="sport-pill">MLB</span>
          <span class="sport-pill">FIFA</span>
        </div>
      </div>
    </div>
  </main>
</div>

<script>
// ── AIRTABLE DATA ──────────────────────────────────────────────
const AIRTABLE_BASE = 'appo1ndgsQfOwuIy6';
const AIRTABLE_TABLE = 'tblb5wECCbyL7q8SY';

// Hardcoded picks from Airtable (populated from known data)
const PICKS = [
  // UFC Baku — June 27 (pending)
  { matchup: 'Fiziev vs Torres', pick: 'Manuel Torres', result: '⏳', date: '2026-06-27', league: 'UFC', predictor: 'Claude', confidence: 68 },
  { matchup: 'Shara Magomedov vs Pereira', pick: 'Shara Magomedov', result: '⏳', date: '2026-06-27', league: 'UFC', predictor: 'Claude', confidence: 69 },
  { matchup: 'Aliskerov vs Ferreira', pick: 'Ikram Aliskerov', result: '⏳', date: '2026-06-27', league: 'UFC', predictor: 'Claude', confidence: 55 },
  { matchup: 'Almabayev vs Johnson', pick: 'Asu Almabayev', result: '⏳', date: '2026-06-27', league: 'UFC', predictor: 'Claude', confidence: 71 },
  { matchup: 'Sadykhov vs Camilo', pick: 'Nazim Sadykhov', result: '⏳', date: '2026-06-27', league: 'UFC', predictor: 'Claude', confidence: 62 },
  // UFC 317 — June 14 (completed)
  { matchup: 'Pereira vs Gane — Interim HW', pick: 'Gane', result: '✅', date: '2026-06-14', league: 'UFC', predictor: 'Claude', confidence: 73 },
  { matchup: 'Ruffy vs Chandler', pick: 'Ruffy', result: '✅', date: '2026-06-14', league: 'UFC', predictor: 'Claude', confidence: 66 },
  { matchup: 'Nickal vs Daukaus', pick: 'Nickal', result: '✅', date: '2026-06-14', league: 'UFC', predictor: 'Claude', confidence: 82 },
  { matchup: "O'Malley vs Zahabi", pick: "O'Malley", result: '✅', date: '2026-06-14', league: 'UFC', predictor: 'Claude', confidence: 79 },
  { matchup: 'Hokit vs Lewis', pick: 'Hokit', result: '✅', date: '2026-06-14', league: 'UFC', predictor: 'Claude', confidence: 61 },
  { matchup: 'Topuria vs Gaethje — LW Title', pick: 'Topuria', result: '❌', date: '2026-06-14', league: 'UFC', predictor: 'Claude', confidence: 58 },
  { matchup: 'Garcia vs Lopes', pick: 'Garcia', result: '❌', date: '2026-06-14', league: 'UFC', predictor: 'Claude', confidence: 52 },
  // ChatGPT — UFC Baku June 27 (pending)
  { matchup: 'Fiziev vs Torres', pick: 'Rafael Fiziev', result: '⏳', date: '2026-06-27', league: 'UFC', predictor: 'ChatGPT', confidence: 60 },
  { matchup: 'Shara Magomedov vs Pereira', pick: 'Shara Magomedov', result: '⏳', date: '2026-06-27', league: 'UFC', predictor: 'ChatGPT', confidence: 65 },
  { matchup: 'Aliskerov vs Ferreira', pick: 'Ikram Aliskerov', result: '⏳', date: '2026-06-27', league: 'UFC', predictor: 'ChatGPT', confidence: 55 },
  { matchup: 'Almabayev vs Johnson', pick: 'Asu Almabayev', result: '⏳', date: '2026-06-27', league: 'UFC', predictor: 'ChatGPT', confidence: 62 },
  { matchup: 'Sadykhov vs Camilo', pick: 'Nazim Sadykhov', result: '⏳', date: '2026-06-27', league: 'UFC', predictor: 'ChatGPT', confidence: 58 },
  { matchup: 'Farman Hasanov vs Eric Nolan', pick: 'Eric Nolan', result: '⏳', date: '2026-06-27', league: 'UFC', predictor: 'ChatGPT', confidence: 52 },
  { matchup: 'Rizvan Kuniev vs Tyrell Fortune', pick: 'Rizvan Kuniev', result: '⏳', date: '2026-06-27', league: 'UFC', predictor: 'ChatGPT', confidence: 56 },
  { matchup: 'Abdul-Rakhman Yakhyaev vs Julius Walker', pick: 'Abdul-Rakhman Yakhyaev', result: '⏳', date: '2026-06-27', league: 'UFC', predictor: 'ChatGPT', confidence: 70 },
  { matchup: 'Bekzat Almakhan vs Jean Matsumoto', pick: 'Bekzat Almakhan', result: '⏳', date: '2026-06-27', league: 'UFC', predictor: 'ChatGPT', confidence: 51 },
  { matchup: 'Tahir Abdullayev vs Jefferson Nascimento', pick: 'Tahir Abdullayev', result: '⏳', date: '2026-06-27', league: 'UFC', predictor: 'ChatGPT', confidence: 54 },
  { matchup: 'Nursulton Ruziboev vs Andrey Pulyaev', pick: 'Nursulton Ruziboev', result: '⏳', date: '2026-06-27', league: 'UFC', predictor: 'ChatGPT', confidence: 68 },
  { matchup: 'Daniil Donchenko vs Theodor Berggren', pick: 'Daniil Donchenko', result: '⏳', date: '2026-06-27', league: 'UFC', predictor: 'ChatGPT', confidence: 63 },
];

function buildSidebar() {
  const list = document.getElementById('picks-list');
  list.innerHTML = '';
  PICKS.filter(p => p.predictor === 'Claude').forEach(p => {
    const badgeClass = p.result === '✅' ? 'badge-hit' : p.result === '❌' ? 'badge-miss' : 'badge-pending';
    const badgeText  = p.result === '✅' ? 'HIT' : p.result === '❌' ? 'MISS' : 'PENDING';
    list.innerHTML += \`
      <div class="pick-card" onclick="askAboutPick('\${p.matchup}')">
        <div class="pick-card-header">
          <div class="pick-matchup">\${p.matchup}</div>
          <span class="pick-badge \${badgeClass}">\${badgeText}</span>
        </div>
        <div class="pick-winner">Pick: <strong>\${p.pick}</strong> · \${p.confidence}%</div>
        <div class="pick-date">\${p.date} · \${p.league}</div>
      </div>\`;
  });
}

function updateScoreboard() {
  const claude = PICKS.filter(p => p.predictor === 'Claude');
  const cW = claude.filter(p => p.result === '✅').length;
  const cL = claude.filter(p => p.result === '❌').length;
  const cPending = claude.filter(p => p.result === '⏳').length;
  const cTotal = cW + cL;
  const cPct = cTotal > 0 ? Math.round((cW / cTotal) * 100) + '%' : '--';

  document.getElementById('claude-wins').textContent   = cW;
  document.getElementById('claude-losses').textContent = cL;
  document.getElementById('claude-pct').textContent    = cPct;

  const gpt = PICKS.filter(p => p.predictor === 'ChatGPT');
  const gW = gpt.filter(p => p.result === '✅').length;
  const gL = gpt.filter(p => p.result === '❌').length;
  const gTotal = gW + gL;
  const gPct = gTotal > 0 ? Math.round((gW / gTotal) * 100) + '%' : '—';

  document.getElementById('gpt-wins').textContent   = gW > 0 ? gW : '—';
  document.getElementById('gpt-losses').textContent = gL > 0 ? gL : '—';
  document.getElementById('gpt-pct').textContent    = gPct;

  const allPending = PICKS.filter(p => p.result === '⏳').length;
  document.getElementById('stat-pending').textContent = allPending + ' PENDING';
}

// ── CONVERSATION ───────────────────────────────────────────────
let messages = [];
let isThinking = false;

const SYSTEM_PROMPT = \`You are the AI Grimaldi Sports Prediction Engine — a sharp, confident sports analyst built for The Drew Grimaldi Podcast out of Detroit. Your personality is direct, data-driven, and Motor City gritty. You don't hedge unnecessarily. When you make a prediction, you commit to it.

You have access to this prediction history from Airtable:
\${JSON.stringify(PICKS, null, 2)}

Your capabilities:
- Give fight/game predictions with confidence percentages based on ESPN player profiles and Monte Carlo simulation logic
- Break down matchups round-by-round or quarter-by-quarter
- Reference your prediction record accurately (Claude: 5W-2L on UFC 317, 16 pending from UFC Baku June 27)
- Compare Claude vs ChatGPT accuracy when asked
- Explain the reasoning behind each pick (striking stats, grappling, cardio, pace)

When giving a prediction, always include:
- The pick and confidence %
- The most likely method of victory
- The biggest upset risk
- A brief reasoning summary

Format predictions clearly. Use stats when you have them. Be confident but accurate. Never mention gambling odds — analysis only. You represent the Grimaldi brand: bold, smart, Detroit tough.\`;

async function callClaude(userMsg) {
  messages.push({ role: 'user', content: userMsg });

  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1000,
      system: SYSTEM_PROMPT,
      messages: messages
    })
  });

  const data = await response.json();
  const reply = data.content?.find(b => b.type === 'text')?.text || 'Error getting response.';
  messages.push({ role: 'assistant', content: reply });
  return reply;
}

function appendMessage(role, content) {
  const hero = document.getElementById('hero-state');
  if (hero) hero.remove();

  const container = document.getElementById('chat-messages');
  const label = role === 'user' ? 'YOU' : 'AI GRIMALDI';
  const div = document.createElement('div');
  div.className = \`msg \${role}\`;
  div.innerHTML = \`
    <div class="msg-role">\${label}</div>
    <div class="msg-bubble">\${formatContent(content)}</div>\`;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
  return div;
}

function formatContent(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\`([^\`]+)\`/g, '<em>$1</em>')
    .replace(/\n/g, '<br>');
}

function showThinking() {
  const container = document.getElementById('chat-messages');
  const div = document.createElement('div');
  div.id = 'thinking-indicator';
  div.className = 'msg ai';
  div.innerHTML = \`
    <div class="msg-role">AI GRIMALDI</div>
    <div class="thinking">
      <div class="thinking-dot"></div>
      <div class="thinking-dot"></div>
      <div class="thinking-dot"></div>
      <span class="thinking-label">Running simulation...</span>
    </div>\`;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

function removeThinking() {
  const el = document.getElementById('thinking-indicator');
  if (el) el.remove();
}

async function sendMessage() {
  if (isThinking) return;
  const input = document.getElementById('user-input');
  const text = input.value.trim();
  if (!text) return;

  input.value = '';
  input.style.height = 'auto';
  isThinking = true;
  document.getElementById('send-btn').disabled = true;

  appendMessage('user', text);
  showThinking();

  try {
    const reply = await callClaude(text);
    removeThinking();
    appendMessage('ai', reply);
  } catch (err) {
    removeThinking();
    appendMessage('ai', 'Connection error. Check your API configuration.');
  }

  isThinking = false;
  document.getElementById('send-btn').disabled = false;
  input.focus();
}

function sendSuggestion(btn) {
  const text = btn.querySelector('.chip-text').textContent;
  document.getElementById('user-input').value = text;
  sendMessage();
}

function askAboutPick(matchup) {
  document.getElementById('user-input').value = \`Break down the \${matchup} pick\`;
  sendMessage();
}

function handleKey(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
}

function autoResize(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 120) + 'px';
}

// Sport pills
document.querySelectorAll('.sport-pill').forEach(pill => {
  pill.addEventListener('click', () => {
    document.querySelectorAll('.sport-pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    document.getElementById('active-sport').textContent = pill.textContent;
  });
});

// Init
buildSidebar();
updateScoreboard();
</script>
</body>
</html>`;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    // Proxy Anthropic API — keeps your key server-side
    if (url.pathname === '/api/chat') {
      if (request.method !== 'POST') {
        return new Response('Method not allowed', { status: 405 });
      }
      const body = await request.json();
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      return new Response(JSON.stringify(data), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // Serve the app
    return new Response(HTML, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  },
};
