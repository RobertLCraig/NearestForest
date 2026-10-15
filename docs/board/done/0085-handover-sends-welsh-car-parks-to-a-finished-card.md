# HANDOVER sends Welsh car parks to a finished card

## Why
**`docs/HANDOVER.md` says Welsh car parks are still open on card `0017`, and `0017` is in `done/`.**
It says so in three places: the `**Status:**` paragraph ("Welsh car parks wait on NRW's licence
answer (card 0017)"), the data-shape bullet ("Welsh car parks are card 0017 and are still open"),
and the `## Blockers / open questions` bullet for `0017`, plus the Scotland paragraph under
`## What's next`. Measured 2026-10-05.

`0017`'s `**2026-09-29** **Decided:**` entry chose option 1 and says option 2, the Welsh car parks,
"belong on their own later card". No card in any lane carries option 2 today.

**What it costs.** A reader follows HANDOVER to a card that is finished, and the one open question,
whether to send the NRW email and build Welsh car parks, has no card to sit on.

## Links

**Relates to**
- `0017` - the finished decision card HANDOVER still treats as open; its 2026-09-29 entry is the
  source of the "own later card" line.
- `0079` - the option 1 build `0017` was carried forward to, which HANDOVER already describes.
- `0084` - found this while checking reason lines against the board.

## Not this card
Not sending the NRW email or building Welsh car parks. Not editing `0017`.

## Acceptance
<!-- AC:BEGIN -->
- [x] #1 WHEN `docs/HANDOVER.md` is read, IT SHALL NOT call card `0017` open or a blocker, and the
      Welsh car parks question SHALL point at a card in an open lane that carries it.
      proves: none - prose; checked by `grep -n 0017 docs/HANDOVER.md`
<!-- AC:END -->

## Plan
Read `0017`'s `## Comments` from 2026-09-29. Raise one card for option 2 (the NRW email and Welsh car
parks), shaped like `0017`'s option 2 text, then repoint the HANDOVER lines above at it.

## Comments

**2026-10-15** RESULT: done
TESTS: +0 new, all green (criterion #1 is proves: none; node scripts/selftest.js 345 passed, 0 failed)
TOUCHED: docs/HANDOVER.md
TOUCHED: docs/board/todo/0086-welsh-car-parks-from-nrw-recreation-points.md
OUT-OF-SCOPE: none

Raised `0086` for 0017's option 2 (the NRW email plus Welsh car parks from NRW_GB_RECREATION_POINTS), as the card's Plan asks. It is the card's own deliverable, not an out-of-scope finding, so it is not on the OUT-OF-SCOPE line. It sits in todo/ with `not_for_the_loop:` because its first step is an email Rob sends; acceptance #2's test names are deferred until NRW answer.

Repointed the four HANDOVER places at 0086: the Status paragraph (line 12), the data-shape bullet (82), the What's next Scotland/Wales paragraph (416) and the Blockers bullet (436). The two lines that pointed at 'the text on the card' now name docs/outreach/nrw-licence-enquiry.md, which is where the send-ready email lives. Before: `grep -n 0017 docs/HANDOVER.md` returned four lines calling 0017 open. After: three lines, each naming 0017 as option 1's source or as finished.

No Pest/Pint here: this project has no PHP suite or vendor/, so the suite is node scripts/selftest.js.

### 2026-10-15 review (v20261015062717-3e16)

**suite**

No suite this job could find in NearestForest, so none ran. That is not a pass.

**acceptance: sound**

I could not break criterion #1. The work does what it says.

**#1, part 1: HANDOVER does not call `0017` open or a blocker.**
- I ran `grep -n 0017 docs/HANDOVER.md`. It found three lines, and none of them calls `0017` open.
- Line 415 says `0017` is where option 1 came from. That part is built as card `0079`.
- Line 416 says `0017` "is finished".
- Line 436 sits in the Blockers list. But the blocker it names is `0086`, and it calls `0017` "the finished card".

**#1, part 2: the Welsh car parks question points at a card in an open lane.**
- All four places in `docs/HANDOVER.md` now name `0086`. They are the Status paragraph, the data-shape bullet, the What's next paragraph and the Blockers bullet.
- `0086` is at `docs/board/todo/0086-welsh-car-parks-from-nrw-recreation-points.md`. `todo/` is an open lane.

**What I did not check:**
- I did not open `docs/outreach/nrw-licence-enquiry.md`. HANDOVER now points readers there for the email, so I do not know that the file exists. The criterion does not cover it.
- No suite ran. This criterion is plain text with nothing to test, so a suite would not prove it anyway.

VERDICT: sound

**scope: sound**

I tried to break the scope, and I could not.

**What the card's own commit did.** Commit `d38adc1` changes only two files: `docs/HANDOVER.md` and the new card `docs/board/todo/0086-welsh-car-parks-from-nrw-recreation-points.md`. The `## Plan` asks for both. The other 19 files in the diff come from other commits, such as the 2026-10-07 clean-up and the moves of `0077` and `0078`. This card did not make them.

**The fence ("Not this card").**
- `0017` did not change. It is still in `docs/board/done/0017-how-much-of-wales-can-we-actually-ship.md`, and this commit does not touch it.
- No email went out, and no Welsh car parks were built. `0086` sits in `todo/` with `not_for_the_loop:`.

**One small addition.** Two HANDOVER lines used to say "the text is on the card". They now point to `docs/outreach/nrw-licence-enquiry.md`. That file exists. The old line had to change anyway, because `0017` is finished, so this is part of the repoint and not growth.

**Half done?** No. `grep -n 0017 docs/HANDOVER.md` shows 3 lines, and each one calls `0017` finished or the source of option 1. All four places now point at `0086`, and `0086` is in an open lane. Criterion #1 holds.

VERDICT: sound

**breakage: sound**

I tried to break this work, and I could not.

**What I checked**

- **The new card.** Card `0086` is in `docs/board/todo/`, which is an open lane. It holds the Welsh car parks question, which was option 2 of `0017`.
- **The draft email.** The file `docs/outreach/nrw-licence-enquiry.md` exists. HANDOVER now sends the reader there in two places, and that path is correct.
- **What `grep -n 0017 docs/HANDOVER.md` shows.** It finds three lines: 415, 416 and 436. Each one names `0017` only as the source of option 1 or as "finished". No line calls `0017` open or a blocker.
- **What `grep 0086` shows.** It finds four lines: Status, the data-shape bullet, What's next, and Blockers. All four point at the open card `0086`.
- **Card `0086` itself.** It links back to `0017` under `## Links`, so the suite's links check has nothing new to flag.

**Limit:** I did not run `node scripts/selftest.js`, because I am only allowed to read files.

**What you do now:** nothing. Criterion #1 holds.

VERDICT: sound

