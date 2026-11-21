/* 동네친구 / Dongne Chingu
   Data: data/places.json. Audio: audio/manifest.json lists the mp3 files made by tools/make_audio.py.
   A clip that is not in the manifest falls back to the browser's own speech voice. */
(() => {
  'use strict';

  const LANGS = ['en', 'ja', 'zh', 'ko']; // ko is offered as a toggle only, never picked from the browser language
  const SPEECH = { en: 'en-US', ja: 'ja-JP', zh: 'zh-CN', ko: 'ko-KR' };

  const UI = {
    en: {
      tagline: 'Where Koreans in {area} actually go',
      local: 'Mostly locals',
      mixed: 'Mixed crowd',
      tourist: 'Mostly travelers',
      unknown: 'No counts yet',
      keyLocal: 'Locals',
      keyMixed: 'Mixed',
      keyTourist: 'Travelers',
      howTo: 'How to read pins',
      all: 'All',
      onlyLocal: 'Locals only',
      emptyTag: 'No places with this tag yet.',
      koreanReviews: 'Korean reviews',
      onNaver: 'on Naver Map',
      travelerReviews: 'Traveler reviews',
      onGoogle: 'on Google Maps',
      ratioLine: '{n} Korean reviews for every traveler review',
      ratioOnlyLocal: 'No traveler reviews yet. Only Koreans have reviewed it.',
      ratioUnknown: 'Review counts have not been added yet.',
      checked: 'Counts checked on {date}',
      fromFriend: 'From your local friend',
      listen: 'Listen',
      stop: 'Stop',
      voiceCredit: 'Voice made with ElevenLabs',
      koreansSay: 'What Koreans say',
      koreansSayNote: 'Summed up in my own words from Korean reviews.',
      readOnNaver: 'Read them on Naver Map',
      order: 'What Koreans order',
      sayThis: 'Say this',
      hearIt: 'Hear it',
      showStaff: 'Show to staff',
      tapToClose: 'Tap anywhere to close',
      openNaver: 'Open in Naver Map',
      openGoogle: 'Open in Google Maps',
      address: 'Address in Korean',
      addressHint: 'Show this to a taxi driver, or paste it into a map app.',
      copy: 'Copy address',
      copied: 'Address copied',
      copyFailed: 'Couldn’t copy. Press and hold the address to copy it.',
      close: 'Close',
      noAudio: 'This device can’t play the audio.',
      info1: 'Koreans mostly review places on Naver Map. Travelers mostly use Google Maps. So each app hears from a different crowd.',
      info2: 'The number on each pin is how many Korean reviews a place has for every traveler review.',
      infoLocal: '{local}× or more',
      infoMixed: '{mixed}× to {local}×',
      infoTourist: 'Under {mixed}×',
      info3: 'It’s a hint, not a verdict. New places and chains can skew the numbers.',
      loadError: 'The places didn’t load.',
      hint: '= {n} Korean reviews for every 1 traveler review. Orange pins are where locals go.',
      gotIt: 'Got it',
      walk: '{n} min',
      walkFrom: 'About {n} min walk from {here}',
      courseStats: '{n} stops · about {m} min on foot',
      courseStart: 'Starts at {here}',
      step: 'Stop {i} of {n}',
      nextStop: 'Next stop',
      farLeg: 'Bus or taxi',
      play: 'Play my day',
      tourEnd: 'That’s a day in {area}.',
      whyBtn: 'Why this map?',
      whyTitle: 'Why I made this',
      why1: 'Koreans leave reviews on Naver Map, and travelers on Google Maps. So visitors rarely get to see where Koreans actually go.',
      why2: 'This map compares the review counts on the two apps to show where locals really go.',
      why3: 'Yeonsinnae is my neighborhood. From market tteokbokki to cold noodles in the hanok village, a walk to Jingwansa and the chicken place down the alley, the course is just my ordinary day.'
    },
    ja: {
      tagline: '{area}で地元の人が本当に通う店',
      local: 'ほぼ地元客',
      mixed: '地元客と旅行者',
      tourist: '旅行者が多い',
      unknown: '件数未登録',
      keyLocal: '地元客',
      keyMixed: '半々',
      keyTourist: '旅行者',
      howTo: 'ピンの見方',
      all: 'すべて',
      onlyLocal: '地元のみ',
      emptyTag: 'このタグの場所はまだありません。',
      koreanReviews: '韓国人のレビュー',
      onNaver: 'Naver Map',
      travelerReviews: '旅行者のレビュー',
      onGoogle: 'Google マップ',
      ratioLine: '旅行者のレビュー1件に対して、韓国人のレビューが{n}件',
      ratioOnlyLocal: '旅行者のレビューはまだありません。韓国人のレビューだけです。',
      ratioUnknown: 'レビュー件数はまだ登録されていません。',
      checked: '{date}時点の件数',
      fromFriend: '地元の友だちから',
      listen: '聞く',
      stop: '止める',
      voiceCredit: '音声: ElevenLabs',
      koreansSay: '韓国人の声',
      koreansSayNote: '韓国語のレビューを、私の言葉でまとめました。',
      readOnNaver: 'Naver Mapで読む',
      order: '韓国人がよく頼むもの',
      sayThis: 'こう言ってみて',
      hearIt: '発音を聞く',
      showStaff: '店員さんに見せる',
      tapToClose: 'タップで閉じる',
      openNaver: 'Naver Mapで開く',
      openGoogle: 'Google マップで開く',
      address: '韓国語の住所',
      addressHint: 'タクシーの運転手に見せるか、地図アプリに貼り付けてください。',
      copy: '住所をコピー',
      copied: '住所をコピーしました',
      copyFailed: 'コピーできませんでした。住所を長押ししてコピーしてください。',
      close: '閉じる',
      noAudio: 'この端末では音声を再生できません。',
      info1: '韓国の人は主に Naver Map でレビューを書き、旅行者は主に Google マップを使います。2つのアプリには、別々の客層の声が集まっています。',
      info2: 'ピンの数字は、旅行者のレビュー1件に対して韓国人のレビューが何件あるかを示します。',
      infoLocal: '{local}倍以上',
      infoMixed: '{mixed}〜{local}倍',
      infoTourist: '{mixed}倍未満',
      info3: 'あくまで目安です。新しい店やチェーン店では数字がずれることがあります。',
      loadError: '場所を読み込めませんでした。',
      hint: '= 旅行者のレビュー1件に対して、韓国人のレビューが{n}件。オレンジのピンは地元の人が通う店です。',
      gotIt: 'OK',
      walk: '{n}分',
      walkFrom: '{here}から徒歩約{n}分',
      courseStats: '{n}か所 · 徒歩 計約{m}分',
      courseStart: '{here}から出発',
      step: '{n}か所中 {i}番目',
      nextStop: '次の場所へ',
      farLeg: 'バスかタクシーで',
      play: '私の一日を再生',
      tourEnd: '{area}の一日でした。',
      whyBtn: 'この地図について',
      whyTitle: 'この地図をつくった理由',
      why1: '韓国の人はNaver Mapに、旅行者はGoogleマップにレビューを書きます。だから旅行者には、韓国の人が本当に通う店が見えにくいのです。',
      why2: 'この地図は2つのアプリのレビュー数を比べて、地元の人が本当に通う場所を見せます。',
      why3: 'ヨンシンネは私の住む街です。市場のトッポッキから韓屋村の冷麺、津寛寺の散歩、路地裏のチキン屋まで、このコースは私のふだんの一日そのままです。'
    },
    zh: {
      tagline: '{area}本地人真正常去的地方',
      local: '以本地人为主',
      mixed: '本地人和游客都有',
      tourist: '游客较多',
      unknown: '暂无数据',
      keyLocal: '本地人',
      keyMixed: '混合',
      keyTourist: '游客',
      howTo: '如何看标记',
      all: '全部',
      onlyLocal: '仅本地人',
      emptyTag: '暂时没有这个标签的地点。',
      koreanReviews: '韩国人评价',
      onNaver: 'Naver 地图',
      travelerReviews: '游客评价',
      onGoogle: 'Google 地图',
      ratioLine: '每 1 条游客评价，对应 {n} 条韩国人评价',
      ratioOnlyLocal: '还没有游客评价，只有韩国人评价。',
      ratioUnknown: '还没有填写评价数量。',
      checked: '数据截至 {date}',
      fromFriend: '本地朋友说',
      listen: '收听',
      stop: '停止',
      voiceCredit: '语音由 ElevenLabs 生成',
      koreansSay: '韩国人怎么说',
      koreansSayNote: '根据韩国人的评价，用我自己的话总结。',
      readOnNaver: '在 Naver 地图上查看',
      order: '韩国人常点',
      sayThis: '这样说',
      hearIt: '听发音',
      showStaff: '给店员看',
      tapToClose: '点击任意处关闭',
      openNaver: '在 Naver 地图中打开',
      openGoogle: '在 Google 地图中打开',
      address: '韩文地址',
      addressHint: '可以给出租车司机看，或粘贴到地图应用里。',
      copy: '复制地址',
      copied: '地址已复制',
      copyFailed: '复制失败。请长按地址手动复制。',
      close: '关闭',
      noAudio: '这台设备无法播放语音。',
      info1: '韩国人大多在 Naver 地图上写评价，游客大多用 Google 地图。所以两个应用里听到的是两拨不同的人。',
      info2: '标记上的数字表示：每 1 条游客评价，对应多少条韩国人评价。',
      infoLocal: '{local} 倍以上',
      infoMixed: '{mixed}–{local} 倍',
      infoTourist: '低于 {mixed} 倍',
      info3: '这只是参考，不是结论。新店和连锁店的数字可能有偏差。',
      loadError: '地点加载失败。',
      hint: '= 每 1 条游客评价，对应 {n} 条韩国人评价。橙色标记是本地人常去的地方。',
      gotIt: '知道了',
      walk: '{n}分钟',
      walkFrom: '从{here}步行约{n}分钟',
      courseStats: '{n} 站 · 步行共约 {m} 分钟',
      courseStart: '从{here}出发',
      step: '第 {i} 站 / 共 {n} 站',
      nextStop: '下一站',
      farLeg: '坐公交或打车',
      play: '播放我的一天',
      tourEnd: '这就是{area}的一天。',
      whyBtn: '关于这张地图',
      whyTitle: '我为什么做这张地图',
      why1: '韩国人在 Naver 地图上写评价，游客在 Google 地图上写评价。所以游客很难看到韩国人真正常去的地方。',
      why2: '这张地图比较两个应用的评价数量，告诉你本地人真正常去的地方。',
      why3: '延新内是我住的街区。从市场炒年糕、韩屋村冷面、津宽寺散步，到巷子里的炸鸡店，这条路线就是我平常的一天。'
    },
    ko: {
      tagline: '{area} 사람들이 진짜 가는 곳',
      local: '현지인 위주',
      mixed: '현지인 반 여행자 반',
      tourist: '여행자 위주',
      unknown: '아직 숫자 없음',
      keyLocal: '현지인',
      keyMixed: '반반',
      keyTourist: '여행자',
      howTo: '핀 읽는 법',
      all: '전체',
      onlyLocal: '현지인만',
      emptyTag: '이 태그의 장소가 아직 없어요.',
      koreanReviews: '한국인 리뷰',
      onNaver: '네이버 지도',
      travelerReviews: '여행자 리뷰',
      onGoogle: '구글 지도',
      ratioLine: '여행자 리뷰 1개당 한국인 리뷰 {n}개',
      ratioOnlyLocal: '여행자 리뷰가 아직 없어요. 한국인 리뷰만 있어요.',
      ratioUnknown: '리뷰 수를 아직 넣지 않았어요.',
      checked: '{date} 기준 리뷰 수',
      fromFriend: '동네 친구의 한마디',
      listen: '듣기',
      stop: '멈춤',
      voiceCredit: '음성: ElevenLabs',
      koreansSay: '한국인 후기 요약',
      koreansSayNote: '한국인 후기를 읽고 제 말로 정리했어요.',
      readOnNaver: '네이버 지도에서 원문 보기',
      order: '한국인이 주로 시키는 것',
      sayThis: '이렇게 말해 보세요',
      hearIt: '발음 듣기',
      showStaff: '직원에게 보여 주기',
      tapToClose: '아무 곳이나 누르면 닫혀요',
      openNaver: '네이버 지도에서 열기',
      openGoogle: '구글 지도에서 열기',
      address: '한국어 주소',
      addressHint: '택시 기사님께 보여 주거나 지도 앱에 붙여 넣으세요.',
      copy: '주소 복사',
      copied: '주소를 복사했어요',
      copyFailed: '복사하지 못했어요. 주소를 길게 눌러 복사하세요.',
      close: '닫기',
      noAudio: '이 기기에서는 음성을 재생할 수 없어요.',
      info1: '한국 사람은 주로 네이버 지도에, 여행자는 주로 구글 지도에 리뷰를 남겨요. 그래서 두 앱에는 서로 다른 사람들의 목소리가 모여요.',
      info2: '핀의 숫자는 여행자 리뷰 1개당 한국인 리뷰가 몇 개인지를 뜻해요.',
      infoLocal: '{local}배 이상',
      infoMixed: '{mixed}–{local}배',
      infoTourist: '{mixed}배 미만',
      info3: '판정이 아니라 참고 지표예요. 새 가게나 체인점은 숫자가 왜곡될 수 있어요.',
      loadError: '장소를 불러오지 못했어요.',
      hint: '= 여행자 리뷰 1개당 한국인 리뷰 {n}개. 주황 핀이 현지인이 가는 곳이에요.',
      gotIt: '알겠어요',
      walk: '{n}분',
      walkFrom: '{here}에서 걸어서 약 {n}분',
      courseStats: '{n}곳 · 걷는 시간 약 {m}분',
      courseStart: '{here}에서 출발',
      step: '{n}곳 중 {i}번째',
      nextStop: '다음 장소',
      farLeg: '버스나 택시로',
      play: '나의 하루 재생',
      tourEnd: '{area}에서의 하루였어요.',
      whyBtn: '만든 이유',
      whyTitle: '왜 만들었나요',
      why1: '한국 사람은 네이버 지도에, 여행자는 구글 지도에 후기를 남겨요. 그래서 외국인은 한국인이 실제로 가는 곳을 보기 어려워요.',
      why2: '이 지도는 두 앱의 리뷰 수를 비교해서 현지인이 진짜 가는 곳을 보여 줘요.',
      why3: '연신내는 제가 사는 동네예요. 시장 떡볶이부터 한옥마을 냉면, 진관사 산책, 골목 치킨집까지, 제 평범한 하루를 그대로 코스로 만들었어요.'
    }
  };
  /* In Korean the "meaning" line would just repeat the Korean sentence, so it is left out. */
  function meaning(o) { return lang === 'ko' ? '' : loc(o); }

  const ICON = {
    play: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2.5v11l9-5.5z" fill="currentColor"/></svg>',
    stop: '<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="3.5" y="3.5" width="9" height="9" rx="1.5" fill="currentColor"/></svg>',
    close: '<svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true"><path d="M5 5l10 10M15 5L5 15" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>',
    out: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M9 3h4v4M13 3L7.5 8.5M11 9.5V13H3V5h3.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    copy: '<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="5.5" y="5.5" width="8" height="8" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M10.5 3.5V3A1.5 1.5 0 0 0 9 1.5H4A1.5 1.5 0 0 0 2.5 3v5A1.5 1.5 0 0 0 4 9.5h.5" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>',
    route: '<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="3.5" cy="12.5" r="2" fill="currentColor"/><circle cx="12.5" cy="3.5" r="2" fill="currentColor"/><path d="M5 12.5h4.5a2.5 2.5 0 0 0 0-5h-3a2.5 2.5 0 0 1 0-5H11" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-dasharray="0.1 2.6"/></svg>',
    next: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h9M8.5 4l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    train: '<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="3.5" y="1.5" width="9" height="10" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M3.5 7h9" stroke="currentColor" stroke-width="1.5"/><circle cx="6" cy="9.3" r=".9" fill="currentColor"/><circle cx="10" cy="9.3" r=".9" fill="currentColor"/><path d="M5.5 11.5 4 14.5M10.5 11.5 12 14.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
    walk: '<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="9" cy="2.6" r="1.6" fill="currentColor"/><path d="M8.4 5.6 6.6 9.2l2.1 2v3.3M8.4 5.6l2.4 2.3 2 .6M8.4 5.6 6 6.7 5.1 9M6.6 9.2l-2 5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };

  const $ = (sel, el = document) => el.querySelector(sel);
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* private mode */ } }
  };
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const els = {
    top: $('#top'), bottom: $('#bottom'), tagline: $('#tagline'), legend: $('#legend'),
    makerNote: $('#makerNote'), hint: $('#hint'), chips: $('#chips'), rail: $('#rail'),
    sheet: $('#sheet'), sign: $('#sign'), toast: $('#toast'), play: $('#play'), tourCap: $('#tourCap'), why: $('#why')
  };

  let data = null;
  let lang = pickLang();
  let tag = null;
  let course = null;         // selected course: its places are shown in walking order
  let routeLine = null;
  let map = null;
  let current = null;        // place shown in the sheet, or 'info'
  let lastFocus = null;
  let closeTimer = null;
  let playing = null;
  let audioFiles = new Set();
  let hereMarker = null;
  let intro = !reduceMotion; // pins drop in on first load only
  let tour = null;           // "Play my day": { i, stops, audio, timer }
  let routeAnim = 0;
  const markers = new Map();

  /* ---------- helpers ---------- */
  function pickLang() {
    const saved = store.get('dc.lang');
    if (LANGS.includes(saved)) return saved;
    const nav = (navigator.language || 'en').toLowerCase();
    if (nav.startsWith('ja')) return 'ja';
    if (nav.startsWith('zh')) return 'zh';
    return 'en';
  }
  function t(key, vars) {
    let s = (UI[lang] && UI[lang][key]) || UI.en[key] || key;
    if (vars) s = s.replace(/\{(\w+)\}/g, (_, k) => (vars[k] == null ? '' : vars[k]));
    return s;
  }
  function loc(o) {
    if (!o) return '';
    if (typeof o === 'string') return o;
    return o[lang] || o.en || '';
  }
  function num(n) {
    return new Intl.NumberFormat(lang === 'zh' ? 'zh-CN' : lang).format(n);
  }
  function ratioOf(p) {
    const n = p.naverReviews, g = p.googleReviews;
    if (typeof n !== 'number' || typeof g !== 'number') return null;
    if (g === 0) return n > 0 ? Infinity : null;
    return n / g;
  }
  function tierOf(r) {
    if (r === null) return 'unknown';
    const th = data.meta.thresholds;
    if (r >= th.local) return 'local';
    if (r >= th.mixed) return 'mixed';
    return 'tourist';
  }
  function ratioNum(r) { return r >= 10 ? String(Math.round(r)) : r.toFixed(1); }
  function ratioLabel(r) {
    if (r === null) return '?';
    if (r === Infinity) return t('onlyLocal');
    return '×' + ratioNum(r);
  }
  function sortValue(p) {
    const r = ratioOf(p);
    if (r === null) return -1;
    return r === Infinity ? Number.MAX_VALUE : r;
  }
  function firstHangul(name) {
    const clean = String(name || '').replace(/^\(.*?\)\s*/, '');
    return Array.from(clean)[0] || '';
  }
  function here() {
    const h = data.meta.here;
    return h && typeof h.lat === 'number' && typeof h.lng === 'number' ? h : null;
  }
  /* Straight-line distance x1.3 for street detours, at about 75 m a minute. A rough guide, not a route. */
  function legMin(from, to) {
    const rad = Math.PI / 180;
    const dLat = (to.lat - from.lat) * rad, dLng = (to.lng - from.lng) * rad;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(from.lat * rad) * Math.cos(to.lat * rad) * Math.sin(dLng / 2) ** 2;
    const meters = 2 * 6371000 * Math.asin(Math.sqrt(a));
    return Math.max(1, Math.round((meters * 1.3) / 75));
  }
  function walkMin(p) {
    const h = here();
    return h ? legMin(h, p) : null;
  }
  /* A stop is a place id, or {"place": id, "move": {"en": "Bus 7211, 15 min", ...}} when it isn't a walk. */
  function courseEntries(c) {
    return (c.stops || []).map((s) => {
      const id = typeof s === 'string' ? s : s && s.place;
      return { p: data.places.find((x) => x.id === id), move: s && s.move };
    }).filter((e) => e.p);
  }
  function courseStops(c) { return courseEntries(c).map((e) => e.p); }
  /* Walk to stop i: from the previous stop, or from "here" for the first one. */
  function courseLeg(stops, i) {
    if (i > 0) return legMin(stops[i - 1], stops[i]);
    return walkMin(stops[0]);
  }
  const FAR_WALK = 30;
  function legHtml(entries, i, cls) {
    if (entries[i].move) return '<span class="' + cls + '">' + ICON.route + esc(loc(entries[i].move)) + '</span>';
    const m = courseLeg(entries.map((e) => e.p), i);
    if (m === null) return '';
    if (m > FAR_WALK) return '<span class="' + cls + '">' + ICON.route + esc(t('farLeg')) + '</span>';
    return '<span class="' + cls + '">' + ICON.walk + esc(t('walk', { n: m })) + '</span>';
  }
  function stepOf(p) {
    if (!course) return -1;
    return courseStops(course).findIndex((x) => x.id === p.id);
  }
  function httpUrl(u) { return typeof u === 'string' && /^https?:\/\//i.test(u) ? u : ''; }
  function naverUrl(p) {
    return httpUrl(p.links && p.links.naver) || 'https://map.naver.com/p/search/' + encodeURIComponent(p.name.ko);
  }
  function googleUrl(p) {
    return httpUrl(p.links && p.links.google) || 'https://www.google.com/maps/search/?api=1&query=' + Number(p.lat) + ',' + Number(p.lng);
  }
  function visiblePlaces() {
    if (course) return courseStops(course);
    const list = tag ? data.places.filter((p) => (p.tags || []).includes(tag)) : data.places.slice();
    return list.sort((a, b) => sortValue(b) - sortValue(a));
  }
  function toast(msg) {
    els.toast.textContent = msg;
    els.toast.classList.add('is-on');
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => els.toast.classList.remove('is-on'), 2600);
  }
  function measure() {
    const h = els.bottom.offsetHeight;
    document.documentElement.style.setProperty('--bottom-h', h + 'px');
    return { top: els.top.offsetHeight + 24, bottom: h + 16 };
  }

  /* ---------- boot ---------- */
  async function init() {
    try {
      const res = await fetch('data/places.json', { cache: 'no-cache' });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      data = await res.json();
    } catch (e) {
      showLoadError();
      return;
    }
    try {
      const res = await fetch('audio/manifest.json', { cache: 'no-cache' });
      if (res.ok) audioFiles = new Set((await res.json()).files || []);
    } catch (e) { /* no audio yet: speech fallback */ }

    els.makerNote.hidden = !data.places.some((p) => p.sample);
    // Open on the course: numbered pins and a route say more at first glance than scattered pins.
    course = (data.courses || []).find((c) => courseStops(c).length > 1) || null;
    buildMap();
    bindUI();
    applyLang();
    fitAll();
    if (course) setTimeout(() => drawRoute(true), reduceMotion ? 0 : 500 + courseStops(course).length * 120);
    setTimeout(() => { intro = false; }, 2500);
  }

  function showLoadError() {
    const box = document.createElement('div');
    box.className = 'load-error';
    box.innerHTML = '<div><p><strong>' + esc(t('loadError')) + '</strong></p>' +
      '<p lang="ko">로컬에서 볼 때는 파일을 바로 열지 말고 README의 미리보기 명령으로 여세요.</p></div>';
    document.body.appendChild(box);
  }

  function buildMap() {
    map = L.map('map', { zoomControl: false }).setView(data.meta.center, data.meta.zoom || 16);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    map.on('click', () => { if (tour) stopTour(); closeSheet(); });
    map.on('moveend', placeBubbles);

    const h = here();
    if (h) {
      hereMarker = L.marker([h.lat, h.lng], { icon: hereIcon(), interactive: false, keyboard: false, zIndexOffset: -500 });
      hereMarker.addTo(map);
    }

    data.places.forEach((p) => {
      const m = L.marker([p.lat, p.lng], { icon: pinIcon(p), keyboard: true, riseOnHover: true });
      m.on('click', () => openPlace(p));
      m.addTo(map);
      markers.set(p.id, m);
    });
  }

  function fitAll() {
    const list = visiblePlaces();
    if (!list.length) return;
    const pad = measure();
    if (list.length === 1) {
      map.setView([list[0].lat, list[0].lng], 17);
      return;
    }
    const pts = list.map((p) => [p.lat, p.lng]);
    const h = here();
    if (h) pts.push([h.lat, h.lng]);
    map.fitBounds(L.latLngBounds(pts), {
      paddingTopLeft: [40, pad.top + (course ? BUB.h + BUB.lift : 0)],
      paddingBottomRight: [40, pad.bottom],
      maxZoom: 17,
      animate: !reduceMotion
    });
  }

  function isActive(p) {
    if (tour && tour.stops[tour.i]) return tour.stops[tour.i].id === p.id;
    return !!current && current !== 'info' && current.id === p.id;
  }

  /* ---------- course stops as illustrated speech bubbles ----------
     Bubbles sit above their spot with a short stem. Stops close together on screen are fanned out
     side by side and joined to their spot by a leader line, so nothing hides behind anything else. */
  const BUB = { w: 104, h: 146, gap: 8, lift: 24 };
  let bubbleLayout = new Map();
  function layoutBubbles() {
    bubbleLayout = new Map();
    if (!course || !map) return;
    const pts = courseStops(course).map((p) => ({ p, pt: map.latLngToLayerPoint([p.lat, p.lng]) }));
    const groups = [];
    pts.forEach((o) => {
      const g = groups.find((gr) => gr.some((m) => Math.abs(m.pt.x - o.pt.x) < BUB.w + BUB.gap && Math.abs(m.pt.y - o.pt.y) < BUB.h));
      if (g) g.push(o); else groups.push([o]);
    });
    groups.forEach((g) => {
      g.sort((a, b) => a.pt.x - b.pt.x);
      const cx = g.reduce((s, o) => s + o.pt.x, 0) / g.length;
      const top = Math.min(...g.map((o) => o.pt.y));
      // Keep the whole row on screen.
      const width = g.length * (BUB.w + BUB.gap) - BUB.gap;
      const left = map.layerPointToContainerPoint(L.point(cx - width / 2, 0)).x;
      const room = map.getSize().x;
      let shift = 0;
      if (width <= room - 16) {
        if (left < 8) shift = 8 - left;
        else if (left + width > room - 8) shift = room - 8 - (left + width);
      }
      g.forEach((o, k) => {
        const bx = cx + shift + (k - (g.length - 1) / 2) * (BUB.w + BUB.gap);
        bubbleLayout.set(o.p.id, { dx: Math.round(bx - o.pt.x), dy: Math.round(top - BUB.lift - o.pt.y) });
      });
    });
  }
  function bubTransform(l) { return 'translate(calc(-50% + ' + l.dx + 'px), calc(-100% + ' + l.dy + 'px))'; }
  function placeBubbles() {
    if (!course) return;
    layoutBubbles();
    markers.forEach((m, id) => {
      const el = m.getElement();
      const l = bubbleLayout.get(id);
      if (!el || !l) return;
      const b = el.querySelector('.bub');
      const ln = el.querySelector('.bub-line line');
      if (b) b.style.transform = bubTransform(l);
      if (ln) { ln.setAttribute('x2', l.dx); ln.setAttribute('y2', l.dy); }
    });
  }
  function bubbleIcon(p, step, cls) {
    const r = ratioOf(p);
    const l = bubbleLayout.get(p.id) || { dx: 0, dy: -BUB.lift };
    return L.divIcon({
      className: 'pin-wrap',
      iconSize: null,
      html: '<svg class="bub-line" width="1" height="1" aria-hidden="true"><line x1="0" y1="0" x2="' + l.dx + '" y2="' + l.dy + '"/></svg>' +
        '<span class="bub-dot bub-dot--' + tierOf(r) + '"></span>' +
        '<span class="bub' + cls + '" style="transform:' + bubTransform(l) + ';--i:' + step + '"><span class="bub__in">' +
          '<img src="' + esc(p.illust) + '" alt="" draggable="false">' +
          '<span class="bub__ratio badge badge--' + tierOf(r) + '">' + esc(ratioLabel(r)) + '</span>' +
          '<span class="bub__label"><span class="bub__step">' + (step + 1) + '</span>' + esc(loc(p.tagline) || loc(p.name)) + '</span>' +
        '</span></span>'
    });
  }

  function pinIcon(p) {
    const r = ratioOf(p);
    const step = stepOf(p);
    let cls = isActive(p) ? ' is-active' : '';
    if (tour && step > tour.i) cls += ' is-dim';
    if (intro) cls += ' is-intro';
    if (step >= 0 && p.illust) return bubbleIcon(p, step, cls);
    const order = step >= 0 ? step : Math.max(0, visiblePlaces().indexOf(p));
    return L.divIcon({
      className: 'pin-wrap',
      iconSize: null,
      html: '<span class="pin pin--' + tierOf(r) + cls + '" style="--i:' + order + '">' +
        (step >= 0 ? '<span class="pin__step">' + (step + 1) + '</span>' : '') + esc(ratioLabel(r)) + '</span>'
    });
  }

  function hereIcon() {
    return L.divIcon({ className: 'pin-wrap', iconSize: null, html: '<span class="here">' + ICON.train + esc(loc(here().name)) + '</span>' });
  }

  function refreshMarkers() {
    layoutBubbles();
    const show = new Set(visiblePlaces().map((p) => p.id));
    data.places.forEach((p) => {
      const m = markers.get(p.id);
      m.setIcon(pinIcon(p));
      const el = m.getElement();
      if (el) el.setAttribute('aria-label', loc(p.name) + ', ' + t(tierOf(ratioOf(p))));
      if (show.has(p.id)) { if (!map.hasLayer(m)) m.addTo(map); }
      else if (map.hasLayer(m)) map.removeLayer(m);
    });
  }

  /* Dotted line through the course in order, starting from "here" when there is one. */
  function routePts() {
    const pts = courseStops(course).map((p) => [p.lat, p.lng]);
    const h = here();
    if (h) pts.unshift([h.lat, h.lng]);
    return pts;
  }
  function setRoute(latlngs) {
    if (!routeLine) routeLine = L.polyline([], { color: '#F2671F', weight: 5, opacity: 0.9, dashArray: '1 10', lineCap: 'round', interactive: false }).addTo(map);
    routeLine.setLatLngs(latlngs);
  }
  /* Grow the line from point `from` to point `to` over `ms`, keeping everything before `from` drawn. */
  function animateRoute(pts, from, to, ms, done) {
    cancelAnimationFrame(routeAnim);
    const seg = [];
    let total = 0;
    for (let k = from; k < to; k++) {
      const d = Math.hypot(pts[k + 1][0] - pts[k][0], (pts[k + 1][1] - pts[k][1]) * Math.cos(pts[k][0] * Math.PI / 180));
      seg.push(d);
      total += d;
    }
    if (reduceMotion || ms <= 0 || !total) { setRoute(pts.slice(0, to + 1)); if (done) done(); return; }
    const t0 = performance.now();
    const frame = (now) => {
      const f = Math.min(1, (now - t0) / ms);
      const eased = 1 - Math.pow(1 - f, 2);
      let left = eased * total;
      const out = pts.slice(0, from + 1);
      for (let k = from; k < to; k++) {
        const d = seg[k - from];
        if (left >= d) { out.push(pts[k + 1]); left -= d; continue; }
        const r = d ? left / d : 1;
        out.push([pts[k][0] + (pts[k + 1][0] - pts[k][0]) * r, pts[k][1] + (pts[k + 1][1] - pts[k][1]) * r]);
        break;
      }
      setRoute(out);
      if (f < 1) routeAnim = requestAnimationFrame(frame);
      else if (done) done();
    };
    routeAnim = requestAnimationFrame(frame);
  }
  function drawRoute(animate) {
    cancelAnimationFrame(routeAnim);
    if (!course) { if (routeLine) { map.removeLayer(routeLine); routeLine = null; } return; }
    const pts = routePts();
    if (pts.length < 2) return;
    if (animate) { setRoute(pts.slice(0, 1)); animateRoute(pts, 0, pts.length - 1, 1800); }
    else setRoute(pts);
  }

  /* ---------- "Play my day": fly stop to stop, draw the route, and let the ElevenLabs voice introduce each place ---------- */
  function renderPlay() {
    els.play.hidden = !course;
    els.play.classList.toggle('is-on', !!tour);
    els.play.innerHTML = tour
      ? ICON.stop + '<span>' + esc(t('stop')) + '</span>'
      : ICON.play + '<span>' + esc(t('play')) + '</span><small>' + courseStops(course || { stops: [] }).length + '</small>';
  }

  function startTour() {
    if (!course) return;
    closeSheet();
    stopAudio();
    dismissHint();
    const stops = courseStops(course);
    const audio = new Audio();
    // iOS only lets a page play sound it started inside a tap. Start (muted) now, reuse the same element later.
    const first = stops.map((p) => p.id + '.note.' + lang + '.mp3').find((f) => audioFiles.has(f));
    if (first) {
      audio.muted = true;
      audio.src = 'audio/' + first;
      audio.play().then(() => audio.pause()).catch(() => {});
    }
    tour = { i: -1, stops, audio, timer: null };
    document.body.classList.add('is-touring');
    renderPlay();
    tourStep();
  }

  function tourTarget(p, z) {
    // Put the spot low enough that its bubble fits between the caption and the cards.
    const dy = Math.round((els.bottom.offsetHeight - els.top.offsetHeight - 12) / 2 - (p.illust ? (BUB.h + BUB.lift) / 2 : 0));
    return map.unproject(map.project([p.lat, p.lng], z).add(L.point(0, dy)), z);
  }

  function showCaption(html) {
    els.tourCap.innerHTML = html;
    els.tourCap.hidden = false;
    els.tourCap.classList.remove('is-in');
    void els.tourCap.offsetWidth;
    els.tourCap.classList.add('is-in');
  }

  function tourStep() {
    if (!tour) return;
    tour.i += 1;
    const { stops } = tour;
    if (tour.i >= stops.length) { endTour(); return; }
    const p = stops[tour.i];
    const file = p.id + '.note.' + lang + '.mp3';
    showCaption(
      '<div class="tour-cap__top"><span class="step">' + (tour.i + 1) + '</span>' +
        '<span class="tour-cap__count">' + (tour.i + 1) + ' / ' + stops.length + '</span>' +
        (audioFiles.has(file) ? '<span class="tour-cap__credit">' + esc(t('voiceCredit')) + '</span>' : '') + '</div>' +
      '<p class="tour-cap__name">' + esc(p.emoji || '') + ' ' + esc(loc(p.name)) + ' <span lang="ko">' + esc(p.name.ko) + '</span></p>' +
      '<p class="tour-cap__note">' + esc(loc(p.note) || loc(p.category)) + '</p>' +
      '<button type="button" class="tour-cap__next" data-tour="next">' + esc(t('nextStop')) + ICON.next + '</button>'
    );
    refreshMarkers();
    renderRail();
    const card = els.rail.querySelector('.card[data-id="' + CSS.escape(p.id) + '"]');
    if (card) card.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', inline: 'start', block: 'nearest' });

    const z = 16;
    const dur = reduceMotion ? 0 : (tour.i === 0 ? 1.4 : 1.8);
    const pts = routePts();
    const idx = pts.length - stops.length + tour.i;
    if (idx > 0) animateRoute(pts, idx - 1, idx, dur * 1000);
    if (reduceMotion) map.setView(tourTarget(p, z), z);
    else map.flyTo(tourTarget(p, z), z, { duration: dur });
    tour.timer = setTimeout(() => tourSpeak(p, file), dur * 1000 + 300);
  }

  function tourSpeak(p, file) {
    if (!tour) return;
    const next = (ms) => { if (tour) tour.timer = setTimeout(tourStep, ms); };
    if (!audioFiles.has(file)) { next(4500); return; }
    const a = tour.audio;
    a.onended = () => next(700);
    a.onerror = () => next(3000);
    a.muted = false;
    a.src = 'audio/' + file;
    a.play().catch(() => next(4500));
  }

  function endTour() {
    drawRoute(false);
    showCaption('<p class="tour-cap__name">' + esc(t('tourEnd', { area: loc(data.meta.area) })) + '</p>');
    refreshMarkers();
    fitAll();
    tour.timer = setTimeout(stopTour, 4000);
  }

  function stopTour() {
    if (!tour) return;
    clearTimeout(tour.timer);
    tour.audio.pause();
    tour.audio.onended = tour.audio.onerror = null;
    tour = null;
    document.body.classList.remove('is-touring');
    els.tourCap.hidden = true;
    renderPlay();
    refreshMarkers();
    renderRail();
    drawRoute(false);
    measure();
  }

  /* ---------- static UI ---------- */
  function bindUI() {
    document.querySelectorAll('.langs button').forEach((b) => {
      b.addEventListener('click', () => {
        stopTour();
        lang = b.dataset.lang;
        store.set('dc.lang', lang);
        applyLang();
      });
    });
    els.legend.addEventListener('click', () => { stopTour(); openInfo(); });
    els.why.addEventListener('click', () => { stopTour(); openInfo('why'); });
    els.hint.addEventListener('click', (e) => { if (e.target.closest('button')) dismissHint(); });
    els.play.addEventListener('click', () => { if (tour) stopTour(); else startTour(); });
    // Skip ahead: stop this stop's voice and fly straight to the next one.
    els.tourCap.addEventListener('click', (e) => {
      if (!tour || !e.target.closest('[data-tour="next"]')) return;
      clearTimeout(tour.timer);
      tour.audio.pause();
      tour.audio.onended = tour.audio.onerror = null;
      tourStep();
    });
    els.chips.addEventListener('click', (e) => {
      const b = e.target.closest('.chip');
      if (!b) return;
      stopTour();
      if (b.dataset.course) {
        course = (data.courses || []).find((c) => c.id === b.dataset.course) || null;
        tag = null;
      } else {
        course = null;
        tag = b.dataset.tag || null;
      }
      closeSheet();
      renderChips();
      renderRail();
      renderPlay();
      refreshMarkers();
      drawRoute(!!course);
      fitAll();
      els.rail.scrollTo({ left: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
    els.rail.addEventListener('click', (e) => {
      const b = e.target.closest('.card[data-id]');
      if (!b) return;
      const p = data.places.find((x) => x.id === b.dataset.id);
      if (p) openPlace(p);
    });
    els.sheet.addEventListener('click', onSheetClick);
    els.sign.addEventListener('click', closeSign);
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      if (!els.sign.hidden) closeSign();
      else closeSheet();
    });
    window.addEventListener('resize', () => measure());
  }

  function applyLang() {
    document.documentElement.lang = lang;
    document.querySelectorAll('.langs button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
    els.tagline.textContent = t('tagline', { area: loc(data.meta.area) });
    els.why.textContent = t('whyBtn');
    els.legend.innerHTML =
      '<span class="legend__item"><span class="swatch swatch--local"></span>' + esc(t('keyLocal')) + '</span>' +
      '<span class="legend__item"><span class="swatch swatch--mixed"></span>' + esc(t('keyMixed')) + '</span>' +
      '<span class="legend__item"><span class="swatch swatch--tourist"></span>' + esc(t('keyTourist')) + '</span>' +
      '<span class="legend__how">' + esc(t('howTo')) + '</span>';
    if (hereMarker) hereMarker.setIcon(hereIcon());
    renderHint();
    renderPlay();
    renderChips();
    renderRail();
    refreshMarkers();
    if (current === 'info') renderInfo();
    else if (current) renderPlace(current);
    if (!els.sign.hidden && current && current !== 'info') renderSign(current);
    measure();
  }

  /* First visit only: say what the pin number means before anyone has to find "How to read pins". */
  function renderHint() {
    if (store.get('dc.hint') === 'seen') { els.hint.hidden = true; return; }
    const top = visiblePlaces().find((p) => { const r = ratioOf(p); return r !== null && r !== Infinity; });
    const n = top ? ratioNum(ratioOf(top)) : String(data.meta.thresholds.local);
    els.hint.innerHTML = '<p><strong>×' + esc(n) + '</strong> ' + esc(t('hint', { n })) + '</p>' +
      '<button type="button">' + esc(t('gotIt')) + '</button>';
    els.hint.hidden = false;
  }
  function dismissHint() {
    if (els.hint.hidden) return;
    els.hint.hidden = true;
    store.set('dc.hint', 'seen');
    measure();
  }

  function walkHtml(p, cls, key) {
    const m = walkMin(p);
    if (m === null) return '';
    return '<span class="' + cls + '">' + ICON.walk + esc(t(key, { n: m, here: loc(here().name) })) + '</span>';
  }

  function renderChips() {
    const tags = data.tags || {};
    const used = new Set(data.places.flatMap((p) => p.tags || []));
    let html = '<button type="button" class="chip" data-tag="" aria-pressed="' + (tag === null && !course) + '">' + esc(t('all')) + '</button>';
    (data.courses || []).filter((c) => courseStops(c).length > 1).forEach((c) => {
      html += '<button type="button" class="chip chip--course" data-course="' + esc(c.id) + '" aria-pressed="' + (!!course && course.id === c.id) + '">' + ICON.route + esc(loc(c.name)) + '</button>';
    });
    Object.keys(tags).filter((k) => used.has(k)).forEach((k) => {
      html += '<button type="button" class="chip" data-tag="' + esc(k) + '" aria-pressed="' + (!course && tag === k) + '">' + esc(loc(tags[k])) + '</button>';
    });
    els.chips.innerHTML = html;
  }

  function thumb(p, cls) {
    if (p.photo || p.illust) return '<img class="' + cls + '" src="' + esc(p.photo || p.illust) + '" alt="" loading="lazy">';
    return '<span class="' + cls + '" lang="ko" aria-hidden="true">' + esc(p.emoji || firstHangul(p.name.ko)) + '</span>';
  }

  function renderRail() {
    const list = visiblePlaces();
    if (!list.length) {
      els.rail.innerHTML = '<div class="card card--empty">' + esc(t('emptyTag')) + '</div>';
      return;
    }
    const entries = course ? courseEntries(course) : null;
    let head = '';
    if (course) {
      const legs = list.map((_, i) => (entries[i].move ? null : courseLeg(list, i))).filter((m) => m !== null && m <= FAR_WALK);
      const total = legs.reduce((a, b) => a + b, 0);
      head = '<div class="card card--course">' +
        '<span class="card__name">' + ICON.route + esc(loc(course.name)) + '</span>' +
        (loc(course.blurb) ? '<span class="course__blurb">' + esc(loc(course.blurb)) + '</span>' : '') +
        '<span class="card__meta">' + esc(t('courseStats', { n: list.length, m: total })) +
          (here() ? ' · ' + esc(t('courseStart', { here: loc(here().name) })) : '') + '</span>' +
      '</div>';
    }
    els.rail.innerHTML = head + list.map((p, i) => {
      const r = ratioOf(p), tier = tierOf(r);
      const active = isActive(p) ? ' is-active' : '';
      const walk = course ? legHtml(entries, i, 'card__walk') : walkHtml(p, 'card__walk', 'walk');
      return '<button type="button" class="card' + active + '" data-id="' + esc(p.id) + '">' +
        (course ? '<span class="thumb-wrap">' + thumb(p, 'thumb') + '<span class="step">' + (i + 1) + '</span></span>' : thumb(p, 'thumb')) +
        '<span class="card__text">' +
          '<span class="card__name">' + esc(loc(p.name)) + '</span>' +
          '<span class="card__ko" lang="ko">' + esc(p.name.ko) + '</span>' +
          '<span class="card__meta"><span class="badge badge--' + tier + '">' + esc(ratioLabel(r)) + '</span>' +
            '<span class="card__tier">' + esc(t(tier)) + '</span>' + walk + '</span>' +
        '</span>' +
      '</button>';
    }).join('');
  }

  /* ---------- sheet ---------- */
  function openPlace(p) {
    stopTour();
    stopAudio();
    dismissHint();
    current = p;
    renderPlace(p);
    showSheet();
    refreshMarkers();
    renderRail();
    const card = els.rail.querySelector('.card[data-id="' + CSS.escape(p.id) + '"]');
    if (card) card.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', inline: 'start', block: 'nearest' });
    focusOn(p);
  }

  function focusOn(p) {
    const z = Math.max(map.getZoom(), 17);
    const wide = window.innerWidth >= 900;
    const offset = wide ? L.point(-220, 0) : L.point(0, Math.round(window.innerHeight * 0.28));
    const target = map.unproject(map.project([p.lat, p.lng], z).add(offset), z);
    if (reduceMotion) map.setView(target, z);
    else map.flyTo(target, z, { duration: 0.6 });
  }

  let infoMode = 'pins';     // the info sheet shows either how to read pins, or why the map exists
  function openInfo(mode) {
    stopAudio();
    infoMode = mode === 'why' ? 'why' : 'pins';
    current = 'info';
    renderInfo();
    showSheet();
    refreshMarkers();
    renderRail();
  }

  function showSheet() {
    clearTimeout(closeTimer);
    if (els.sheet.hidden) lastFocus = document.activeElement;
    els.sheet.hidden = false;
    els.sheet.scrollTop = 0;
    requestAnimationFrame(() => requestAnimationFrame(() => els.sheet.classList.add('is-open')));
    const btn = els.sheet.querySelector('.sheet__close');
    if (btn) setTimeout(() => btn.focus({ preventScroll: true }), reduceMotion ? 0 : 320);
  }

  function closeSheet() {
    if (els.sheet.hidden) return;
    stopAudio();
    els.sheet.classList.remove('is-open');
    current = null;
    refreshMarkers();
    renderRail();
    clearTimeout(closeTimer);
    closeTimer = setTimeout(() => { els.sheet.hidden = true; }, reduceMotion ? 0 : 330);
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus({ preventScroll: true });
  }

  function closeButton() {
    return '<div class="sheet__closebar"><button type="button" class="sheet__close" data-act="close" aria-label="' + esc(t('close')) + '">' + ICON.close + '</button></div>';
  }

  function audioButton(act, label, file) {
    const credit = audioFiles.has(file) ? '<span class="credit">' + esc(t('voiceCredit')) + '</span>' : '';
    return '<span><button type="button" class="btn" data-act="' + act + '" data-label="' + esc(label) + '" aria-pressed="false">' +
      ICON.play + '<span class="btn__label">' + esc(label) + '</span></button>' + credit + '</span>';
  }

  function renderPlace(p) {
    const r = ratioOf(p), tier = tierOf(r);
    const n = p.naverReviews || 0, g = p.googleReviews || 0;
    const max = Math.max(n, g, 1);
    const pct = (v) => Math.max(1, Math.round((v / max) * 100));
    const says = (p.koreansSay && (p.koreansSay[lang] || p.koreansSay.en)) || [];
    const order = p.order || null;
    const say = p.say || null;
    const tags = (p.tags || []).map((k) => '<li>' + esc(loc((data.tags || {})[k]) || k) + '</li>').join('');
    let ratioLine = t('ratioUnknown');
    if (r === Infinity) ratioLine = t('ratioOnlyLocal');
    else if (r !== null) ratioLine = t('ratioLine', { n: ratioNum(r) });
    const checked = p.countsCheckedOn || data.meta.countsCheckedOn;

    let html = closeButton();
    let media;
    if (p.photo) media = '<img class="sheet__photo" src="' + esc(p.photo) + '" alt="' + esc(loc(p.photoAlt) || loc(p.name)) + '">';
    else if (p.illust) media = '<img class="sheet__photo sheet__illust" src="' + esc(p.illust) + '" alt="">';
    else media = '<div class="sheet__placeholder" lang="ko" aria-hidden="true">' + esc(p.emoji || firstHangul(p.name.ko)) + '</div>';
    html += '<div class="sheet__media">' + media + '</div>';
    html += '<div class="sheet__body">';
    html += '<h2 class="sheet__name" id="sheetTitle">' + esc(loc(p.name)) + '</h2>';
    html += '<p class="sheet__ko" lang="ko">' + esc(p.name.ko) + '</p>';
    if (p.category) html += '<p class="sheet__cat">' + esc(loc(p.category)) + '</p>';
    const step = stepOf(p);
    const stops = step >= 0 ? courseStops(course) : null;
    if (step >= 0) {
      html += '<p class="sheet__step">' + ICON.route + esc(loc(course.name)) + ' · ' + esc(t('step', { i: step + 1, n: stops.length })) + '</p>';
    }
    const walk = walkHtml(p, 'sheet__walk', 'walkFrom');
    if (walk) html += '<p>' + walk + '</p>';
    if (tags) html += '<ul class="tags">' + tags + '</ul>';

    html += '<section class="block">' +
      '<h3 class="ratio__head"><span class="badge badge--' + tier + '">' + esc(ratioLabel(r)) + '</span>' + esc(t(tier)) + '</h3>' +
      '<p class="ratio__line">' + esc(ratioLine) + '</p>';
    if (r !== null) {
      html += '<div class="bars">' +
        '<div class="bars__row"><span class="bars__label">' + esc(t('koreanReviews')) + '<small>' + esc(t('onNaver')) + '</small></span>' +
          '<span class="bars__n">' + esc(num(n)) + '</span>' +
          '<span class="bars__track"><span class="bars__fill bars__fill--kr" style="width:' + pct(n) + '%"></span></span></div>' +
        '<div class="bars__row"><span class="bars__label">' + esc(t('travelerReviews')) + '<small>' + esc(t('onGoogle')) + '</small></span>' +
          '<span class="bars__n">' + esc(num(g)) + '</span>' +
          '<span class="bars__track"><span class="bars__fill bars__fill--tr" style="width:' + pct(g) + '%"></span></span></div>' +
      '</div>';
      if (checked) html += '<p class="fine">' + esc(t('checked', { date: checked })) + '</p>';
    }
    html += '</section>';

    if (says.length) {
      html += '<section class="block"><h3>' + esc(t('koreansSay')) + '</h3>' +
        '<ul class="says">' + says.map((s) => '<li>' + esc(s) + '</li>').join('') + '</ul>' +
        '<p class="fine">' + esc(t('koreansSayNote')) + ' <a href="' + esc(naverUrl(p)) + '" target="_blank" rel="noopener">' + esc(t('readOnNaver')) + '</a></p>' +
      '</section>';
    }

    if (loc(p.note)) {
      html += '<section class="block"><h3>' + esc(t('fromFriend')) + '</h3>' +
        '<p class="note">' + esc(loc(p.note)) + '</p>' +
        audioButton('note', t('listen'), p.id + '.note.' + lang + '.mp3') +
      '</section>';
    }

    if (order && order.ko) {
      html += '<section class="block"><h3>' + esc(t('order')) + '</h3>' +
        '<p class="order__ko" lang="ko">' + esc(order.ko) + '</p>' +
        (order.roman ? '<p class="order__roman">' + esc(order.roman) + '</p>' : '') +
        ((meaning(order) || order.price) ? '<p class="order__mean">' + esc(meaning(order)) + (meaning(order) && order.price ? ' · ' : '') + esc(order.price || '') + '</p>' : '') +
      '</section>';
    }

    if (say && say.ko) {
      html += '<section class="block"><h3>' + esc(t('sayThis')) + '</h3><div class="say__card">' +
        '<p class="say__ko" lang="ko">' + esc(say.ko) + '</p>' +
        (say.roman ? '<p class="say__roman">' + esc(say.roman) + '</p>' : '') +
        (meaning(say) ? '<p class="say__mean">' + esc(meaning(say)) + '</p>' : '') +
        '<div class="say__btns">' +
          audioButton('say', t('hearIt'), p.id + '.say.ko.mp3') +
          '<span><button type="button" class="btn btn--primary" data-act="sign">' + esc(t('showStaff')) + '</button></span>' +
        '</div>' +
      '</div></section>';
    }

    if (p.address) {
      html += '<section class="block"><h3>' + esc(t('address')) + '</h3>' +
        '<p class="addr" lang="ko">' + esc(p.address) + '</p>' +
        '<button type="button" class="btn" data-act="copy">' + ICON.copy + esc(t('copy')) + '</button>' +
        '<p class="fine">' + esc(t('addressHint')) + '</p>' +
      '</section>';
    }

    html += '<div class="links">' +
      '<a class="btn" href="' + esc(naverUrl(p)) + '" target="_blank" rel="noopener">' + ICON.out + esc(t('openNaver')) + '</a>' +
      '<a class="btn" href="' + esc(googleUrl(p)) + '" target="_blank" rel="noopener">' + ICON.out + esc(t('openGoogle')) + '</a>' +
    '</div>';
    if (stops && step < stops.length - 1) {
      const next = stops[step + 1];
      html += '<button type="button" class="next-stop" data-act="next">' +
        '<span class="next-stop__label">' + esc(t('nextStop')) + ' · ' + (step + 2) + '/' + stops.length + '</span>' +
        '<span class="next-stop__name">' + esc(loc(next.name)) + '</span>' +
        legHtml(courseEntries(course), step + 1, 'next-stop__leg') +
        ICON.next +
      '</button>';
    }
    html += '</div>';
    els.sheet.innerHTML = html;
  }

  function renderInfo() {
    if (infoMode === 'why') {
      els.sheet.innerHTML = closeButton() +
        '<div class="sheet__body info">' +
          '<h2 class="sheet__name" id="sheetTitle">' + esc(t('whyTitle')) + '</h2>' +
          '<section class="block">' +
            '<p>' + esc(t('why1')) + '</p>' +
            '<p>' + esc(t('why2')) + '</p>' +
            '<p>' + esc(t('why3')) + '</p>' +
            '<button type="button" class="btn" data-act="pins">' + esc(t('howTo')) + '</button>' +
          '</section>' +
        '</div>';
      return;
    }
    const th = data.meta.thresholds;
    els.sheet.innerHTML = closeButton() +
      '<div class="sheet__body info">' +
        '<h2 class="sheet__name" id="sheetTitle">' + esc(t('howTo')) + '</h2>' +
        '<section class="block">' +
          '<p>' + esc(t('info1')) + '</p>' +
          '<p>' + esc(t('info2')) + '</p>' +
          '<div class="legend-rows">' +
            '<div><span class="badge badge--local">×' + esc(th.local) + '</span>' + esc(t('local')) + ' (' + esc(t('infoLocal', th)) + ')</div>' +
            '<div><span class="badge badge--mixed">×' + esc(th.mixed) + '</span>' + esc(t('mixed')) + ' (' + esc(t('infoMixed', th)) + ')</div>' +
            '<div><span class="badge">×1</span>' + esc(t('tourist')) + ' (' + esc(t('infoTourist', th)) + ')</div>' +
          '</div>' +
          '<p>' + esc(t('info3')) + '</p>' +
          (data.meta.countsCheckedOn ? '<p class="fine">' + esc(t('checked', { date: data.meta.countsCheckedOn })) + '</p>' : '') +
        '</section>' +
      '</div>';
  }

  function onSheetClick(e) {
    const b = e.target.closest('[data-act]');
    if (current === 'info') {
      if (b && b.dataset.act === 'close') closeSheet();
      else if (b && b.dataset.act === 'pins') { infoMode = 'pins'; renderInfo(); els.sheet.scrollTop = 0; }
      return;
    }
    if (!b || !current) return;
    const p = current;
    switch (b.dataset.act) {
      case 'close': closeSheet(); break;
      case 'note': playClip(b, p.id + '.note.' + lang + '.mp3', loc(p.note), SPEECH[lang]); break;
      case 'say': playClip(b, p.id + '.say.ko.mp3', p.say.ko, SPEECH.ko); break;
      case 'sign': openSign(p, b); break;
      case 'copy': copyText(p.address); break;
      case 'next': {
        const stops = course ? courseStops(course) : [];
        const i = stops.findIndex((x) => x.id === p.id);
        if (i >= 0 && stops[i + 1]) openPlace(stops[i + 1]);
        break;
      }
    }
  }

  async function copyText(text) {
    let ok = false;
    try {
      await navigator.clipboard.writeText(text);
      ok = true;
    } catch (e) {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { ok = document.execCommand('copy'); } catch (e2) { ok = false; }
      ta.remove();
    }
    toast(ok ? t('copied') : t('copyFailed'));
  }

  /* ---------- audio ---------- */
  function setPlaying(btn, on) {
    btn.classList.toggle('is-playing', on);
    btn.setAttribute('aria-pressed', String(on));
    btn.innerHTML = (on ? ICON.stop : ICON.play) + '<span class="btn__label">' + esc(on ? t('stop') : btn.dataset.label) + '</span>';
  }

  function stopAudio() {
    if (!playing) return;
    if (playing.audio) playing.audio.pause();
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    if (document.contains(playing.btn)) setPlaying(playing.btn, false);
    playing = null;
  }

  function finish(state) {
    if (playing !== state) return;
    if (document.contains(state.btn)) setPlaying(state.btn, false);
    playing = null;
  }

  function playClip(btn, file, text, speechLang) {
    if (playing && playing.btn === btn) { stopAudio(); return; }
    stopAudio();
    const state = { btn, audio: null };
    playing = state;
    setPlaying(btn, true);

    if (audioFiles.has(file)) {
      state.audio = new Audio('audio/' + file);
      state.audio.addEventListener('ended', () => finish(state));
      state.audio.addEventListener('error', () => { finish(state); toast(t('noAudio')); });
      state.audio.play().catch(() => { finish(state); toast(t('noAudio')); });
      return;
    }
    if (!('speechSynthesis' in window) || !text) { finish(state); toast(t('noAudio')); return; }
    const u = new SpeechSynthesisUtterance(text);
    u.lang = speechLang;
    u.rate = speechLang === 'ko-KR' ? 0.85 : 1;
    u.onend = () => finish(state);
    u.onerror = () => finish(state);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  }

  /* ---------- show-to-staff sign ---------- */
  let signReturn = null;
  function renderSign(p) {
    els.sign.innerHTML =
      '<span class="sign__ko" lang="ko">' + esc(p.say.ko) + '</span>' +
      (p.say.roman ? '<span class="sign__roman">' + esc(p.say.roman) + '</span>' : '') +
      (meaning(p.say) ? '<span class="sign__mean">' + esc(meaning(p.say)) + '</span>' : '') +
      '<span class="sign__hint">' + esc(t('tapToClose')) + '</span>';
    els.sign.setAttribute('aria-label', t('close'));
  }
  function openSign(p, from) {
    stopAudio();
    signReturn = from;
    renderSign(p);
    els.sign.hidden = false;
    els.sign.focus({ preventScroll: true });
  }
  function closeSign() {
    els.sign.hidden = true;
    if (signReturn && document.contains(signReturn)) signReturn.focus({ preventScroll: true });
  }

  init();
})();
