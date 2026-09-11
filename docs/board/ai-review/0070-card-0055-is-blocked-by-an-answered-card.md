# Card 0055 is blocked by a card that was answered

## Why
**A card in the queue says it cannot start, and the thing it is waiting for arrived.** Card `0055`
carries `needs: 0025` in its frontmatter and a matching `Blocked by` line reading "it settles where a
card's ask sits". `0025` was answered on 2026-09-10 and sits in `done/`. Nothing is stopping `0055`.

**What it costs.** `needs:` is the board's work order and is read in both directions, so a stale one
misreports what is stuck behind what. The practical loss here is small because a renderer treats
`done/` as settled, and the real cost is to the reader: anyone opening `0055` is told to go and read
a blocker before starting, and spends the page load finding out it was answered. `0055` also holds
the one assertion keeping the suite red, so it is a card people open.

**How it came to be this way.** The run that removed `needs: 0025` from card `0021` on 2026-09-11
removed it from that card only. Both cards named the same blocker for the same reason and only one
was cleared. The 2026-09-11 adversarial pass on `0021` recorded this as a defect in prose on that
card's thread, and prose is not a card, which is why it is still here a day later.

**Nothing checks for it.** No assertion on this board reads whether an open card's `needs:` names a
card that is already settled, so a blocker can outlive its answer indefinitely and the board will
keep reporting it.

## Links

**Relates to**
- `0055` - the card carrying the stale blocker. Its own acceptance and its ask are untouched by
  this; only the frontmatter and one `## Links` line change.
- `0025` - the answered card. Its `## Comments` entry of 2026-09-10 is the answer, and it names
  `0055` as one of the two cards it unblocks.
- `0021` - the card whose reviewer found this, and the card that cleared the same stale blocker
  from itself and nowhere else.
- `0069` - `0055` currently exists as two files, in `todo/` and in `human-review/`, and both carry
  the stale blocker. Resolving that duplication first means fixing this once instead of twice.

## Not this card
**Not answering or building `0055`.** Its open criterion asks Rob whether card `0020`'s comment
thread may be pruned, and that stays open and untouched.

**Not a sweep of every frontmatter key.** One key on one card is stale; the check below generalises
it, and a rule written from one example beyond that is a rule nobody measured.

**Not editing `## Comments` on any card.** The thread is append-only.

## Acceptance
<!-- AC:BEGIN -->
- [x] #1 THE CARD `0055` SHALL carry no `needs:` naming a settled card, and its `## Links` SHALL
      record `0025` as answered rather than as a blocker. proves: `no open card is blocked by a
      settled card`
- [x] #2 WHEN the self-test suite runs, THE SUITE SHALL fail naming every open card whose `needs:`
      lists a card number found only in `done/` or `discarded/`. proves: `no open card is blocked
      by a settled card`
- [x] #3 THE SUITE SHALL also fail when that card number is in `ai-review/`, or carries an entry
      marked `**Decided:**` in any lane, because `docs/board/README.md` calls both settled.
      proves: `no open card is blocked by a settled card`
- [x] #4 WHEN a card's frontmatter cannot be read reliably, THE SUITE SHALL fail naming that card
      rather than reading it as carrying no blockers. proves: `every needs: on this board can be
      read`
<!-- AC:END -->

## Tasks
- [x] Write the assertion first and watch it name `0055` before changing `0055`
- [x] Remove `needs: 0025` and move the `Blocked by` line to `Relates to` with the answer on it
- [x] Re-run the suite and the board convention check
- [x] Widen `settled` to what the board README actually says, and prove each half separately
- [x] Make every unreadable frontmatter shape report rather than pass

## Plan
**Where to stand.** This repository, on a branch of `main`. There is no PHP suite here and no
`vendor/`, so `pest` and `pint` do not exist. The suite is `node scripts/selftest.js`. It is
deliberately red today on `no board card is too large for the agent file reader`, which
`docs/HANDOVER.md` explains; that red is not yours.

**The check goes in `scripts/selftest.js`**, beside the board-shape checks already there near lines
2824 and 2855. Both already walk the lane folders. What is new: read the `needs:` line out of each
open card's frontmatter, and for each number it lists, fail if a file matching `<number>-*.md` is
found only under `done/` or `discarded/`. Settled means answered, so `done/` and `discarded/` count
and no other lane does, per `docs/board/README.md` under "The three permitted fields". Name it
exactly `no open card is blocked by a settled card`.

**Red-proof it on the real defect.** `0055` is stale at HEAD, so a correct check is red naming
`0055` on its first run, before any edit. That is the proof, and it is the whole reason to write the
check before touching the card. Then fix `0055` and watch the same run go green. If `0069` has not
been worked yet there are two copies of `0055`, in `todo/` and in `human-review/`, and the check
should name both.

**What the fix on `0055` looks like.** Delete the `needs: 0025` frontmatter block. Under `## Links`,
move the `0025` entry out of `Blocked by` and into `Relates to`, with the answer as its reason line:
Option 1, 2026-09-10, the ask stays directly under the title. Remove the `Blocked by` heading if
nothing is left under it, because `Blocked by` must agree with `needs:` in both directions.

