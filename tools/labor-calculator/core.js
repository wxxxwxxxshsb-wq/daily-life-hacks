// 未休年假工资：日工资 = 月工资 ÷ 21.75；额外应补 = 日工资 × 200% × 天数（合计 300% 中含正常工资）
// 依据：《企业职工带薪年休假实施办法》第十条、第十一条
(function (g) {
  function r2(x) { return Math.round(x * 100) / 100; }
  function leavePay(wage, days) {
    if (!(wage > 0)) throw new Error('wage');
    if (!(days > 0)) throw new Error('days');
    var daily = wage / 21.75;
    return { daily: r2(daily), extra: r2(daily * 2 * days), total: r2(daily * 3 * days), normal: r2(daily * days) };
  }
  var api = { leavePay: leavePay };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else g.LaborCore = api;
})(this);
