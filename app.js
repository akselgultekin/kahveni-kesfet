/* Kahveni Keşfet — saf Vanilla JS. Harici kütüphane yok.
   Durum yenilemede sıfırlanır (kalıcı depolama isteğe bağlı bırakıldı). */
"use strict";

/* ------------------------------------------------------------------ */
/* VERİ: kahveler (tek kaynak). image dolarsa sonuç kartında gösterilir. */
/* ------------------------------------------------------------------ */
const COFFEES = [
  {
    name: "House Blend",
    shortDescription:
      "Dengeli ve klasik içimiyle öne çıkan; kuruyemiş tonları ve hafif meyvemsi bitişiyle günlük içime uygun bir profil.",
    tags: ["Dengeli", "Kuruyemiş", "Meyvemsi"],
    character: "dengeli ve klasik",
    image: ""
  },
  {
    name: "Pike Place",
    shortDescription:
      "Kakao ve karamel tonlarıyla dengeli, yumuşak bitişli klasik bir profil.",
    tags: ["Dengeli", "Kakao", "Yumuşak bitiş"],
    character: "dengeli ve klasik",
    image: ""
  },
  {
    name: "Ethiopia",
    shortDescription:
      "Narenciye ve meyvemsi tonlarıyla ferah, canlı ve kendine özgü karakterli bir profil.",
    tags: ["Meyvemsi", "Canlı", "Karakterli"],
    character: "belirgin ve karakterli",
    image: ""
  },
  {
    name: "Guatemala",
    shortDescription:
      "Kakao tonları ve hafif baharat dokunuşuyla dengeli ama karakterli bir profil.",
    tags: ["Dengeli", "Kakao", "Karakterli"],
    character: "dengeli ve klasik",
    image: ""
  },
  {
    name: "Colombia Nariño",
    shortDescription:
      "Kavrulmuş kuruyemiş ve karamel tonlarıyla dengeli, yuvarlak bir profil.",
    tags: ["Dengeli", "Kuruyemiş", "Karamel"],
    character: "dengeli ve klasik",
    image: ""
  },
  {
    name: "Espresso",
    shortDescription:
      "Kakao ve kavruk tonlarıyla yoğun, güçlü ve uzun süren bir profil.",
    tags: ["Yoğun", "Kakao", "Güçlü"],
    character: "yoğun ve güçlü",
    image: ""
  },
  {
    name: "Sumatra",
    shortDescription:
      "Topraksı ve baharatlı tonlarıyla dolgun, yoğun ve belirgin bir profil.",
    tags: ["Topraksı", "Baharatlı", "Yoğun"],
    character: "yoğun ve güçlü",
    image: ""
  },
  {
    name: "Verona",
    shortDescription:
      "Kakao ve karamelize tatlarla yoğun, kavruk ve güçlü bir profil.",
    tags: ["Yoğun", "Kakao", "Kavruk"],
    character: "yoğun ve güçlü",
    image: ""
  },
  {
    name: "Veranda",
    shortDescription:
      "Hafif gövdeli, yumuşak ve tatlı; kolay içimli, narin bir profil.",
    tags: ["Hafif", "Yumuşak", "Kolay içimli"],
    character: "yumuşak ve rahat",
    image: ""
  },
  {
    name: "Espresso Blonde",
    shortDescription:
      "Yumuşak içimli, tatlı ve hafif meyvemsi tonlar taşıyan narin bir profil.",
    tags: ["Yumuşak", "Meyvemsi", "Tatlı"],
    character: "yumuşak ve rahat",
    image: ""
  }
];

/* Sabit kahve sırası: deterministic eşitlik bozma için yedek ölçüt. */
const COFFEE_ORDER = COFFEES.map(function (c) { return c.name; });

/* Badge ikonları (Font Awesome Free, solid). Bilgi hiyerarşisinin parçası;
   her metnin yanına ikon konulmaz, yalnızca özellik badge'lerinde kullanılır. */
