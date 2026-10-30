# 订阅清单 Subscription Tracker

像手机 App 一样用的订阅记账本：把视频、音乐、网盘、软件、学习类会员记下来，看清**本月应付**和**一年合计**，扣费前提醒你。可以“添加到主屏幕”，断网也能打开。

在线使用：https://wxxxwxxxshsb-wq.github.io/daily-life-hacks/tools/subscription-tracker/

## 功能

- **订阅**：卡片列表，按下次扣费日排序；7 天内要扣费的标橙色。点一下编辑，左滑或长按可编辑、删除（删除可撤销）。
- **添加**：右下角“+”弹出底部表单：名称、分类（影音 / 音乐 / 云盘 / 软件 / 学习 / 其他）、金额和币种、周期（每月 / 每季度 / 每年）、下次扣费日、备注。
- **合计**：本月应付、一年合计、月均；不同币种分开算，不做汇率换算。
- **统计**：分类占比环形图、未来 12 个月按扣费日预估的柱状图。
- **日历**：月视图标出每个扣费日，点某天看当天扣哪些。
- **设置**：导出日历提醒 `.ics`（每个订阅按周期重复，扣费前 3 天上午 9 点提醒）、导出 / 导入 JSON 备份（导入与现有清单合并）、中文 / English、清空数据、隐私说明。
- 跟随系统的浅色 / 深色模式。

## 隐私

**数据只在你这台设备的浏览器里（localStorage）**，没有服务器、不注册、不上传，没有统计或广告代码，页面不请求任何外部资源。

- 换手机、换浏览器或清除浏览器数据前，先“导出备份”，到新设备再“导入备份”。
- iPhone 的 Safari 可能清掉长期没打开的网站数据，添加到主屏幕后打开更稳，但仍建议定期导出备份。
- 不能主动推送通知，提醒靠导入日历的 `.ics` 文件。

## 文件

| 文件 | 说明 |
| --- | --- |
| `index.html` | 页面和样式 |
| `core.js` | 核心计算（折算、合计、扣费日顺延、预估、`.ics`、备份），纯函数 |
| `app.js` | 界面逻辑 |
| `sw.js` / `manifest.json` / `icon-*.png` | 离线缓存和“添加到主屏幕” |
| `test.js` | 单元测试：`node --test test.js`（Node 18+） |

纯 HTML + CSS + JS，没有任何外部依赖或 CDN。

## English

A mobile-first, installable (PWA) subscription tracker. Add subscriptions with a category, amount, currency, monthly / quarterly / yearly cycle and next charge date. See what is due this month and what you pay per year (each currency totaled separately), a category donut chart, a 12-month forecast, and a calendar of charge dates. Renewals within 7 days are highlighted. Export an `.ics` calendar with an alert at 9 AM, 3 days before each charge, and export / import a JSON backup. Works offline after the first visit.

**Your data stays only in this browser on this device.** No server, no account, no network requests, no analytics. Export a backup before switching devices or clearing browser data; Safari may delete data for sites you have not opened in a while.

## License

MIT
