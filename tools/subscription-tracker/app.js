/* 订阅清单 v2 · MIT License · 纯前端，无网络请求，数据只存 localStorage */
(function () {
  'use strict';
  var C = window.SubCalc, KEY = 'dlh-subscription-tracker-v1', LKEY = 'dlh-subscription-tracker-lang';
  var CURS = ['CNY', 'USD', 'HKD', 'TWD', 'EUR', 'GBP', 'JPY', 'SGD', 'AUD', 'CAD'];
  var ICON = {
    video: '<path d="M8 5.5v13l10-6.5z" fill="currentColor"/>',
    music: '<path d="M9 18V6l10-2v12" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="6.5" cy="18" r="2.6" fill="currentColor"/><circle cx="16.5" cy="16" r="2.6" fill="currentColor"/>',
    cloud: '<path d="M7 18h10a4 4 0 0 0 .6-8A6 6 0 0 0 6 9.5 4.3 4.3 0 0 0 7 18z" fill="currentColor"/>',
    software: '<rect x="4" y="4" width="7" height="7" rx="2" fill="currentColor"/><rect x="13" y="4" width="7" height="7" rx="2" fill="currentColor"/><rect x="4" y="13" width="7" height="7" rx="2" fill="currentColor"/><rect x="13" y="13" width="7" height="7" rx="2" fill="currentColor" opacity=".55"/>',
    learning: '<path d="M4 5.5C6.5 4.5 9.5 4.5 12 6.5c2.5-2 5.5-2 8-1v13c-2.5-1-5.5-1-8 1-2.5-2-5.5-2-8-1z" fill="currentColor"/>',
    other: '<path d="M3.5 12.2V5a1.5 1.5 0 0 1 1.5-1.5h7.2L20.5 12 12 20.5z" fill="currentColor"/><circle cx="8" cy="8" r="1.7" fill="#fff"/>'
  };
  var T = {
    zh: {
      tSubs: '订阅', tStats: '统计', tCal: '日历', tSet: '设置', all: '全部订阅', swipeHint: '左滑或长按可编辑、删除，点一下也能编辑',
      emptyT: '还没有订阅', emptyP: '把视频、音乐、网盘、软件会员记下来，自动算出每月和每年花多少，快扣费时提醒你。',
      addFirst: '添加第一个订阅', addSample: '一键添加示例', statsEy: '按月均折算', avgM: '月均花费', sumY: '一年合计', byCat: '分类占比',
      next12: '未来 12 个月扣费', estimate: '按扣费日预估', statsHint: '不同币种分开统计，不做汇率换算。季付 ÷ 3、年付 ÷ 12 折成月均。',
      calEy: '扣费日', setEy: '数据只在本机', language: '语言', remind: '提醒与备份', ics: '导出日历提醒 (.ics)',
      icsHint: '每个订阅按周期重复，扣费前 3 天上午 9 点提醒；用手机或电脑自带日历打开导入', exp: '导出备份 (JSON)', expHint: '换手机或清浏览器数据前先导出',
      imp: '导入备份', impHint: '和现有清单合并，同一条以备份为准', app: '应用', install: '添加到主屏幕', clear: '清空全部数据', privacy: '隐私说明',
      privacyP: ['数据只保存在你这台设备的浏览器里（localStorage）。没有服务器、不注册、不上传，也没有任何统计或广告代码。',
        '换手机、换浏览器或清除浏览器数据前，请先在上面“导出备份”，到新设备再“导入备份”。',
        'iPhone 的 Safari 可能会清掉长期（约 7 天以上）没打开过的网站数据；添加到主屏幕后打开更稳，但仍建议定期导出备份。',
        'App 不能主动推送通知，扣费提醒靠导入手机日历的 .ics 文件。'],
      footer: '订阅清单 v2 · 开源 MIT · 无广告无统计', source: '查看源码',
      cancel: '取消', save: '保存', add: '添加订阅', edit: '编辑订阅', name: '名称', namePh: '例如：视频会员、网盘、健身房', category: '分类',
      amount: '金额', cycle: '扣费周期', month: '每月', quarter: '每季度', year: '每年', next: '下次扣费日', note: '备注（可选）', notePh: '例如：哪个账号、怎么取消', del: '删除订阅',
      c_video: '影音', c_music: '音乐', c_cloud: '云盘', c_software: '软件', c_learning: '学习', c_other: '其他',
      dueMonth: '本月应付', yearTotal: '一年合计', perMonthAvg: '月均', subsN: '{n} 个订阅', soonN: '{n} 个 7 天内扣费', noneSoon: '7 天内无扣费',
      today: '今天扣费', tomorrow: '明天扣费', inDays: '{n} 天后扣费', nextOn: '{d} 扣费', perM: '/月', perQ: '/季', perY: '/年',
      editA: '编辑', delA: '删除', delQ: '删除“{n}”？', clearQ: '清空全部订阅？建议先导出备份。', clearA: '清空', cancelA: '取消',
      deleted: '已删除“{n}”', undo: '撤销', saved: '已保存', added: '已添加', cleared: '已清空', sampled: '已添加 {n} 个示例',
      e_name: '请填写名称（60 字以内）', e_amount: '请填写大于 0 的金额', e_next: '请选择下次扣费日', e_currency: '币种不正确', e_cycle: '请选择扣费周期', e_category: '分类不正确', e_note: '备注最多 120 字',
      noData: '清单是空的，先添加订阅', icsDone: '已导出 {n} 条日历提醒', jsonDone: '已导出 {n} 条备份',
      impDone: '已导入 {n} 条', impSkip: '，跳过 {n} 条格式不对的', impErr: '导入失败：不是本工具导出的备份文件', saveErr: '浏览器不允许保存（可能是无痕模式），刷新后数据会丢失',
      prevM: '折合每月', prevY: '每年', calCharges: '{m}扣费', calDay: '{d} 扣费', noCharge: '这段时间没有扣费', countN: '{n} 笔',
      installIOS: 'Safari 里点“分享”→“添加到主屏幕”', installOK: '已安装，可从主屏幕打开', installGo: '点这里安装，像 App 一样离线使用', installOther: '在浏览器菜单里选“安装应用”或“添加到主屏幕”',
      noStats: '添加订阅后这里会显示统计', wd: ['一', '二', '三', '四', '五', '六', '日'], monFirst: true,
      sample: [['视频会员', 'video', 25, 'CNY', 'month', 6], ['音乐会员', 'music', 45, 'CNY', 'quarter', 20], ['网盘 2TB', 'cloud', 298, 'CNY', 'year', 75],
        ['写作助手会员', 'software', 20, 'USD', 'month', 3], ['外语学习', 'learning', 198, 'CNY', 'year', 140], ['健身房', 'other', 199, 'CNY', 'month', 12]]
    },
    en: {
      tSubs: 'Subscriptions', tStats: 'Insights', tCal: 'Calendar', tSet: 'Settings', all: 'All subscriptions', swipeHint: 'Swipe left or long-press to edit or delete. Tap to edit.',
      emptyT: 'No subscriptions yet', emptyP: 'Add your streaming, music, cloud storage and app plans. See what they cost each month and year, and get reminded before renewals.',
      addFirst: 'Add your first one', addSample: 'Add sample data', statsEy: 'Monthly averages', avgM: 'Monthly average', sumY: 'Per year', byCat: 'By category',
      next12: 'Next 12 months', estimate: 'by charge date', statsHint: 'Each currency is counted separately; no exchange rates. Quarterly ÷ 3, yearly ÷ 12.',
      calEy: 'Charge dates', setEy: 'Data stays on this device', language: 'Language', remind: 'Reminders & backup', ics: 'Export calendar (.ics)',
      icsHint: 'Repeats on each cycle with an alert at 9 AM, 3 days before. Open it with your calendar app.', exp: 'Export backup (JSON)', expHint: 'Do this before switching devices or clearing data',
      imp: 'Import backup', impHint: 'Merges with your list; the backup wins for the same entry', app: 'App', install: 'Add to Home Screen', clear: 'Delete all data', privacy: 'Privacy',
      privacyP: ['Your data stays only in this browser on this device (localStorage). No server, no account, no uploads, no analytics or ads.',
        'Before switching phones or browsers, or clearing browser data, use Export backup above, then Import backup on the new device.',
        'Safari on iPhone may delete data for sites you have not opened in a while (about 7 days). Opening it from the Home Screen helps, but keep exporting backups.',
        'The app cannot send push notifications. Renewal alerts come from the .ics file you import into your calendar.'],
      footer: 'Subscription Tracker v2 · MIT open source · no ads, no tracking', source: 'View source',
      cancel: 'Cancel', save: 'Save', add: 'New subscription', edit: 'Edit subscription', name: 'Name', namePh: 'e.g. Video streaming, Cloud storage, Gym', category: 'Category',
      amount: 'Amount', cycle: 'Billing cycle', month: 'Monthly', quarter: 'Quarterly', year: 'Yearly', next: 'Next charge date', note: 'Note (optional)', notePh: 'e.g. which account, how to cancel', del: 'Delete subscription',
      c_video: 'Video', c_music: 'Music', c_cloud: 'Cloud', c_software: 'Software', c_learning: 'Learning', c_other: 'Other',
      dueMonth: 'Due this month', yearTotal: 'Per year', perMonthAvg: 'Monthly avg', subsN: '{n} subscriptions', soonN: '{n} due within 7 days', noneSoon: 'Nothing due in 7 days',
      today: 'Due today', tomorrow: 'Due tomorrow', inDays: 'Due in {n} days', nextOn: 'Next {d}', perM: '/mo', perQ: '/qtr', perY: '/yr',
      editA: 'Edit', delA: 'Delete', delQ: 'Delete "{n}"?', clearQ: 'Delete all subscriptions? Export a backup first.', clearA: 'Delete all', cancelA: 'Cancel',
      deleted: 'Deleted "{n}"', undo: 'Undo', saved: 'Saved', added: 'Added', cleared: 'All data deleted', sampled: 'Added {n} samples',
      e_name: 'Enter a name (max 60 characters)', e_amount: 'Enter an amount greater than 0', e_next: 'Pick the next charge date', e_currency: 'Invalid currency', e_cycle: 'Pick a billing cycle', e_category: 'Invalid category', e_note: 'Note is limited to 120 characters',
      noData: 'The list is empty. Add a subscription first.', icsDone: 'Exported {n} calendar reminders', jsonDone: 'Exported {n} entries',
      impDone: 'Imported {n}', impSkip: ', skipped {n} invalid', impErr: 'Import failed: not a backup from this app', saveErr: 'This browser blocks storage (private mode?); data will be lost on reload',
      prevM: 'Per month', prevY: 'Per year', calCharges: 'Charges in {m}', calDay: 'Charges on {d}', noCharge: 'No charges in this period', countN: '{n} charges',
      installIOS: 'In Safari tap Share, then Add to Home Screen', installOK: 'Installed. Open it from your Home Screen', installGo: 'Tap to install and use it offline like an app', installOther: 'Use your browser menu: Install app / Add to Home Screen',
      noStats: 'Add subscriptions to see insights', wd: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], monFirst: false,
      sample: [['Video streaming', 'video', 15.49, 'USD', 'month', 6], ['Music', 'music', 10.99, 'USD', 'month', 20], ['Cloud storage 2TB', 'cloud', 99.99, 'USD', 'year', 75],
        ['Writing assistant', 'software', 20, 'USD', 'month', 3], ['Language course', 'learning', 59.99, 'USD', 'year', 140], ['Gym', 'other', 45, 'USD', 'quarter', 12]]
    }
  };
  var $ = function (id) { return document.getElementById(id); };
  var lang = 'zh';
  try { lang = localStorage.getItem(LKEY) || (/^zh/i.test(navigator.language || 'zh') ? 'zh' : 'en'); } catch (e) {}
  if (!T[lang]) lang = 'zh';
  function t(k, v) { var s = T[lang][k]; if (s == null) s = k; if (v) Object.keys(v).forEach(function (x) { s = String(s).replace('{' + x + '}', v[x]); }); return s; }
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function svgIcon(cat) { var s = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); s.setAttribute('viewBox', '0 0 24 24'); s.innerHTML = ICON[cat] || ICON.other; return s; }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function todayStr() { var d = new Date(); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function addDays(str, n) { var p = C.parseDate(str); var d = new Date(Date.UTC(p.y, p.m - 1, p.d + n)); return d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1) + '-' + pad(d.getUTCDate()); }
  function money(n, cur, compact) {
    try { return new Intl.NumberFormat(lang === 'zh' ? 'zh-CN' : 'en-US', { style: 'currency', currency: cur, minimumFractionDigits: compact && n % 1 === 0 ? 0 : (cur === 'JPY' ? 0 : 2), maximumFractionDigits: cur === 'JPY' ? 0 : 2 }).format(n); }
    catch (e) { return (+n).toFixed(2) + ' ' + cur; }
  }
  function shortDate(str) { var p = C.parseDate(str); if (!p) return str; return lang === 'zh' ? (p.m + '月' + p.d + '日') : new Date(Date.UTC(p.y, p.m - 1, p.d)).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }); }
  function monthName(y, m, withYear) { return lang === 'zh' ? ((withYear ? y + '年' : '') + m + '月') : new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString('en-US', { month: withYear ? 'long' : 'short', year: withYear ? 'numeric' : undefined, timeZone: 'UTC' }); }

  var subs = [];
  try { var raw = localStorage.getItem(KEY); if (raw) { var p0 = C.parseBackup(raw); if (p0.ok) subs = p0.items; } } catch (e) {}
  function persist() {
    try { localStorage.setItem(KEY, C.makeBackup(subs, new Date().toISOString())); return true; }
    catch (e) { toast(t('saveErr')); return false; }
  }

  // ---------- toast ----------
  var toastTimer;
  function toast(msg, actLabel, act) {
    $('toastMsg').textContent = msg;
    var b = $('toastAct'); b.hidden = !actLabel; b.textContent = actLabel || ''; b.onclick = function () { hideToast(); if (act) act(); };
    $('toast').classList.add('on'); clearTimeout(toastTimer); toastTimer = setTimeout(hideToast, actLabel ? 5000 : 2600);
  }
  function hideToast() { $('toast').classList.remove('on'); }

  // ---------- tabs ----------
  var view = 'subs';
  function show(v) {
    view = v;
    document.querySelectorAll('.view').forEach(function (s) { s.classList.toggle('on', s.id === 'v-' + v); });
    document.querySelectorAll('.tab').forEach(function (b) { var on = b.getAttribute('data-v') === v; b.classList.toggle('on', on); b.setAttribute('aria-current', on ? 'page' : 'false'); });
    $('fab').classList.toggle('hide', v === 'set');
    renderView();
  }
  $('tabbar').addEventListener('click', function (e) { var b = e.target.closest('.tab'); if (b) show(b.getAttribute('data-v')); });

  // ---------- render: subscriptions ----------
  function enriched(today) {
    return subs.map(function (s) { var nx = C.nextCharge(s.next, s.cycle, today); return { s: s, nx: nx, dd: C.daysUntil(nx, today) }; });
  }
  function rowFor(s, nx, dd) {
    var li = el('li', 'row cat-' + (s.category || 'other') + (dd >= 0 && dd <= 7 ? ' soon' : '')); li.setAttribute('data-id', s.id);
    var acts = el('div', 'acts');
    var be = el('button', 'ed', t('editA')); be.type = 'button'; be.onclick = function (e) { e.stopPropagation(); closeSwipes(); openSheet(s.id); };
    var bd = el('button', 'rm', t('delA')); bd.type = 'button'; bd.onclick = function (e) { e.stopPropagation(); removeSub(s.id); };
    acts.appendChild(be); acts.appendChild(bd);
    var inn = el('div', 'rowin');
    var av = el('div', 'av', Array.from(s.name.trim())[0].toUpperCase()); av.setAttribute('aria-hidden', 'true');
    var mid = el('div', 'mid'); mid.appendChild(el('div', 'nm', s.name));
    var sub = el('div', 'sub'); sub.appendChild(el('span', 'dot')); sub.appendChild(document.createTextNode(t('c_' + (s.category || 'other')) + ' · ' + t('nextOn', { d: shortDate(nx) })));
    mid.appendChild(sub);
    if (dd >= 0 && dd <= 7) mid.appendChild(el('span', 'pill', dd === 0 ? t('today') : dd === 1 ? t('tomorrow') : t('inDays', { n: dd })));
    var rt = el('div', 'rt'); var b = el('b', null, money(s.amount, s.currency)); b.setAttribute('data-amt', s.id); rt.appendChild(b);
    rt.appendChild(el('small', null, t(s.cycle)));
    inn.appendChild(av); inn.appendChild(mid); inn.appendChild(rt);
    li.appendChild(acts); li.appendChild(inn);
    bindSwipe(li, inn, s.id);
    return li;
  }
  function renderSubs() {
    var today = todayStr(), p = C.parseDate(today);
    $('todayLbl').textContent = lang === 'zh' ? (p.m + '月' + p.d + '日 · 星期' + '日一二三四五六'[new Date().getDay()]) : new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    var empty = !subs.length;
    $('empty').hidden = !empty; $('listWrap').hidden = empty; $('hero').hidden = empty;
    if (empty) { $('list').textContent = ''; return; }
    var due = C.monthCharges(subs, p.y, p.m).byCurrency, tots = C.totals(subs);
    var main = tots[0].currency, hero = $('hero'); hero.textContent = '';
    hero.appendChild(el('div', 'lbl', t('dueMonth') + ' · ' + monthName(p.y, p.m, false)));
    var big = el('div', 'big', money(due[main] || 0, main)); big.setAttribute('data-due', main); hero.appendChild(big);
    var row = el('div', 'row');
    var c1 = el('div', 'cell'); c1.appendChild(el('span', null, t('yearTotal'))); var yb = el('b', null, money(tots[0].yearly, main)); yb.setAttribute('data-total-y', main); c1.appendChild(yb);
    var c2 = el('div', 'cell'); c2.appendChild(el('span', null, t('perMonthAvg'))); var mb = el('b', null, money(tots[0].monthly, main)); mb.setAttribute('data-total-m', main); c2.appendChild(mb);
    row.appendChild(c1); row.appendChild(c2); hero.appendChild(row);
    var en = enriched(today), soon = en.filter(function (x) { return x.dd >= 0 && x.dd <= 7; }).length;
    var more = el('div', 'more');
    more.appendChild(el('span', null, t('subsN', { n: subs.length })));
    more.appendChild(el('span', null, soon ? t('soonN', { n: soon }) : t('noneSoon')));
    tots.slice(1).forEach(function (o) {
      var sp = el('span', null, o.currency + ' · ' + t('dueMonth') + ' ' + money(due[o.currency] || 0, o.currency) + ' · ' + t('yearTotal') + ' ' + money(o.yearly, o.currency));
      sp.setAttribute('data-total-y', o.currency); sp.setAttribute('data-y', o.yearly); more.appendChild(sp);
    });
    hero.appendChild(more);
    // 排序：先按下次扣费日，再按金额
    en.sort(function (a, b) { return a.dd - b.dd || C.monthly(b.s.amount, b.s.cycle) - C.monthly(a.s.amount, a.s.cycle); });
    var list = $('list'); list.textContent = '';
    en.forEach(function (x) { list.appendChild(rowFor(x.s, x.nx, x.dd)); });
    $('listMeta').textContent = lang === 'zh' ? '按扣费日排序' : 'by next charge';
  }

  // ---------- swipe / long press ----------
  var openRow = null;
  function closeSwipes() { if (openRow) { openRow.querySelector('.rowin').style.transform = ''; openRow = null; } }
  function bindSwipe(li, inn, id) {
    var sx = 0, sy = 0, dx = 0, base = 0, active = false, moved = false, lp = null, longed = false;
    inn.addEventListener('pointerdown', function (e) {
      if (e.button) return;
      if (openRow && openRow !== li) closeSwipes();
      sx = e.clientX; sy = e.clientY; dx = 0; moved = false; longed = false; active = true;
      base = openRow === li ? -152 : 0;
      clearTimeout(lp); lp = setTimeout(function () { if (!moved) { longed = true; active = false; if (navigator.vibrate) try { navigator.vibrate(10); } catch (er) {} actionSheet(id); } }, 480);
    });
    inn.addEventListener('pointermove', function (e) {
      if (!active) return;
      var mx = e.clientX - sx, my = e.clientY - sy;
      if (!moved && Math.abs(mx) < 8 && Math.abs(my) < 8) return;
      clearTimeout(lp);
      if (!moved) { if (Math.abs(my) > Math.abs(mx)) { active = false; return; } moved = true; li.classList.add('drag'); try { inn.setPointerCapture(e.pointerId); } catch (er) {} }
      dx = Math.max(-190, Math.min(0, base + mx)); inn.style.transform = 'translateX(' + dx + 'px)';
    });
    function end() {
      clearTimeout(lp); if (!active && !moved) return; active = false; li.classList.remove('drag');
      if (moved) { if (dx < -60) { inn.style.transform = 'translateX(-152px)'; openRow = li; } else { inn.style.transform = ''; if (openRow === li) openRow = null; } }
    }
    inn.addEventListener('pointerup', end); inn.addEventListener('pointercancel', end);
    inn.addEventListener('contextmenu', function (e) { e.preventDefault(); });
    inn.addEventListener('click', function () {
      if (moved || longed) { moved = false; return; }
      if (openRow === li) { closeSwipes(); return; }
      if (openRow) { closeSwipes(); return; }
      openSheet(id);
    });
  }
  document.addEventListener('pointerdown', function (e) { if (openRow && !openRow.contains(e.target)) closeSwipes(); }, true);

  function actionSheet(id) {
    var s = subs.filter(function (x) { return x.id === id; })[0]; if (!s) return;
    sheetOpts(s.name + ' · ' + money(s.amount, s.currency), [
      { label: t('editA'), fn: function () { openSheet(id); } },
      { label: t('delA'), red: true, fn: function () { removeSub(id); } }
    ]);
  }
  function sheetOpts(title, opts) {
    var a = $('asheet'); a.textContent = '';
    var g = el('div', 'og'); if (title) g.appendChild(el('div', 'ttl', title));
    opts.forEach(function (o) { var b = el('button', 'opt' + (o.red ? ' red' : ''), o.label); b.type = 'button'; b.onclick = function () { closeAll(); setTimeout(o.fn, 60); }; g.appendChild(b); });
    a.appendChild(g);
    var c = el('button', 'opt cancel', t('cancelA')); c.type = 'button'; c.onclick = closeAll; a.appendChild(c);
    open(a);
  }
  function removeSub(id) {
    closeSwipes();
    var idx = subs.findIndex(function (x) { return x.id === id; }); if (idx < 0) return;
    var gone = subs[idx]; subs.splice(idx, 1); persist(); renderView();
    toast(t('deleted', { n: gone.name }), t('undo'), function () { subs.splice(Math.min(idx, subs.length), 0, gone); persist(); renderView(); });
  }

  // ---------- sheets ----------
  var current = null;
  function open(node) { closeSwipes(); hideToast(); current = node; $('backdrop').classList.add('on'); node.classList.add('on'); }
  function closeAll() { document.querySelectorAll('.sheet.on').forEach(function (n) { n.classList.remove('on'); }); $('backdrop').classList.remove('on'); current = null; if (document.activeElement) document.activeElement.blur(); }
  $('backdrop').onclick = closeAll;
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && current) closeAll(); });

  var fCat = 'video', fCyc = 'month';
  function buildCats() {
    var box = $('fCats'); box.textContent = '';
    C.CATS.forEach(function (c) {
      var b = el('button', 'cat cat-' + c + (c === fCat ? ' on' : '')); b.type = 'button'; b.setAttribute('role', 'radio'); b.setAttribute('aria-checked', c === fCat); b.setAttribute('data-cat', c);
      var i = el('i'); i.appendChild(svgIcon(c)); b.appendChild(i); b.appendChild(el('span', null, t('c_' + c)));
      b.onclick = function () { fCat = c; buildCats(); };
      box.appendChild(b);
    });
  }
  function setCycle(c) { fCyc = c; document.querySelectorAll('#fCycle button').forEach(function (b) { var on = b.getAttribute('data-c') === c; b.classList.toggle('on', on); b.setAttribute('aria-checked', on); }); updPrev(); }
  $('fCycle').addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) setCycle(b.getAttribute('data-c')); });
  function updPrev() {
    var a = Number($('fAmount').value), cur = $('fCurrency').value, pv = $('fPrev');
    if (!(a > 0)) { pv.hidden = true; return; }
    pv.hidden = false; pv.textContent = '';
    var l = el('span', null, t('prevM') + ' '); l.appendChild(el('b', null, money(C.monthly(a, fCyc), cur)));
    var r = el('span', null, t('prevY') + ' '); r.appendChild(el('b', null, money(C.yearly(a, fCyc), cur)));
    pv.appendChild(l); pv.appendChild(r);
  }
  $('fAmount').addEventListener('input', updPrev); $('fCurrency').addEventListener('change', updPrev);
  function fillCurrencies() { var s = $('fCurrency'), v = s.value; s.textContent = ''; CURS.forEach(function (c) { var o = el('option', null, c); o.value = c; s.appendChild(o); }); if (v) s.value = v; }
  function defaultCur() { var tots = C.totals(subs); return tots.length ? tots[0].currency : (lang === 'zh' ? 'CNY' : 'USD'); }
  function openSheet(id) {
    var s = id ? subs.filter(function (x) { return x.id === id; })[0] : null;
    $('fId').value = s ? s.id : ''; $('fName').value = s ? s.name : ''; $('fAmount').value = s ? s.amount : '';
    $('fCurrency').value = s ? s.currency : defaultCur(); $('fNext').value = s ? C.nextCharge(s.next, s.cycle, todayStr()) : todayStr(); $('fNote').value = s ? (s.note || '') : '';
    fCat = s ? (s.category || 'other') : 'video'; buildCats(); setCycle(s ? s.cycle : 'month');
    $('formTitle').textContent = s ? t('edit') : t('add'); $('formErr').textContent = ''; $('delInSheet').hidden = !s;
    $('sheet').scrollTop = 0;
    open($('sheet'));
  }
  $('fab').onclick = function () { openSheet(null); };
  $('emptyAdd').onclick = function () { openSheet(null); };
  $('sheetCancel').onclick = closeAll;
  $('delInSheet').onclick = function () { var id = $('fId').value; closeAll(); setTimeout(function () { removeSub(id); }, 60); };
  $('sheet').addEventListener('submit', function (ev) {
    ev.preventDefault();
    var id = $('fId').value;
    var s = { id: id || ('s' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6)), name: $('fName').value, amount: $('fAmount').value,
      currency: $('fCurrency').value, cycle: fCyc, next: $('fNext').value, note: $('fNote').value, category: fCat };
    var err = C.validate(s);
    if (err) { $('formErr').textContent = t('e_' + err); return; }
    s = C.clean(s);
    var i = subs.findIndex(function (x) { return x.id === s.id; });
    if (i >= 0) subs[i] = s; else subs.push(s);
    persist(); closeAll(); renderView(); toast(i >= 0 ? t('saved') : t('added'));
  });
  $('sampleBtn').onclick = function () {
    var today = todayStr();
    T[lang].sample.forEach(function (r, i) { subs.push(C.clean({ id: 'demo' + i + Date.now().toString(36), name: r[0], category: r[1], amount: r[2], currency: r[3], cycle: r[4], next: addDays(today, r[5]), note: '' })); });
    persist(); renderView(); toast(t('sampled', { n: T[lang].sample.length }));
  };

  // ---------- stats ----------
  var statCur = null;
  function renderStats() {
    var tots = C.totals(subs), seg = $('curSeg'); seg.textContent = '';
    if (!tots.length) { statCur = null; }
    else if (!statCur || !tots.some(function (o) { return o.currency === statCur; })) statCur = tots[0].currency;
    seg.hidden = tots.length < 2;
    tots.forEach(function (o) { var b = el('button', o.currency === statCur ? 'on' : '', o.currency); b.type = 'button'; b.onclick = function () { statCur = o.currency; renderStats(); }; seg.appendChild(b); });
    var tt = tots.filter(function (o) { return o.currency === statCur; })[0];
    $('kM').textContent = tt ? money(tt.monthly, statCur) : '—'; $('kY').textContent = tt ? money(tt.yearly, statCur) : '—';
    // donut
    var NS = 'http://www.w3.org/2000/svg', d = $('donut'); d.textContent = '';
    var cats = statCur ? C.byCategory(subs, statCur) : [], total = cats.reduce(function (a, c) { return a + c.monthly; }, 0);
    var R = 54, L = 2 * Math.PI * R, off = 0;
    var bg = document.createElementNS(NS, 'circle'); bg.setAttribute('cx', 70); bg.setAttribute('cy', 70); bg.setAttribute('r', R); bg.setAttribute('fill', 'none'); bg.setAttribute('stroke', 'var(--card2)'); bg.setAttribute('stroke-width', 18); d.appendChild(bg);
    cats.forEach(function (c) {
      var len = total ? c.monthly / total * L : 0, gap = cats.length > 1 ? Math.min(2, len / 3) : 0;
      var ci = document.createElementNS(NS, 'circle'); ci.setAttribute('cx', 70); ci.setAttribute('cy', 70); ci.setAttribute('r', R); ci.setAttribute('fill', 'none');
      ci.setAttribute('class', 'cat-' + c.category); ci.setAttribute('stroke', 'var(--cc)'); ci.setAttribute('stroke-width', 18);
      ci.setAttribute('stroke-dasharray', Math.max(0, len - gap) + ' ' + (L - Math.max(0, len - gap))); ci.setAttribute('stroke-dashoffset', -off); ci.setAttribute('transform', 'rotate(-90 70 70)');
      d.appendChild(ci); off += len;
    });
    function txt(y, s, size, w, fill) { var e = document.createElementNS(NS, 'text'); e.setAttribute('x', 70); e.setAttribute('y', y); e.setAttribute('text-anchor', 'middle'); e.setAttribute('font-size', size); e.setAttribute('font-weight', w); e.setAttribute('fill', fill); e.textContent = s; d.appendChild(e); }
    txt(64, t('avgM'), 11, 500, 'var(--muted)'); txt(84, tt ? money(tt.monthly, statCur, true) : '—', tt && money(tt.monthly, statCur, true).length > 9 ? 13 : 16, 800, 'var(--ink)');
    d.setAttribute('aria-label', cats.map(function (c) { return t('c_' + c.category) + ' ' + money(c.monthly, statCur); }).join(', ') || t('noStats'));
    var lg = $('legend'); lg.textContent = '';
    if (!cats.length) lg.appendChild(el('li', null, t('noStats')));
    cats.forEach(function (c) {
      var li = el('li', 'cat-' + c.category); li.appendChild(el('i')); li.appendChild(el('span', null, t('c_' + c.category)));
      li.appendChild(el('b', null, money(c.monthly, statCur))); li.appendChild(el('em', null, Math.round(c.monthly / total * 100) + '%')); lg.appendChild(li);
    });
    // bars
    var b = $('bars'); b.textContent = '';
    var fc = C.forecast(subs, todayStr(), 12), vals = fc.map(function (f) { return statCur ? (f.byCurrency[statCur] || 0) : 0; });
    var max = Math.max.apply(null, vals.concat([1])), W = 340, top = 26, H = 130, bw = 18, step = W / 12;
    var base = document.createElementNS(NS, 'line'); base.setAttribute('x1', 0); base.setAttribute('x2', W); base.setAttribute('y1', top + H + .5); base.setAttribute('y2', top + H + .5); base.setAttribute('stroke', 'var(--line)'); b.appendChild(base);
    var mi = vals.indexOf(Math.max.apply(null, vals));
    fc.forEach(function (f, i) {
      var v = vals[i], h = v ? Math.max(4, v / max * H) : 2, x = i * step + (step - bw) / 2;
      var r = document.createElementNS(NS, 'rect'); r.setAttribute('x', x); r.setAttribute('y', top + H - h); r.setAttribute('width', bw); r.setAttribute('height', h); r.setAttribute('rx', 5);
      r.setAttribute('fill', i === 0 ? 'var(--pri)' : 'color-mix(in srgb, var(--pri) 45%, transparent)'); r.setAttribute('data-v', v);
      var tl = document.createElementNS(NS, 'title'); tl.textContent = monthName(f.y, f.m, true) + ' ' + money(v, statCur || 'CNY'); r.appendChild(tl); b.appendChild(r);
      var lb = document.createElementNS(NS, 'text'); lb.setAttribute('x', x + bw / 2); lb.setAttribute('y', top + H + 20); lb.setAttribute('text-anchor', 'middle'); lb.setAttribute('font-size', 11);
      lb.setAttribute('fill', i === 0 ? 'var(--pri)' : 'var(--muted)'); lb.setAttribute('font-weight', i === 0 ? 700 : 500); lb.textContent = lang === 'zh' ? f.m + '月' : monthName(f.y, f.m, false).slice(0, 3); b.appendChild(lb);
      if (v && (i === mi || i === 0)) {
        var vt = document.createElementNS(NS, 'text'); vt.setAttribute('x', Math.min(W - 24, Math.max(24, x + bw / 2))); vt.setAttribute('y', top + H - h - 7); vt.setAttribute('text-anchor', 'middle'); vt.setAttribute('font-size', 11); vt.setAttribute('font-weight', 700); vt.setAttribute('fill', 'var(--ink)');
        vt.textContent = money(v, statCur, true); b.appendChild(vt);
      }
    });
    b.setAttribute('aria-label', fc.map(function (f, i) { return monthName(f.y, f.m, false) + ' ' + vals[i]; }).join(', '));
  }

  // ---------- calendar ----------
  var calY, calM, calSel = null;
  function renderCal() {
    var today = todayStr(), tp = C.parseDate(today);
    if (!calY) { calY = tp.y; calM = tp.m; }
    $('calTitle').textContent = monthName(calY, calM, true);
    var mc = C.monthCharges(subs, calY, calM), byDay = {};
    mc.items.forEach(function (x) { (byDay[x.date] = byDay[x.date] || []).push(x.sub); });
    var g = $('calGrid'); g.textContent = '';
    var wd = T[lang].wd; wd.forEach(function (w) { g.appendChild(el('div', 'wd', w)); });
    var first = new Date(Date.UTC(calY, calM - 1, 1)).getUTCDay(), lead = T[lang].monFirst ? (first + 6) % 7 : first, n = C.daysInMonth(calY, calM);
    for (var i = 0; i < lead; i++) g.appendChild(el('div', 'day out'));
    for (var d = 1; d <= n; d++) {
      var ds = calY + '-' + pad(calM) + '-' + pad(d), list = byDay[ds] || [];
      var c = el('button', 'day' + (ds === today ? ' today' : '') + (list.length ? ' has' : '') + (ds === calSel ? ' sel' : '')); c.type = 'button'; c.setAttribute('data-date', ds);
      c.appendChild(el('span', 'n', String(d)));
      var dots = el('span', 'dots'); list.slice(0, 3).forEach(function (s) { dots.appendChild(el('i', 'cat-' + (s.category || 'other'))); }); c.appendChild(dots);
      c.setAttribute('aria-label', shortDate(ds) + (list.length ? ', ' + list.map(function (s) { return s.name; }).join(', ') : ''));
      (function (ds2) { c.onclick = function () { calSel = calSel === ds2 ? null : ds2; renderCal(); }; })(ds);
      g.appendChild(c);
    }
    var items = calSel ? mc.items.filter(function (x) { return x.date === calSel; }) : mc.items;
    $('calListT').textContent = calSel ? t('calDay', { d: shortDate(calSel) }) : t('calCharges', { m: monthName(calY, calM, false) });
    var sums = {}; items.forEach(function (x) { sums[x.sub.currency] = (sums[x.sub.currency] || 0) + Number(x.sub.amount); });
    $('calSum').textContent = Object.keys(sums).map(function (k) { return money(sums[k], k); }).join(' + ');
    var ul = $('calList'); ul.textContent = '';
    if (!items.length) { var e = el('li', 'rowin'); e.appendChild(el('div', 'sub', t('noCharge'))); ul.appendChild(e); return; }
    items.forEach(function (x) {
      var s = x.sub, li = el('li', 'row cat-' + (s.category || 'other')), inn = el('div', 'rowin');
      inn.appendChild(el('div', 'av', Array.from(s.name.trim())[0].toUpperCase()));
      var mid = el('div', 'mid'); mid.appendChild(el('div', 'nm', s.name)); var sb = el('div', 'sub'); sb.appendChild(el('span', 'dot')); sb.appendChild(document.createTextNode(shortDate(x.date) + ' · ' + t(s.cycle))); mid.appendChild(sb);
      var rt = el('div', 'rt'); rt.appendChild(el('b', null, money(s.amount, s.currency)));
      inn.appendChild(mid); inn.appendChild(rt);
      inn.onclick = function () { openSheet(s.id); };
      li.appendChild(inn); ul.appendChild(li);
    });
  }
  $('calPrev').onclick = function () { calM--; if (calM < 1) { calM = 12; calY--; } calSel = null; renderCal(); };
  $('calNext').onclick = function () { calM++; if (calM > 12) { calM = 1; calY++; } calSel = null; renderCal(); };

  // ---------- settings ----------
  function download(name, text, type) {
    var blob = new Blob([text], { type: type }), a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
  }
  $('icsBtn').onclick = function () {
    if (!subs.length) return toast(t('noData'));
    var now = new Date(), stamp = now.toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
    download('subscriptions.ics', C.buildICS(subs, { today: todayStr(), stamp: stamp, lang: lang }), 'text/calendar;charset=utf-8');
    toast(t('icsDone', { n: subs.length }));
  };
  $('expBtn').onclick = function () {
    if (!subs.length) return toast(t('noData'));
    download('subscriptions-backup-' + todayStr() + '.json', C.makeBackup(subs, new Date().toISOString()), 'application/json');
    toast(t('jsonDone', { n: subs.length }));
  };
  $('impBtn').onclick = function () { $('impFile').click(); };
  $('impFile').onchange = function () {
    var f = this.files[0]; if (!f) return; var self = this;
    var r = new FileReader();
    r.onload = function () {
      var res = C.parseBackup(String(r.result)); self.value = '';
      if (!res.ok) return toast(t('impErr'));
      subs = C.merge(subs, res.items); persist(); renderView();
      toast(t('impDone', { n: res.items.length }) + (res.skipped ? t('impSkip', { n: res.skipped }) : ''));
    };
    r.readAsText(f);
  };
  $('clearBtn').onclick = function () {
    sheetOpts(t('clearQ'), [{ label: t('clearA'), red: true, fn: function () { subs = []; persist(); renderView(); toast(t('cleared')); } }]);
  };
  $('langSeg').addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; lang = b.getAttribute('data-l'); try { localStorage.setItem(LKEY, lang); } catch (er) {} applyLang(); });

  var deferred = null, standalone = (window.matchMedia && matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true;
  var isIOS = /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); deferred = e; renderInstall(); });
  window.addEventListener('appinstalled', function () { deferred = null; standalone = true; renderInstall(); });
  function renderInstall() { $('installHint').textContent = standalone ? t('installOK') : deferred ? t('installGo') : isIOS ? t('installIOS') : t('installOther'); }
  $('installBtn').onclick = function () {
    if (deferred) { deferred.prompt(); deferred.userChoice.then(function () { deferred = null; renderInstall(); }); }
    else toast(standalone ? t('installOK') : isIOS ? t('installIOS') : t('installOther'));
  };

  function renderSet() {
    document.querySelectorAll('#langSeg button').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-l') === lang); });
    var pn = $('privacyNote'); pn.textContent = ''; T[lang].privacyP.forEach(function (p) { pn.appendChild(el('p', null, p)); });
    renderInstall();
  }

  function renderView() { renderSubs(); if (view === 'stats') renderStats(); if (view === 'cal') renderCal(); if (view === 'set') renderSet(); }
  function applyLang() {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    document.title = lang === 'zh' ? '订阅清单 · Subscription Tracker' : 'Subscription Tracker';
    document.querySelectorAll('[data-i18n]').forEach(function (n) { n.textContent = t(n.getAttribute('data-i18n')); });
    document.querySelectorAll('[data-i18n-ph]').forEach(function (n) { n.placeholder = t(n.getAttribute('data-i18n-ph')); });
    $('fab').setAttribute('aria-label', t('add'));
    buildCats(); renderSet(); renderStats(); renderCal(); renderSubs();
  }
  fillCurrencies(); setCycle('month'); applyLang();

  // 离线：注册 service worker（仅 http/https）
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () {}); });
  }
  window.__subs = function () { return subs.slice(); };
})();