/* Badge ikonları: kahve-bağlamlı sınırlı vocabulary + custom çekirdek.
   Sözlük anlamının literal ikon eşleşmeleri kullanılmaz. */
const TAG_ICONS = {
  "Dengeli": "bean",
  "Kuruyemiş": "fa-seedling",
  "Meyvemsi": "fa-lemon",
  "Kakao": "fa-cookie",
  "Yumuşak bitiş": "fa-feather",
  "Yumuşak": "fa-feather",
  "Canlı": "fa-bolt",
  "Karakterli": "fa-gem",
  "Karamel": "fa-mug-hot",
  "Yoğun": "fa-fire",
  "Güçlü": "fa-bolt",
  "Kavruk": "fa-mug-hot",
  "Topraksı": "fa-mountain",
  "Baharatlı": "fa-pepper-hot",
  "Hafif": "fa-wind",
  "Tatlı": "fa-apple-whole",
  "Kolay içimli": "fa-mug-saucer"
};
/* Marka çekirdek motifi (statik inline SVG; kullanıcı verisi içermez). */
const BEAN_SVG = '<svg viewBox="0 0 32 32" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M23.5 6.5C15.5 2.5 6 10 6 18.5c0 6.5 8 10.5 13.5 6.5C26.5 19.5 29.5 10 23.5 6.5Z"/><path d="M15 5.5c7 5.5-1.5 8 3.5 12.5 2.8 2.6 2.8 4.6 1.8 6.5"/></svg>';
function brandIcon(name, fallback) {
  if (name === "bean") {
    const holder = document.createElement("span");
    holder.setAttribute("aria-hidden", "true");
    holder.innerHTML = BEAN_SVG;
    return holder;
  }
  const icon = document.createElement("i");
  icon.className = "fa-solid " + (name || fallback);
  icon.setAttribute("aria-hidden", "true");
  return icon;
}
const FALLBACK_TAG_ICON = "fa-mug-saucer";
const FALLBACK_OPTION_ICON = "fa-mug-saucer";

/* ------------------------------------------------------------------ */
/* VERİ: sorular ve eşleşmeler (tek kaynak).
   Bir eşleşmeyi değiştirmek için ilgili matches dizisini düzenlemek yeterli.
   Örn: "Guatemala bu cevaptan puan almasın" -> o cevabın matches dizisinden
   "Guatemala" satırını silmek yeterli.                                    */
