# 出简报规则

每次出简报都要遵守这里的约定。具体日期每次由使用者指定，下文用“当天”代指。

操作步骤（换算窗口、查来源的顺序、确认时间、写原文和数据、预览、汇报）见技能 `.agents/skills/daily-brief/SKILL.md`。

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
- 官方日期多数是美国时间，不能直接当北京日期用。夏令时期间太平洋时间是 PDT（UTC−7），其余时间是 PST（UTC−8）。
- 可以作为精确时间依据的：GitHub 的 `published_at`、文章页的 `article:published_time` / `datePublished`、官方 RSS 的 `pubDate`、官方 X 推文时间。
- 发布说明只标日期时，同一条有其他官方精确时间的，按精确时间判断。
- 找不到精确时间、官方日期又是当天的，收录并标“时间未公开”；官方日期不是当天的，不收。

## 收录标准

- 只收官方发布的消息，原文链接必须是官方页面，不用媒体报道和转述。
- 只写查到的内容，不补充、不推测、不编。
- 只有版本号、没有更新内容的预发布版本，不单独列。
- 客户案例、社区展示等不是产品变化的内容，不收。
- “是否调整用法”：不是产品功能变化、但和 AI 工具使用相关的官方消息（政策、安全、研究计划这类），写“可以关注”，不写“不需要”。
- 评分按对日常使用这几个工具的人有多大影响分三档，和“是否调整用法”对应：
  - 85—100：直接影响日常用法，比如主力工具的新版本、默认行为或额度变化；写“需要”。
  - 70—84：值得了解、可能用得上，比如新功能、套餐或使用政策调整；写“可以关注”。
  - 0—69：间接相关或影响面小，比如研究、安全、学术计划类消息和小范围功能；写“可以关注”，和日常用法无关的产品变化写“不需要”。
  - 写“需要”的必须在 85 分以上，85 分以上的必须写“需要”。
- 某个工具当天没有确认的更新，写“今天没有”，并说明查了哪些页面；有页面没打开的，要写明“不代表当天确实没有”。

## 打不开的页面

- 打不开、内容不全的页面如实记下来，不用其他网站代替。
- 普通抓取被拦（比如返回 403）时，可以改用浏览器打开同一个官方页面；打开了就算查过，但要在原文里说明。
- X 账号用项目里声明的 Playwright 浏览器查看（Claude Code 读 `.mcp.json`，Codex 读 `.codex/config.toml`，两边用 `--user-data-dir` 固定同一份项目浏览器资料，不随聊天目录变化）。这个浏览器要先由使用者自己登录一次 X，之后复用本机登录状态；登录失效时仍需使用者重新登录。同一份资料不能被多个浏览器实例同时占用。时间线要往下翻到覆盖整个时间窗口，或者用高级搜索 `from:账号 since:日期 until:日期` 核对。
- 发现 X 没登录时，原文写明“未登录”和没加载到的时段，并在汇报里提醒使用者登录。定时无人值守运行不询问、不等待人工登录；单个来源打不开或内容不全不阻止发布：在原文、数据 `failed` 和汇报中说明缺失及影响，只写已核实内容；受影响工具注明“不代表当天确实没有”，完成数据检查与本地预览后照常发布。具体处理见技能。

## 原文 raw/YYYY-MM-DD.md

沿用已有几期的结构：

1. 标题、日期和窗口、窗口换算（UTC 和美国太平洋时间）、核查结论
2. 分节：一、Codex；二、ChatGPT；三、Claude（含 Claude Code）；四、DeepSeek
3. 每条写：标题（评分/100）、官方发布时间及依据、北京时间及是否在窗口内、是否调整用法、变化内容、推荐理由、官方原文链接
4. 已排除的临近条目：写明时间依据和北京时间
5. 未能完整查到的页面

## 数据 data/YYYY-MM-DD.json

格式见 README，补充约定：

- `window` 固定写成 `北京时间 X 月 D 日 00:00—24:00`。
- `tool` 只用 `Codex`、`ChatGPT`、`Claude`、`Claude Code`、`DeepSeek`；页面筛选按前缀匹配，`Claude Code` 归在 Claude 下。
- `time` 是北京时间 `HH:MM`；时间未公开的写 `null`。
- `source` 沿用已有写法：`GitHub 发布记录`、`ChatGPT 发布说明`、`OpenAI 官方博客`、`Anthropic 官方新闻`、`X @账号名` 等。
- `adjust` 只用 `需要`、`可以关注`、`不需要`；`score` 是 0—100 的整数。
- `quiet` 写当天没有更新的工具；`failed` 写没打开或内容不全的页面，内容不全的在 `name` 后用括号说明。
- JSON 里的内容只能来自 raw 原文，不另外改写事实。
- 每一期都要在 `data/index.json` 的 `issues` 里按日期顺序加上。不改网页代码。

## 交付边界

- 新一期要在本地预览里实际看过，确认显示正常。
- 推送到 GitHub 后线上网页会自动更新，推送就等于公开发布。
