# Card 0011 entered `human-review/` without `## What I need from you`

## Why
`docs/board/README.md` says a card in `human-review/` must carry `## What I need from you`, directly
under its title, and that a card arriving in the lane without a question is a defect in the card
rather than a task for the reader. One more card in the lane does not have that section:

- `docs/board/human-review/0011-security-response-headers.md`

The check is one line: for each file in the lane, does the text `## What I need from you` appear.

What it costs. `0011` is 153 lines. All five of its criteria are ticked, its `## Direction` reads
"Everything on this card is now evidenced on the device", and the ask is the single paragraph at the
very bottom of the file. A reader who opens it meets a finished, device-verified security card and
has to read past two review verdicts to learn that a reviewer returned it with two `defect` verdicts
and that the card needs a person to untick something. The top of the card says the opposite of the
ask, so a reader who stops early reads it backwards.

How it came to be this way. `0011` was built, sent to `ai-review/`, returned, and then moved into the
lane by the scheduler on 2026-09-07, after cards `0045`, `0046` and `0047` had each counted the lane.
Nothing in the move adds the section, so a card gains the lane's obligation without gaining the
lane's shape. That is the same cause `0045` recorded for `0024`, `0030` and `0043`, `0046` for `0004`
and `0006`, and `0047` for `0008`. **This is the fourth time the same fault has been raised in two
days**, which says the fix belongs at the move, in `C:\Dev\ProgressBoard`, and not in this repository.

## Links

**Relates to**
- `0045` - the same defect on `0024`, `0030` and `0043`, which it fixed. Its first criterion is
  lane-wide and cannot close until this card, `0046` and `0047` do.
- `0046` - the same defect on `0004` and `0006`, which it fixed. Its first criterion is lane-wide and
  is still open for the same reason.
- `0047` - the same defect on `0008`, still in `todo/`. Kept separate because one card per finding,
  and `0047` was written before `0011` reached the lane.

## Not this card
Not the cards `0045`, `0046` and `0047` name. Not acting on the reviewer's finding in `0011`, not
unticking any of its criteria and not moving it out of the lane: that is the very call the section
will be asking Rob for. Not widening the hardening self-tests in `scripts/selftest.js` to cover
`app/app.js`, which is what the reviewer's finding asks for and is `0011`'s own work, not this
card's. Not a check that refuses a card entering the lane without the section: that lives in
`C:\Dev\ProgressBoard`, not in this repository.

## Acceptance
<!-- AC:BEGIN -->
- [ ] #1 WHEN `docs/board/human-review/0011-security-response-headers.md` is searched for the heading
      `## What I need from you`, THE CARD SHALL return a hit directly under its title. proves: none -
      this project's suite is one node script over the app and cannot read the board; the check is
      `grep -rL "## What I need from you" docs/board/human-review/*.md` not naming `0011`
- [ ] #2 WHEN a reader opens `0011`, THE CARD SHALL state the ask, what a pass is and what a fail is,
      within the first three lines under the title. proves: manual - whether an ask is legible in
      three lines is a reader's judgement, not a string match
<!-- AC:END -->

## Tasks
- [ ] Read the card's last comment entry and the two `defect` verdicts above it, and use the ask
      already there rather than inventing one
- [ ] Write `## What I need from you` under the title, with the ask first and Pass / Fail / Why it
      needs you underneath
- [ ] Check the card is still inside the 100-line budget after the section is added, and say on the
      card if it is not
- [ ] Re-grep the lane and report which cards still miss the heading

## Plan
Work in the NearestForest repository. Only `docs/board/human-review/0011-security-response-headers.md`
changes; nothing under `app/` or `scripts/` is involved, so `node scripts/selftest.js` cannot see
this either way. Run it anyway to show the change broke nothing.

**The ask is already on the card; it is at the bottom.** Do not invent a new one. Its last comment
entry says the reviewer returned it, that a reviewer may not untick a criterion, and that every
unattended session since has found nothing open to do and promoted it again on the ticked boxes. So
the ask is: untick what the reviewer disproved and send it back to `todo/`, or say on the thread why
the finding is wrong. The finding itself is the `scope` and `breakage` verdicts at the end of
`## Direction`, and both name the same gap: the hardening block in `scripts/selftest.js` checks "no
inline handler" and "no `style=`" against `index.html` only, while the markup the CSP exists to
defend is built by `innerHTML` in `app/app.js`. Only the `eval` check scans the shipped files. Note
that the reviewer graded `acceptance: sound` and the gap sits under task 4, not under a criterion, so
which criterion to untick, if any, is part of what a person has to decide.

**Read `docs/board/README.md`, section "The one section a card in `human-review/` must have",
before writing it.** It gives the field table and a worked example, and it is the thing this card is
enforcing rather than a style preference.

**Watch the line budget.** A whole card fits in 100 lines. `0011` is already 153, all of it build
detail and review verdicts, and the append-only `## Comments` and `## Direction` threads may not be
cut to make room. So this card cannot bring it under budget; keep the new section tight and say so on
the card, as `0045` did for `0043` and `0046` did for `0004`.

It worked when grepping `## What I need from you` across `docs/board/human-review/*.md` returns a hit
in `0011`, and when the card states the ask, the pass and the fail in the first three lines under the
title.

## Comments
<!-- The card's thread, appended by ProgressBoard. Append-only: entries are added, never edited or removed. An entry beginning **Decided:** is an answer, and that is what a decision card exits on. -->

**2026-09-07** Raised by card `0046` on its second run. `0045` named three cards, `0046` named two
more that arrived after it was written, `0047` named `0008`, and `0011` arrived after `0047` was
written. The lane keeps changing under an open card, which is the finding rather than a miscount.
