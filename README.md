# claude-student-project

A small web project hosted on **GitHub Pages**.

**Live site:** https://maciej-jedral.github.io/claude-student-project/

> ⚠️ The current `index.html` is a **placeholder** (an illustrated scene) used to confirm the
> hosting setup works. It will be replaced by a **JavaScript prototype app** for class.

## Project layout

| Path | What it is |
| --- | --- |
| `index.html` | The page served at the live URL (currently the placeholder). |
| `.github/workflows/deploy-pages.yml` | Auto-deploys the site to GitHub Pages on every push to `main`. |
| `.gitignore` | Ignores common JS / Node build artifacts. |

## View it locally

It's a static page, so **no build step is required**.

```bash
# Simplest: open the file directly in a browser
xdg-open index.html      # Linux
open index.html          # macOS

# If you split the app into multiple JS modules, serve it over HTTP instead
# (browsers block ES module imports over file://):
python3 -m http.server   # then open http://localhost:8000
```

In VS Code, the **Live Server** extension gives one-click preview with auto-reload.

## How deployment works

- The site deploys from the **`main`** branch via GitHub Actions.
- **Every push to `main` redeploys** automatically (~30 seconds).
- Pages **Source** is set to *GitHub Actions* (repo → Settings → Pages).

### Publishing changes

Work on a branch, then publish by merging into `main`:

```bash
git switch claude/brave-einstein-EDGb3   # your working branch
# ...edit, then commit...
git add -A && git commit -m "Describe your change"

git switch main
git merge claude/brave-einstein-EDGb3
git push origin main                     # this triggers the deploy

git switch claude/brave-einstein-EDGb3   # back to working
```

## Planned

- [ ] Replace the placeholder with a **JS prototype app** (concept TBD).
- [ ] Flesh out styling and interactions.
