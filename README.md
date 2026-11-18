# Lyft — return-to-lifting log

A lift log for your phone. It knows the plan, so you only ever have to tap sets: it tells
you which exercises today, how many sets, what weight to load and what to do next time.
It runs offline and keeps the log on your phone.

Old numbers in the app: **squat 190 · bench 140 · deadlift 235** (edit them in Settings —
everything in the plan is calculated from them).

## The plan in words

### Phase 1 — Recovery (you are here now)
Three sessions a week, all four lifts every session:

| Lift | Sets x reps |
|---|---|
| Squat | 3 x 5 |
| Bench press | 3 x 5 |
| Deadlift | 1 x 5 |
| Pull-ups | 3 x 5 (bodyweight) |

- Start light (your first session was 60 kg on the bars — that was the right call).
- **Add weight whenever every set hits its reps.** The jump shrinks as you approach your
  old numbers: full jumps while you are under 50% of your old best (squat +10 kg,
  bench +5, deadlift +10), half jumps from 50% to 65% (+5 / +2.5 / +5), then +2.5 kg only.
  There is a "Conservative jumps" switch in Settings if you want smaller steps everywhere.
- **Missed reps:** the weight stays. Two sessions in a row where a lift comes up short and
  it drops 5% and starts again.
- The phase ends when the squat, bench and deadlift are back at 80% of your old numbers
  (152 / 112 / 188 kg on the bar). The app says so and offers the switch.

### Phase 2 — Build (back in shape: AMRAP + assistance)
Three days that rotate A → B → C, so you are never grinding everything on the same day:

- **A — squat heavy + bench volume:** squat 2x5 then 1 set AMRAP, bench 3x5 at 85% of the
  heavy bench day, pull-ups 3 sets, barbell row 3x8-10, face pulls 3x15-20.
- **B — hinge + accessories:** deadlift week: 1 top set of 5 then a back-off set of 5 at
  90% (AMRAP, aim for 12). RDL week: RDL 3x5-8 at 70% of your deadlift working weight.
  Then bench 2x5 at 85%, lateral raise 3x12-15, curls 3x8-12, face pulls 3x15-20.
- **C — bench heavy + squat technique:** bench 2x5 then 1 set AMRAP, squat 3x5 at 80%
  (technical, fast), pull-ups 3 sets, tricep extensions 3x10-12, lateral raise 3x12-15.

The **deadlift and RDL alternate automatically** on day B — you never have to remember
which week it is.

The **AMRAP set drives the weight**: the squat/bench load goes up only when that last set
reaches **9 reps**, deadlift back-off when it reaches **12**. Everything else stays 5s.
So: 3x5 at 100 with a 12-rep last set → next time 105 for the work sets.
Stop the AMRAP set with 1-2 reps left; the app asks for RPE so you can see if you are
grinding it. Rest 3-4 minutes before a heavy or AMRAP set (the built-in timer does this).

Every 5th session is an automatic **deload**: same movements, ~60% of the weight, no AMRAP,
short rests.

This phase runs until the work sets reach 95% of your old numbers (squat 180 / bench 132 /
deadlift 222 on the bar) — that is the ceiling the app holds you at, so a rebound 3x5 can
never ask you to load more than you used to max out.

**Assistance work** (rows, face pulls, curls, extensions, laterals) is a rep range, not a
fixed load: you pick the weight, and it goes up the next time when *every* set reached the
top of the range. The app tells you to hold the weight until then.

### Phase 3 — Strength (when the Build ceilings are reached)
One max effort per day, waved 5/3/1 style off a training max (95% of your best estimated
1RM): week of 5s at 90%, week of 3s at 95%, week of singles at 100%, then it resets with a
higher training max. Back-off sets at 79% of the training max, technique/assistance work on
top. Deadlift and RDL still alternate.

The app estimates your 1RM from your best logged set (Epley: weight x (1 + reps/30)) and
shows how far you are back to your old numbers as a percentage bar at the top.

## Installing it on the phone

It is a plain static site — GitHub Pages is the easiest host, and once installed the app
works with no signal at all (all files are cached, the log lives on the phone).

1. Create a **public** repository on GitHub called `lyft` containing these files
   (`index.html`, `manifest.webmanifest`, `sw.js`, `icon-192.png`, `icon-512.png`).
2. Repository → **Settings → Pages → Source: Deploy from a branch → main / (root)** → Save.
3. After a minute open `https://<your-username>.github.io/lyft/` in **Chrome** on the phone.
4. Chrome menu (⋮) → **Add to home screen** / **Install app**. Accept the offline prompt.
   It then opens like a normal app from the icon, no browser bar, no internet needed.
5. Open it once and tap through a session *before* you go to the gym, so the files get
   cached.

If you later move the app, export the log first (Settings → Backup → Copy log) and paste it
in on the new address (Settings → Backup → Paste & restore).

## Backup

Nothing leaves your phone: the log is stored in that browser's storage, and if the browser
decides to clear site data the log goes with it. So every now and then:
**Settings → Backup → Download .json** (or Copy log) and keep it somewhere. "Paste & restore"
puts it back.

## Files

- `index.html` — the whole app: plan, progression rules, logging, charts, storage
- `manifest.webmanifest`, `sw.js`, `icon-*.png` — makes it installable and offline
- `make_icons.py` — regenerates the icons (needs Pillow)

## Testing

`cd dev && node test_engine.js` runs the app's own plan/progression code in Node and prints
month after month of sessions — the weight jumps, the phase ceilings, the deloads and the
5/3/1 wave — so the rules can be checked without tapping through the phone. It also writes a
`state.json` (a full simulated log) that you can paste into the app through
Settings → Backup → Paste & restore if you want to see what a finished block looks like.