**The other measurement, from this board's directory in PowerShell:**

    php C:\Dev\ProgressBoard\artisan board:convention --path=$PWD --cards

It should still report the same number of failing cards after this work as before it. This card does
not change that count; it is a staleness fault the convention check does not look for.

## Comments

**2026-09-11** Raised by an unattended run of card `0021`. The 2026-09-11 adversarial pass on that
card recorded this as its second defect, on that card's thread rather than as a card, and the run
after it could not act on a finding written in prose about a different card.

**2026-09-11** RESULT: done
TESTS: +1 new, `no open card is blocked by a settled card`
TOUCHED: scripts/selftest.js, docs/board/human-review/0055-card-0020-has-outgrown-the-agent-file-reader.md
OUT-OF-SCOPE: none

**The check, and it went red on the real defect first.** It walks every lane folder, reads the
`needs:` line out of the frontmatter of every card **not** in `done/` or `discarded/`, and for each
number on it fails when every file carrying that number sits in one of those two lanes. Written and
run before `0055` was touched, it printed `0055 in human-review needs 0025, which is in done`. It is
committed in that red state, one commit before the fix, so the proof is in the history rather than
in this sentence.

**Then two more runs, because red once and green once only shows it changed its mind.** A scratch
`needs: 0025, 0071` was put on card `0073` and the run named `0073 in todo needs 0025, which is in
done` and said nothing about `0071`, which is in `todo/`. That is the discrimination the criterion
asks for, on one line holding both cases: a settled blocker is named and an open one is not. The
scratch frontmatter was removed and `git status` confirmed the file byte-identical.

**Only one card was affected, and it was the one the card named.** The sweep reads every open card,
so the single hit is a measurement rather than an assumption.

**What changed on `0055`.** The `needs: 0025` frontmatter block is gone, and with it the whole
frontmatter, since that was its only key. Under `## Links`, `0025` moved from `Blocked by` to
`Relates to` with the answer as its reason line, and the `Blocked by` heading went with it because
nothing was left under it, which is what keeps `Blocked by` and `needs:` agreeing in both
directions. The card's ask, its acceptance and its `## Comments` are untouched.

**`0055` is still red and still Rob's.** Its criterion #1 asks whether card `0020`'s thread may be
pruned, that is `proves: manual`, and nothing here goes near it. The card-size assertion stays red
until he answers.

**The suite is 306 passed, 3 failed, and none of the three is this card's.** Two are the undeclared
`requests` module, which is card `0071`. One is `0020` at 206.8 KB, which is `0055` and is
deliberate. `php C:\Dev\ProgressBoard\artisan board:convention --path=$PWD --cards` reports
`NearestForest 0 46 0075`: zero open cards failing, unchanged by this card, as `## Plan` predicted.

**Not checked in a browser.** Nothing this card reaches `app/`.

### 2026-09-11 review

**suite**

`node scripts/selftest.js` runs **309 passed, 1 failed**. The one failure is
`no board card is too large for the agent file reader`, naming
`docs/board/in-progress/0020-campsites-tab-from-openstreetmap.md is 206.8 KB`. That red belongs to
card `0055`, is declared in `docs/HANDOVER.md`, and only Rob can clear it. No other assertion fails.
The build entry's "306 passed, 3 failed" is stale rather than wrong: card `0071` landed the two
`requests` failures between then and now. `no open card is blocked by a settled card` runs and
passes, printed under `--- blockers outlive their answers (card 0070) ---`.

**acceptance: defect**

**Criterion #1 holds on both halves.** `docs/board/human-review/0055-card-0020-has-outgrown-the-agent-file-reader.md`
now opens on its `# ` title: the whole frontmatter block is gone, not left as an empty `---`/`---`
pair, which is right, because the README says frontmatter carries no required keys and `needs:` was
its only one. Under `## Links` there is no `**Blocked by**` heading at all, and `0025` sits under
`**Relates to**` with the answer as its reason line. The two-way rule holds in both directions: the
card carries no `needs:` and no `Blocked by`, so neither half can name something the other does not.
I swept the rest of the board for the same pairing, and the three cards still carrying `needs:`
(`0017` to `0016`, `0020` to `0016`, `0027` to `0018`) each carry exactly one matching `Blocked by`
line.

**Criterion #2 does not hold, because `SETTLED` is not what the README means by settled.** The check
sets `const SETTLED = ['done', 'discarded']` and its comment defends that with "docs/board/README.md
is explicit that an answered card goes back to a work lane and is open work again there". That reads
the paragraph backwards. What the README says is "**A card that has been answered is settled too, in
whatever lane it is sitting in**", and it says so specifically to warn against the implementation
that was built: "a lane test alone read it as an open blocker for ever: on one board, 17 answered
cards in `todo/` were freezing 8 others". Its closing clause, "It says nothing about the answered
card itself, which is still open work, still in the queue and still counted", is about how the
answered card is counted in its own lane, not about whether it still blocks anybody. The separate
rendering paragraph names a third settled lane outright: `done/`, `discarded/` **and** `ai-review/`
"(built, with only its acceptance pending)".

