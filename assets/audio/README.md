# Slide audio

Drop narration MP3s here. Filenames below are keyed to each slide (and, for the
multi-step slides, to each internal beat) so wiring them into the deck is just a
lookup — no guesswork about which clip belongs where.

You don't need to fill every slot. For the first pass, pick your **best 5 slides**
and drop those files in; the rest can follow later.

## Per-slide clips (one file each)

| Slide | On-screen section | Filename |
|------:|-------------------|----------|
| 1  | Opening hero — "Knowledge is power" | `01-hero.mp3` |
| 2  | The Pressures (AI / Cost / Transformation) | `02-pressures.mp3` |
| 3  | The Common Thread (See it / Size it / Test it) | `03-common-thread.mp3` |
| 4  | The Question ("Do you actually know…") | `04-question.mp3` |
| 7  | Why Now | `07-why-now.mp3` |
| 8  | Evidence (customer logos) | `08-evidence.mp3` |
| 9  | Either Way | `09-either-way.mp3` |
| 10 | Final close ("Apromore gives you both") | `10-close.mp3` |

## Multi-beat slides (one file per internal step)

These two slides animate through internal steps. Provide one clip per step if you
want audio to follow the progression; or a single `…-all.mp3` if you'd rather one
clip narrate the whole slide.

**Slide 5 — Process Reality** (3 acts):
- `05-process-reality-1-designed.mp3`  — "the process you designed"
- `05-process-reality-2-believed.mp3`  — "the process you think you have"
- `05-process-reality-3-actual.mp3`    — "the process you actually have"

**Slide 6 — Process Intelligence** (7 layers, revealed across 9 steps):
- `06-process-intelligence-1.mp3` … `06-process-intelligence-9.mp3`

## Notes

- **Format:** MP3 preferred (widest browser support). Keep clips reasonably small
  so the deck stays quick to load on GitHub Pages.
- **Naming:** stick to the exact names above (lowercase, hyphens). If you want to
  use different names, that's fine — just tell me the mapping and I'll match it.
- **Optional:** if a per-step clip is missing, the deck can fall back to the
  slide-level clip (or to silence) — we'll decide that behaviour when we wire it up.
