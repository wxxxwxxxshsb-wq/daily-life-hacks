// 运行：node --test test.js
// 直接从 full.html 中提取计算核心（@@CORE-START ~ @@CORE-END），保证测的就是页面里的代码。
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const html = fs.readFileSync(path.join(__dirname, 'full.html'), 'utf8');
const core = html.split('// @@CORE-START')[1].split('// @@CORE-END')[0];
const sandbox = { globalThis: {} };
sandbox.globalThis = sandbox;
vm.runInNewContext(core, sandbox);
const C = sandbox.LaborCalc;

test('未休年假工资：6525 元，3 天', () => {
  const r = C.unusedLeavePay(6525, 3);
  assert.equal(r.daily, 300);
  assert.equal(r.total, 2700);
  assert.equal(r.normal, 900);
  assert.equal(r.extra, 1800);
});

test('未休年假工资：保留两位小数', () => {
  const r = C.unusedLeavePay(8000, 2);
  assert.equal(r.daily, 367.82);
  assert.equal(r.total, 2206.9);
});

test('全年年假天数档位（条例第三条）', () => {
  assert.equal(C.annualEntitlement(0.5), 0);
  assert.equal(C.annualEntitlement(1), 5);
  assert.equal(C.annualEntitlement(9.9), 5);
  assert.equal(C.annualEntitlement(10), 10);
  assert.equal(C.annualEntitlement(19.99), 10);
  assert.equal(C.annualEntitlement(20), 15);
  assert.equal(C.annualEntitlement(35), 15);
});

test('入职折算：8月8日入职，146÷365×5=2', () => {
  const r = C.joinYearLeave(5, '2026-08-08');
  assert.equal(r.calendarDays, 146);
  assert.equal(r.days, 2);
});

test('入职折算：不足1整天不享受', () => {
  const r = C.joinYearLeave(5, '2026-09-01'); // 122 天 → 1.67
  assert.equal(r.calendarDays, 122);
  assert.equal(r.days, 1);
  assert.equal(C.joinYearLeave(5, '2026-12-01').days, 0); // 31 天 → 0.42
});

test('入职折算：1月1日入职不超过全年', () => {
  assert.equal(C.joinYearLeave(10, '2028-01-01').days, 10); // 闰年 366 天，封顶
});

test('离职折算：8月7日离职，219÷365×5−1=2', () => {
  const r = C.leaveYearLeave(5, '2026-08-07', 1);
  assert.equal(r.calendarDays, 219);
  assert.equal(r.days, 2);
});

test('离职折算：已多休不扣回、不出现负数', () => {
  assert.equal(C.leaveYearLeave(5, '2026-03-01', 5).days, 0);
});

test('离职折算：当年入职又离职，从入职日起算', () => {
  const r = C.leaveYearLeave(10, '2026-12-31', 0, '2026-07-01'); // 184 天 → 5.04
  assert.equal(r.calendarDays, 184);
  assert.equal(r.days, 5);
});

test('补偿月数：满6个月按1年，不满6个月按半年', () => {
  assert.equal(C.compensationMonths(3, 0), 3);
  assert.equal(C.compensationMonths(3, 6), 4);
  assert.equal(C.compensationMonths(3, 5), 3.5);
  assert.equal(C.compensationMonths(0, 4), 0.5);
  assert.equal(C.compensationMonths(0, 6), 1);
});

test('经济补偿 N：8000 × 3.5', () => {
  const r = C.severance({ wage: 8000, years: 3, months: 3 });
  assert.equal(r.months, 3.5);
  assert.equal(r.total, 28000);
});

test('N+1：经济补偿 + 1个月代通知金', () => {
  const r = C.severance({ wage: 10000, years: 2, months: 7, noNotice: true });
  assert.equal(r.compensation, 30000);
  assert.equal(r.notice, 10000);
  assert.equal(r.total, 40000);
  const r2 = C.severance({ wage: 10000, years: 2, months: 7, noNotice: true, lastMonth: 9000 });
  assert.equal(r2.total, 39000); // 按上一个月工资
});

test('2N：违法解除赔偿金为经济补偿标准 2 倍，不再另付补偿/代通知金', () => {
  const r = C.severance({ wage: 10000, years: 5, months: 0, illegal: true, noNotice: true });
  assert.equal(r.compensation, 50000);
  assert.equal(r.damages, 100000);
  assert.equal(r.notice, 0);
  assert.equal(r.total, 100000);
});

test('封顶 3 倍社平 + 年限最高 12 年', () => {
  const r = C.severance({ wage: 50000, years: 15, months: 0, localAvg: 10000 });
  assert.equal(r.capped, true);
  assert.equal(r.base, 30000);
  assert.equal(r.months, 15);
  assert.equal(r.monthsUsed, 12);
  assert.equal(r.total, 360000);
  const r2 = C.severance({ wage: 50000, years: 15, months: 0, localAvg: 10000, illegal: true });
  assert.equal(r2.total, 720000);
});

test('未超 3 倍社平时，年限不封顶（第四十七条 12 年上限只针对高收入）', () => {
  const r = C.severance({ wage: 20000, years: 15, months: 0, localAvg: 10000 });
  assert.equal(r.capped, false);
  assert.equal(r.monthsUsed, 15);
  assert.equal(r.total, 300000);
});

test('恰好等于 3 倍不封顶（原文为“高于”）', () => {
  const r = C.severance({ wage: 30000, years: 13, months: 0, localAvg: 10000 });
  assert.equal(r.capped, false);
  assert.equal(r.total, 390000);
});

test('半年档：工作 4 个月 → 半个月工资', () => {
  const r = C.severance({ wage: 6000, years: 0, months: 4 });
  assert.equal(r.total, 3000);
});

test('低于最低工资按最低工资计', () => {
  const r = C.severance({ wage: 1800, years: 1, months: 0, minWage: 2420 });
  assert.equal(r.usedMin, true);
  assert.equal(r.total, 2420);
});

test('页面不含禁用字样', () => {
  assert.ok(!/\bAI\b|亲测/.test(html));
  assert.ok(html.includes('仅供参考，不构成法律意见') && html.includes('12333'));
  assert.ok(html.includes('2026-10-29'));
  assert.ok(!/<script[^>]+src=|<link[^>]+href=/.test(html)); // 无外部依赖
});