/* ------------------------------------------------------------------ */
const QUESTIONS = [
  {
    title: "Kahveni nasıl bir karakterde seversin?",
    info: "",
    options: [
      { label: "Yumuşak, rahat içimli", icon: "fa-feather", matches: ["Veranda", "Espresso Blonde"] },
      { label: "Dengeli ve klasik", icon: "bean", matches: ["House Blend", "Pike Place", "Guatemala", "Colombia Nariño"] },
      { label: "Yoğun ve güçlü", icon: "fa-fire", matches: ["Espresso", "Sumatra", "Verona"] },
      { label: "Belirgin ve karakterli", icon: "fa-bolt", matches: ["Ethiopia"] }
    ]
  },
  {
    title: "Kahvenin verdiği his nasıl olsun?",
    info: "Asidite; kahvenin damağınızda bıraktığı canlı, ferah ve meyvemsi hissi ifade eder.",
    options: [
      { label: "Daha düşük, yumuşak olsun", icon: "fa-droplet", matches: ["Sumatra", "Verona", "Veranda"] },
      { label: "Dengeli olsun", icon: "bean", matches: ["House Blend", "Pike Place", "Guatemala", "Colombia Nariño", "Espresso"] },
      { label: "Biraz daha canlı ve belirgin olsun", icon: "fa-sun", matches: ["Ethiopia", "Espresso Blonde"] },
      { label: "Ferah ve meyvemsi karakteri belirgin olsun", icon: "fa-lemon", matches: ["Ethiopia", "Espresso Blonde"] }
    ]
  },
  {
    title: "Kahveni ne kadar yoğun seversin?",
    info: "Gövde, kahvenin ağızda bıraktığı dolgunluk ve yoğunluk hissidir.",
    options: [
      { label: "Hafif ve narin", icon: "fa-feather", matches: ["Veranda"] },
      { label: "Orta, dengeli", icon: "bean", matches: ["House Blend", "Pike Place", "Ethiopia", "Guatemala", "Colombia Nariño", "Espresso Blonde"] },
      { label: "Dolgun ve yoğun", icon: "fa-mug-hot", matches: ["Espresso", "Sumatra", "Verona"] }
    ]
  },
  {
    title: "Kahvende hangi lezzetleri daha çekici buluyorsun?",
    info: "",
    options: [
      { label: "Çikolata, kakao ve karamel", icon: "fa-cookie", matches: ["Pike Place", "Guatemala", "Verona", "Espresso"] },
      { label: "Fındık ve kuruyemiş", icon: "fa-seedling", matches: ["House Blend", "Colombia Nariño", "Espresso"] },
      { label: "Meyvemsi ve narenciye", icon: "fa-lemon", matches: ["Ethiopia", "House Blend"] },
      { label: "Daha farklı, topraksı ve baharatlı tatlar", icon: "fa-leaf", matches: ["Sumatra", "Guatemala"] }
    ]
  },
  {
    title: "Kahveni içerken nasıl bir deneyim arıyorsun?",
    info: "",
    options: [
      { label: "Yumuşak, tatlı ve kolay içimli", icon: "fa-feather", matches: ["Veranda", "Espresso Blonde"] },
      { label: "Dengeli; ne çok hafif ne çok yoğun", icon: "bean", matches: ["House Blend", "Pike Place", "Guatemala", "Colombia Nariño"] },
      { label: "Yoğun, güçlü ve uzun süren bir tat", icon: "fa-fire", matches: ["Espresso", "Sumatra", "Verona"] },
      { label: "Farklı ve kendine özgü bir karakter", icon: "fa-bolt", matches: ["Ethiopia"] }
    ]
  },
  {
    title: "Aşağıdaki tatlardan hangisi sana daha yakın?",
    info: "",
    /* GEÇİCİ ürün mantığı: Soru 6 ayırt edici sorudur, kolayca değiştirilebilir. */
    options: [
      { label: "Sütlü çikolata / kakao", icon: "fa-cookie", matches: ["Pike Place", "Guatemala", "Verona"] },
      { label: "Fındık / kavrulmuş kuruyemiş", icon: "fa-seedling", matches: ["House Blend", "Colombia Nariño", "Espresso"] },
      { label: "Meyve / narenciye", icon: "fa-lemon", matches: ["Ethiopia", "Espresso Blonde"] },
      { label: "Karamel / yoğun kavruk tatlar", icon: "fa-fire", matches: ["Espresso", "Verona", "Pike Place"] },
      { label: "Topraksı / baharatlı", icon: "fa-pepper-hot", matches: ["Sumatra", "Guatemala"] }
    ]
  }
];

/* Soru ağırlıkları: ilk 5 soru +1, ayırt edici Soru 6 +2. */
const QUESTION_WEIGHTS = [1, 1, 1, 1, 1, 2];

/* Bir kahvenin alabileceği teorik maksimum puan: 5x1 + 1x2 = 7. */
const MAX_SCORE = QUESTION_WEIGHTS.reduce(function (sum, w) { return sum + w; }, 0);

/* ------------------------------------------------------------------ */
/* REVIEW STORE — değerlendirme veri katmanı.
   Şimdilik localStorage (kahve bazlı). Supabase'e geçişte YALNIZCA bu
   katmandaki getReviews / saveReview / getReviewStats fonksiyonlarının
   içi değişecek; UI kodu aynen kalacak.
   Gelecek veri modeli: coffee_reviews { id, coffee_id, rating, comment, created_at }
   Bu turda Supabase SDK / env / API key / network request YOK.          */
