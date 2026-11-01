#!/usr/bin/env python3
"""出简报用的时间换算：窗口换算、任意时间转北京时间、X 推文 ID 解码。

用法：
  python3 brief_time.py window 2026-10-30
  python3 brief_time.py bj 2026-10-29T19:47:00Z "Thu, 30 Oct 2026 09:00:00 GMT"
  python3 brief_time.py tweet 1983000000000000000
"""
import sys
from datetime import datetime, timedelta, timezone
from email.utils import parsedate_to_datetime
from zoneinfo import ZoneInfo

BJ = ZoneInfo("Asia/Shanghai")
PT = ZoneInfo("America/Los_Angeles")
# X（Twitter）snowflake ID 的起始纪元，单位毫秒
TWITTER_EPOCH_MS = 1288834974657


def fmt(dt, tz):
    local = dt.astimezone(tz)
    # 太平洋时间标出 PDT/PST，夏令时切换当天窗口两端可能不同
    return f"{local.month} 月 {local.day} 日 {local:%H:%M} {local.tzname()}"


def window(date_str):
    start = datetime.fromisoformat(date_str).replace(tzinfo=BJ)
    end = start + timedelta(days=1)
    print(f"北京时间 {fmt(start, BJ)}—{fmt(end, BJ)}")
    print(f"UTC      {fmt(start, timezone.utc)}—{fmt(end, timezone.utc)}")
    print(f"太平洋   {fmt(start, PT)}—{fmt(end, PT)}")


def parse(value):
    # 支持 ISO 8601（GitHub published_at、datePublished）和 RFC 822（RSS pubDate）
    try:
        dt = datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError:
        dt = parsedate_to_datetime(value)
    if dt.tzinfo is None:
        raise ValueError(f"没有时区信息，不能换算：{value}")
    return dt


def to_bj(values):
    for value in values:
        print(f"{value}  →  北京时间 {parse(value).astimezone(BJ):%Y-%m-%d %H:%M}")


def tweet(ids):
    for tid in ids:
        ms = (int(tid) >> 22) + TWITTER_EPOCH_MS
        dt = datetime.fromtimestamp(ms / 1000, timezone.utc)
        print(f"{tid}  →  UTC {dt:%Y-%m-%d %H:%M:%S}  北京时间 {dt.astimezone(BJ):%Y-%m-%d %H:%M}")


if __name__ == "__main__":
    commands = {"window": lambda a: window(a[0]), "bj": to_bj, "tweet": tweet}
    if len(sys.argv) < 3 or sys.argv[1] not in commands:
        sys.exit(__doc__)
    commands[sys.argv[1]](sys.argv[2:])