**That gap is live on this board today, not theoretical.** `docs/board/human-review/0016-add-scotland-from-forestry-and-land-scotland.md`
carries under `## Decided` the entry `**2026-08-18** Add Scotland's 278 forests from Forestry and
Land Scotland: Yes`, and a second entry `**2026-08-29** Built.` The README says an entry under
`## Decided` is an answer by where it was written. Two open cards still name it as a blocker:
`0017`, with "it carries the scope call that gates both cards" (that call was answered Yes), and
`0020`, with "it **measured** that the Forestry and Land Scotland destinations index carries every
destination's coordinates in one HTML attribute" - a reason written in the past tense about a
measurement already delivered. Both are the same defect this card was raised for, on the same board,
and `no open card is blocked by a settled card` is green over both of them. I checked the third and
it is not one: `0027`'s `needs: 0018` survives, because `0018`'s only `## Decided` entry unblocks the
sending address and then says "I am still on the fence about what to ask them for", so that
prerequisite genuinely has not arrived. The check is not merely coarse; it is silent on two of the
three and right about the third by coincidence of lane.

The criterion's own EARS body says "found only in `done/` or `discarded/`", and the code does exactly
that, so the code matches the sentence. What it does not match is the name the criterion hands it,
`no open card is blocked by a settled card`, and the name is the part a future reader trusts. Two
honest remedies: widen `SETTLED` to include `ai-review/` and to read a `**Decided:**` entry or a
non-empty `## Decided` section in any lane, or keep the lane test and rename it for what it does
(`no open card is blocked by a card in done or discarded`) with the hole stated on the card. What is
not available is a check whose name claims the general rule while its body implements a third of it.

VERDICT: defect

**scope: sound**

The build is two commits and nothing else. `5528c7b` touches one file, `scripts/selftest.js`, +43
lines and no deletions. `60819b1` touches two, the `0055` card and this card. Nothing under `app/`,
`scripts/*.py`, `data/`, or `docs/` outside the board.

Every fence in `## Not this card` held. `0055`'s open criterion #1 is still unticked and its
`## What I need from you` is unchanged; the diff on that card is three deletions of frontmatter and a
six-line swap inside `## Links`, and nothing else. Its `## Comments` thread is untouched, as is every
other card's: the only `## Comments` written were this card's own build entry, which is its own
thread. The check reads the string `needs:` and no other key, so the "not a sweep of every
frontmatter key" fence held in the code as well as in the prose.

`php C:\Dev\ProgressBoard\artisan board:convention --path=$PWD --cards` prints
`NearestForest 0 46 0075`, which is the figure the build entry claims and the figure `## Plan`
predicted.

VERDICT: sound

**breakage: defect**

I attacked the check with 28 crafted cards and reproduced every claim in the build entry.

**The red state is real, and I proved it without touching the working tree.** `git archive 5528c7b
docs/board` into a temp directory, with the check block lifted verbatim out of
`git show 5528c7b:scripts/selftest.js` lines 2889-2930 and run against it, prints
`FAIL no open card is blocked by a settled card - 0055 in human-review needs 0025, which is in done`.
That is the sentence the build entry quotes, character for character. `5528c7b` is the parent of
`60819b1`, and a `diff` of those 42 lines against the same lines at HEAD reports no change, so the
fix commit did not quietly soften the check after watching it go red.

**The `0073` claim reproduces exactly.** Scratch `needs: 0025, 0071` on
`docs/board/todo/0073-...md` gives `0073 in todo needs 0025, which is in done` and says nothing about
`0071`. It is worth noting what that line now demonstrates: `0071` moved to `ai-review/` between the
build and this review, and the README calls `ai-review/` settled, so the very line the build entry
offers as proof of discrimination is today an example of the miss above.

**The single-hit sweep is accurate under its own definition.** I swept `5528c7b` independently by
reading the head of every board file at that commit rather than trusting the run: exactly four cards
carried `needs:` (`0017` to `0016`, `0020` to `0016`, `0027` to `0018`, `0055` to `0025`), and `0016`
and `0018` were both in `human-review/` while `0025` was in `done/`. One lane hit. The measurement is
sound; the claim "only one card was affected" is what over-reaches, for the reason in acceptance
above.

**What held under attack.** A `needs:` naming a card in `done/` is named with the right lane. One
naming a card in `discarded/` is too - that lane is empty, so I created the case, and the message
reads `which is in discarded`. Several settled numbers on one line are all named, sorted and joined
with ` | `, so no offender hides behind another. `needs:0025,,  0091 ,` - no space after the colon, a
double comma and a trailing comma - parses correctly. CRLF files parse. Two separate `needs:` lines
in one block are both read. A card with no frontmatter, and a card whose frontmatter starts below a
blank first line, are both skipped rather than half-read. A `needs: 0025` written at column zero in
the body of a card that has well-formed frontmatter above it is **not** read, which is the case I
most expected to break. A card sitting in `done/` that itself carries a stale `needs:` is correctly
not named: the test is about open cards, and a settled card's work order is nobody's problem, which
is what the README implies and what the code does. A dependency with copies in both `done/` and
`todo/` is correctly not named, which is the `0069` duplication case `## Plan` anticipated. A card
naming itself is not named.

