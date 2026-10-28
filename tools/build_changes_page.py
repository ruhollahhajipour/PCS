#!/usr/bin/env python3
"""Build the 'PCS Changes' artifact page from git history.

Usage: python3 tools/build_changes_page.py [output.html]
Then republish the output with the Artifact tool (same file path = same URL).
"""
import html, re, subprocess, sys, datetime, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else "/tmp/pcs-changes.html")
MAX_COMMITS, MAX_PATCH_LINES = 15, 160


def git(*a):
    return subprocess.run(["git", "-C", str(ROOT), *a], capture_output=True, text=True).stdout


def esc(s):
    return html.escape(s, quote=True)


def commits():
    out = []
    raw = git("log", f"-{MAX_COMMITS}", "--format=%x01%h%x02%an%x02%aI%x02%s")
    for chunk in raw.split("\x01")[1:]:
        head = chunk.split("\n", 1)[0]
        h, an, ad, subj = head.split("\x02")
        files = []
        for line in git("show", "--numstat", "--format=", h).splitlines():
            p = line.split("\t")
            if len(p) == 3:
                a, d, f = p
                files.append((f, 0 if a == "-" else int(a), 0 if d == "-" else int(d), a == "-"))
        out.append(dict(h=h, an=an, ad=ad, subj=subj, files=files))
    return out


def patch_for(h, f):
    p = git("show", "--format=", "--unified=2", h, "--", f).splitlines()
    p = [l for l in p if not l.startswith(("diff --git", "index ", "--- ", "+++ "))]
    cut = len(p) > MAX_PATCH_LINES
    return "\n".join(p[:MAX_PATCH_LINES]), cut


def fmt_patch(t):
    rows = []
    for l in t.splitlines():
        c = "add" if l.startswith("+") else "del" if l.startswith("-") else "hunk" if l.startswith("@@") else ""
        rows.append(f'<span class="ln {c}">{esc(l) or " "}</span>')
    return "".join(rows)


def date_fa(iso):
    d = datetime.datetime.fromisoformat(iso)
    return d.strftime("%Y-%m-%d %H:%M")


def routes():
    app = (ROOT / "frontend/src/App.tsx").read_text()
    placeholders = re.search(r"const placeholders = \[(.*?)\]", app, re.S)
    ph = re.findall(r'"([^"]+)"', placeholders.group(1)) if placeholders else []
    real = [p for p in re.findall(r'<Route path="/([a-z-]+)" element=\{<(\w+)', app) if p[1] != "ComingSoon"]
    items = [("login", "Login", "ready")] + [(p, c, "ready") for p, c in real] + [(p, "ComingSoon", "todo") for p in ph]
    return items


def status():
    rows = []
    for l in git("status", "--porcelain").splitlines():
        rows.append((l[:2].strip() or "?", l[3:]))
    return rows


cs = commits()
st = status()
rt = routes()
branch = git("branch", "--show-current").strip() or "detached"
now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")


def file_rows(c, with_patch):
    out = []
    for f, a, d, b in c["files"]:
        meta = f'<span class="stat"><b class="p">+{a}</b> <b class="m">-{d}</b></span>'
        if with_patch and not b and (a + d) > 0:
            t, cut = patch_for(c["h"], f)
            note = '<p class="cut">ادامه‌ی diff کوتاه شد</p>' if cut else ""
            out.append(f'<details class="file"><summary><code dir="ltr">{esc(f)}</code>{meta}</summary>'
                       f'<pre dir="ltr">{fmt_patch(t)}</pre>{note}</details>')
        else:
            tag = "باینری" if b else ""
            out.append(f'<div class="file flat"><code dir="ltr">{esc(f)}</code><span class="stat">{tag or meta}</span></div>')
    return "".join(out)


latest = cs[0]
tot_a = sum(f[1] for f in latest["files"]); tot_d = sum(f[2] for f in latest["files"])