/* ------------------------------------------------------------------ */
const ReviewStore = {
  keyFor: function (coffeeId) {
    return "kahve-kesif-reviews-v1:" + coffeeId;
  },
  storage: function () {
    try {
      return window.localStorage;
    } catch (e) {
      return null;
    }
  },
  getReviews: function (coffeeId) {
    const store = this.storage();
    if (!store) return [];
    try {
      const raw = store.getItem(this.keyFor(coffeeId));
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed.filter(function (r) {
        return r && typeof r.rating === "number" && typeof r.comment === "string";
      });
    } catch (e) {
      return [];
    }
  },
  saveReview: function (coffeeId, review) {
    const store = this.storage();
    const entry = {
      id: "r" + Date.now().toString(36) + "-" + (reviewSeq++),
      rating: review.rating,
      comment: String(review.comment).slice(0, 500),
      createdAt: new Date().toISOString()
    };
    if (!store) return { ok: false };
    try {
      const list = this.getReviews(coffeeId);
      list.unshift(entry); /* en yeni en üstte */
      store.setItem(this.keyFor(coffeeId), JSON.stringify(list));
      return { ok: true, review: entry };
    } catch (e) {
      return { ok: false };
    }
  },
  getReviewStats: function (coffeeId) {
    const list = this.getReviews(coffeeId);
    if (!list.length) return { count: 0, average: 0 };
    const sum = list.reduce(function (total, r) { return total + r.rating; }, 0);
    return {
      count: list.length,
      average: Math.round((sum / list.length) * 10) / 10
    };
  }
};
let reviewSeq = 0;

/* ------------------------------------------------------------------ */
/* DURUM (quiz state; localStorage değerlendirmeleri burada tutulmaz) */
/* ------------------------------------------------------------------ */
let currentQuestion = 0;
let answers = [null, null, null, null, null, null];
let currentRating = 0;
let currentCoffee = null;
let reviewsExpanded = false;

/* ------------------------------------------------------------------ */
/* DOM */
/* ------------------------------------------------------------------ */
const screens = {
  welcome: document.getElementById("screen-welcome"),
  quiz: document.getElementById("screen-quiz"),
  result: document.getElementById("screen-result")
};
const stepLabel = document.getElementById("step-label");
const stepPercent = document.getElementById("step-percent");
const progressBar = document.getElementById("progress-bar");
const progressFill = document.getElementById("progress-fill");
const questionTitle = document.getElementById("question-title");
const questionInfo = document.getElementById("question-info");
const optionsBox = document.getElementById("options");
const btnStart = document.getElementById("btn-start");
const btnBack = document.getElementById("btn-back");
const btnNext = document.getElementById("btn-next");
const btnRestart = document.getElementById("btn-restart");
const ratingAvgLine = document.getElementById("rating-avg-line");
const reviewText = document.getElementById("review-text");
const charCount = document.getElementById("char-count");
const reviewError = document.getElementById("review-error");
const reviewSuccess = document.getElementById("review-success");
const reviewList = document.getElementById("review-list");
const btnToggleReviews = document.getElementById("btn-toggle-reviews");
const btnSubmitReview = document.getElementById("btn-submit-review");
const starsValue = document.getElementById("stars-value");
const starsNum = document.getElementById("stars-num");
const starButtons = [1, 2, 3, 4, 5].map(function (n) {
  return document.getElementById("star-" + n);
});

/* ------------------------------------------------------------------ */
/* PUANLAMA */
/* ------------------------------------------------------------------ */
function calculateScores() {
  const scores = {};
  COFFEE_ORDER.forEach(function (name) { scores[name] = 0; });

  answers.forEach(function (optionIndex, questionIndex) {
    if (optionIndex === null) return;
    const weight = QUESTION_WEIGHTS[questionIndex];
    const matches = QUESTIONS[questionIndex].options[optionIndex].matches;
    matches.forEach(function (name) {
      if (scores[name] !== undefined) scores[name] += weight;
    });
  });

  return scores;
}

