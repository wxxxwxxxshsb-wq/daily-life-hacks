// 订阅清单核心计算（纯函数，无 DOM），MIT License
(function (root) {
  'use strict';
  var CYCLES = { month: 1, quarter: 3, year: 12 };
  var CATS = ['video', 'music', 'cloud', 'software', 'learning', 'other'];

  function round2(n) { return Math.round((n + Number.EPSILON) * 100) / 100; }

  function parseDate(s) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(s || ''));
    if (!m) return null;
    var y = +m[1], mo = +m[2], d = +m[3];
    var dt = new Date(Date.UTC(y, mo - 1, d));
    if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== mo - 1 || dt.getUTCDate() !== d) return null;
    return { y: y, m: mo, d: d };
  }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function fmtDate(o) { return o.y + '-' + pad(o.m) + '-' + pad(o.d); }
  function dayNum(o) { return Math.floor(Date.UTC(o.y, o.m - 1, o.d) / 86400000); }
  function daysInMonth(y, m) { return new Date(Date.UTC(y, m, 0)).getUTCDate(); }

  // 从锚定日 anchor 加 k 个周期（按月加，月末自动取当月最后一天）
  function addMonths(anchor, months) {
    var total = anchor.y * 12 + (anchor.m - 1) + months;
    var y = Math.floor(total / 12), m = total % 12 + 1;
    return { y: y, m: m, d: Math.min(anchor.d, daysInMonth(y, m)) };
  }

  // 下次扣费日：如果填写的日期已经过去，按周期顺延到今天或之后
  function nextCharge(dateStr, cycle, todayStr) {
    var a = parseDate(dateStr), t = parseDate(todayStr);
    var step = CYCLES[cycle];
    if (!a || !t || !step) return null;
    var k = 0, cur = a;
    while (dayNum(cur) < dayNum(t) && k < 10000) { k++; cur = addMonths(a, step * k); }
    return fmtDate(cur);
  }

  function daysUntil(dateStr, todayStr) {
    var a = parseDate(dateStr), t = parseDate(todayStr);
    if (!a || !t) return null;
    return dayNum(a) - dayNum(t);
  }

  function monthly(amount, cycle) { return round2(Number(amount) / CYCLES[cycle]); }
  function yearly(amount, cycle) { return round2(Number(amount) * 12 / CYCLES[cycle]); }

  // 按币种合计
  function totals(subs) {
    var by = {};
    subs.forEach(function (s) {
      var c = s.currency;
      if (!by[c]) by[c] = { currency: c, monthly: 0, yearly: 0, count: 0 };
      by[c].monthly += Number(s.amount) / CYCLES[s.cycle];
      by[c].yearly += Number(s.amount) * 12 / CYCLES[s.cycle];
      by[c].count++;
    });
    return Object.keys(by).map(function (k) {
      var o = by[k]; o.monthly = round2(o.monthly); o.yearly = round2(o.yearly); return o;
    }).sort(function (x, y) { return y.yearly - x.yearly; });
  }

  function sortByMonthly(subs) {
    return subs.slice().sort(function (a, b) {
      return monthly(b.amount, b.cycle) - monthly(a.amount, a.cycle) || String(a.name).localeCompare(String(b.name));
    });
  }

  function validate(s) {
    if (!s || typeof s !== 'object') return 'bad';
    if (typeof s.name !== 'string' || !s.name.trim() || s.name.length > 60) return 'name';
    var a = Number(s.amount);
    if (!isFinite(a) || a <= 0 || a > 1e9) return 'amount';
    if (typeof s.currency !== 'string' || !/^[A-Z]{3}$/.test(s.currency)) return 'currency';
    if (!CYCLES[s.cycle]) return 'cycle';
    if (!parseDate(s.next)) return 'next';
    if (s.note != null && (typeof s.note !== 'string' || s.note.length > 120)) return 'note';
    if (s.category != null && s.category !== '' && CATS.indexOf(s.category) < 0) return 'category';
    return '';
  }

  function clean(s, id) {
    return { id: String(s.id || id), name: s.name.trim(), amount: round2(Number(s.amount)), currency: s.currency,
      cycle: s.cycle, next: s.next, note: (s.note || '').trim(), category: CATS.indexOf(s.category) >= 0 ? s.category : 'other' };
  }

  // 解析 JSON 备份：支持 {app, version, subscriptions:[...]} 或直接数组
  function parseBackup(text) {
    var data;
    try { data = JSON.parse(text); } catch (e) { return { ok: false, error: 'json' }; }
    var arr = Array.isArray(data) ? data : (data && Array.isArray(data.subscriptions) ? data.subscriptions : null);
    if (!arr) return { ok: false, error: 'format' };
    var good = [], bad = 0;
    arr.forEach(function (s, i) {
      if (validate(s)) { bad++; return; }
      good.push(clean(s, 'imp-' + i + '-' + Date.now().toString(36)));
    });
    return { ok: true, items: good, skipped: bad };
  }

  function merge(existing, incoming) {
    var map = {}, order = [];
    existing.forEach(function (s) { map[s.id] = s; order.push(s.id); });
    incoming.forEach(function (s) { if (!map[s.id]) order.push(s.id); map[s.id] = s; });
    return order.map(function (id) { return map[id]; });
  }

  function makeBackup(subs, nowIso) {
    return JSON.stringify({ app: 'daily-life-hacks/subscription-tracker', version: 1, exportedAt: nowIso, subscriptions: subs }, null, 2);
  }

  // ---- iCalendar (RFC 5545) ----
  function icsEscape(s) { return String(s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n'); }
  function utf8len(ch) { var c = ch.codePointAt(0); return c < 0x80 ? 1 : c < 0x800 ? 2 : c < 0x10000 ? 3 : 4; }
  function fold(line) {
    var out = [], cur = '', len = 0, limit = 75;
    Array.from(line).forEach(function (ch) {
      var l = utf8len(ch);
      if (len + l > limit) { out.push(cur); cur = ' '; len = 1; limit = 75; }
      cur += ch; len += l;
    });
    out.push(cur);
    return out.join('\r\n');
  }
  function rrule(cycle, d) {
    if (cycle === 'year') return 'RRULE:FREQ=YEARLY';
    var iv = cycle === 'quarter' ? ';INTERVAL=3' : '';
    // 29/30/31 号扣费：没有这一天的月份取月末
    if (d >= 29) return 'RRULE:FREQ=MONTHLY' + iv + ';BYMONTHDAY=' + d + ',-1;BYSETPOS=1';
    return 'RRULE:FREQ=MONTHLY' + iv;
  }
  function buildICS(subs, opts) {
    opts = opts || {};
    var today = opts.today, stamp = opts.stamp || '20260101T000000Z', L = opts.lang === 'en' ? 'en' : 'zh';
    var cyc = { zh: { month: '每月', quarter: '每季度', year: '每年' }, en: { month: 'monthly', quarter: 'quarterly', year: 'yearly' } }[L];
    var lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//daily-life-hacks//subscription-tracker//' + (L === 'en' ? 'EN' : 'ZH'),
      'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', 'X-WR-CALNAME:' + icsEscape(L === 'en' ? 'Subscriptions' : '订阅扣费提醒')];
    subs.forEach(function (s) {
      var nx = today ? nextCharge(s.next, s.cycle, today) : s.next;
      var p = parseDate(nx);
      var endDay = new Date(Date.UTC(p.y, p.m - 1, p.d + 1));
      var endStr = endDay.getUTCFullYear() + pad(endDay.getUTCMonth() + 1) + pad(endDay.getUTCDate());
      var money = s.amount + ' ' + s.currency;
      var summary = L === 'en' ? ('Renewal: ' + s.name + ' (' + money + ')') : ('扣费：' + s.name + '（' + money + '）');
      var desc = (L === 'en' ? 'Billed ' : '扣费周期：') + cyc[s.cycle] + (L === 'en' ? ', ' : '，') + money +
        (s.note ? (L === 'en' ? '\nNote: ' : '\n备注：') + s.note : '') +
        (L === 'en' ? '\nCancel before this date if you no longer need it.' : '\n不想续就在这天之前取消。');
      lines.push('BEGIN:VEVENT', 'UID:' + icsEscape(s.id) + '@subscription-tracker.daily-life-hacks', 'DTSTAMP:' + stamp,
        'DTSTART;VALUE=DATE:' + nx.replace(/-/g, ''), 'DTEND;VALUE=DATE:' + endStr, rrule(s.cycle, p.d),
        'SUMMARY:' + icsEscape(summary), 'DESCRIPTION:' + icsEscape(desc), 'TRANSP:TRANSPARENT',
        'BEGIN:VALARM', 'ACTION:DISPLAY', 'DESCRIPTION:' + icsEscape(summary), 'TRIGGER:-PT63H', 'END:VALARM', 'END:VEVENT');
    });
    lines.push('END:VCALENDAR');
    return lines.map(fold).join('\r\n') + '\r\n';
  }


  // 某订阅在 [start, end] 之间的所有扣费日（从填写的扣费日开始往后按周期推）
  function occurrences(s, startStr, endStr) {
    var a = parseDate(s.next), st = parseDate(startStr), en = parseDate(endStr), step = CYCLES[s.cycle];
    if (!a || !st || !en || !step) return [];
    var out = [], diff = (st.y * 12 + st.m) - (a.y * 12 + a.m);
    var k = Math.max(0, Math.floor(diff / step) - 1), cur = addMonths(a, step * k), guard = 0;
    while (dayNum(cur) <= dayNum(en) && guard++ < 2000) {
      if (dayNum(cur) >= dayNum(st)) out.push(fmtDate(cur));
      k++; cur = addMonths(a, step * k);
    }
    return out;
  }
  function monthRange(y, m) { return [fmtDate({ y: y, m: m, d: 1 }), fmtDate({ y: y, m: m, d: daysInMonth(y, m) })]; }
  // 某个自然月里每个币种实际要扣的钱
  function monthCharges(subs, y, m) {
    var r = monthRange(y, m), by = {}, items = [];
    subs.forEach(function (s) {
      occurrences(s, r[0], r[1]).forEach(function (d) {
        by[s.currency] = round2((by[s.currency] || 0) + Number(s.amount));
        items.push({ date: d, sub: s });
      });
    });
    items.sort(function (x, z) { return x.date < z.date ? -1 : x.date > z.date ? 1 : 0; });
    return { byCurrency: by, items: items };
  }
  // 从今天所在月份起，未来 n 个月的扣费预估
  function forecast(subs, todayStr, n) {
    var t = parseDate(todayStr), out = [];
    for (var i = 0; i < n; i++) {
      var p = addMonths({ y: t.y, m: t.m, d: 1 }, i);
      out.push({ y: p.y, m: p.m, byCurrency: monthCharges(subs, p.y, p.m).byCurrency });
    }
    return out;
  }
  // 某币种下各分类的月均花费
  function byCategory(subs, currency) {
    var by = {};
    subs.forEach(function (s) {
      if (s.currency !== currency) return;
      var c = CATS.indexOf(s.category) >= 0 ? s.category : 'other';
      by[c] = (by[c] || 0) + Number(s.amount) / CYCLES[s.cycle];
    });
    return Object.keys(by).map(function (k) { return { category: k, monthly: round2(by[k]) }; })
      .sort(function (x, z) { return z.monthly - x.monthly; });
  }

  root.SubCalc = { CYCLES: CYCLES, round2: round2, parseDate: parseDate, nextCharge: nextCharge, daysUntil: daysUntil,
    monthly: monthly, yearly: yearly, totals: totals, sortByMonthly: sortByMonthly, validate: validate, clean: clean,
    parseBackup: parseBackup, merge: merge, makeBackup: makeBackup, buildICS: buildICS, fold: fold,
    CATS: CATS, occurrences: occurrences, monthCharges: monthCharges, forecast: forecast, byCategory: byCategory, addMonths: addMonths, daysInMonth: daysInMonth };
})(typeof window !== 'undefined' ? window : globalThis);
