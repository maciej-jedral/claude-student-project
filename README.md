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
| `app/` | Prototyp **Buddy app** (w budowie): `index.html` + `styles.css` + `app.js` + `data.js`. |

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

## Prototyp — Buddy app (w toku)

Wsparcie młodych dorosłych na starcie pracy w korporacji (na podstawie raportu z badania).
Kod w folderze `app/`. Podgląd lokalnie: otwórz **`app/index.html`** w przeglądarce.

- [x] Szkielet aplikacji + nawigacja + panel „Twój tydzień" (PSS‑10, UWES‑9, CBT, self‑compassion)
- [x] Moduł **Buddy Match** — quiz → dopasowanie buddy/seniora → 3 sesje 1:1 + mini‑ankiety
- [x] Moduł **Know‑How na teraz** — mikro‑lekcje just‑in‑time, quizy (retrieval), checklisty, wyszukiwarka
- [x] Moduł **Jasne Oczekiwania** — kanwa oczekiwań + check‑in „Weekly 15" + suwak jasności zadań (0–100)
- [ ] Docelowo: przeniesienie `app/` do katalogu głównego (zastąpienie placeholdera)