/* Belirli bir sorudaki cevabın eşleşme kümesi (tie-break için). */
function getMatchSet(questionIndex, optionIndex) {
  if (optionIndex === null || optionIndex === undefined) return {};
  const set = {};
  QUESTIONS[questionIndex].options[optionIndex].matches.forEach(function (name) {
    set[name] = true;
  });
  return set;
}

/* Sıralama + eşitlik bozma (EK PUAN YOK, yalnızca eşit skorları ayırır):
   1) toplam puan, 2) Soru 6, 3) Soru 4, 4) Soru 1, 5) Soru 5, 6) Soru 3,
   7) sabit liste sırası (deterministic, random yok).
   Her kademede yalnızca hâlâ eşit olanlar karşılaştırılır.
   Audit (3840 kombinasyon): fixed-order %30,1 -> %19,6; mapping/ağırlık aynı. */
const TIE_BREAK_ORDER = [5, 3, 0, 4, 2];
function rankCoffees(scores) {
  const sets = TIE_BREAK_ORDER.map(function (qi) { return getMatchSet(qi, answers[qi]); });

  return COFFEE_ORDER.slice().sort(function (a, b) {
    if (scores[b] !== scores[a]) return scores[b] - scores[a];
    for (let i = 0; i < sets.length; i++) {
      const diff = (sets[i][b] ? 1 : 0) - (sets[i][a] ? 1 : 0);
      if (diff !== 0) return diff;
    }
    return COFFEE_ORDER.indexOf(a) - COFFEE_ORDER.indexOf(b);
  });
}

/* Uyum skoru: ham puanın teorik maksimuma normalizasyonu (0-100).
   NOT: Bu, bilimsel bir olasılık değildir; yalnızca cevaplarla
   eşleşme oranını gösteren deterministik bir skordur. */
function matchPercent(score) {
  return Math.round((score / MAX_SCORE) * 100);
}

function findCoffee(name) {
  for (let i = 0; i < COFFEES.length; i++) {
    if (COFFEES[i].name === name) return COFFEES[i];
  }
  return COFFEES[0];
}

/* Kişiselleştirilmiş açıklama: kullanıcının Q1 + Q4 cevaplarından
   türetilen cümle + kahveye özel profil metni. */
function buildResultText(coffee) {
  const q1 = QUESTIONS[0].options[answers[0]].label.toLowerCase();
  const q4 = QUESTIONS[3].options[answers[3]].label.toLowerCase();
  const first =
    capitalizeTr(q1) + " karakterde kahveleri seviyorsun. " +
    capitalizeTr(q4) + " lezzetlerine yakın tercihlerinden dolayı " +
    coffee.name + " damak tadına en yakın seçenek olarak öne çıktı.";
  return first + " " + coffee.shortDescription;
}

function capitalizeTr(text) {
  if (!text) return text;
  return text.charAt(0).toLocaleUpperCase("tr") + text.slice(1);
}

/* Uyum count-up: YALNIZCA görsel animasyon (~1000ms, ease-out, 150ms giriş).
   Skor matchPercent'ten gelir (algoritmaya dokunulmaz); final her zaman
   tam integer biter ve DOM'daki erişilebilir değer doğru kalır.
   prefers-reduced-motion aktifse veya rAF yoksa doğrudan final gösterilir. */
function animateMatch(target) {
  const el = document.getElementById("result-match");
  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !window.requestAnimationFrame) {
    el.textContent = "%" + target;
    return;
  }
  const duration = 1000;
  const leadIn = 150;
  let startedAt = null;
  function frame(now) {
    if (startedAt === null) startedAt = now;
    const progress = Math.min(Math.max((now - startedAt - leadIn) / duration, 0), 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = "%" + Math.round(eased * target);
    if (progress < 1) {
      window.requestAnimationFrame(frame);
    } else {
      el.textContent = "%" + target;
    }
  }
  window.requestAnimationFrame(frame);
}

