// 运行：node --test test.js
// 直接加载页面用的 core.js，保证测的就是 App 里的代码。
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const core = fs.readFileSync(path.join(__dirname, 'core.js'), 'utf8');
const sandbox = {};
sandbox.globalThis = sandbox;
vm.runInNewContext(core, sandbox);
const C = sandbox.SubCalc;

const subs = [
  { id: 'a', name: '视频会员', amount: 25, currency: 'CNY', cycle: 'month', next: '2026-11-03', note: '' },
  { id: 'b', name: '网盘', amount: 298, currency: 'CNY', cycle: 'year', next: '2027-03-01', note: '' },
  { id: 'c', name: '音乐', amount: 45, currency: 'CNY', cycle: 'quarter', next: '2026-12-15', note: '' },
  { id: 'd', name: 'Writing app', amount: 20, currency: 'USD', cycle: 'month', next: '2026-11-20', note: '' },
];

test('每月 / 每年折算', () => {
  assert.equal(C.monthly(298, 'year'), 24.83);
  assert.equal(C.yearly(45, 'quarter'), 180);
  assert.equal(C.yearly(25, 'month'), 300);
});

test('按币种合计，不做汇率换算', () => {
  const t = C.totals(subs);
  const cny = t.find(x => x.currency === 'CNY'), usd = t.find(x => x.currency === 'USD');
  assert.equal(cny.monthly, 64.83);   // 25 + 298/12 + 45/3
  assert.equal(cny.yearly, 778);      // 300 + 298 + 180
  assert.equal(cny.count, 3);
  assert.equal(usd.yearly, 240);
});

test('按每月金额从高到低排序', () => {
  assert.deepEqual(Array.from(C.sortByMonthly(subs), s => s.id), ['a', 'b', 'd', 'c']);
});

test('下次扣费日已过时按周期顺延，月末取当月最后一天', () => {
  assert.equal(C.nextCharge('2026-10-29', 'month', '2026-10-29'), '2026-10-29');
  assert.equal(C.nextCharge('2026-09-15', 'month', '2026-10-29'), '2026-11-15');
  assert.equal(C.nextCharge('2026-01-31', 'month', '2026-02-10'), '2026-02-28');
  assert.equal(C.nextCharge('2026-01-31', 'month', '2026-03-01'), '2026-03-31');
  assert.equal(C.nextCharge('2024-02-29', 'year', '2026-10-29'), '2027-02-28');
  assert.equal(C.nextCharge('2026-05-10', 'quarter', '2026-10-29'), '2026-11-10');
  assert.equal(C.daysUntil('2026-11-05', '2026-10-29'), 7);
});

test('校验与 JSON 备份往返', () => {
  assert.equal(C.validate({ name: '', amount: 1, currency: 'CNY', cycle: 'month', next: '2026-11-01' }), 'name');
  assert.equal(C.validate({ name: 'x', amount: 0, currency: 'CNY', cycle: 'month', next: '2026-11-01' }), 'amount');
  assert.equal(C.validate({ name: 'x', amount: 1, currency: 'CNY', cycle: 'week', next: '2026-11-01' }), 'cycle');
  assert.equal(C.validate({ name: 'x', amount: 1, currency: 'CNY', cycle: 'month', next: '2026-02-30' }), 'next');
  const back = C.parseBackup(C.makeBackup(subs, '2026-10-29T00:00:00Z'));
  assert.equal(back.ok, true);
  assert.equal(back.items.length, 4);
  assert.equal(back.skipped, 0);
  assert.equal(C.parseBackup('not json').ok, false);
  const mixed = C.parseBackup(JSON.stringify([subs[0], { name: 'bad' }]));
  assert.equal(mixed.items.length, 1);
  assert.equal(mixed.skipped, 1);
  const merged = C.merge(subs.slice(0, 2), [{ ...subs[1], amount: 1 }, subs[2]]);
  assert.equal(merged.length, 3);
  assert.equal(merged[1].amount, 1);
});

