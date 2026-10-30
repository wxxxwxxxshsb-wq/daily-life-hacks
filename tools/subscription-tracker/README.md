# 订阅清单 Subscription Tracker

记下每月自动扣费的订阅，看看每月花多少钱。

在线使用：https://wxxxwxxxshsb-wq.github.io/daily-life-hacks/tools/subscription-tracker/

## 怎么用

1. 点“添加订阅”
2. 填名称和金额（多久扣一次：每月 / 每年；扣费日期默认今天）
3. 看每月合计（下面小字是一年大约多少）

列表里显示每个订阅折合每月多少钱、还有几天扣费，3 天内要扣费的标橙色。点一条可以修改，点右边垃圾桶删除（可撤销）。

右上角“…”里有：导出日历提醒（`.ics`，扣费前 3 天上午 9 点提醒）、导出 / 导入备份（JSON）、中文 / English、清空全部。币种在添加表单的“更多选项”里，默认人民币；不同币种分开合计，不做汇率换算。

可以“添加到主屏幕”，断网也能打开；跟随系统深色模式。

## 隐私

数据只存在你这台设备的浏览器里（localStorage），不上传、不注册，没有统计或广告代码，页面不请求任何外部资源。换手机或清浏览器数据前先导出备份；iPhone 的 Safari 可能清掉长期没打开的网站数据。

## 开发

纯 HTML + CSS + JS，无外部依赖。`core.js` 是计算逻辑，`app.js` 是界面，`sw.js` / `manifest.json` 负责离线和安装。测试：`node --test test.js`（Node 18+）。

## English

Track subscriptions that renew automatically and see what you spend each month. Add a name and an amount (monthly or yearly); the app shows your monthly total, a yearly estimate, and how many days until each charge (orange within 3 days). The "…" menu has calendar reminders (.ics, 9 AM three days before), JSON backup export / import, language, and delete all. Data stays only in this browser on this device. Installable and works offline.

## License

MIT
