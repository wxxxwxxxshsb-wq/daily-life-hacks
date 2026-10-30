# 订阅清单 Subscription Tracker

一年在会员和订阅上到底花了多少钱？把视频会员、网盘、AI 助手、App 订阅都记下来，这个单页小工具帮你：

1. **算总账**：每月合计、每年合计（季付 ÷ 3、年付 ÷ 12 折算；不同币种分开合计，不做汇率换算）
2. **排顺序**：按每月金额从高到低排，一眼看出最贵的是哪个
3. **快扣费提醒**：7 天内要扣费的订阅高亮显示；下次扣费日过了会按周期自动顺延
4. **加进手机日历**：导出 `.ics` 日历文件，每个订阅按周期重复，扣费日前 3 天上午 9 点提醒
5. **备份**：导出 / 导入 JSON 备份，导入时和现有清单合并

在线使用：https://wxxxwxxxshsb-wq.github.io/daily-life-hacks/tools/subscription-tracker/

> **数据只在你这台设备的浏览器里，换设备或清数据前请先导出备份；Safari 长期不访问可能清掉数据。**
> 页面没有服务器、不联网、没有任何统计脚本，数据存在浏览器 localStorage，不上传、不收集。

## 使用方法

- 直接用浏览器打开 `index.html`（手机、电脑都可以），无需安装、无需联网。右上角可切换中文 / English。
- 纯 HTML + CSS + JS 单文件，没有任何外部依赖或 CDN。
- `.ics` 用手机或电脑自带的日历打开即可导入；提醒能否弹出取决于你的日历 App。
- 运行测试：`node --test test.js`（Node 18 及以上）。测试直接读取 `index.html` 里的核心代码。

## English

A single-page, offline subscription tracker. Add subscriptions (name, amount, currency, monthly / quarterly / yearly, next charge date, note), see monthly and yearly totals per currency, sort by cost, highlight renewals due within 7 days, export an `.ics` calendar with an alert 3 days before each charge, and export / import a JSON backup.

**Your data stays only in this browser on this device.** No server, no network requests, no analytics, no external dependencies. Export a backup before switching devices or clearing browser data; Safari may delete data for sites you have not visited in a long time.

## License

MIT
