# Two cards wait on a decision you already made

## What I need from you

**One line, pasted onto card `0016`.**

```
**Decided:** 2026-08-18, Yes - add Scotland's 278 forests from Forestry and Land Scotland.
Recorded here in the form the board reads; the answer and the build note above are unchanged.
```

---

**What's wrong.** You answered the Scotland question on 2026-08-18 and it was built on 2026-08-29.
Two other cards still say in their own frontmatter that they cannot start until that answer arrives:
card `0017`, about how much of Wales can ship, and card `0020`, the campsites tab. Anyone opening
either is told to go and read a blocker, and spends the page load finding out it landed three weeks
ago.

**Cause.** The board reads an answer from a line marked `**Decided:**`. Card `0016` was written
before that convention and its answer sits under a `## Decided` heading with no marker on it, so
nothing machine-readable says it was answered. A new self-test that catches exactly this fault is
now green over both cards, because it cannot see the answer either.

**Pass** is card `0016` carrying a `**Decided:**` line, after which a session clears the two stale
blockers and the test starts covering this case.

**Fail** is leaving it. The two cards keep declaring a blocker that landed, and the check that exists
to catch that keeps reporting green over the one instance on the board.

**Why it needs you.** The answer is yours and the `**Decided:**` mark is what makes an entry the
answer rather than a comment about one. An agent writing that line in your name is an agent deciding
for you, which is the one thing this lane exists to prevent. The wording above is your own, so this
is a paste rather than a decision.

**Not the same as card `0018`.** That one also has a `## Decided` section, and its entry reads "I am
still on the fence about what to ask them for". That is steering rather than an answer, card `0027`
correctly still waits on it, and nothing here touches either. It is the reason the check refuses to
read the heading as an answer: doing so would have named `0027`'s live blocker as stale.

## Why
**Two open cards declare a prerequisite that was delivered three weeks ago.**
`docs/board/human-review/0017-how-much-of-wales-can-we-actually-ship.md` and
`docs/board/in-progress/0020-campsites-tab-from-openstreetmap.md` both carry `needs: 0016` and a
matching `Blocked by` line. Card `0016` was answered Yes on 2026-08-18 and its own thread records
"Built" on 2026-08-29, with the Forests tab at 550 sites.

**What it costs.** `needs:` is the board's work order and is read in both directions, so a stale one
misreports what is stuck behind what. The reader pays a page load to discover a blocker is gone, and
an unattended session will not start a card whose `needs:` is unresolved, so a delivered answer can
freeze work behind it indefinitely.

**How it came to be this way.** The board used to split a card's thread into `## Direction` and
`## Decided`, and an entry's section was what made it an answer. The two sections were merged into
one `## Comments` thread where a `**Decided:**` prefix carries that meaning instead. Cards written
under the old split keep their headings and still read correctly to a person; what they do not carry
is the marker, and `0016` is one of them.

## Links

**Relates to**
- `0070` - the card that added the self-test for this fault. Its check treats a card as settled by
  lane or by a `**Decided:**` entry, and deliberately does not infer one from a `## Decided`
  heading. This card is the cost of that call, recorded rather than hidden.
- `0016` - the answered card. Its answer of 2026-08-18 and its build note of 2026-08-29 are both on
  its own thread and neither changes here.
- `0018` - the other card with a `## Decided` section, whose entry is not an answer. Named so nobody
  reads this card as a request to mark that one too.

## Not this card
**Not writing the `**Decided:**` line into `0016` without Rob.** The mark is what makes an entry the
answer, and an agent applying it is an agent answering.

**Not moving card `0016`.** Which lane an answered-and-built card belongs in is a separate question
and this card does not raise it.

**Not clearing `0017`'s or `0020`'s blockers yet.** That is one commit once the mark exists, and
doing it first would leave the board asserting an answer nothing records.

**Not card `0018` or card `0027`.** Their blocker is live.

## Acceptance
<!-- AC:BEGIN -->
- [ ] #1 THE CARD `0016` SHALL carry an entry marked `**Decided:**` recording the 2026-08-18 answer.
      proves: manual - only Rob may mark a decision as answered
- [ ] #2 THE CARDS `0017` AND `0020` SHALL carry no `needs:` naming a settled card, and their
      `## Links` SHALL record `0016` as answered rather than as a blocker. proves: `no open card is
      blocked by a settled card`
<!-- AC:END -->

## Tasks
- [ ] Rob pastes the line onto card `0016`
- [ ] Confirm the suite now names `0017` and `0020`, which is the check finally seeing the fault
- [ ] Move both `Blocked by` entries to `Relates to` with the answer as the reason, and delete the
      `needs:` keys
- [ ] Re-run the suite and `board:convention`

## Plan
**Where to stand.** This repository, on a branch of `main`. There is no PHP suite here and no
`vendor/`, so `pest` and `pint` do not exist. The suite is `node scripts/selftest.js`. It is red at
HEAD on one assertion that is not yours, `no board card is too large for the agent file reader`,
which is card `0055` and is Rob's to clear.

**The order matters and it is the whole plan.** Nothing here can be built until criterion #1 is done,
because the test named in #2 cannot see the fault until `0016` carries the marker. So the sequence
is: Rob marks `0016`, the suite goes RED naming `0017` and `0020`, and that red is the proof the
check works. Then clear the two cards and it goes green. A session that clears the cards first has
built the fix without ever seeing the fault, which is the shape this board keeps rejecting.

**What the fix on each card looks like**, and card `0055` is the worked example, in `human-review/`:
delete the `needs:` line, and if it was the only frontmatter key delete the whole block. Under
`## Links`, move the `0016` entry out of `Blocked by` into `Relates to`, with the answer as its
reason line: answered Yes on 2026-08-18, built on 2026-08-29. Remove the `Blocked by` heading if
nothing is left under it, because `Blocked by` and `needs:` must agree in both directions.

**The other measurement**, from this board's directory in PowerShell:

    php C:\Dev\ProgressBoard\artisan board:convention --path=$PWD --cards

It should report the same number of failing cards after this work as before it.

## Comments

**2026-09-11** Raised by the adversarial review of card `0070`, which found that its first check
treated only `done/` and `discarded/` as settled and was therefore green over this exact pair. The
rebuilt check catches a card settled by lane or by an explicit answer, and this pair is the one case
on the board it still cannot see. Not fixed there: applying a `**Decided:**` mark is answering, and
that is Rob's.