/* ------------------------------------------------------------------ */
/* EKRANLAR */
/* ------------------------------------------------------------------ */
function showScreen(name) {
  Object.keys(screens).forEach(function (key) {
    screens[key].hidden = key !== name;
  });
  window.scrollTo(0, 0);
}

function renderQuestion() {
  const q = QUESTIONS[currentQuestion];
  const percent = ((currentQuestion + 1) / QUESTIONS.length) * 100;

  stepLabel.textContent = "Soru " + (currentQuestion + 1) + " / " + QUESTIONS.length;
  stepPercent.textContent = "%" + Math.round(percent);
  progressFill.style.width = percent.toFixed(1) + "%";
  progressBar.setAttribute("aria-valuenow", String(Math.round(percent)));

  questionTitle.textContent = q.title;

  if (q.info) {
    questionInfo.textContent = q.info;
    questionInfo.hidden = false;
  } else {
    questionInfo.textContent = "";
    questionInfo.hidden = true;
  }

  while (optionsBox.firstChild) optionsBox.removeChild(optionsBox.firstChild);

  q.options.forEach(function (opt, index) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "option";
    btn.setAttribute("aria-pressed", String(answers[currentQuestion] === index));

    /* Anlama uygun ikon kabı (dekoratif; buton metni zaten erişilebilir ad). */
    const iconBox = document.createElement("span");
    iconBox.className = "option-icon";
    iconBox.setAttribute("aria-hidden", "true");
    iconBox.appendChild(brandIcon(opt.icon, FALLBACK_OPTION_ICON));

    const label = document.createElement("span");
    label.className = "option-label";
    label.textContent = opt.label;

    const check = document.createElement("span");
    check.className = "option-check";
    check.setAttribute("aria-hidden", "true");
    check.innerHTML =
      '<svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8.5l3.5 3.5L13 4.5"/></svg>';

    btn.appendChild(iconBox);
    btn.appendChild(label);
    btn.appendChild(check);
    btn.addEventListener("click", function () {
      answers[currentQuestion] = index;
      renderQuestion();
    });
    optionsBox.appendChild(btn);
  });

  btnNext.disabled = answers[currentQuestion] === null;
  btnNext.textContent = currentQuestion === QUESTIONS.length - 1 ? "Sonucumu Gör" : "Devam Et";
}

function showResult() {
  const scores = calculateScores();
  const ranked = rankCoffees(scores);
  const top = ranked.slice(0, 3);

  const main = findCoffee(top[0]);
  document.getElementById("result-coffee").textContent = main.name;
  animateMatch(matchPercent(scores[top[0]]));
  document.getElementById("result-desc").textContent = buildResultText(main);

  const tagsBox = document.getElementById("result-tags");
  while (tagsBox.firstChild) tagsBox.removeChild(tagsBox.firstChild);
  main.tags.forEach(function (tag) {
    const li = document.createElement("li");
    li.appendChild(brandIcon(TAG_ICONS[tag], FALLBACK_TAG_ICON));
    const text = document.createElement("span");
    text.textContent = tag;
    li.appendChild(text);
    tagsBox.appendChild(li);
  });

  const altList = document.getElementById("alt-list");
  while (altList.firstChild) altList.removeChild(altList.firstChild);
  top.slice(1).forEach(function (name) {
    const coffee = findCoffee(name);
    const card = document.createElement("div");
    card.className = "alt-card";

    const title = document.createElement("p");
    title.className = "alt-name";
    title.textContent = coffee.name;

    const match = document.createElement("p");
    match.className = "alt-match";
    match.textContent = "%" + matchPercent(scores[name]) + " uyum";

    card.appendChild(title);
    card.appendChild(match);

    const altStats = ReviewStore.getReviewStats(name);
    if (altStats.count > 0) {
      const rating = document.createElement("p");
      rating.className = "alt-rating";
      const starIcon = document.createElement("i");
      starIcon.className = "fa-solid fa-star";
      starIcon.setAttribute("aria-hidden", "true");
      rating.appendChild(starIcon);
      const ratingText = document.createElement("span");
      ratingText.textContent = String(altStats.average).replace(".", ",") +
        " / 5 · " + altStats.count + " değerlendirme";
      rating.appendChild(ratingText);
      card.appendChild(rating);
    }

    const tags = document.createElement("p");
    tags.className = "alt-tags";
    tags.textContent = coffee.tags.join(" · ");

    card.appendChild(tags);
    altList.appendChild(card);
  });

  /* Değerlendirme bölümü: her sonuçta forma sıfırdan başlanır. */
  currentCoffee = top[0];
  reviewsExpanded = false;
  resetReviewForm();
  renderRatingSummary(currentCoffee);
  renderReviewList(currentCoffee);

  showScreen("result");
}

