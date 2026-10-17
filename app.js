// 读取 data/index.json 里的期数列表，逐期加载并按时间线渲染
const WEEKDAYS = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];

// 创建元素的小工具：文字一律走 textContent，避免把数据当 HTML 解析
function el(tag, props = {}, children = []) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(props)) {
    if (key === "class") node.className = value;
    else if (key === "text") node.textContent = value;
    else node.setAttribute(key, value);
  }
  for (const child of children) if (child) node.append(child);
  return node;
}

function formatDay(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const weekday = WEEKDAYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
  return { title: `${m} 月 ${d} 日`, weekday };
}

// 有时间的按时间倒序，最新在上；时间未公开的排在当天最后
function sortItems(items) {
  return [...items].sort((a, b) => {
    if (!a.time && !b.time) return 0;
    if (!a.time) return 1;
    if (!b.time) return -1;
    return b.time.localeCompare(a.time);
  });
}

function renderEntry(item) {
  const time = el("div", {
    class: item.time ? "entry-time" : "entry-time unknown",
    text: item.time || "时间未公开",
  });

  const card = el("article", { class: "card" }, [
    el("div", { class: "card-head" }, [
      el("span", { class: "tool", text: item.tool }),
      el("span", { text: item.source }),
      el("span", { class: `adjust adjust-${item.adjust}`, text: item.adjust }),
      el("span", { class: "score", text: `评分 ${item.score}` }),
    ]),
    el("h3", { text: item.title }),
    el("p", { text: item.summary }),
    el("p", { class: "reason", text: `推荐理由：${item.reason}` }),
    el("a", { class: "card-link", href: item.url, target: "_blank", rel: "noopener", text: "官方原文 ↗" }),
  ]);

  return el("li", { class: "entry" }, [time, card]);
}

function renderNotes(issue) {
  const parts = [];
  if (issue.quiet?.length) {
    parts.push(el("h4", { text: "今天没有" }));
    parts.push(el("ul", {}, issue.quiet.map((q) => el("li", { text: `${q.tool}：${q.note}` }))));
  }
  if (issue.failed?.length) {
    parts.push(el("h4", { text: "抓取失败的来源" }));
    parts.push(el("ul", {}, issue.failed.map((f) =>
      el("li", {}, [el("a", { href: f.url, target: "_blank", rel: "noopener", text: f.name })])
    )));
  }
  return parts.length ? el("div", { class: "notes" }, parts) : null;
}

function renderIssue(issue) {
  const { title, weekday } = formatDay(issue.date);
  return el("section", { class: "day", id: issue.date }, [
    el("div", { class: "day-head" }, [
      el("h2", { text: title }),
      el("span", { class: "day-meta", text: `${weekday} · ${issue.items.length} 条` }),
    ]),
    issue.window ? el("p", { class: "day-window", text: issue.window }) : null,
    el("ol", { class: "timeline" }, sortItems(issue.items).map(renderEntry)),
    renderNotes(issue),
  ]);
}

async function main() {
  const root = document.getElementById("issues");
  try {
    const index = await fetch("data/index.json").then((r) => r.json());
    // 新的一期在最上面
    const dates = [...index.issues].sort().reverse();
    const issues = await Promise.all(dates.map((d) => fetch(`data/${d}.json`).then((r) => r.json())));
    root.replaceChildren(...issues.map(renderIssue));
  } catch (err) {
    root.replaceChildren(el("p", { class: "error", text: "简报加载失败，请稍后刷新。" }));
    console.error(err);
  }
}

main();