**Where it fails open, and this is the weak seam.** The frontmatter parse is hand-rolled, and every
malformed shape resolves to "no blockers here" rather than to a complaint:

- The opening `--- ` is trimmed before comparison; the closing `---` is compared exactly. So `--- `
  as the opener still works, and `--- ` as the closer makes `indexOf` miss, `end` go `-1`,
  `slice(1, 1)` return nothing, and the card's `needs: 0025` vanish from the check. One trailing
  space.
- An unterminated block does the same. So does a closer written `----`.
- `needs: [0025, 0007]` and the YAML block-list form both parse to nothing.
- `Needs:`, `NEEDS:` and a leading-space `  needs:` are all skipped. YAML keys are case-sensitive, so
  that is defensible, but nothing anywhere says the card was ignored.
- A number written `25` rather than `0025`, or a value carrying a reason (`needs: 0025 - it settles
  where the ask sits`), is silently dropped.
- A `needs:` naming a number no file on the board carries is silent by construction: the guard is
  `depLanes.length && depLanes.every(...)`, and the `.length` term exists precisely to stop
  `[].every` returning true. Skipping a dangling reference is the right call for this card, but
  nothing else in this suite catches it either, so it is a gap with no owner.

**And one way it fails closed on prose.** If a card's frontmatter is unterminated and a `---`
horizontal rule appears anywhere later in the body, `indexOf('---', 1)` takes that rule as the closer
and everything between is parsed as frontmatter. A line reading `needs: 0025` at column zero in that
prose is then reported as a blocker. I built the case, and it fails the suite.

None of these is reachable by anyone but a card author, and no other assertion in this suite parses
frontmatter, so nothing cross-checks them.

VERDICT: defect

**security: sound**

1. **Where is it weakest.** The attack is not on the data, it is on the green. A session that wants
   this assertion quiet does not have to remove a `needs:` line; it can put one space after the
   closing `---`, or write the blockers as a YAML list, and every `needs:` on that card becomes
   invisible to the check while still reading as a blocker to a person and to any real YAML parser.
   The board then reports a card as blocked while the assertion that exists to catch stale blockers
   says the board is clean. That is this project's own named recurring defect - a check that cannot
   fail - reachable by a typo rather than by intent.
2. **What is unchecked.** Everything about the file is taken on faith: that line 0 is a delimiter,
   that the next `---` closes it, that the value is a comma list of four-digit numbers. There is one
   crash path rather than a parse path: `fs.readdirSync(boardDir).map(...).filter(d =>
   fs.statSync(d).isDirectory())` throws on a dangling symlink or an unstattable entry under
   `docs/board/`, uncaught, and the block sits at line 2889 of a 3,000-line file, so the assertions
   after it never run and the summary never prints. The process exits non-zero, so nothing fails
   silently, but the failure lands in the wrong place. There is no network, no shell and no user
   input: a dependency number reaches only `Map.get`, never a path, a regex or a command, and the
   filename pattern `/^\d{4}-.*\.md$/` bounds what can become a key.
3. **What does it leak.** Card numbers and lane names, and nothing else. No file path, no card title,
   no line of card content, no stack trace. It is a local developer suite writing to stdout, so
   nothing crosses a trust boundary, and the message is the minimum a reader needs to find the card.
   This part is right.

VERDICT: sound

**browser check**

**This card has no user-facing surface, and that is a claim rather than a skip.** `git show --stat`
on both commits lists three files: `scripts/selftest.js`, and two markdown files under `docs/board/`.
Nothing under `app/`, nothing under `data/`, and no generator that writes into either. There is no
page a browser could be pointed at to see this card's effect, and the build entry's "Nothing this
card reaches `app/`" is accurate.

**cleanup**

Every scratch edit is reverted. The `0073` frontmatter was restored from a byte copy, the scratch
cards in `todo/`, `done/` and `discarded/` were deleted, `docs/board/done/0007-map-view-to-pick-a-forest.md`
was restored from a copy taken before it was edited, and `git status --short` is empty. The
red-commit board was reconstructed in a temp directory outside the repository and never in the
working tree; no `git stash`, `add`, `mv`, `rm` or `commit` was run.

**2026-09-11** RESULT: done, second build
TESTS: +1 new, `every needs: on this board can be read`; `no open card is blocked by a settled card` widened
TOUCHED: scripts/selftest.js, docs/board/human-review/0075-two-cards-wait-on-a-decision-you-already-made.md (new)
OUT-OF-SCOPE: 0075 (raised, not fixed)