/* ------------------------------------------------------------------ */
/* DEĞERLENDİRME UI (kullanıcı içeriği yalnızca textContent ile yazılır) */
/* ------------------------------------------------------------------ */
function starIcon(solid) {
  const icon = document.createElement("i");
  icon.className = solid ? "fa-solid fa-star" : "fa-regular fa-star";
  icon.setAttribute("aria-hidden", "true");
  return icon;
}

function renderStars() {
  starButtons.forEach(function (btn, index) {
    const on = index < currentRating;
    btn.classList.toggle("active", on);
    const icon = btn.querySelector("i");
    if (icon) icon.className = on ? "fa-solid fa-star" : "fa-regular fa-star";
  });
  starsNum.textContent = String(currentRating);
  starsValue.hidden = currentRating === 0;
}

function renderRatingSummary(coffeeName) {
  const stats = ReviewStore.getReviewStats(coffeeName);
  while (ratingAvgLine.firstChild) ratingAvgLine.removeChild(ratingAvgLine.firstChild);
  if (stats.count === 0) {
    const empty = document.createElement("span");
    empty.className = "rating-empty";
    empty.textContent = "Henüz değerlendirme yok";
    ratingAvgLine.appendChild(empty);
    return;
  }
  const stars = document.createElement("span");
  stars.className = "stars-static";
  stars.setAttribute("aria-hidden", "true");
  const solidCount = Math.round(stats.average);
  for (let i = 0; i < 5; i++) {
    stars.appendChild(starIcon(i < solidCount));
  }
  const avg = document.createElement("strong");
  avg.className = "rating-avg";
  avg.textContent = String(stats.average).replace(".", ",") + " / 5";
  const count = document.createElement("span");
  count.className = "rating-count";
  count.textContent = "· " + stats.count + " değerlendirme";
  ratingAvgLine.appendChild(stars);
  ratingAvgLine.appendChild(avg);
  ratingAvgLine.appendChild(count);
  ratingAvgLine.setAttribute("aria-label",
    "Müşteri puanı: 5 üzerinden " + stats.average + ", " + stats.count + " değerlendirme");
}

function formatDateTr(iso) {
  try {
    return new Date(iso).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  } catch (e) {
    return "";
  }
}

