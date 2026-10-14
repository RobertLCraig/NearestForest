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
- [x] #1 THE CARD `0027` SHALL carry no `needs:` naming `0018`, and its `## Links` SHALL record
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

**2026-10-14** RESULT: done
TESTS: +0 new, all green (345 passed, 0 failed on `node scripts/selftest.js`)
TOUCHED: none
OUT-OF-SCOPE: none

Nothing to build: the edit this card plans was already made by hand before this run. Card `0027`'s 2026-09-30 entry removed `needs: 0018`, and its 2026-10-07 entry dropped the `Blocked by` link. Its `Relates to` list now names `0018` with 'chose the no-ask email on 2026-09-25'. So #1 holds at HEAD and `no open card is blocked by a settled card` passes.

No new test: the criterion's `proves:` is an existing assertion. Red-proof instead, with the patch confirmed: I added `needs: 0018` back to `0027`'s frontmatter (printed the head to show it took), and the suite went 344 passed, 1 failed with `0027 in human-review needs 0018, which is in done`. `git checkout` restored the file and the suite was 345/0 again. No card was left edited and there is no commit, because nothing in the tree changed.

The brief's `.\vendor\bin\pest.bat` and `pint.bat` do not apply: this project has no PHP suite and no vendor/. Its suite is `node scripts/selftest.js`.

### 2026-10-14 review (v20261014211249-9f4c)

**suite**

No suite this job could find in NearestForest, so none ran. That is not a pass.

**acceptance: sound**

I tried to break the one test (#1). I could not break it.

- Card `0027` (`docs/board/human-review/0027-send-the-forestry-england-enquiry.md`) has no `needs:` line in its header. The word "needs" shows up only once, in the 2026-09-30 comment that says it was taken out.
- Its `## Links` puts `0018` under `Relates to`. The reason given is "chose the no-ask email on 2026-09-25".
- There is no `Blocked by` heading left.

The suite check that proves this is `no open card is blocked by a settled card` in `scripts/selftest.js`. I did not run it myself, because I am only allowed to read files. The builder ran it and broke it on purpose. With `needs: 0018` put back, the check failed. With the file put back, it passed. That shows the check can fail and now passes.

Earlier hand edits did this work, not this build. The card still gets what it asked for.

VERDICT: sound

**scope: sound**

**What I checked**

- I read the last commit (`7b6cedb`). It changes only one file: card `0077`'s own file. That file now holds the RESULT note.
- The big diff in the brief is old work from other cards. This run did not make it.
- Card `0027` has no `needs:` in its frontmatter.
- In card `0027`, `## Links` names `0018` under `Relates to`, with the reason "chose the no-ask email on 2026-09-25".
- There is no `Blocked by 0018` line. The card's own 2026-10-07 comment says that line was removed.

**Scope**

- The run did not change the draft email. It did not change the check. Both stay inside the "Not this card" fence.
- Nothing is half done. Earlier hand edits on `0027` already did the work this card planned. The run made no other changes.
- Criterion #1 holds.

VERDICT: sound

**breakage: sound**

I tried to break this card and could not.

**What I checked**
- I read card `0027` at `docs/board/human-review/0027-send-the-forestry-england-enquiry.md`.
- Its frontmatter has no `needs: 0018`.
- `## Links` has no `Blocked by` heading.
- Under `Relates to`, it says: "`0018` - chose the no-ask email on 2026-09-25. Done." This is the reason the card asks for.
- Its comments show the two hand edits: `needs: 0018` was removed on 2026-09-30, and the `Blocked by` link was dropped on 2026-10-07.

**Breakage lens**
- The build changed no file, so it can break no caller.
- The check `no open card is blocked by a settled card` stays as it was. The card said not to change it.
- I found no text that this work made false. The card text agrees with the frontmatter.
- The builder's red-proof is believable. They put the line back, saw the suite go red, and restored the file.

**Limit**
- I did not run `node scripts/selftest.js`. Plan mode lets me only read.

**What you do now:** nothing. Criterion #1 holds.

VERDICT: sound

