# 1066gram

*It's 1066. Everyone's posting.* The Bayeux Tapestry as a social feed: 51 posts across six chapters,
voiced reels, seven 3D pop-up set pieces, and "Get Stitched" — make your own ending.

**Live:** https://niksargent.github.io/1066gram/

## Run it

```bash
python tools/serve.py 8066
```

Then open http://localhost:8066. It's a static site with no build step. Pushing to `main` publishes
`app/` to GitHub Pages via `.github/workflows/pages.yml`.

## Layout

| Path | What |
|---|---|
| `creative/bible.md` | Tone, cast, running order and every script |
| `app/js/art.js` | The stitch art kit: puppets, horses, ships, borders, Latin captions |
| `app/js/scenes.js` | Every post's artwork, the Get Stitched templates and avatars |
| `app/js/posts.js` | The feed: accounts, captions, comments, voice/music cues |
| `app/js/audio.js` | Web Audio engine: sequences, music crossfades, ducking |
| `app/js/immersive.js` | The three.js pop-up set pieces (comet, crossing, battle) |
| `app/js/main.js` | Feed, players, sheets, sharing, Get Stitched |
| `app/audio/` | Pre-generated voices, sound effects and music |
| `tools/` | Audio generation and the dev server |

## Regenerating audio

Voices and effects are generated once at build time with ElevenLabs and shipped as fixed files —
nothing calls an AI service at runtime.

```bash
node tools/generate-audio.mjs            # only missing clips
node tools/generate-audio.mjs --force r03_8   # redo specific clips
node tools/build-lines.mjs               # refresh subtitles after editing lines
```

Lines live in `tools/voice-lines.mjs`. The API key is read from the minifig studio `.env`
(override with `ELEVENLABS_ENV=/path/to/.env`) and is never copied into this project.