function renderReviewList(coffeeName) {
  const reviews = ReviewStore.getReviews(coffeeName);
  while (reviewList.firstChild) reviewList.removeChild(reviewList.firstChild);

  if (!reviews.length) {
    const empty = document.createElement("p");
    empty.className = "review-empty";
    empty.textContent = "Bu kahve için henüz değerlendirme yok. İlk değerlendiren sen ol.";
    reviewList.appendChild(empty);
    btnToggleReviews.hidden = true;
    return;
  }

  const visible = reviewsExpanded ? reviews : reviews.slice(0, 3);
  visible.forEach(function (r) {
    const item = document.createElement("div");
    item.className = "review-item";

    const stars = document.createElement("div");
    stars.className = "review-stars";
    stars.setAttribute("aria-label", "5 üzerinden " + r.rating + " yıldız");
    for (let i = 0; i < 5; i++) {
      stars.appendChild(starIcon(i < r.rating));
    }

    const comment = document.createElement("p");
    comment.className = "review-comment";
    comment.textContent = r.comment; /* textContent: HTML/script execute edilmez */

    const meta = document.createElement("p");
    meta.className = "review-meta";
    const date = formatDateTr(r.createdAt);
    meta.textContent = date ? "Müşteri değerlendirmesi · " + date : "Müşteri değerlendirmesi";

    item.appendChild(stars);
    item.appendChild(comment);
    item.appendChild(meta);
    reviewList.appendChild(item);
  });

  if (reviews.length > 3) {
    btnToggleReviews.hidden = false;
    btnToggleReviews.textContent = reviewsExpanded
      ? "Daha az göster"
      : "Tüm değerlendirmeleri gör (" + reviews.length + ")";
  } else {
    btnToggleReviews.hidden = true;
  }
}

function resetReviewForm() {
  currentRating = 0;
  reviewText.value = "";
  charCount.textContent = "0 / 500";
  reviewError.hidden = true;
  reviewSuccess.hidden = true;
  renderStars();
}

function showReviewError(message) {
  reviewError.textContent = message;
  reviewError.hidden = false;
  reviewSuccess.hidden = true;
}

function submitReview() {
  if (!currentCoffee) return;
  const comment = reviewText.value.trim();
  if (currentRating === 0) {
    showReviewError("Değerlendirme için önce yıldız puanı seç.");
    return;
  }
  if (!comment) {
    showReviewError("Yorumunu yazmadan gönderemezsin. Deneyimini kısaca paylaş.");
    return;
  }
  const result = ReviewStore.saveReview(currentCoffee, {
    rating: currentRating,
    comment: comment
  });
  if (!result.ok) {
    showReviewError("Değerlendirme kaydedilemedi. Tarayıcı depolaması kapalı olabilir.");
    return;
  }
  reviewError.hidden = true;
  reviewSuccess.hidden = false;
  currentRating = 0;
  reviewText.value = "";
  charCount.textContent = "0 / 500";
  renderStars();
  renderRatingSummary(currentCoffee);
  renderReviewList(currentCoffee);
}

function resetTest() {
  currentQuestion = 0;
  answers = [null, null, null, null, null, null];
  renderQuestion();
  showScreen("quiz");
}

/* ------------------------------------------------------------------ */
/* OLAYLAR (addEventListener ile; satır içi olay niteliği yok) */
/* ------------------------------------------------------------------ */
btnStart.addEventListener("click", function () {
  currentQuestion = 0;
  answers = [null, null, null, null, null, null];
  renderQuestion();
  showScreen("quiz");
});

btnNext.addEventListener("click", function () {
  if (answers[currentQuestion] === null) return;
  if (currentQuestion < QUESTIONS.length - 1) {
    currentQuestion += 1;
    renderQuestion();
  } else {
    showResult();
  }
});

btnBack.addEventListener("click", function () {
  if (currentQuestion === 0) {
    showScreen("welcome");
    return;
  }
  currentQuestion -= 1;
  renderQuestion();
});

btnRestart.addEventListener("click", resetTest);

starButtons.forEach(function (btn, index) {
  btn.addEventListener("click", function () {
    currentRating = index + 1;
    reviewError.hidden = true;
    renderStars();
  });
});

reviewText.addEventListener("input", function () {
  charCount.textContent = String(reviewText.value.length) + " / 500";
});

btnSubmitReview.addEventListener("click", submitReview);

btnToggleReviews.addEventListener("click", function () {
  reviewsExpanded = !reviewsExpanded;
  if (currentCoffee) renderReviewList(currentCoffee);
});

renderQuestion();
showScreen("welcome");
