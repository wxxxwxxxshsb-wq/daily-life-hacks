# 预付卡退款计算器

商家跑路、停业、迁店，或者自己不想用了：办的充值卡、次卡、年卡到底能退多少？这个单页小工具按最高人民法院 2025 年施行的预付式消费司法解释原文帮你算：

1. **储值卡**：“充 2000 送 1000”这类充值送金额，以及“办卡打 7 折”
2. **次卡**：按次数消费，赠送次数也算进总数
3. **年卡 / 月卡**：期限内不限次数，按剩余天数比例退
4. **7 天反悔**：付款之日起 7 日内要求退回本金
5. **利息估算**（可选）

> 仅供参考，不构成法律意见。商家拒退可拨 **12315**（市场监管投诉）或 **12345**（政务服务热线），也可找当地消费者协会调解或向法院起诉。
> 属于“商家原因”还是“自己原因”、合同能否解除、地方细化规定等，**以当地主管部门 / 法院认定为准**。

## 使用方法

- 直接用浏览器打开 `index.html`（手机、电脑都可以），无需安装、无需联网。
- 纯 HTML + CSS + JS 单文件，没有任何外部依赖；所有计算都在本地完成，不上传数据。
- 运行测试：`node --test test.js`（Node 18 及以上）。测试直接读取 `index.html` 里的计算代码。

## 公式与依据

依据均于 **2026-10-29** 对照官方原文核对。以下“解释”指《最高人民法院关于审理预付式消费民事纠纷案件适用法律若干问题的解释》（法释〔2025〕4号，2025-05-01 起施行）。

| 情形 | 公式 | 依据 |
|---|---|---|
| 充值送金额，商家原因退 | 已消费价款 = 卡面已扣 × 实付 ÷ (实付 + 赠送)；应退 = 实付 − 已消费价款 | 解释第十五条、第十八条（二） |
| 办卡打折，商家原因退 | 已消费价款 = 原价合计 × 折扣；应退 = 实付 − 已消费价款 | 解释第十八条（一） |
| 自己原因退（有折扣或赠送） | 已消费价款按打折前原价；应退 = max(0, 实付 − 已消费价款)，不倒补 | 解释第十九条、第二十条 |
| 次卡，商家原因退 | 应退 = 实付 × 剩余次数 ÷ (购买次数 + 赠送次数) | 解释第十八条；最高法典型案例三 |
| 次卡，自己原因退 | 应退 = max(0, 实付 − 已用次数 × 单次打折前原价) | 解释第十九条、第二十条 |
| 年卡 / 月卡（不限次数） | 应退 = 实付 × 剩余天数 ÷ 全部天数；商家先停业的，从停业日起算剩余期限；自己没去用、期限已过的不退 | 解释第二十二条 |
| 7 天反悔 | 付款之日起 7 日内可要求返还本金；办卡时已在该店或别家获得过相同服务的除外；开始的当日不计入 | 解释第十四条；民法典第二百零一条 |
| 利息（可选） | 本金 × 年利率 × 天数 ÷ 365；商家原因用合同成立时一年期 LPR，自己原因用一年定期存款基准利率；自合同解除时起算 | 解释第十五条、第十六条、第十七条 |

### 用法院公开案例核对

| 案例 | 法院结果 | 本工具结果 |
|---|---|---|
| 最高人民法院典型案例三：次卡 50 次送 10 次，付 2000 元，用 12 次，健身公司终止服务 | 2000 × 48 ÷ 60 = 1600 元 | 1600.00 元 |
| 潢川县法院（信阳中院 2025-12-15 发布）：充 2000 送 1000，卡面消费 434 元，采耳店停业 | 1711 元 | 1710.67 元（法院取整） |
| 最高人民法院典型案例二：800 元游乐场年卡（2021-10-25 至 2022-10-25），2022-02-01 停业 | 599 元 | 583.01 元（按天数 266 ÷ 365）。判决书摘要未写折算口径，按月折算等方法结果会略有不同，因此页面提示“以法院认定为准” |

### 原文链接

- 解释全文（中国政府网）：https://www.gov.cn/yaowen/liebiao/202503/content_7020334.htm
- 解释全文（最高人民法院公报）：http://gongbao.court.gov.cn/Details/415add6e9c15736f2fbd871bdb1538.html
- 最高人民法院涉预付式消费典型案例：https://www.court.gov.cn/zixun/xiangqing/459331.html
- 信阳市中级人民法院“充2000送1000”案例：https://hnxyzy.hncourt.gov.cn/public/detail.php?id=14058
- 《消费者权益保护法》第二十六条、第五十三条、第五十五条（市场监管总局网站）：https://www.samr.gov.cn/zw/zfxxgk/fdzdgknr/fgs/art/2023/art_0a323e046fba43f0b6e9e977f1e8d5fc.html
- 《消费者权益保护法实施条例》第二十二条（中国政府网）：https://www.gov.cn/zhengce/content/202403/content_6940158.htm
- 人民币存款基准利率表（中国人民银行，2015-10-24 一年定期 1.50%）：https://www.pbc.gov.cn/zhengcehuobisi/125207/125213/125440/125838/125888/2968982/index.html
- 2026-10-20 一年期 LPR 3.0%（新华社）：https://www.news.cn/20261020/b68d5e1b300e4a5bbfe5c1149cba5314/c.html

## 本工具不判断的事项

- 退款原因属于“商家原因”还是“自己原因”，合同能否解除（解释第十三条列了迁店造成明显不便、未经同意转给第三人等情形）
- 赠送的实物或服务是否要折价（解释第二十一条，由法院综合认定）
- 惩罚性赔偿能否成立、金额多少（解释第二十三条、消保法第五十五条）
- 多用途预付卡、一次性买断的商品或服务（不适用该解释）
- 合同中对消费者更有利的约定（按约定处理），以及各地关于单用途预付卡的地方规定

以上情况请以当地主管部门 / 法院认定为准，或拨打 12315、12345 咨询。

## 免责声明

本工具仅按公开的司法解释和法律法规原文做算术计算，结果仅供参考，不构成法律意见，不对任何具体案件的结果负责。

## 许可

MIT License

Copyright (c) 2026

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