test('.ics：CRLF、每条一个提醒、提前 3 天、行长 ≤ 75 字节', () => {
  const ics = C.buildICS([...subs, { id: 'e', name: '很长的名字'.repeat(10) + ',;', amount: 9, currency: 'CNY', cycle: 'month', next: '2026-01-31', note: '第一行\n第二行' }],
    { today: '2026-10-29', stamp: '20261029T000000Z' });
  assert.ok(ics.startsWith('BEGIN:VCALENDAR\r\n'));
  assert.ok(ics.endsWith('END:VCALENDAR\r\n'));
  assert.equal((ics.match(/BEGIN:VEVENT/g) || []).length, 5);
  assert.equal((ics.match(/TRIGGER:-PT63H/g) || []).length, 5);
  assert.ok(ics.includes('DTSTART;VALUE=DATE:20261103'));
  assert.ok(ics.includes('RRULE:FREQ=YEARLY'));
  assert.ok(ics.includes('RRULE:FREQ=MONTHLY;INTERVAL=3'));
  assert.ok(ics.includes('DTSTART;VALUE=DATE:20261031'));       // 1/31 顺延到 10/31
  assert.ok(ics.includes('BYMONTHDAY=31,-1;BYSETPOS=1'));       // 没有 31 号的月份取月末
  ics.split('\r\n').forEach(l => assert.ok(Buffer.byteLength(l, 'utf8') <= 75, l));
  const unfolded = ics.replace(/\r\n /g, '');
  assert.ok(unfolded.includes('\\,\\;'));
  assert.ok(unfolded.includes('第一行\\n第二行'));
  assert.ok(!/[^\r]\n/.test(ics));
});

test('分类：缺省为其他，非法分类拒绝', () => {
  assert.equal(C.clean({ name: 'x', amount: 1, currency: 'CNY', cycle: 'month', next: '2026-11-01' }, 'i').category, 'other');
  assert.equal(C.clean({ name: 'x', amount: 1, currency: 'CNY', cycle: 'month', next: '2026-11-01', category: 'music' }, 'i').category, 'music');
  assert.equal(C.validate({ name: 'x', amount: 1, currency: 'CNY', cycle: 'month', next: '2026-11-01', category: 'food' }), 'category');
});

test('扣费日展开、本月应付、未来 12 个月预估', () => {
  assert.deepEqual(Array.from(C.occurrences({ next: '2026-01-31', cycle: 'month' }, '2026-10-01', '2027-02-28')),
    ['2026-10-31', '2026-11-30', '2026-12-31', '2027-01-31', '2027-02-28']);
  assert.deepEqual(Array.from(C.occurrences({ next: '2026-12-01', cycle: 'month' }, '2026-10-01', '2026-11-30')), []);
  const nov = C.monthCharges(subs, 2026, 11);
  assert.equal(nov.byCurrency.CNY, 25);
  assert.equal(nov.byCurrency.USD, 20);
  const fc = C.forecast(subs, '2026-10-29', 12);
  assert.equal(fc.length, 12);
  assert.equal(fc[0].m, 10);
  assert.equal(fc[11].y, 2027);
  assert.equal(fc[11].m, 9);
  assert.equal(fc[2].byCurrency.CNY, 70);   // 12 月：视频 25 + 音乐季付 45
  assert.equal(fc[5].byCurrency.CNY, 368);  // 3 月：视频 25 + 网盘年付 298 + 音乐季付 45
  const yearCny = fc.reduce((a, f) => a + (f.byCurrency.CNY || 0), 0);
  assert.equal(yearCny, 25 * 11 + 298 + 45 * 4);  // 10 月无扣费（11-03 起）
});

test('分类月均', () => {
  const s2 = subs.map((s, i) => ({ ...s, category: ['video', 'cloud', 'music', 'software'][i] }));
  const cats = C.byCategory(s2, 'CNY');
  assert.deepEqual(Array.from(cats, c => c.category), ['video', 'cloud', 'music']);
  assert.equal(cats[1].monthly, 24.83);
});
