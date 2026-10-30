/* 订阅清单（简化版）· MIT License · 纯前端，无网络请求，数据只存 localStorage */
(function () {
  'use strict';
  var C = window.SubCalc, KEY = 'dlh-subscription-tracker-v1', LKEY = 'dlh-subscription-tracker-lang';
  var CURS = ['CNY', 'USD', 'HKD', 'TWD', 'EUR', 'GBP', 'JPY'];
  var T = {
    zh: { title: '订阅清单', lead: '记下每月自动扣费的订阅，看看每月花多少钱', monthly: '每月合计', yearAbout: '一年约 {v}', alsoM: '另有 {v} / 月',
      add: '添加订阅', edit: '修改订阅', howTo: '怎么用？', s1: '点“添加订阅”', s2: '填名称和金额', s3: '看每月合计', sample: '试试示例',
      mine: '我的订阅', countN: '共 {n} 个', tip: '点一下可修改，点右边的垃圾桶删除', cancel: '取消', name: '名称', namePh: '例如：视频会员', amount: '金额',
      cycle: '多久扣一次', month: '每月', quarter: '每季度', year: '每年', date: '扣费日期', optional: '（默认今天，可不改）', moreOpts: '更多选项', currency: '币种',
      save: '保存', delete: '删除', close: '关闭', more: '更多', language: '语言', tools: '提醒与备份', ics: '导出日历提醒',
      icsHint: '扣费前 3 天上午 9 点提醒，用手机或电脑日历打开', exp: '导出备份', expHint: '换手机或清浏览器数据前先导出', imp: '导入备份', impHint: '和现有清单合并',
      clear: '清空全部', privacy: '数据只存在这台设备的浏览器里，不上传、不注册。换手机或清浏览器数据前先导出备份；iPhone 的 Safari 可能清掉长期没打开的网站数据。',
      today: '今天扣费', tomorrow: '明天扣费', inDays: '还有 {n} 天扣费', perM: '/ 月', perYear: '每年 {v}', perQuarter: '每季度 {v}',
      deleted: '已删除“{n}”', undo: '撤销', added: '已添加', saved: '已保存', cleared: '已清空', delA: '删除 {n}',
      e_name: '请填写名称', e_amount: '请填写大于 0 的金额', e_next: '请选择扣费日期', e_currency: '币种不正确', e_cycle: '请选择多久扣一次', e_note: '备注太长', e_category: '分类不正确',
      noData: '清单是空的，先添加订阅', icsDone: '已导出 {n} 条日历提醒', jsonDone: '已导出 {n} 条备份', impDone: '已导入 {n} 条', impSkip: '，跳过 {n} 条格式不对的',
      impErr: '导入失败：不是本工具导出的备份文件', saveErr: '浏览器不允许保存（可能是无痕模式），刷新后数据会丢失',
      samples: [['视频会员', 25, 'month', 2], ['音乐会员', 15, 'month', 9], ['网盘 2TB', 298, 'year', 75], ['写作助手会员', 68, 'month', 1], ['健身房', 199, 'month', 18]], cur: 'CNY' },
    en: { title: 'Subscriptions', lead: 'Track what renews automatically and see what you spend each month', monthly: 'Per month', yearAbout: 'About {v} a year', alsoM: 'Plus {v} / mo',
      add: 'Add subscription', edit: 'Edit subscription', howTo: 'How it works', s1: 'Tap “Add subscription”', s2: 'Enter a name and amount', s3: 'See your monthly total', sample: 'Try an example',
      mine: 'My subscriptions', countN: '{n} total', tip: 'Tap to edit. Tap the trash icon to delete.', cancel: 'Cancel', name: 'Name', namePh: 'e.g. Video streaming', amount: 'Amount',
      cycle: 'How often', month: 'Monthly', quarter: 'Quarterly', year: 'Yearly', date: 'Charge date', optional: '(defaults to today)', moreOpts: 'More options', currency: 'Currency',
      save: 'Save', delete: 'Delete', close: 'Close', more: 'More', language: 'Language', tools: 'Reminders & backup', ics: 'Export calendar reminders',
      icsHint: 'Alert at 9 AM, 3 days before each charge. Open with your calendar.', exp: 'Export backup', expHint: 'Do this before switching phones', imp: 'Import backup', impHint: 'Merges with your list',
      clear: 'Delete all', privacy: 'Your data stays only in this browser on this device. No uploads, no account. Export a backup before switching phones or clearing data; Safari on iPhone may delete data for sites you have not opened in a while.',
      today: 'Charges today', tomorrow: 'Charges tomorrow', inDays: 'Charges in {n} days', perM: '/ mo', perYear: '{v} a year', perQuarter: '{v} a quarter',
      deleted: 'Deleted "{n}"', undo: 'Undo', added: 'Added', saved: 'Saved', cleared: 'All deleted', delA: 'Delete {n}',
      e_name: 'Enter a name', e_amount: 'Enter an amount greater than 0', e_next: 'Pick a charge date', e_currency: 'Invalid currency', e_cycle: 'Pick how often', e_note: 'Note too long', e_category: 'Invalid category',
      noData: 'The list is empty. Add a subscription first.', icsDone: 'Exported {n} calendar reminders', jsonDone: 'Exported {n} entries', impDone: 'Imported {n}', impSkip: ', skipped {n} invalid',
      impErr: 'Import failed: not a backup from this app', saveErr: 'This browser blocks storage (private mode?); data will be lost on reload',
      samples: [['Video streaming', 15.49, 'month', 2], ['Music', 10.99, 'month', 9], ['Cloud storage 2TB', 99.99, 'year', 75], ['Writing assistant', 20, 'month', 1], ['Gym', 45, 'month', 18]], cur: 'USD' }
  };
  var $ = function (id) { return document.getElementById(id); };
  var lang = 'zh';
  try { lang = localStorage.getItem(LKEY) || (/^zh/i.test(navigator.language || 'zh') ? 'zh' : 'en'); } catch (e) {}
  if (!T[lang]) lang = 'zh';
  function t(k, v) { var s = T[lang][k]; if (s == null) s = k; if (v) Object.keys(v).forEach(function (x) { s = String(s).replace('{' + x + '}', v[x]); }); return s; }
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function todayStr() { var d = new Date(); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function addDays(str, n) { var p = C.parseDate(str), d = new Date(Date.UTC(p.y, p.m - 1, p.d + n)); return d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1) + '-' + pad(d.getUTCDate()); }
  function money(n, cur) {
    var whole = Math.abs(n - Math.round(n)) < 0.005;
    try { return new Intl.NumberFormat(lang === 'zh' ? 'zh-CN' : 'en-US', { style: 'currency', currency: cur, minimumFractionDigits: whole || cur === 'JPY' ? 0 : 2, maximumFractionDigits: cur === 'JPY' ? 0 : 2 }).format(n); }
    catch (e) { return (+n).toFixed(2) + ' ' + cur; }
  }
  function sym(cur) { try { return new Intl.NumberFormat(lang === 'zh' ? 'zh-CN' : 'en-US', { style: 'currency', currency: cur }).formatToParts(0).filter(function (p) { return p.type === 'currency'; })[0].value; } catch (e) { return cur; } }

  var subs = [];
  try { var raw = localStorage.getItem(KEY); if (raw) { var p0 = C.parseBackup(raw); if (p0.ok) subs = p0.items; } } catch (e) {}
  function persist() { try { localStorage.setItem(KEY, C.makeBackup(subs, new Date().toISOString())); } catch (e) { toast(t('saveErr')); } }

  var toastTimer;
  function toast(msg, actLabel, act) {
    $('toastMsg').textContent = msg; var b = $('toastAct'); b.hidden = !actLabel; b.textContent = actLabel || '';
    b.onclick = function () { hideToast(); if (act) act(); };
    $('toast').classList.add('on'); clearTimeout(toastTimer); toastTimer = setTimeout(hideToast, actLabel ? 5000 : 2500);
  }
  function hideToast() { $('toast').classList.remove('on'); }

  var TRASH = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>';

  function render() {
    var today = todayStr(), tots = C.totals(subs);
    var main = tots[0] || { currency: T[lang].cur, monthly: 0, yearly: 0 };
    $('total').textContent = money(main.monthly, main.currency); $('total').setAttribute('data-cur', main.currency);
    $('yearly').textContent = t('yearAbout', { v: money(main.yearly, main.currency) });
    var others = tots.slice(1).map(function (o) { return t('alsoM', { v: money(o.monthly, o.currency) }); });
    $('extra').hidden = !others.length; $('extra').textContent = others.join(' · ');
    var empty = !subs.length;
    $('empty').hidden = !empty; $('listWrap').hidden = empty;
    var list = $('list'); list.textContent = '';
    if (empty) return;
    $('count').textContent = t('countN', { n: subs.length });
    subs.map(function (s) { var nx = C.nextCharge(s.next, s.cycle, today); return { s: s, dd: C.daysUntil(nx, today) }; })
      .sort(function (a, b) { return a.dd - b.dd || String(a.s.name).localeCompare(String(b.s.name)); })
      .forEach(function (x) {
        var s = x.s, dd = x.dd, li = el('li', 'row' + (dd <= 3 ? ' soon' : '')); li.setAttribute('data-id', s.id);
        var hit = el('button', 'hit'); hit.type = 'button';
        hit.appendChild(el('span', 'av', Array.from(s.name.trim())[0].toUpperCase()));
        var mid = el('span', 'mid'); mid.appendChild(el('span', 'nm', s.name));
        mid.appendChild(el('span', 'when', dd === 0 ? t('today') : dd === 1 ? t('tomorrow') : t('inDays', { n: dd })));
        mid.firstChild.style.display = mid.lastChild.style.display = 'block';
        var amt = el('span', 'amt'); var b = el('b', null, money(C.monthly(s.amount, s.cycle), s.currency) + ' ' + t('perM')); b.setAttribute('data-m', s.id); amt.appendChild(b);
        if (s.cycle !== 'month') amt.appendChild(el('small', null, t(s.cycle === 'year' ? 'perYear' : 'perQuarter', { v: money(s.amount, s.currency) })));
        hit.appendChild(mid); hit.appendChild(amt);
        hit.onclick = function () { openForm(s.id); };
        var del = el('button', 'del'); del.type = 'button'; del.innerHTML = TRASH; del.setAttribute('aria-label', t('delA', { n: s.name }));
        del.onclick = function () { removeSub(s.id); };
        li.appendChild(hit); li.appendChild(del); list.appendChild(li);
      });
  }
  function removeSub(id) {
    var i = subs.findIndex(function (x) { return x.id === id; }); if (i < 0) return;
    var gone = subs.splice(i, 1)[0]; persist(); render();
    toast(t('deleted', { n: gone.name }), t('undo'), function () { subs.splice(Math.min(i, subs.length), 0, gone); persist(); render(); });
  }

  // ----- 弹层 -----
  function open(node) { hideToast(); $('backdrop').classList.add('on'); node.classList.add('on'); }
  function closeAll() { document.querySelectorAll('.sheet.on').forEach(function (n) { n.classList.remove('on'); }); $('backdrop').classList.remove('on'); if (document.activeElement) document.activeElement.blur(); }
  $('backdrop').onclick = closeAll; $('cancelBtn').onclick = closeAll; $('menuClose').onclick = closeAll;
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeAll(); });

  // ----- 表单 -----
  var fCyc = 'month';
  function setCycle(c) { fCyc = c; document.querySelectorAll('#fCycle button').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-c') === c); }); $('fCycle').querySelector('[data-c="quarter"]').hidden = c !== 'quarter'; }
  $('fCycle').addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) setCycle(b.getAttribute('data-c')); });
  CURS.forEach(function (c) { var o = el('option', null, c); o.value = c; $('fCurrency').appendChild(o); });
  function updSym() { $('curSym').textContent = sym($('fCurrency').value); }
  $('fCurrency').onchange = updSym;
  function openForm(id) {
    var s = id ? subs.filter(function (x) { return x.id === id; })[0] : null, tots = C.totals(subs);
    $('fId').value = s ? s.id : ''; $('fName').value = s ? s.name : ''; $('fAmount').value = s ? s.amount : '';
    $('fCurrency').value = s ? s.currency : (tots[0] ? tots[0].currency : T[lang].cur); updSym();
    $('fNext').value = s ? C.nextCharge(s.next, s.cycle, todayStr()) : todayStr();
    setCycle(s ? s.cycle : 'month'); $('moreBox').open = false;
    $('formTitle').textContent = s ? t('edit') : t('add'); $('formErr').textContent = ''; $('delInSheet').hidden = !s;
    open($('sheet'));
  }
  $('addBtn').onclick = function () { openForm(null); };
  $('delInSheet').onclick = function () { var id = $('fId').value; closeAll(); removeSub(id); };
  $('sheet').addEventListener('submit', function (ev) {
    ev.preventDefault();
    var id = $('fId').value, old = id ? subs.filter(function (x) { return x.id === id; })[0] : null;
    var s = { id: id || ('s' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6)), name: $('fName').value, amount: $('fAmount').value,
      currency: $('fCurrency').value, cycle: fCyc, next: $('fNext').value || todayStr(), note: old ? old.note : '', category: old ? old.category : 'other' };
    var err = C.validate(s); if (err) { $('formErr').textContent = t('e_' + err); return; }
    s = C.clean(s);
    var i = subs.findIndex(function (x) { return x.id === s.id; }); if (i >= 0) subs[i] = s; else subs.push(s);
    persist(); closeAll(); render(); toast(i >= 0 ? t('saved') : t('added'));
  });
  $('sampleBtn').onclick = function () {
    var today = todayStr();
    T[lang].samples.forEach(function (r, i) { subs.push(C.clean({ id: 'demo' + i + Date.now().toString(36), name: r[0], amount: r[1], currency: T[lang].cur, cycle: r[2], next: addDays(today, r[3]), note: '' })); });
    persist(); render();
  };

  // ----- 更多菜单 -----
  $('menuBtn').onclick = function () { renderLang(); open($('menu')); };
  function download(name, text, type) {
    var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type: type })); a.download = name;
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
  }
  $('icsBtn').onclick = function () {
    if (!subs.length) return toast(t('noData'));
    var stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
    download('subscriptions.ics', C.buildICS(subs, { today: todayStr(), stamp: stamp, lang: lang }), 'text/calendar;charset=utf-8'); toast(t('icsDone', { n: subs.length }));
  };
  $('expBtn').onclick = function () {
    if (!subs.length) return toast(t('noData'));
    download('subscriptions-backup-' + todayStr() + '.json', C.makeBackup(subs, new Date().toISOString()), 'application/json'); toast(t('jsonDone', { n: subs.length }));
  };
  $('impBtn').onclick = function () { $('impFile').click(); };
  $('impFile').onchange = function () {
    var f = this.files[0], self = this; if (!f) return;
    var r = new FileReader();
    r.onload = function () {
      var res = C.parseBackup(String(r.result)); self.value = '';
      if (!res.ok) return toast(t('impErr'));
      subs = C.merge(subs, res.items); persist(); render(); toast(t('impDone', { n: res.items.length }) + (res.skipped ? t('impSkip', { n: res.skipped }) : ''));
    };
    r.readAsText(f);
  };
  $('clearBtn').onclick = function () {
    if (!subs.length) return toast(t('noData'));
    var backup = subs.slice(); subs = []; persist(); render(); closeAll();
    toast(t('cleared'), t('undo'), function () { subs = backup; persist(); render(); });
  };
  function renderLang() { document.querySelectorAll('#langSeg button').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-l') === lang); }); }
  $('langSeg').addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; lang = b.getAttribute('data-l'); try { localStorage.setItem(LKEY, lang); } catch (er) {} applyLang(); });

  function applyLang() {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    document.title = lang === 'zh' ? '订阅清单 · Subscription Tracker' : 'Subscription Tracker';
    document.querySelectorAll('[data-i18n]').forEach(function (n) { n.textContent = t(n.getAttribute('data-i18n')); });
    document.querySelectorAll('[data-i18n-ph]').forEach(function (n) { n.placeholder = t(n.getAttribute('data-i18n-ph')); });
    document.querySelectorAll('[data-i18n-aria]').forEach(function (n) { n.setAttribute('aria-label', t(n.getAttribute('data-i18n-aria'))); });
    renderLang(); updSym(); render();
  }
  applyLang();

  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () {}); });
  }
  window.__subs = function () { return subs.slice(); };
})();
