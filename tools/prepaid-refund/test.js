// 运行：node --test test.js
// 直接从 index.html 中提取计算核心（@@CORE-START ~ @@CORE-END），保证测的就是页面里的代码。
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
const C = sandbox.PrepaidCalc;

test('法院案例：充2000送1000，卡面消费434，商家停业 → 应退1710.67（判决取整1711）', () => {
  const r = C.giftCard(2000, 1000, 434, 'merchant');
  assert.equal(r.consumed, 289.33);
  assert.equal(r.refund, 1710.67);
  assert.equal(r.cardBalance, 2566);
  assert.equal(Math.round(r.refund), 1711);
});

test('司法解释第十八条示例：充1000送200，消费600 → 退500', () => {
  assert.equal(C.giftCard(1000, 200, 600, 'merchant').refund, 500);
});

test('自己原因退卡：按原价扣，充1000送200消费600 → 退400', () => {
  const r = C.giftCard(1000, 200, 600, 'consumer');
  assert.equal(r.refund, 400);
  assert.equal(r.capped, false);
});

test('第二十条：原价算超出预付款，不倒补，退0', () => {
  const r = C.giftCard(10000, 10000, 15000, 'consumer');
  assert.equal(r.refund, 0);
  assert.equal(r.capped, true);
  // 同一张卡若是商家原因：15000×0.5=7500，退2500
  assert.equal(C.giftCard(10000, 10000, 15000, 'merchant').refund, 2500);
});

test('无赠送：按实付扣', () => {
  assert.equal(C.giftCard(500, 0, 120, 'merchant').refund, 380);
  assert.equal(C.giftCard(500, 0, 120, 'consumer').refund, 380);
});

test('储值卡输入校验', () => {
  assert.throws(() => C.giftCard(0, 0, 0, 'merchant'));
  assert.throws(() => C.giftCard(100, 50, 151, 'merchant'));
  assert.throws(() => C.giftCard(100, -1, 0, 'merchant'));
});

test('打折卡：付1000打7折，已用原价800 → 商家原因退440，自己原因退200', () => {
  assert.equal(C.discountCard(1000, 7, 800, 'merchant').refund, 440);
  assert.equal(C.discountCard(1000, 7, 800, 'consumer').refund, 200);
});

test('打折卡：自己原因原价超出预付款 → 0 且标记', () => {
  const r = C.discountCard(1000, 7, 1200, 'consumer');
  assert.equal(r.refund, 0);
  assert.equal(r.capped, true);
  assert.equal(C.discountCard(1000, 7, 1200, 'merchant').refund, 160);
});

test('打折卡输入校验', () => {
  assert.throws(() => C.discountCard(1000, 0, 100, 'merchant'));
  assert.throws(() => C.discountCard(1000, 11, 100, 'merchant'));
  assert.throws(() => C.discountCard(1000, 7, 2000, 'merchant')); // 折后1400 > 实付
});

test('最高法典型案例三：次卡50+送10，付2000用12次 → 退1600', () => {
  const r = C.countCard(2000, 50, 10, 12, 'merchant');
  assert.equal(r.refund, 1600);
  assert.equal(r.total, 60);
  assert.equal(r.left, 48);
});

test('次卡自己原因：用12次×原价50 → 退1400；原价超出 → 0', () => {
  assert.equal(C.countCard(2000, 50, 10, 12, 'consumer', 50).refund, 1400);
  const r = C.countCard(2000, 50, 10, 45, 'consumer', 50);
  assert.equal(r.refund, 0);
  assert.equal(r.capped, true);
});

test('次卡输入校验', () => {
  assert.throws(() => C.countCard(2000, 50, 10, 61, 'merchant'));
  assert.throws(() => C.countCard(2000, 0, 0, 0, 'merchant'));
  assert.throws(() => C.countCard(2000, 10.5, 0, 0, 'merchant'));
  assert.throws(() => C.countCard(2000, 50, 0, 1, 'consumer')); // 缺原价
});

test('期限卡：365天卡，剩73天，付730 → 退146', () => {
  const r = C.timeCard(730, '2026-01-01', '2027-01-01', '2026-10-20');
  assert.equal(r.total, 365);
  assert.equal(r.left, 73);
  assert.equal(r.refund, 146);
});

test('期限卡：已过期/未开始', () => {
  const a = C.timeCard(800, '2026-01-01', '2027-01-01', '2027-02-01');
  assert.equal(a.refund, 0);
  assert.equal(a.expired, true);
  const b = C.timeCard(800, '2026-01-01', '2027-01-01', '2025-12-01');
  assert.equal(b.refund, 800);
  assert.equal(b.beforeStart, true);
});

test('期限卡：日期校验（含非法日期 2月30日）', () => {
  assert.throws(() => C.timeCard(800, '2026-02-30', '2027-01-01', '2026-05-01'));
  assert.throws(() => C.timeCard(800, '2027-01-01', '2026-01-01', '2026-05-01'));
  assert.throws(() => C.timeCard(800, '', '2027-01-01', '2026-05-01'));
});

test('7天反悔：付款日不计入，10-29付款最后一天11-05', () => {
  const r = C.coolingOff('2026-10-29', '2026-11-05', false);
  assert.equal(r.lastDay, '2026-11-05');
  assert.equal(r.inTime, true);
  assert.equal(r.ok, true);
  assert.equal(C.coolingOff('2026-10-29', '2026-11-06', false).inTime, false);
  assert.equal(C.coolingOff('2026-10-29', '2026-10-30', true).ok, false);
  assert.throws(() => C.coolingOff('2026-10-29', '2026-10-28', false));
});

test('7天反悔：跨年', () => {
  assert.equal(C.coolingOff('2026-12-28', '2027-01-04', false).ok, true);
  assert.equal(C.coolingOff('2026-12-28', '2027-01-04', false).lastDay, '2027-01-04');
});

test('利息：1000元×3%×365天 = 30', () => {
  assert.equal(C.interest(1000, 3, '2026-01-01', '2027-01-01').interest, 30);
  assert.equal(C.interest(1710.67, 3.1, '2026-03-01', '2026-10-29').days, 242);
  assert.equal(C.interest(1710.67, 3.1, '2026-03-01', '2026-10-29').interest, 35.16);
  assert.throws(() => C.interest(1000, 3, '2026-05-01', '2026-04-01'));
});
