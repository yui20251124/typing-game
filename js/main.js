// ===== 単語リスト =====
const words = [
  "やればできる子",
  "がんばっててえらい！",
  "ちゃんと起きれた！",
  "かしこすぎ！",
  "笑顔が可愛い",
  "ビール美味しい♡",
  "今日もがんばった！",
  "やりきった！",
  "優勝！！！",
  "才能ありすぎ",
  "世界一かわいい",
  "努力の天才",
  "気配り上手",
  "今日も天才",
  "ほめるとこしかない",
  "まじで尊い",
  "最高のいちにち",
  "いい感じ〜！",
  "センスありすぎ",
  "無敵モード",
  "神対応！",
  "周囲も笑顔に！",
  "なんかもう天才！"
];

// ===== DOM取得 =====
const startScreenEl = document.getElementById("startScreen");
const gameScreenEl = document.getElementById("gameScreen");
const startBtn = document.getElementById("startBtn");

const scoreEl = document.getElementById("score");
const gameTimeEl = document.getElementById("gameTime");
const missEl = document.getElementById("miss");
const laneEl = document.getElementById("lane");
const bubbleEl = document.getElementById("bubble");
const inputEl = document.getElementById("input");
const resultBox = document.getElementById("result");
const resultText = document.getElementById("resultText");

const fullImageEl = document.getElementById("fullImage");
const bgmEl = document.getElementById("bgm");

// ===== 状態管理 =====
let currentWord = "";
let laneWidth = 0;
let bubbleDuration = 15000; // 1ワードが流れる時間(ms)
let bubbleStartTime = 0;
let bubbleX = 0;

let score = 0;
let miss = 0;
let gameTime = 70;
let gameTimerId = null;
let gameStarted = false;

// ===== 単語表示 =====
function renderWordAsSpans(word) {
  bubbleEl.innerHTML = "";
  for (const ch of word) {
    const span = document.createElement("span");
    span.textContent = ch;
    span.className = "char-span";
    bubbleEl.appendChild(span);
  }
}

function setNewBubble() {
  currentWord = words[Math.floor(Math.random() * words.length)];
  renderWordAsSpans(currentWord);
  inputEl.value = "";
  bubbleStartTime = performance.now();
  bubbleX = -200;
  bubbleEl.style.left = `${bubbleX}px`;
}

// ===== バブルアニメーション =====
function animateBubble(timestamp) {
  const elapsed = timestamp - bubbleStartTime;
  const t = Math.min(elapsed / bubbleDuration, 1);
  bubbleX = -200 + (laneWidth + 300) * t;
  bubbleEl.style.left = `${bubbleX}px`;

  if (elapsed >= bubbleDuration) {
    miss += 1;
    missEl.textContent = miss;
    setNewBubble();
  }

  if (gameTime > 0) {
    requestAnimationFrame(animateBubble);
  }
}

// ===== 入力処理 =====
inputEl.addEventListener("input", () => {
  if (gameTime <= 0) return;

  const val = inputEl.value;
  const spans = bubbleEl.querySelectorAll(".char-span");

  let longestPrefix = 0;
  for (let i = 0; i < val.length && i < currentWord.length; i += 1) {
    if (val[i] === currentWord[i]) {
      longestPrefix += 1;
    } else {
      break;
    }
  }

  spans.forEach((span, index) => {
    if (index < longestPrefix) {
      span.classList.add("correct");
    } else {
      span.classList.remove("correct");
    }
  });

  if (val === currentWord) {
    score += 10;
    scoreEl.textContent = score;
    setNewBubble();
  }
});

// ===== タイマー =====
function startGameTimer() {
  if (gameTimerId) return;

  gameTimerId = setInterval(() => {
    gameTime -= 1;
    if (gameTime < 0) gameTime = 0;
    gameTimeEl.textContent = gameTime;

    if (gameTime <= 0) {
      clearInterval(gameTimerId);
      endGame();
    }
  }, 1000);
}

// ===== 本当のゲーム開始処理 =====
function startGameCore() {
  // 画面切り替え
  startScreenEl.classList.add("hidden");
  gameScreenEl.classList.remove("hidden");

  // 状態初期化
  score = 0;
  miss = 0;
  gameTime = 70;
  scoreEl.textContent = score;
  missEl.textContent = miss;
  gameTimeEl.textContent = gameTime;
  resultBox.classList.add("hidden");
  inputEl.disabled = false;

  // レーン幅取得 & バブルセット
  laneWidth = laneEl.clientWidth;
  setNewBubble();
  requestAnimationFrame(animateBubble);

  inputEl.focus();
  startGameTimer();

  // BGMスタート
  bgmEl.currentTime = 0;
  bgmEl.play().catch(() => {});
}

// ===== スタートボタン押下時 =====
function startGame() {
  if (gameStarted) return;
  gameStarted = true;

  // 中村くん全画面表示
  fullImageEl.classList.remove("hidden");
  requestAnimationFrame(() => {
    fullImageEl.classList.add("show");
  });

  // 1秒表示 → 0.5秒でフェードアウト → ゲーム開始
  setTimeout(() => {
    fullImageEl.classList.remove("show");

    setTimeout(() => {
      fullImageEl.classList.add("hidden");
      startGameCore();
    }, 500);
  }, 1000);
}

// ===== 終了処理（最終演出なし） =====
function endGame() {
  inputEl.disabled = true;
  bgmEl.pause();

  resultBox.classList.remove("hidden");
  resultText.textContent =
    `💖 きょうのスコア：${score} てん!! 💖\n` +
    `🌟 ミス：${miss} OK🌈\n` +
    `✨ じぶんをほめてあげよう♡`;
}

// ===== イベント設定 =====
startBtn.addEventListener("click", startGame);

// 初期状態
window.addEventListener("load", () => {
  inputEl.disabled = true;
});
