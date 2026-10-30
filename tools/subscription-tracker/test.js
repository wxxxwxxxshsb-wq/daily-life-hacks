// 运行：node --test test.js
// 直接从 index.html 中提取核心代码（@@CORE-START ~ @@CORE-END），保证测的就是页面里的代码。
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const core = html.split('// @@CORE-START')[1].split('// @@CORE-END')[0];
const sandbox = {};
sandbox.globalThis = sandbox;
vm.runInNewContext(core, sandbox);
const C = sandbox.SubCalc;

const subs = [
  { id: 'a', name: '视频会员', amount: 25, currency: 'CNY', cycle: 'month', next: '2026-11-03', note: '' },
  { id: 'b', name: '网盘', amount: 298, currency: 'CNY', cycle: 'year', next: '2027-03-01', note: '' },
  { id: 'c', name: '音乐', amount: 45, currency: 'CNY', cycle: 'quarter', next: '2026-12-15', note: '' },
  { id: 'd', name: 'AI chat', amount: 20, currency: 'USD', cycle: 'month', next: '2026-11-20', note: '' },
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
