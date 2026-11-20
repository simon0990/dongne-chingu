/* 동네친구 / Dongne Chingu
   Data: data/places.json. Audio: audio/manifest.json lists the mp3 files made by tools/make_audio.py.
   A clip that is not in the manifest falls back to the browser's own speech voice. */
(() => {
  'use strict';

  const LANGS = ['en', 'ja', 'zh'];
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
      loadError: 'The places didn’t load.'
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
      loadError: '場所を読み込めませんでした。'
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
      loadError: '地点加载失败。'
    }
  };

  const ICON = {
    play: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2.5v11l9-5.5z" fill="currentColor"/></svg>',
    stop: '<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="3.5" y="3.5" width="9" height="9" rx="1.5" fill="currentColor"/></svg>',
    close: '<svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true"><path d="M5 5l10 10M15 5L5 15" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>',
    out: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M9 3h4v4M13 3L7.5 8.5M11 9.5V13H3V5h3.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    copy: '<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="5.5" y="5.5" width="8" height="8" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M10.5 3.5V3A1.5 1.5 0 0 0 9 1.5H4A1.5 1.5 0 0 0 2.5 3v5A1.5 1.5 0 0 0 4 9.5h.5" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>'
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
    makerNote: $('#makerNote'), chips: $('#chips'), rail: $('#rail'),
    sheet: $('#sheet'), sign: $('#sign'), toast: $('#toast')
  };

  let data = null;
  let lang = pickLang();
  let tag = null;
  let map = null;
  let current = null;        // place shown in the sheet, or 'info'
  let lastFocus = null;
  let closeTimer = null;
  let playing = null;
  let audioFiles = new Set();
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
  function httpUrl(u) { return typeof u === 'string' && /^https?:\/\//i.test(u) ? u : ''; }
  function naverUrl(p) {
    return httpUrl(p.links && p.links.naver) || 'https://map.naver.com/p/search/' + encodeURIComponent(p.name.ko);
  }
  function googleUrl(p) {
    return httpUrl(p.links && p.links.google) || 'https://www.google.com/maps/search/?api=1&query=' + Number(p.lat) + ',' + Number(p.lng);
  }
  function visiblePlaces() {
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
    buildMap();
    bindUI();
    applyLang();
    fitAll();
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
    map.on('click', () => closeSheet());

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
    map.fitBounds(L.latLngBounds(list.map((p) => [p.lat, p.lng])), {
      paddingTopLeft: [40, pad.top],
      paddingBottomRight: [40, pad.bottom],
      maxZoom: 17,
      animate: !reduceMotion
    });
  }

  function pinIcon(p) {
    const r = ratioOf(p);
    const active = current && current !== 'info' && current.id === p.id ? ' is-active' : '';
    return L.divIcon({
      className: 'pin-wrap',
      iconSize: null,
      html: '<span class="pin pin--' + tierOf(r) + active + '">' + esc(ratioLabel(r)) + '</span>'
    });
  }

  function refreshMarkers() {
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

  /* ---------- static UI ---------- */
  function bindUI() {
    document.querySelectorAll('.langs button').forEach((b) => {
      b.addEventListener('click', () => {
        lang = b.dataset.lang;
        store.set('dc.lang', lang);
        applyLang();
      });
    });
    els.legend.addEventListener('click', openInfo);
    els.chips.addEventListener('click', (e) => {
      const b = e.target.closest('.chip');
      if (!b) return;
      tag = b.dataset.tag || null;
      renderChips();
      renderRail();
      refreshMarkers();
      fitAll();
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
    els.legend.innerHTML =
      '<span class="legend__item"><span class="swatch swatch--local"></span>' + esc(t('keyLocal')) + '</span>' +
      '<span class="legend__item"><span class="swatch swatch--mixed"></span>' + esc(t('keyMixed')) + '</span>' +
      '<span class="legend__item"><span class="swatch swatch--tourist"></span>' + esc(t('keyTourist')) + '</span>' +
      '<span class="legend__how">' + esc(t('howTo')) + '</span>';
    renderChips();
    renderRail();
    refreshMarkers();
    if (current === 'info') renderInfo();
    else if (current) renderPlace(current);
    if (!els.sign.hidden && current && current !== 'info') renderSign(current);
    measure();
  }

  function renderChips() {
    const tags = data.tags || {};
    const used = new Set(data.places.flatMap((p) => p.tags || []));
    let html = '<button type="button" class="chip" data-tag="" aria-pressed="' + (tag === null) + '">' + esc(t('all')) + '</button>';
    Object.keys(tags).filter((k) => used.has(k)).forEach((k) => {
      html += '<button type="button" class="chip" data-tag="' + esc(k) + '" aria-pressed="' + (tag === k) + '">' + esc(loc(tags[k])) + '</button>';
    });
    els.chips.innerHTML = html;
  }

  function thumb(p, cls) {
    if (p.photo) return '<img class="' + cls + '" src="' + esc(p.photo) + '" alt="" loading="lazy">';
    return '<span class="' + cls + '" lang="ko" aria-hidden="true">' + esc(firstHangul(p.name.ko)) + '</span>';
  }

  function renderRail() {
    const list = visiblePlaces();
    if (!list.length) {
      els.rail.innerHTML = '<div class="card card--empty">' + esc(t('emptyTag')) + '</div>';
      return;
    }
    els.rail.innerHTML = list.map((p) => {
      const r = ratioOf(p), tier = tierOf(r);
      const active = current && current !== 'info' && current.id === p.id ? ' is-active' : '';
      return '<button type="button" class="card' + active + '" data-id="' + esc(p.id) + '">' +
        thumb(p, 'thumb') +
        '<span class="card__text">' +
          '<span class="card__name">' + esc(loc(p.name)) + '</span>' +
          '<span class="card__ko" lang="ko">' + esc(p.name.ko) + '</span>' +
          '<span class="card__meta"><span class="badge badge--' + tier + '">' + esc(ratioLabel(r)) + '</span>' + esc(t(tier)) + '</span>' +
        '</span>' +
      '</button>';
    }).join('');
  }

  /* ---------- sheet ---------- */
  function openPlace(p) {
    stopAudio();
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

  function openInfo() {
    stopAudio();
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
    html += '<div class="sheet__media">' + (p.photo
      ? '<img class="sheet__photo" src="' + esc(p.photo) + '" alt="' + esc(loc(p.photoAlt) || loc(p.name)) + '">'
      : '<div class="sheet__placeholder" lang="ko" aria-hidden="true">' + esc(firstHangul(p.name.ko)) + '</div>') + '</div>';
    html += '<div class="sheet__body">';
    html += '<h2 class="sheet__name" id="sheetTitle">' + esc(loc(p.name)) + '</h2>';
    html += '<p class="sheet__ko" lang="ko">' + esc(p.name.ko) + '</p>';
    if (p.category) html += '<p class="sheet__cat">' + esc(loc(p.category)) + '</p>';
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
        '<p class="order__mean">' + esc(loc(order)) + (order.price ? ' · ' + esc(order.price) : '') + '</p>' +
      '</section>';
    }

    if (say && say.ko) {
      html += '<section class="block"><h3>' + esc(t('sayThis')) + '</h3><div class="say__card">' +
        '<p class="say__ko" lang="ko">' + esc(say.ko) + '</p>' +
        (say.roman ? '<p class="say__roman">' + esc(say.roman) + '</p>' : '') +
        '<p class="say__mean">' + esc(loc(say)) + '</p>' +
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
    html += '</div>';
    els.sheet.innerHTML = html;
  }

  function renderInfo() {
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
    if (!b || !current || (current === 'info' && b.dataset.act !== 'close')) {
      if (b && b.dataset.act === 'close') closeSheet();
      return;
    }
    const p = current;
    switch (b.dataset.act) {
      case 'close': closeSheet(); break;
      case 'note': playClip(b, p.id + '.note.' + lang + '.mp3', loc(p.note), SPEECH[lang]); break;
      case 'say': playClip(b, p.id + '.say.ko.mp3', p.say.ko, SPEECH.ko); break;
      case 'sign': openSign(p, b); break;
      case 'copy': copyText(p.address); break;
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
      '<span class="sign__mean">' + esc(loc(p.say)) + '</span>' +
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
