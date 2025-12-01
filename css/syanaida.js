// ① モードごとの文章
const wordSets = {
  // 営業：前向きで華やか
  sales: [
    "お世話になっております。株式会社〇〇の小柳でございます。",
    "本日はご提案の機会をいただきありがとうございます！",
    "お客様の課題解決に向けて全力でサポートいたします。",
    "次回のお打ち合わせは来週水曜でいかがでしょうか？",
    "資料をお送りしましたのでご確認をお願いいたします。",
    "ご連絡ありがとうございます。すぐにご対応いたします！",
    "現場のお声をもとにご提案内容をアップデートしました。",
    "本日はありがとうございました。引き続きよろしくお願いいたします！",
    "成果で信頼を積み上げてまいります。",
    "今日も目標達成、最高の一日でした！"
  ],

  // 秘書：気配り・調整・優しい
  secretary: [
    "お疲れ様です。総務課の〇〇です。",
    "本日の会議は予定通り10時より第1会議室にて実施いたします。",
    "資料は印刷し会議室にセット済みです。",
    "ただいま席を外しておりますので戻り次第ご連絡いたします。",
    "日程の再調整が必要との連絡がございました。",
    "本日は会食の予定があり18時以降のご連絡が遅れます。",
    "明日のご訪問先のアクセス情報を共有いたします。",
    "急ぎの場合はお手数ですがお電話にてご連絡ください。",
    "以上、よろしくお願いいたします。",
    "本日もサポートさせていただきありがとうございました。"
  ],

  // 技術職：丸投げに耐える現場の声
  engineer: [
    "その要件だと画面が決まらないんですよ…？",
    "仕様変更、また来ましたね。",
    "丸投げするなら期限と優先度ください。",
    "それ、再現取れますか？",
    "“いい感じに”が一番時間かかるんですって。",
    "テストどうする想定でしょうか？",
    "動いたけどこれ本当に欲しかったやつですか？",
    "デプロイ中は話しかけないでください。",
    "環境依存かもしれません。詳細共有いただけますか？",
    "はい、こっちで補完しておきますね。"
  ],

  // 会長：余裕・理念・夜の社交
  chairman: [
    "今日も現場はよくやっているな。",
    "失敗の責任は上が取り成果は下に渡せ。",
    "会社は人でできている、忘れるな。",
    "若い連中が動きやすい器を作るのが私の役目だ。",
    "取引先との関係は丁寧に続けておけ。",
    "あとは任せよう、私は顔を出しておく。",
    "みんなよく働いた、今夜は少し良い店に行くか。",
    "数字だけでなく信頼を積み上げていこう。",
    "今日もいい日だった。",
    "では、行ってくるよ。"
  ]
};

// ② DOM取得
const sushiEl = document.getElementById("sushi");
const wordEl = document.getElementById("word");
const inputEl = document.getElementById("input");
const scoreEl = document.getElementById("score");
const timeEl = document.getElementById("time");
const charImg = document.getElementById("charImg");
const charMsg = document.getElementById("charMsg");
const resultBox = document.getElementById("result");
const resultText = document.getElementById("resultText");
const modeButtons = document.querySelectorAll(".mode-btn");

let currentMode = "sales";
let currentWord = "";
let score = 0;
let time = 45;
let laneWidth = 0;
let x = -400;
let finishedCount = 0;

// ③ モード変更処理
modeButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    modeButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    currentMode = btn.dataset.mode;

    // 背景用にbodyクラス切り替え
    document.body.className = ""; // いったん全部外す
    document.body.classList.add(`${currentMode}-mode`);

    setNewWord();

    // モードごとのひとこと
    if (currentMode === "sales") {
      charMsg.textContent = "「営業モード！今日も数字取りにいきましょー💪」";
    } else if (currentMode === "secretary") {
      charMsg.textContent = "「秘書モード。気配りで会社を回します☕️」";
    } else if (currentMode === "engineer") {
      charMsg.textContent = "「技術職モード。丸投げには冷静に対処💻」";
    } else if (currentMode === "chairman") {
      charMsg.textContent = "「会長モードか。今夜は馴染みの店に顔を出すとしよう🥃」";
    }
  });
});

// ④ 新しい文をセット
function setNewWord() {
  const list = wordSets[currentMode];
  currentWord = list[Math.floor(Math.random() * list.length)];
  wordEl.textContent = currentWord;
  inputEl.value = "";
  x = -400;
  sushiEl.style.left = x + "px";
}

// ⑤ 流す
function moveSushi() {
  x += 2;
  sushiEl.style.left = x + "px";

  if (x > laneWidth) {
    setNewWord();
  }

  requestAnimationFrame(moveSushi);
}

// ⑥ 入力チェック
inputEl.addEventListener("input", () => {
  if (inputEl.value === currentWord) {
    score += 10;
    finishedCount += 1;
    scoreEl.textContent = score;

    // モードごとの反応
    if (currentMode === "sales") {
      charMsg.textContent = "「ナイス即レス力👍」";
    } else if (currentMode === "secretary") {
      charMsg.textContent = "「丁寧なご入力ありがとうございます☺️」";
    } else if (currentMode === "engineer") {
      charMsg.textContent = "「これでまた1つバグが消えた…」";
    } else if (currentMode === "chairman") {
      charMsg.textContent = "「うむ、これなら夜に飲みに行けるな。」";
    }

    setNewWord();
  }
});

// ⑦ タイマー
function startTimer() {
  const timerId = setInterval(() => {
    time--;
    timeEl.textContent = time;
    if (time <= 0) {
      clearInterval(timerId);
      endGame();
    }
  }, 1000);
}

// ⑧ 終了演出
function endGame() {
  inputEl.disabled = true;
  wordEl.textContent = "本日の業務、終了。";

  if (currentMode === "sales") {
    charImg.src = "img/char_beer.png";
    charMsg.textContent = "「今日も売上ありがとう！かんぱーい🍺」";
  } else if (currentMode === "secretary") {
    charImg.src = "img/char_tea.png";
    charMsg.textContent = "「キャンドルつけて、あったかい紅茶で休も☕️」";
  } else if (currentMode === "engineer") {
    charImg.src = "img/char_coffee.png";
    charMsg.textContent = "「バグもデプロイも終わった…夜のコーヒーがうまい☕️」";
  } else if (currentMode === "chairman") {
    charImg.src = "img/char_lounge.png";
    charMsg.textContent = "「みんな頑張っていたし、今夜は少し良い店でねぎらってくるか🥃」";
  }

  resultBox.classList.remove("hidden");
  resultText.textContent =
    `本日の入力数：${finishedCount}文\nスコア：${score}点\nまたの出社をお待ちしております。`;
}

// ⑨ 初期化
window.addEventListener("load", () => {
  laneWidth = document.querySelector(".lane").clientWidth + 400;
  setNewWord();
  moveSushi();
  startTimer();
  inputEl.focus();
});