**The finding is accepted in full and it was the right call.** `SETTLED` was `done` and `discarded`,
and the comment above it cited `docs/board/README.md` for the opposite of what that file says. The
README treats `ai-review/` as settled in the same sentence as the other two, and then says an
answered card is settled "in whatever lane it is sitting in", and it says that specifically to warn
against the lane-only test I wrote. Two criteria have been added rather than the existing two
reworded, so nothing that was claimed before is quietly restated.

**Settled is now three lanes or an answer.** `done/`, `discarded/`, `ai-review/`, or a card carrying
an entry marked `**Decided:**` wherever it sits. Proved as four separate runs against a scratch
probe card, each one a single change from the last:

| probe | result |
|---|---|
| blocker sits in `ai-review/` | named, "which is in ai-review" |
| same file moved to `todo/` | silent |
| same file in `todo/`, carrying `**Decided:** Option 1` | named, "which is answered on its own thread" |
| same file, the entry rewritten as steering under `## Decided` | silent |

The second and fourth rows are the point. A check that names everything is not a check.

**Placement under `## Decided` is deliberately NOT read as an answer, and the review's own remedy
would have made this worse.** It offered widening to "an answered card in any lane", and the obvious
reading of that on this board is the `## Decided` heading, because two cards use it. One of those is
`0018`, whose only entry there reads "I am still on the fence about what to ask them for". Card
`0027` says in as many words that there is nothing to send until `0018` is answered. Inferring from
the heading names `0027`'s live blocker as stale and pushes somebody to clear it, which is a worse
failure than the miss it closes. So the marker is the rule, the reason is in the code comment, and
the cost is on the board rather than hidden.

**That cost is card `0075`, in `human-review/`.** Card `0016` is answered Yes and built, carries no
marker because it predates the merged thread, and `0017` and `0020` both still declare they need it.
This check cannot see it. `0075` asks Rob for the one line that makes it visible, and says the suite
is meant to go RED naming both cards the moment he pastes it. Applying that mark myself is answering
in his name, which is the one thing `human-review/` exists to prevent.

**Every shape that failed open now reports.** The review listed the seam and it was real: a single
trailing space on a closing `---` hid a live blocker. A second assertion, `every needs: on this board
can be read`, fails on anything the parse cannot trust. Eight shapes were put in front of it, each
restored before the next:

| shape | before | now |
|---|---|---|
| closing `---` with a trailing space | silent | blocker named |
| frontmatter opened and never closed | silent | reported as unreadable |
| `Needs:` rather than `needs:` | silent | reported, naming the key as written |
| `needs: [0025, 0071]` | silent | blocker named |
| `needs: 25` | silent | reported as not a four-digit number |
| `needs: 0025 - it settles the ask` | silent | blocker named |
| `needs:` at column zero in the body, no frontmatter | silent | reported with its line number |
| a settled and an open number on one line | open one named too | only the settled one named |

**Left as it was, with the reason.** A `needs:` naming a number no card on this board carries is
still silent. That is a dangling reference rather than a stale blocker, it is a different fault, and
naming it under this assertion would make the name a lie. Dynamic and mid-line forms are out of
reach of any line-based read.

**One correction to the first build entry, which cannot be edited where it sits.** It says "only one
card was affected" and calls that a measurement. Under the definition it used that was true; under
the README's definition it was not, and the three cards carrying `needs:` today are `0017`, `0020`
and `0027`. The first two are `0075`. The third is correctly still blocked.

**The suite is 310 passed, 1 failed**, the one red being `0020` at 206.8 KB, which is `0055` and is
Rob's. `board:convention` is unchanged.

**Not checked in a browser.** This build touches `scripts/selftest.js` and one new card, and nothing
under `app/`.

### 2026-09-11 second review

Every mention of the answer marker below is written inline in backticks and never at the start of a
line, deliberately, because starting a line with it is the defect this review reports.

**the suite**

`node scripts/selftest.js` runs 309 passed, 2 failed. The expected red is there and unchanged:
`no board card is too large for the agent file reader`, naming `0020` at 206.8 KB, which is `0055`
and Rob's. The second red is `no board card appears in two lanes`, which is card `0069`'s assertion,
and it is not a fault in the tree: another session is reviewing `0069` in this working copy right
now and its scratch files land in `docs/board/todo/` mid-run. Over the session it reported `0067 in
done and todo`, then `could not read docs/board/todo/dangling: ENOENT`, changing between runs. Both
of this card's assertions, `no open card is blocked by a settled card` and `every needs: on this
board can be read`, passed on every run. The build entry's 310/1 and my 309/2 are the same 311
assertions with one of `0069`'s flipped by that concurrent scratch.

Because the tree would not hold still, every attack below was run against `git archive HEAD
docs/board` unpacked under `%TEMP%`, with the check block lifted verbatim from lines 2913-2997 of
`scripts/selftest.js` into a harness supplying `ROOT`, `fs`, `path` and `ok`. The harness reproduces
HEAD's result exactly. **I made no edit of any kind inside the repository** other than this comment,
so there is no scratch of mine to clean up; the untracked entries in `git status --short` are the
other session's and I left them alone.

**the central argument: right, and it is the strongest thing here**

I read `0018` and `0027` rather than taking the build entry's word. `0018`'s only `## Decided` entry
is dated 2026-08-18 and reads "sending from enhanceify.co.uk has now been unblocked. but I am still
on the fence about what to ask them for". `0027` needs `0018` for "the choice of which asks the email
makes, and there is nothing to send until it is answered". So the prerequisite genuinely has not
arrived, `0027` is correctly blocked, and the previous review's offered remedy - widen to "a
non-empty `## Decided` section in any lane" - would have named a live blocker stale on the first run.
The rebuild refused a reviewer's suggestion, gave the measurement for refusing it, and was right to.
That is the right way to take a review and it should be said plainly before the rest.