hist = "".join(
    f'<details class="commit"><summary><code dir="ltr">{c["h"]}</code><span class="subj">{esc(c["subj"])}</span>'
    f'<time>{date_fa(c["ad"])}</time></summary>{file_rows(c, False)}</details>'
    for c in cs[1:]
)
tree = "".join(f'<li><span class="chip s{esc(k[0])}">{esc(k)}</span><code dir="ltr">{esc(f)}</code></li>' for k, f in st) \
    or '<li class="clean">همه‌ی تغییرات کامیت شده‌اند.</li>'
pages = "".join(
    f'<li class="{s}"><code dir="ltr">/{p}</code><span>{c if s == "ready" else "در حال توسعه"}</span></li>'
    for p, c, s in rt
)

page = f"""<title>PCS Changes</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;600;800&family=JetBrains+Mono:wght@400;600&display=swap">
<style>
/* Layout: one column, newest change on top, history and working tree below. */
:root {{
  --bg:#F3F6FB; --surface:#FFFFFF; --fg:#14243B; --muted:#5B6B82; --line:#DCE3EE;
  --accent:#4F46E5; --navy:#16355B; --add:#12794A; --addbg:#E3F5EB; --del:#B3261E; --delbg:#FCE9E7; --warn:#9A5B00; --warnbg:#FFF1D6;
  --code:#F6F8FC;
  --sans:'Vazirmatn',system-ui,sans-serif; --mono:'JetBrains Mono',ui-monospace,monospace;
}}
@media (prefers-color-scheme: dark) {{ :root:not([data-theme="light"]) {{
  --bg:#0C1422; --surface:#131E31; --fg:#E6ECF6; --muted:#93A3BB; --line:#25334B;
  --accent:#8B85FF; --navy:#9CC0F0; --add:#5DD59B; --addbg:#12301F; --del:#FF8A80; --delbg:#3A1815; --warn:#F0B35A; --warnbg:#3A2A0E; --code:#0F192A; color-scheme:dark; }} }}
:root[data-theme="dark"] {{
  --bg:#0C1422; --surface:#131E31; --fg:#E6ECF6; --muted:#93A3BB; --line:#25334B;
  --accent:#8B85FF; --navy:#9CC0F0; --add:#5DD59B; --addbg:#12301F; --del:#FF8A80; --delbg:#3A1815; --warn:#F0B35A; --warnbg:#3A2A0E; --code:#0F192A; color-scheme:dark; }}
body {{ background:var(--bg); color:var(--fg); font-family:var(--sans); line-height:1.7; font-size:15px;
  padding-block:28px 56px; padding-left:max(16px,env(safe-area-inset-left,0px)); padding-right:max(16px,env(safe-area-inset-right,0px)); }}
main {{ max-width:860px; margin:0 auto; display:flex; flex-direction:column; gap:28px; }}
header {{ display:flex; flex-wrap:wrap; align-items:end; justify-content:space-between; gap:8px 24px; }}
h1 {{ margin:0; font-size:28px; font-weight:800; color:var(--navy); text-wrap:balance; }}
header p {{ margin:0; color:var(--muted); font-size:13px; }}
.meta {{ display:flex; gap:8px; flex-wrap:wrap; font-size:12px; color:var(--muted); }}
.meta span {{ border:1px solid var(--line); border-radius:6px; padding:1px 8px; background:var(--surface); }}
h2 {{ margin:0 0 10px; font-size:13px; font-weight:600; letter-spacing:.04em; color:var(--muted); }}
code {{ font-family:var(--mono); font-size:12.5px; }}
.latest {{ background:var(--surface); border:1px solid var(--line); border-radius:12px; padding:20px 20px 12px; }}
.latest h3 {{ margin:4px 0 2px; font-size:20px; font-weight:800; text-wrap:balance; }}
.latest .by {{ color:var(--muted); font-size:13px; margin-bottom:12px; display:flex; gap:12px; flex-wrap:wrap; }}
.sum b {{ font-family:var(--mono); }} .p {{ color:var(--add); }} .m {{ color:var(--del); }}
.file {{ border-top:1px solid var(--line); }}
.file summary, .file.flat {{ display:flex; gap:12px; justify-content:space-between; align-items:center; padding:8px 2px; min-width:0; }}
.file summary {{ cursor:pointer; list-style:none; }}
.file summary::-webkit-details-marker {{ display:none; }}
.file summary::before {{ content:"◂"; color:var(--accent); font-size:11px; }}
.file[open] summary::before {{ content:"▾"; }}
.file code {{ overflow-wrap:anywhere; flex:1; min-width:0; }}
.stat {{ font-family:var(--mono); font-size:12px; color:var(--muted); white-space:nowrap; }}
pre {{ margin:0 0 10px; background:var(--code); border:1px solid var(--line); border-radius:8px; overflow-x:auto; padding:8px 0; font:12px/1.55 var(--mono); text-align:left; }}
.ln {{ display:block; padding:0 12px; white-space:pre; min-width:max-content; }}
.ln.add {{ background:var(--addbg); color:var(--add); }} .ln.del {{ background:var(--delbg); color:var(--del); }} .ln.hunk {{ color:var(--accent); }}
.cut {{ font-size:12px; color:var(--muted); margin:0 0 10px; }}
.grid {{ display:grid; grid-template-columns:repeat(auto-fit,minmax(300px,1fr)); gap:20px; }}
.grid > section {{ min-width:0; }}
ul.list {{ list-style:none; margin:0; padding:0; background:var(--surface); border:1px solid var(--line); border-radius:12px; }}
ul.list li {{ display:flex; gap:10px; align-items:center; justify-content:space-between; padding:9px 14px; border-top:1px solid var(--line); min-width:0; }}
ul.list li:first-child {{ border-top:0; }}
ul.list li span {{ font-size:12.5px; color:var(--muted); }}
ul.list li.todo span {{ color:var(--warn); background:var(--warnbg); border-radius:6px; padding:0 8px; }}
ul.list li.ready span {{ color:var(--add); }}
.chip {{ font-family:var(--mono); font-size:11px; border-radius:5px; padding:0 6px; background:var(--code); border:1px solid var(--line); }}
.chip.sM {{ color:var(--warn); }} .chip.s\\? , .chip.sA {{ color:var(--add); }} .chip.sD {{ color:var(--del); }}
li.clean {{ color:var(--muted); font-size:13.5px; justify-content:flex-start; }}
.commit {{ background:var(--surface); border:1px solid var(--line); border-radius:10px; margin-bottom:8px; padding:0 14px; }}
.commit summary {{ cursor:pointer; display:flex; gap:12px; align-items:center; padding:10px 0; flex-wrap:wrap; }}
.commit .subj {{ flex:1; min-width:180px; font-weight:600; }}
.commit time {{ color:var(--muted); font-size:12px; font-family:var(--mono); }}
.commit .file:first-of-type {{ margin-top:2px; }}
:focus-visible {{ outline:2px solid var(--accent); outline-offset:2px; border-radius:4px; }}
</style>
<main dir="rtl" lang="fa">
  <header>
    <div>
      <h1>PCS Changes</h1>
      <p>Project Cost Control System · آخرین تغییرات پروژه</p>
    </div>
    <div class="meta"><span dir="ltr">branch: {esc(branch)}</span><span dir="ltr">ساخته‌شده {now}</span></div>
  </header>

  <section class="latest" aria-labelledby="l">
    <h2 id="l">آخرین تغییر</h2>
    <h3>{esc(latest["subj"])}</h3>
    <div class="by"><span>{esc(latest["an"])}</span><time dir="ltr">{date_fa(latest["ad"])}</time><code dir="ltr">{latest["h"]}</code>
      <span class="sum" dir="ltr">{len(latest["files"])} files <b class="p">+{tot_a}</b> <b class="m">-{tot_d}</b></span></div>
    {file_rows(latest, True)}
  </section>

  <div class="grid">
    <section><h2>تغییرات کامیت‌نشده</h2><ul class="list">{tree}</ul></section>
    <section><h2>صفحه‌های برنامه</h2><ul class="list">{pages}</ul></section>
  </div>

  <section><h2>تاریخچه‌ی کامیت‌ها</h2>{hist or '<p style="color:var(--muted)">کامیت قبلی وجود ندارد.</p>'}</section>
</main>
"""
OUT.write_text(page, encoding="utf-8")
print(f"wrote {OUT} ({len(page)//1024} KB)")
