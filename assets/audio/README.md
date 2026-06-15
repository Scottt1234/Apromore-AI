# Slide audio

This is the **base** narration set and the universal fallback. The setup screen
also offers a **Narration accent** picker (US / UK / AU); those load from
`assets/audio-us`, `assets/audio-uk` and `assets/audio-au` respectively. Any
clip missing from a chosen accent folder falls back to **this** folder, so the
deck never goes silent while an accent set is still being recorded. Use the
same filenames in every folder.

Drop narration MP3s here. Filenames follow the convention **`SxxFyy.mp3`**:

- **`Sxx`** — slide number, matching the deck (`S01` = Slide 1 … `S10` = Slide 10)
- **`Fyy`** — frame within that slide, counting from `00` (`F00` = first frame)

A slide with no internal steps is just frame `F00`. Multi-step slides get one
file per step. Example: `S05F02.mp3` = Slide 5, frame 2 (the "actual" reveal).

You don't need to fill every slot. For the first pass, pick your **best 5 slides**
and drop those files in; the rest can follow later.

## Single-frame slides (one file each)

| Slide | On-screen section | Filename |
|------:|-------------------|----------|
| 1  | Opening hero — "Knowledge is power" | `S01F00.mp3` |
| 2  | The Pressures (AI / Cost / Transformation) | `S02F00.mp3` |
| 3  | The Common Thread (See it / Size it / Test it) | `S03F00.mp3` |
| 4  | The Question ("Do you actually know…") | `S04F00.mp3` |
| 7  | Why Now | `S07F00.mp3` |
| 8  | Evidence (customer logos) | `S08F00.mp3` |
| 9  | Either Way | `S09F00.mp3` |
| 10 | Final close ("Apromore gives you both") | `S10F00.mp3` |

## Multi-frame slides (one file per internal step)

These two slides animate through internal steps. Provide one clip per frame to
follow the progression, or a single `F00` file if you'd rather one clip narrate
the whole slide.

**Slide 5 — Process Reality** (3 frames):
- `S05F00.mp3` — "the process you designed"
- `S05F01.mp3` — "the process you think you have"
- `S05F02.mp3` — "the process you actually have"

**Slide 6 — Process Intelligence** (9 frames, layers 1–7 revealed across 9 steps):
- `S06F00.mp3` … `S06F08.mp3`
- **Frame 7 follow-up questions:** `S06F07Q1.mp3`, `S06F07Q2.mp3`,
  `S06F07Q3.mp3`, `S06F07Q4.mp3`. After the main `S06F07` clip ends, these play
  in sequence over the on-screen questions, then the deck advances (replacing the
  old hold). They're optional — any you omit are simply skipped — and obey the
  same accent-folder + fallback rules as every other clip.

## Notes

- **Format:** MP3 preferred (widest browser support). Keep clips reasonably small
  so the deck stays quick to load on GitHub Pages.
- **Per-card frames (optional):** slides 2, 3, 7 and 9 reveal their cards in a
  stagger. Today that's one frame (`F00`). If you'd like audio to track each card
  individually, we can split those into `F00`, `F01`, `F02`… and I'll promote the
  card reveals to real steps when we wire it up.
- **Fallback:** if a per-frame clip is missing, the deck can fall back to the
  slide's `F00` clip (or to silence) — we'll settle that behaviour at wiring time.