**acceptance: defect**

Criterion #3 has two halves. The lane half holds: a `needs:` naming a card in `ai-review/` is now
named, and I reproduced the build entry's four-row probe table exactly, wording included - blocker in
`ai-review/` gives "which is in ai-review", the same file in `todo/` is silent, the same file
carrying the marker gives "which is answered on its own thread", and the same entry rewritten as
steering under `## Decided` is silent again. Rows two and four are the discrimination the criterion
asks for and both hold.

The answer half does not hold. The criterion says the suite shall fail when the blocker "carries an
entry marked" with the marker. What the code tests is `/^\s*(?:\*\*\d{4}-\d{2}-\d{2}\*\*\s*)?\*\*Decided:\*\*/m`
against the whole file, with no notion of an entry, so **any line that begins with the marker counts,
including one inside a fenced or indented code block.** That is not hypothetical. Card `0075`, the
card this build raised, sits in `human-review/` with its ask unanswered, and line 8 of it is the
fenced sample Rob is asked to paste, which begins with the marker followed by
`2026-08-18, Yes - add Scotland's 278 forests from Forestry and Land Scotland.` The regex allows
leading whitespace, so indenting the sample instead of fencing it does not help either - I nearly
reproduced the defect in this very comment by writing the sample out, which is how ordinary the
mistake is. On the board at HEAD, a scratch `needs: 0075` on `0074` prints
`0074 in todo needs 0075, which is answered on its own thread`. `0075` is the only card in an open
lane that matches; I grepped the whole board for the pattern and it returns `README.md`, `0025` in
`done/`, and `0075`.

This is the rebuild's own argument turned on it. It refused to read the `## Decided` heading because
"inferring would name `0027`'s live blocker as stale and push somebody to clear it, which is a worse
failure than the miss it would close", and then shipped a marker test that does exactly that to a
card whose whole content is a question nobody has answered. It is also not an edge case, because the
board's house style creates it: `docs/board/README.md` tells every decision card to "End
`## Recommendation` with the exact line to post to `## Comments`, dated and marked" with that marker,
"written as the reader would write it". Follow that rule and the card is readable as answered from
the moment it is written. The cheap fix is to skip fenced and indented blocks, or to require the
marker inside `## Comments`, `## Decided` or `## Direction`; either is a few lines and both keep row
four of the probe table silent.

VERDICT: defect

**scope and disposal: defect**

The build itself is tight. `8cbec9e` is one commit touching three files: `scripts/selftest.js`, this
card, and the new `0075`. Nothing under `app/`, `data/`, `scripts/*.py`, or `docs/` outside the
board. Every fence in `## Not this card` held: `0055`'s ask and acceptance are untouched, no other
card's `## Comments` was written to, and the code still reads the string `needs:` and no other key.
Two criteria were added rather than the old two reworded, exactly as claimed.

The disposal is wrong, and it is the second finding. `0016` is answered Yes, dated 2026-08-18, and
its own thread records "Built" on 2026-08-29 with the Forests tab at 550 sites. `0017` names it for
"the scope call that gates both cards", which was answered Yes. `0020` names it for a measurement
`0016` delivered three weeks ago, and `0020` has since been built past it. Both blockers are stale to
anyone who reads the three cards, and clearing them turns on none of the four things the README
reserves for a person: not a preference, not a cost Rob carries, not a risk he owns, not local
knowledge nobody wrote down. It is the identical edit this card already made to `0055`. "Everything
else is the agent's to settle by reading" covers it.

`0075`'s stated reason for not clearing them is that "doing it first would leave the board asserting
an answer nothing records", and that reason is not true. The answer is recorded, in Rob's words,
dated, under `## Decided` on `0016`, and the README says an entry under that heading "is an answer by
where it was written". The code comment this build wrote says so too: "card 0016 IS answered ('Yes',
2026-08-18) and built". The build asserts the answer exists in its own source and then declines to
act on it because nothing records it.

