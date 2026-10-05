# Card 0027 is blocked by a card that was answered

## Why
**The suite is red on `no open card is blocked by a settled card`, and the red is true.** It prints
`0027 in human-review needs 0018, which is answered on its own thread`. Card `0027` carries
`needs: 0018` and a matching `Blocked by` line. Card `0018` got its answer on 2026-09-25: an entry
marked `**Decided:**` choosing a fourth option, a purely informational email that asks for nothing.

**What it costs.** The suite has been red since that answer landed, so every session meets a red it
has to diagnose before it can trust a green. And `0027` still tells its reader there is "nothing to
send until it is answered", when the answer is on `0018` and changes what `0027` must do: the
draft needs rewriting to the no-ask shape before it is sent.

**How it came to be this way.** The answer was written on `0018` only. Nothing clears a dependent
card's `needs:` when its blocker is answered, and the check that reports it is the only signal.

## Links

**Relates to**
- `0027` - the card carrying the stale blocker.
- `0018` - the answered card. Its `**2026-09-25**` `Decided` entry is the answer.
- `0070` - the card that owns the check. Its session could not clear this, because a card session
  may not edit another card.
- `0017`, `0020` - the two cards whose stale blockers card `0070` cleared with the same edit; `## Plan`
  points at them as the worked example.

## Not this card
**Not rewriting `0027`'s draft email or answering its ask.** That stays on `0027` and with Rob.

**Not changing the check.** It is right.

## Acceptance
<!-- AC:BEGIN -->
- [ ] #1 THE CARD `0027` SHALL carry no `needs:` naming `0018`, and its `## Links` SHALL record
      `0018` under `Relates to` with the 2026-09-25 answer as its reason. proves: `no open card is
      blocked by a settled card`
<!-- AC:END -->

## Plan
Delete the `needs: 0018` frontmatter block from
`docs/board/human-review/0027-send-the-forestry-england-enquiry.md`. Under `## Links`, move `0018`
from `Blocked by` to `Relates to` with the answer on it, and drop the `Blocked by` heading if it is
empty. Leave `## Comments` alone. Card `0070`'s 2026-09-11 third build did the same edit to `0017`
and `0020`. Then `node scripts/selftest.js` must be green on that assertion.

## Comments

**2026-09-28** Raised by an unattended run of card `0070`. The red was already there at HEAD before
that run changed anything.
