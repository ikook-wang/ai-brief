# 出简报规则

每次出简报都按这里执行。具体日期由 Steve 当次指定，下文用“当天”代指。

## 信息源

只查下面这些官方来源：

- OpenAI
  - ChatGPT 与 Codex 更新日志：https://learn.chatgpt.com/docs/changelog
  - ChatGPT 发布说明：https://help.openai.com/en/articles/6825453-chatgpt-release-notes
  - Codex 发布记录：https://github.com/openai/codex/releases
  - OpenAI 官方博客：https://openai.com/news/
  - X：@OpenAI、@OpenAIDevs
- Anthropic
  - 官方新闻：https://www.anthropic.com/news
  - Claude 发布说明：support.claude.com 的 Release Notes
  - Claude Code 发布记录：https://github.com/anthropics/claude-code/releases
  - X：@claudeai、@AnthropicAI
- DeepSeek
  - 官方新闻和更新记录：https://api-docs.deepseek.com/news/、https://api-docs.deepseek.com/updates
  - X：@deepseek_ai

## 时间窗口

- 窗口是北京时间当天 00:00 到次日 00:00，窗口外的一律不收。
- 开始前先把窗口换算成 UTC 和美国太平洋时间，写在原文开头。注意夏令时：PDT 是 UTC−7，PST 是 UTC−8。
- 官方日期多数是美国时间，不能直接当北京日期用。
- 能查到精确时间的，换算成北京时间再判断。可用的依据：GitHub 的 `published_at`、文章页的 `article:published_time` / `datePublished`、官方 RSS 的 `pubDate`、官方 X 推文时间。
- 发布说明只标日期时，先找同一条的其他官方时间依据（推文、博客、RSS）；找到就按精确时间判断。
- 找不到精确时间、官方日期又是当天的，收录并标“时间未公开”；官方日期不是当天的不收。
- 临近窗口、最后被排除的条目，列进原文的“已排除的临近条目”，写明时间依据和北京时间。

## 内容

- 只收官方发布的消息，原文链接必须是官方页面，不用媒体报道和转述。
- 只写查到的内容，不补充、不推测、不编。
- 只有版本号、没有更新内容的预发布版本，不单独列。
- 客户案例、社区展示等不是产品变化的内容，不收。
- 某个工具当天没有确认的更新，写“今天没有”，并说明查了哪些页面；页面没打开时要写明“不代表当天确实没有”。

## 打不开的页面

- 打不开、内容不全的页面如实记下来，不用其他网站代替。
- 普通抓取被拦（比如返回 403）时，可以改用浏览器打开同一官方页面；打开了就算查过，并在原文里说明。
- X 账号未登录浏览可能显示不全，没加载到的时段要写明。

## 原文 raw/YYYY-MM-DD.md

沿用已有两期的结构：

1. 标题、日期和窗口、窗口换算、核查结论
2. 分节：一、Codex；二、ChatGPT；三、Claude（含 Claude Code）；四、DeepSeek
3. 每条写：标题（评分/100）、官方发布时间及依据、北京时间及是否在窗口内、是否调整用法、变化内容、推荐理由、官方原文链接
4. 已排除的临近条目
5. 未能完整查到的页面

## 数据 data/YYYY-MM-DD.json

格式见 README，补充约定：

- `window` 固定写成 `北京时间 X 月 D 日 00:00—24:00`。
- `tool` 只用 `Codex`、`ChatGPT`、`Claude`、`Claude Code`、`DeepSeek`；页面筛选按前缀匹配，`Claude Code` 归在 Claude 下。
- `time` 是北京时间 `HH:MM`；时间未公开的写 `null`。
- `source` 沿用已有写法：`GitHub 发布记录`、`ChatGPT 发布说明`、`OpenAI 官方博客`、`Anthropic 官方新闻`、`X @账号名` 等。
- `adjust` 只用 `需要`、`可以关注`、`不需要`；`score` 是 0—100 的整数。
- `quiet` 写当天没有更新的工具；`failed` 写没打开或内容不全的页面，不全时在 `name` 后用括号说明。
- JSON 里的内容只能来自 raw 原文，不另外改写事实。
- 在 `data/index.json` 的 `issues` 里按日期顺序加上这一期。不改网页代码。

## 交付

- 用 `python3 -m http.server 8000` 本地预览，实际打开页面确认新一期显示正常。
- 不提交、不推送，等 Steve 看过再说。
- 最后汇报三件事：
  1. 查了哪些页面
  2. 每一条的发布时间是怎么确认的
  3. 哪些页面没打开或内容不全