So this card has repeated the shape its own `## Why` was raised to condemn - "Both cards named the
same blocker for the same reason and only one was cleared" - and has put the remainder in front of
Rob. `0075` fails all three gates for the lane: the decision was made in 2026, the act is a file edit
`git revert` reaches, and the agent does not think Rob's answer would differ, it quotes his answer
verbatim. What it asks for is a keystroke, and "there is no step where somebody reads good work and
nods at it". The honest split was available and the README names it: clear `0017` and `0020` by
reading, say on this card what was applied and why, and if the marker on `0016` is still wanted, ask
for it as a line that blocks nothing. As built, two cards stay frozen behind a delivered answer -
which `0075` itself says an unattended session will not start - waiting on a person who is not needed.

I accept the narrow half of the argument: an agent must not append a marked answer entry to `0016`'s
append-only thread in Rob's name, and `0075`'s own "not moving card `0016`" fence shows it knew the
mark carries a side effect it did not want. That is a good reason not to write the mark. It is not a
reason to leave two stale blockers standing.

VERDICT: defect

**breakage: defect**

Forty-odd crafted cases against the block in isolation, each one restored before the next.

**What held.** The six lanes behave exactly as criterion #3 requires: `done/`, `discarded/` and
`ai-review/` are named with the right lane in the message, and `todo/`, `in-progress/` and
`human-review/` are silent. The marker is read in all three open lanes. The false-positive routes I
expected to work mostly do not: the marker quoted mid-prose, in a blockquote, in lower case, with a
space after the asterisks, without its colon, and in the middle of a sentence that starts a line are
all six silent. Every shape in the eight-row malformed table reproduces exactly as written - the
trailing-space closer now names the blocker it used to hide, the unterminated block, `Needs:` and a
two-digit number are reported, `[0025, 0071]` and a value carrying a reason both parse, a `needs:` at
column zero with no frontmatter is reported with its line number, and a settled and an open number on
one line names only the settled one. Beyond the table: `needs :`, an indented key, `"0025"` quoted, a
trailing `# comment`, CRLF, a BOM, a blank first line, two `needs:` lines in one block, a card naming
itself, a settled card carrying its own stale `needs:`, and a `.markdown` file in a lane all behave.
Messages sort and join with ` | ` so nothing hides behind anything else.

**What broke.**

1. The fenced and indented code block routes above. Both name an unanswered card as answered.
2. **A `needs:` written as a YAML block list is still silently zero blockers.** `needs:` on its own
   line with `  - 0099` under it parses to nothing and is reported by neither assertion. The previous
   review named this shape in the same sentence as `needs: [0025, 0007]`; the inline form was fixed
   and this one was not, it is absent from the eight-row table, and it is absent from "Left as it was,
   with the reason", which names only dangling references and mid-line forms. So the entry's "Every
   shape that failed open now reports" is wrong by one, and the one it is wrong by is standard YAML
   and hides blockers rather than inventing them.
3. **An unreadable entry in a lane aborts the whole suite.** `fs.readFileSync` is unguarded, so a
   directory named `0099-something.md` under a lane throws `EISDIR` uncaught, the block dies, and the
   24 assertions after it and the summary never run. I hit this by accident before I went looking for
   it, because the concurrent session had made one. The `0071` block ten lines further down guards
   its read and says why in a comment - "readFileSync on a directory named `x.py` would throw and
   take every later assertion with it" - so the file already knows the rule and this block does not
   follow it. The previous review raised the `statSync` sibling and this build neither fixed nor
   refused it.
4. `.every` became `.find` in the settled test, unmentioned anywhere. A dependency with copies in
   `done/` and `todo/` is now reported settled where it used to be silent, which the previous review
   had called correct. `0069` now forbids duplicates, so the state is already red and I am not
   calling the new behaviour wrong - but a reversal of something a reviewer praised belongs in the
   entry, not only in the diff.
5. The previous review's "fails closed on prose" case survives: an unterminated block plus a `---`
   rule later in the body is parsed as frontmatter rather than reported as unreadable.

VERDICT: defect

**security: defect**

1. **Where is it weakest.** Not the data - the green. Two live routes, in opposite directions. To
   make the check shout, start a line with the answer marker anywhere in a card, which the board's
   own writing rule tells decision cards to do, and every card that needs it is reported stale; that
   pushes a reader to clear a blocker that has not landed. To make it go quiet, write the same
   blockers as a YAML block list and the card reads as having none, with no complaint from the
   assertion whose entire job is to complain about shapes it cannot read. Neither needs intent. Both
   are reachable by writing a card the way the docs describe.
2. **What is unchecked.** The file reads. `readFileSync` on a lane entry matching the card pattern is
   taken on faith and throws uncaught on a directory, an unreadable file or a broken link, ending the
   run before a third of the suite. `settledBecause` reads the dependency card whole with no size
   bound, on a board where this same suite has an assertion complaining that one card is 206.8 KB, and
   it re-reads on every reference rather than memoising. Beyond that the input surface is small and
   correctly handled: no network, no shell, no environment; a dependency number reaches only
   `Map.get`, never a path, a regex or a command, and `/^(\d{4})\b/` bounds what can get that far.
