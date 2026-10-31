# PSWDO Romblon · Accomplishment Report 2026

Interactive landing page and narrated video for the **Provincial Social Welfare and Development Office (PSWDO), Province of Romblon**, covering January–October 2026. Everything is generated from one data file, so the page, the film and the subtitles always agree.

- **Landing page** – Vite + React in a light editorial system (Geist + Instrument Serif, near-black ink, one teal accent, 24px cards, blur-in reveals). Fully interactive: floating pill nav with scroll-spy and rolling hover, word-by-word hero with pointer glow, marquee of program figures, accordions for the mandate and challenges, expandable 2027 cards, clickable personnel units, scroll progress bar, plus hero with key facts, the film with chapter links, program explorer (sort, compare 2025 vs 2026), an interactive province map of all 17 municipalities (OpenStreetMap outlines, island-group filters), personnel bars, accreditation flow, budget meters, challenges accordion, 2027 priorities and an impact section.
- **Film** – Remotion (1920×1080, 30 fps, ~6.2 min): 19 narrated scenes in a bright infographic style (icon badges, pictograms, donuts, gauges, a Romblon map with all 17 municipalities), natural neural voice-over (Microsoft Edge TTS, `en-US-EmmaMultilingualNeural`, a lively conversational female voice), word-synced subtitles, spring animations, slide/fade transitions with a soft whoosh, and visuals that appear exactly when the narrator says them.

## Quick start

```bash
npm install
npm run voiceover   # 1. synthesize narration + captions (needs Python 3 with edge-tts, ffprobe on PATH)
npm run render      # 2. render the film to public/video/pswdo-accomplishment-2026.mp4
npm run dev         # 3. open the landing page
```

Other scripts:

| Script              | What it does                                                      |
| ------------------- | ----------------------------------------------------------------- |
| `npm run studio`    | Opens Remotion Studio to preview/edit scenes interactively        |
| `npm run build`     | Builds the static site into `dist/` (includes the rendered video) |
| `npm run preview`   | Serves `dist/` locally                                            |
| `npm run typecheck` | TypeScript check for both the site and the video                  |
| `node scripts/shoot.mjs <url> <dir> [w] [h]` | Screenshots every section of the live page (visual QA) |

Python requirements: `pip install edge-tts` (internet access is needed for synthesis). `ffprobe` from FFmpeg is used to measure audio length.

## How it fits together

```
src/data/accomplishment.json      <- single source of truth: figures, explanations, narration script
scripts/generate_voiceover.py     <- narration -> public/voiceover/*.mp3 + captions + chapter times
src/remotion/                     <- Remotion video (scenes/, components/, generated/voiceover.json)
src/site/                         <- Vite + React landing page
public/                           <- shared static assets (images, voiceover, video, data/chapters.json, docs/)
```

### Change the content

1. Edit `src/data/accomplishment.json` (numbers, program explanations, or any scene's `narration`).
2. Run `npm run voiceover`. Only scenes whose narration changed are re-synthesized; scene lengths and chapter markers are recomputed.
3. Run `npm run render` to produce the new film. The site picks up the new chapters automatically.

Switch voices with `python -I scripts/generate_voiceover.py --voice en-US-AvaMultilingualNeural --force` (list voices with `python -m edge_tts --list-voices`). The Edge endpoint occasionally returns no audio; the script retries automatically.

### Hooks for editors

- Each scene opens with a **hook** (`programs[].hook`) and every section of the page has a hook line in its header.
- Visual beats are tied to spoken words with `useWordFrame("22,513", fallbackSeconds)` so a number counts up when it is said.
- Scenes are registered as separate compositions in Remotion Studio (`Scenes/` folder) for individual editing.

## Deploying

`npm run build` produces a fully static `dist/` folder that can be hosted anywhere (GitHub Pages, Azure Static Web Apps, Netlify, any web server). The rendered film (~70 MB, under GitHub's 100 MB file limit) is committed so Pages can serve it directly.

### GitHub Pages (automated)

A workflow in `.github/workflows/deploy.yml` builds and publishes the site on every push to `main` or `master`.

1. Create an empty repository on GitHub (for example `pswdo-accomplishment-2026`).
2. Push this project:
   ```bash
   git remote add origin https://github.com/<your-user>/pswdo-accomplishment-2026.git
   git push -u origin master
   ```
3. In the repository go to **Settings → Pages** and set **Source** to **GitHub Actions**.
4. The first run takes about two minutes. The site is then live at `https://<your-user>.github.io/pswdo-accomplishment-2026/` and redeploys on every push.

The build reads `VITE_BASE` so the same project works from a sub-path; for a custom domain or a user site at the repository root, remove that variable from the workflow.

## Map data

`src/data/romblon-geo.json` holds simplified island outlines and municipality centers derived from OpenStreetMap coastlines and administrative boundaries (© OpenStreetMap contributors, ODbL). Regenerate it from the Overpass API if boundaries change.

## Source

Figures come from *PSWDO Accomplishment January–October 2026* presented at the Annual Planning and Review Conference (the original PDF is in `public/docs/`). Population context uses the 2024 Census of Population (POPCEN) of the Philippine Statistics Authority: 302,824 residents as of 1 July 2024, declared official under Proclamation No. 973 (11 July 2025).
