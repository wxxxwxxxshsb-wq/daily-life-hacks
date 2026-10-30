# 劳动权益计算器

一个打开就能用的单页小工具，帮你算三笔和打工有关的钱和天数：

1. **未休年假工资**：单位没让你休年假，应该补多少钱
2. **年假天数折算**：新入职或离职那一年，能休、能补几天年假
3. **离职经济补偿**：协商离职、被辞退时的 N、N+1、2N

> 仅供参考，不构成法律意见；拿不准可拨 **12333**（人社服务热线）咨询。
> 是否属于违法解除、工资基数含哪些项目、地方细化规定等，**以当地规定 / 仲裁机构认定为准**。

## 简化版（2026-10-30）

打开网页默认是**一屏简化版**（`index.html` + `core.js` + `style.css`）：只填月工资和没休的天数，直接显示单位还应额外补多少钱（日工资 = 月工资 ÷ 21.75，额外应补 = 日工资 × 200% × 天数）。右上角可切换 English。
原来的三合一完整版移到 `full.html`（年假天数折算、离职补偿 N / N+1 / 2N），简化版页面底部有入口。测试：`node --test`（含 `test-simple.js`）。

## 使用方法

- 直接用浏览器打开 `index.html`（简化版）或 `full.html`（完整版）（手机、电脑都可以），无需安装、无需联网。
- 纯 HTML + CSS + JS 单文件，没有任何外部依赖；所有计算都在本地完成，不上传数据。
- 运行测试：`node --test test.js`（Node 18 及以上）。`test.js` 读取 `full.html` 里的计算代码，`test-simple.js` 测简化版的 `core.js`。

## 公式与依据

依据均于 **2026-10-29** 对照官方原文核对。

### 1. 未休年假工资

| 项目 | 公式 | 依据 |
|---|---|---|
| 月工资 | 支付前 12 个月、剔除加班工资后的月平均工资（不满 12 个月按实际月份） | 实施办法第十一条 |
| 日工资 | 月工资 ÷ 21.75 | 实施办法第十一条 |
| 未休年假工资合计 | 日工资 × 300% × 未休天数（**其中包含正常工作期间工资**） | 实施办法第十条、条例第五条 |
| 额外应补 | 日工资 × 200% × 未休天数 | 由第十条“300% 中包含正常工资”推出 |

例：月工资 6525 元 → 日工资 300 元；未休 3 天 → 合计 2700 元，其中 900 元是正常工资，额外应补 1800 元。
职工本人原因且书面提出不休的，单位可只付正常工资（第十条第二款）。

### 2. 年休假天数

- 全年天数：累计工作满 1 年不满 10 年 5 天；满 10 年不满 20 年 10 天；满 20 年 15 天（条例第三条）。
- 享受条件：连续工作满 12 个月以上（实施办法第三条）；累计工作时间含不同单位（实施办法第四条）。
- 新入职当年：`⌊ 剩余日历天数 ÷ 365 × 全年天数 ⌋`，不足 1 整天不享受（实施办法第五条）。
  例：8 月 8 日入职（剩余 146 天）→ 146 ÷ 365 × 5 = 2 天。
- 离职当年：`⌊ 已过日历天数 ÷ 365 × 全年天数 − 当年已安排天数 ⌋`，不足 1 整天不支付，多休的不扣回（实施办法第十二条）。
  例：8 月 7 日离职（已过 219 天）、已休 1 天 → 219 ÷ 365 × 5 − 1 = 2 天。
- 日历天数按“含首尾两天”计算；原文统一除以 365，闰年同样除以 365，结果不超过全年天数。

### 3. 离职经济补偿

| 项目 | 规则 | 依据 |
|---|---|---|
| 补偿月数 N | 每满 1 年 1 个月；零头满 6 个月按 1 年；不满 6 个月按半个月 | 劳动合同法第四十七条 |
| 月工资 | 解除前 12 个月平均应得工资，含计时/计件工资、奖金、津贴、补贴；不满 12 个月按实际月数；低于当地最低工资按最低工资 | 第四十七条第三款、实施条例第二十七条 |
| 高收入封顶 | 月工资**高于**当地上年度职工月平均工资 3 倍的：基数按 3 倍，**且**年限最多 12 年（不高于 3 倍的，年限不封顶） | 第四十七条第二款 |
| N+1 | 单位依第四十条解除且未提前 30 天书面通知：另付 1 个月工资，按上一个月工资标准 | 第四十条、实施条例第二十条 |
| 2N | 违法解除/终止且劳动者不要求继续履行：按经济补偿标准 2 倍付赔偿金，付了赔偿金不再付经济补偿，年限自用工之日起算 | 第四十八条、第八十七条、实施条例第二十五条 |
| 应付补偿的情形 | 见第四十六条（协商一致由单位提出、第三十八条被迫解除、第四十条、第四十一条裁员、固定期限合同到期单位不续等） | 第四十六条 |

当地上年度职工月平均工资请到所在城市人社局官网搜索“社平工资 / 上年度职工月平均工资”，以设区的市级政府公布的数为准。

### 原文链接

- 《企业职工带薪年休假实施办法》（人社部令第 1 号）：https://www.gov.cn/zhengce/2022-08/31/content_5711300.htm
- 《职工带薪年休假条例》（国务院令第 514 号）：https://www.gov.cn/zhengce/2007-12/16/content_2602498.htm
- 《中华人民共和国劳动合同法》（中国人大网）：http://www.npc.gov.cn/npc/c2/c183/c198/201905/t20190522_26978.html
  - 2012 年修正决定（只改第五十七、六十三、六十六、九十二条，与本工具无关）：http://www.npc.gov.cn/zgrdw/huiyi/cwh/1130/2012-12/29/content_1749758.htm
- 《中华人民共和国劳动合同法实施条例》（国务院令第 535 号）：https://www.gov.cn/zhengce/2008-09/19/content_2602519.htm

> 官方已公开表示将推动修订《职工带薪年休假条例》。截至 2026-10-29 未见修订后的正式文本，本工具按现行规定计算，修订公布后再更新。

## 本工具不判断的事项

- 是否构成违法解除、是否属于应付经济补偿的情形
- 2008 年以前工作年限的补偿（劳动合同法第九十七条另有规定）、非本人原因换单位的年限合并（实施条例第十条）
- 病假、事假达到条例第四条天数而不享受年假的情形，寒暑假抵扣
- 各省市的地方细化规定，以及劳动合同、集体合同中高于法定标准的约定

以上情况请以当地规定 / 仲裁机构认定为准，或拨打 12333 咨询。

## 免责声明

本工具仅按公开的法律法规原文做算术计算，结果仅供参考，不构成法律意见，不对任何具体案件的结果负责。

## 许可

MIT License

Copyright (c) 2026

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