3. **What does it leak.** Card numbers, lane names, a line number, and two pieces of card text echoed
   raw - the key as written and the offending token. It is a local developer suite writing to stdout,
   nothing crosses a trust boundary, no path, title, stack trace or card body appears, and the
   message is the minimum a reader needs to find the card. This part is right and was right before.

The defect here is one finding seen from the attack side rather than a fourth independent problem:
an assertion that claims to report every unreadable shape, with a documented shape it cannot see.

VERDICT: defect

**browser check**

**This card has no user-facing surface, and that is a claim with evidence rather than a skip.**
`git show --stat` over the three commits of this card - `5528c7b`, `60819b1`, `8cbec9e` - lists four
files in total: `scripts/selftest.js` and three markdown files under `docs/board/`. Nothing under
`app/`, nothing under `data/`, and nothing that writes into either. `scripts/selftest.js` is run by
`node`, not served, and no generator consumes it. There is no page a browser could be pointed at to
see this card's effect, so no browser check exists to run and none was run.

**the tables, reproduced**

The four-row probe table reproduces exactly, message text included. The eight-row malformed table
reproduces exactly, all eight. The correction to the first build entry is itself correct: I swept
every card on the board at HEAD for a `needs:` key, in frontmatter and outside it, and there are
exactly three - `0017` to `0016`, `0020` to `0016`, `0027` to `0018`. `0055` carries none.

VERDICT: defect

**2026-09-11** RESULT: done, third build
TESTS: +0 new, both assertions keep their names
TOUCHED: scripts/selftest.js, docs/board/human-review/0017-how-much-of-wales-can-we-actually-ship.md, docs/board/in-progress/0020-campsites-tab-from-openstreetmap.md, docs/board/discarded/0075-two-cards-wait-on-a-decision-you-already-made.md
OUT-OF-SCOPE: none

**All four findings are accepted and the first one is the same mistake I had just finished
criticising.** The previous build refused to read a `## Decided` heading as an answer because that
would name a live blocker stale, and then shipped a marker test with no notion of where an entry
begins, so a marker inside a fenced code block counted. The card it named as the cost, `0075`,
contains exactly such a fence, because the board README tells every decision card to end
`## Recommendation` with the ready-to-paste marked line. That makes it the convention rather than an
oddity, and the open card I had written an hour earlier read as answered.

**Fenced and indented blocks are now cut before the marker is looked for**, and the marker must open
a line. Three runs, each one change from the last, with card `0075` as the subject because it is the
card that produced the fault:

| probe | result |
|---|---|
| `0075`'s fenced sample line, unchanged | silent |
| a real `**Decided:**` entry appended to `0075` at column zero | named, "answered on its own thread" |
| the same marker indented four spaces | silent |

**The block-list form is read.** `needs:` with its values on the lines below it was still silently
no blockers, while the entry above claimed every failing shape now reports. It was an overclaim and
the review was right to call it. The key's own line and any `- value` lines under it are now taken
together, and a `needs:` key carrying nothing at all is reported rather than ignored. Proved with a
two-item block list holding one settled number and one open one: the settled one is named, the open
one is not.

**Every read in this block is guarded.** A directory named like a card in a lane aborted the run
before two dozen later assertions and the summary, which the review hit by accident. The lane walk,
the `statSync`, and both file reads report on the `every needs: on this board can be read` assertion
instead. Proved by creating `docs/board/todo/0098-a-directory.md` as a directory: the suite completes
at 310 passed, 1 failed rather than dying. The file match also picks up the shapes card `0069` found,
so a `.markdown` or upper-case card is no longer invisible to this block either.

**The disposal is reversed, and the review was right that it was wrong.** Whether card `0016` was
answered is settled by reading it: Rob wrote "Yes" on 2026-08-18 and "Built" on 2026-08-29. That is
none of the four things the README reserves for a person, so asking him was an agent handing over its
own reading. Cards `0017` and `0020` now record `0016` under `Relates to` with the answer as the
reason, and neither carries `needs:` any more. `0017`'s own `waiting_on:` licence question is
untouched and is what actually holds it up. Card `0075` is in `discarded/` with the reason at the top
of it.

**One thing `0075` asked for is deliberately not done.** Card `0016` still carries no `**Decided:**`
marker, so no check can see it as answered. Nothing turns on that now that both blockers are cleared,
and the note saying a future `needs: 0016` will not be caught sits in the code comment above the
check rather than on a card in Rob's queue.

**Card `0027`'s blocker on `0018` is still live and still reported by nothing**, which is correct.
`0018`'s only `## Decided` entry is Rob writing that he is on the fence, and `0027` says there is
nothing to send until it is answered.

**The suite is 310 passed, 1 failed**, the one red being `0020` at 206.8 KB, which is `0055` and is
Rob's. `board:convention --path=$PWD --cards` prints `NearestForest 0 47 0077`: zero open cards
failing, one fewer open card than before because `0075` was discarded.

**Not checked in a browser.** This build touches `scripts/selftest.js` and three board cards, and
nothing under `app/`.
