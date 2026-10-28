# PCS project notes

## Changes artifact
The "PCS Changes" artifact shows the latest changes of this project:
https://claude.ai/artifact/SthTsAbwjVXuxVL1KHUYd2

After every code change (and after each commit), refresh it:
1. `python3 tools/build_changes_page.py /tmp/claude-0/-home-claude/4cb18274-93e9-5da7-822c-243a52f415b5/scratchpad/pcs-changes.html`
2. Publish that same file with the Artifact tool (same file path keeps the URL; if the path is gone, pass the URL above as `url` after reading it).
