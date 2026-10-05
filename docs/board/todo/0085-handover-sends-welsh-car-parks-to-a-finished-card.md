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
- [ ] #1 WHEN `docs/HANDOVER.md` is read, IT SHALL NOT call card `0017` open or a blocker, and the
      Welsh car parks question SHALL point at a card in an open lane that carries it.
      proves: none - prose; checked by `grep -n 0017 docs/HANDOVER.md`
<!-- AC:END -->

## Plan
Read `0017`'s `## Comments` from 2026-09-29. Raise one card for option 2 (the NRW email and Welsh car
parks), shaped like `0017`'s option 2 text, then repoint the HANDOVER lines above at it.
