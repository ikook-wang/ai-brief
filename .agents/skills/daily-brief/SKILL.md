---
name: daily-brief
description: 出一期“AI 工具变化简报”：按北京时间某一天的窗口，核查 Codex、ChatGPT、Claude（含 Claude Code）、DeepSeek 的官方更新，写出 raw/YYYY-MM-DD.md 原文和 data/YYYY-MM-DD.json 数据，本地预览后汇报。当 Steve 让你出某一天的简报、补某一期、重做或核对某一期简报时使用。
---

# 出一期简报

收录标准、信息源和数据格式以项目根目录的 `AGENTS.md` 为准，本技能只讲怎么做。开始前先读一遍 `AGENTS.md` 和最近一期的 `raw/`、`data/`，照着它们的写法来。

日期由 Steve 当次指定，下文叫“当天”。没给日期就先问，不要自己猜。

## 1. 换算时间窗口

```bash
python3 .agents/skills/daily-brief/scripts/brief_time.py window YYYY-MM-DD
```

输出的北京时间、UTC 和太平洋时间三段直接写进原文开头。脚本会自动判断 PDT/PST。夏令时切换那天，窗口两端的时区可能不一样，照脚本输出写。

## 2. 按顺序查来源

先查能拿到精确时间的来源，后查只标日期的，最后用 X 补时间。每个页面都要记下有没有打开、内容全不全，最后要汇报。

1. **GitHub 发布记录**（Codex、Claude Code）：读 API 里的 `published_at`，同时看是不是预发布版本：
   ```bash
   gh api 'repos/openai/codex/releases?per_page=30' --jq '.[] | [.tag_name, .published_at, .prerelease] | @tsv'
   gh api 'repos/anthropics/claude-code/releases?per_page=30' --jq '.[] | [.tag_name, .published_at, .prerelease] | @tsv'
   ```
   `gh` 不可用时，用 curl 访问 `api.github.com` 上同一个接口。
2. **官方博客和新闻**（OpenAI 官方博客、Anthropic 官方新闻）：在列表页找到窗口前后几天的文章，再打开文章页读 `article:published_time` / `datePublished`。OpenAI 有 RSS 的，就读 `pubDate`。
3. **只标日期的发布说明和更新日志**（learn.chatgpt.com 更新日志、ChatGPT 发布说明、Claude 发布说明、DeepSeek 更新记录与新闻）：记下当天，以及前后一天的条目，留到第 3 步确认时间。
4. **X 账号**（@OpenAI、@OpenAIDevs、@claudeai、@AnthropicAI、@deepseek_ai）：一是找有没有第 1—3 步漏掉的官方消息，二是给只标日期的条目找推文时间。写清楚时间线加载到了哪个时段。

普通抓取返回 403 或内容不全时，改用浏览器打开同一个官方页面，并在原文里注明“用浏览器打开”。不要换成别的网站。

## 3. 确认每一条的发布时间

每一条都按下面的顺序走，得出一个结论：

1. 有精确时间（`published_at`、`datePublished`、`pubDate`、推文时间）的，换算成北京时间：
   ```bash
   python3 .agents/skills/daily-brief/scripts/brief_time.py bj 2026-10-29T19:47:00Z "Thu, 29 Oct 2026 09:00:00 GMT"
   ```
2. 推文时间从推文 ID 解码。可以挑一两条打开详情页核对，并在原文里说明核对过：
   ```bash
   python3 .agents/skills/daily-brief/scripts/brief_time.py tweet <推文ID> ...
   ```
3. 只标日期的条目，用同一件事的推文、博客或 RSS 时间来判断；找到一个就够了。
4. 时间是 `00:00:00` 的，很可能只填了日期，不能当成精确时间用。
5. 判断结果分三种：
   - 在窗口内：收录。
   - 找不到精确时间、但官方日期是当天：收录，标“时间未公开”。
   - 其余情况：不收。离窗口很近、或者容易被误收的，写进“已排除的临近条目”。

同一件事在多个来源出现（例如博客和推文），按最早的官方时间判断，合并成一条。

## 4. 写原文 raw/YYYY-MM-DD.md

按 `AGENTS.md` 规定的结构写，参照最近一期的标题层级、粗体字段和表格写法。

- 每条都写清楚时间依据，例如“GitHub 发布记录 `published_at`”或“推文 ID 解码”。
- 评分和推荐理由，以对 Steve 实际使用的影响为准；“是否调整用法”按 `AGENTS.md` 的口径填。
- 没有更新的工具写“今天没有”，并列出查过的页面。
- 原文写完，自己对照第 2 步的记录核对一遍：每个查过的页面都要在正文、已排除条目或未能查到的页面里出现。

## 5. 写数据 data/YYYY-MM-DD.json

- 只从刚写好的原文里取内容。`summary` 和 `reason` 可以压缩，但不能加原文没有的事实。
- 在 `data/index.json` 的 `issues` 里按日期顺序加上这一期。
- 写完先检查一遍格式：

```bash
python3 -c "import json,sys; json.load(open(sys.argv[1])); json.load(open('data/index.json')); print('ok')" data/YYYY-MM-DD.json
```

再逐项核对 `tool`、`adjust`、`time`、`score` 的取值有没有超出 `AGENTS.md` 规定的范围。同时核对每条的 `score` 和 `adjust` 是否符合 `AGENTS.md` 的评分分档：85 分以上必须是“需要”，写“需要”的必须在 85 分以上。

## 6. 本地预览

```bash
python3 -m http.server 8000
```

放在后台运行。用浏览器打开 http://localhost:8000，实际看一遍：

- 新一期出现在时间线上，日期、星期、条目数和原文一致。
- 有时间的条目按时间倒序排，时间未公开的排在当天最后。
- 点一遍顶部按钮，每个工具都能筛出这一期对应的条目。
- 当天没有更新的工具、没打开的页面都显示出来了。

只启动了服务、没有实际看过页面，就不能说“显示正常”。看完关掉服务。

## 7. 汇报

不提交、不推送。向 Steve 汇报三件事：

1. 查了哪些页面
2. 每一条的发布时间是怎么确认的（用的哪种依据，换算成北京时间是几点）
3. 哪些页面没打开或内容不全，以及这会影响哪些结论

再附上新增和修改了哪些文件，以及本地预览的实际检查结果。
