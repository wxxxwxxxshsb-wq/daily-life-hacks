// 商家原因（停业、跑路等）退卡，充值送钱卡：
// 已消费价款 = 卡面已扣 × 实付 ÷ (实付 + 赠送)；应退 = 实付 − 已消费价款
// 化简后：应退 = 卡里余额 × 实付 ÷ (实付 + 赠送)
// 依据：法释〔2025〕4号 第十五条、第十八条（二）
(function (g) {
  function r2(x) { return Math.round(x * 100) / 100; }
  function refund(balance, paid, gift) {
    gift = gift || 0;
    if (!(paid > 0)) throw new Error('paid');
    if (!(balance >= 0)) throw new Error('balance');
    if (gift < 0) throw new Error('gift');
    if (balance > paid + gift + 1e-9) throw new Error('over');
    return { refund: r2(balance * paid / (paid + gift)), used: r2(paid + gift - balance), ratio: paid / (paid + gift) };
  }
  var api = { refund: refund };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else g.PrepaidCore = api;
})(this);
