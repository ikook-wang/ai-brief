# AI 工具变化简报

每天追踪 Codex、ChatGPT、Claude、DeepSeek 的官方更新，按时间线展示在网页上。这是《AI 实践指南》系列的贯穿案例。

线上地址：https://brief.ikookblog.com

## 项目结构

```
index.html        页面骨架
style.css         样式
app.js            读取数据并渲染时间线
data/index.json   期数列表
data/YYYY-MM-DD.json  每一期的结构化数据
raw/YYYY-MM-DD.md     每一期 AI 交回来的原文，留作核对
```

## 新增一期

1. 把核对过的简报原文存到 `raw/YYYY-MM-DD.md`。
2. 按下面的格式整理成 `data/YYYY-MM-DD.json`。
3. 在 `data/index.json` 的 `issues` 里加上这一天的日期。

不用改网页代码。

每一期的数据格式：

```json
{
  "date": "2026-10-09",
  "window": "北京时间 10 月 9 日 00:00—24:00",
  "items": [
    {
      "time": "03:48",
      "tool": "Claude Code",
      "source": "GitHub 发布记录",
      "title": "一句话标题",
      "summary": "一两句话说清楚变了什么",
      "reason": "一句推荐理由",
      "adjust": "需要 / 可以关注 / 不需要",
      "score": 88,
      "url": "官方原文链接"
    }
  ],
  "quiet": [{ "tool": "DeepSeek", "note": "当天没有变化的说明" }],
  "failed": [{ "name": "@deepseek_ai", "url": "https://x.com/deepseek_ai" }]
}
```

- `time` 用北京时间 `HH:MM`；官方只公开日期的写 `null`，页面显示“时间未公开”并排在当天最后。
- 有时间的条目按时间倒序显示，最新的在上面。
- 内容只用简报原文里已有的信息，不补充、不改写事实。

## 本地预览

页面用 `fetch` 读取数据，直接双击打开 `index.html` 会被浏览器拦截，需要起一个本地服务：

```bash
python3 -m http.server 8000
```

然后打开 http://localhost:8000 。

## 部署

纯静态页面，没有构建步骤。推送到 GitHub 后由 Cloudflare Pages 自动发布。
