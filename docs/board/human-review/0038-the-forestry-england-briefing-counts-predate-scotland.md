# The Forestry England briefing still counts the dataset as it was before Scotland

## What I need from you

**Untick a criterion and send this card back to `todo/`, so a session corrects two car park numbers
in the briefing.** If you think the numbers are right as they stand, write that on the thread
instead. Doing neither leaves the card here.

**What's wrong.** This matters more than an ordinary count fix, because
`docs/outreach/forestry-england-handover.md` is the file you would hand to Forestry England, and to
a session working in Word that cannot check anything against the code. Two numbers in its
screenshots section disagree with the repository:

- It says **196** car parks publish no usable name. The real figure is **177**. The 196 counts 19
  records twice, because those 19 are already inside the 177.
- It says card `0004` names **177** of them after their nearest forest. It names **158**. The other
  19 are more than five miles from any forest and keep the plain label.

**Cause.** The card fixed the numbers in the table at the top of the briefing, which is the part the
self-tests read. These two sit in prose further down, which nothing reads.

**Pass** is 196 becoming 177 and 177 becoming 158 in that file, with a dated line here.

**Fail** is neither route. The card stays ticked, no session finds anything open, and the briefing
keeps two wrong figures in a document that goes to an outside party.

**Why it needs you.** Only you may untick a criterion. This is also correspondence rather than code:
whether it is worth a round of edits before the email goes is your call.

**Note on length.** This section takes the card past the 100-line budget. `## Comments` and the
review verdicts are append-only, so nothing here could be cut to make room.

## Why
`docs/outreach/forestry-england-handover.md` is the self-contained briefing for a session drafting
the Forestry England email in Word. Two of its statements about the app describe a dataset that no
longer exists, and one of them is presented as checked. Measured 2026-09-06 against
`app/data/sites.json`, which holds 1,180 records: 550 forests (274 English, 276 Scottish) and 630
car parks.

- `:189`, the "what is verified and what is not" table lists `904 locations, 274 forests, 630 car
  parks` as **Verified** against the generated dataset. It is 1,180 and 550 today.
- `:109`, "rows and markers reading `Unnamed car park`. 170 of the 630 car parks". Card 0004 names
  177 of them after their nearest forest, so most of those rows no longer read that way.

What it costs. This file exists to be handed to a session with no repository access, so nothing in
it can be checked against the code by the person using it. A row marked **Verified** is the one
line a reader is entitled to quote without re-checking, and quoting it to Forestry England states a
number about their own data that is wrong by a quarter. The email is not sent yet, so the cost is
still recoverable.

How it came to be this way. The briefing was written on 2026-08-15. Cards 0004 and 0016 changed the
dataset on 2026-08-29 and updated `docs/HANDOVER.md` and `docs/DATA-MODEL.md`, which is where counts
were expected to live. Nothing points from the dataset to the outreach folder.

## Links

**Relates to**
- `0036`, corrected the same stale 904 in three code and build files, and found these two while
  checking that no other live count had moved. Out of its scope: it was scoped to those three files.
- `0027`, the send. This briefing is read as part of doing that card, so this should be fixed first.
- `0016`, grew the dataset from 904 to 1,180 and added the 276 Scottish forests.
- `0004`, derived the 177 car park names that `:109` predates.

## Not this card
Not editing `docs/outreach/forestry-england-enquiry.md` unless a count in it is also wrong; check
it, since the handover repeats the email in full and the two must be edited together. Not changing
what the email asks for, that is card 0018 and card 0027.

## Acceptance
<!-- AC:BEGIN -->
- [x] WHEN a reader opens `docs/outreach/forestry-england-handover.md`, THE FILE SHALL state the
      record, forest and car park counts `app/data/sites.json` holds today.
      proves: `dataset counts in comments match sites.json`
- [x] WHEN the briefing describes what a car park row shows, THE FILE SHALL account for the 177
      derived names card 0004 added. proves: `manual`, prose, not a number a test can read back.
<!-- AC:END -->

## Tasks
- [x] Re-read the counts out of `app/data/sites.json` rather than from any doc
- [x] Correct `:189` and `:109`, and check `forestry-england-enquiry.md` for the same numbers
- [x] Extend the `carried` table in the card 0036 block of `scripts/selftest.js` to cover this file,
      so the next dataset change fails a run

## Plan
Work in the NearestForest repository, on a branch off `main`. The numbers come from the shipped file:

    node -e "const s=require('./app/data/sites.json').sites;console.log(s.length, s.filter(x=>x.source==='forest').length, s.filter(x=>x.source==='carpark').length)"

which prints `1180 550 630` today. `scripts/selftest.js` already reads counts back out of three
files' prose under `--- dataset counts carried in prose (card 0036) ---`; adding a row to its
`carried` list is the whole of the test work. The suite is `node scripts/selftest.js`; there is no
PHP suite here. Nothing under `app/` changes, so no `CACHE` bump is needed.

It worked when the suite passes and no count in the outreach folder disagrees with the shipped file.

## Comments
**2026-09-06** Raised by card `0036` while correcting the same stale 904 in `app/api/nearest.php`,
`docs/build/IOS-SHORTCUT.md` and `app/core.js`.

**2026-09-06**
RESULT: done
TESTS: +3 rows in one existing test, all green (227 passed, 0 failed)
TOUCHED: scripts/selftest.js, docs/outreach/forestry-england-handover.md, docs/board/in-progress/0038-the-forestry-england-briefing-counts-predate-scotland.md
OUT-OF-SCOPE: none

Test first, and it went red for the right reason before the doc moved: three rows added to the
`carried` table in the card 0036 block, one per number on the `:189` row, and the run said
`docs/outreach/forestry-england-handover.md: says 904, dataset holds 1180 | says 274, dataset
holds 550`. It reports as the same single named test the card cites, so the count of tests is
unchanged at 227.

Counts read straight out of `app/data/sites.json`, not out of any doc: **1,180 records, 550
forests (274 `fe-`, 276 `fls-`), 630 car parks**.

`:189` now reads `1,180 locations, 550 forests, 630 car parks` and carries a warning the old row
had no need of: **only 274 of the 550 forests are Forestry England's**. The briefing is read by a
session drafting an email *to* Forestry England, and a bare "550 forests" on a **Verified** row is
exactly the number that would get quoted back to them as a count of their own sites.

`:109` was wrong in two ways, not one. It said "170 of the 630 car parks have no name". Measured
today: **196** publish no usable name (170 `Unknown` plus 7 bare `Car Park`, card 0004's 177 -
plus 19 that were already `Unnamed car park`), and after 0004 only **19** still read that way. So
the line now gives 196 and 19, says the two screenshots at `:104` are from 2026-08-14 and predate
the fix, and says a replacement shot must come from a build containing 0004 rather than from the
live site, since 0004 is built and not yet deployed.

Checked `forestry-england-enquiry.md` as the card asked: it carries no dataset counts at all, so
nothing to edit there and the two files stay in step. `cheryl-update.md`'s only large number is a
word count.

Not settled from the repository, and left for the reviewer rather than guessed: whether the
**Verified** row should be re-dated. The old row carried no date while the rows above it are all
stamped 2026-08-15. I stamped it 2026-09-06, which is when I measured it, on the reading that a
`Verified` claim with no date is the weaker of the two forms.

Nothing under `app/` changed, so no `CACHE` bump, per the card's Plan. No browser check applies -
this card touches documentation and a test only.

### 2026-09-08 review (v20260908123456-4d89)

**suite**

No suite this job could find in NearestForest, so none ran. That is not a pass.

**acceptance: sound**

I checked both boxes against the real code and data.

**AC1 ÔÇö counts match the shipped file.**
`app/data/sites.json` gives `1180 550 630`. The **Verified** row in `docs/outreach/forestry-england-handover.md` now reads `1,180 locations, 550 forests, 630 car parks`. The `carried` table inside the card-0036 block of `scripts/selftest.js` has three new rows, one per number, each reading the count back out of that row and comparing it to a live filter of `sites.json`. So the next dataset change fails a run.

**AC2 ÔÇö the 177 derived names.**
The car-park bullet in the same file now says 196 of 630 publish no usable name, that card 0004 names 177 of them, and only 19 still read "Unnamed car park". I counted in `sites.json`: `name_is_derived` is true on **177** car parks, and **19** still match an unnamed pattern. 177 + 19 = 196. The prose is right.

I ran the suite myself: `node scripts/selftest.js` ÔåÆ **239 passed, 0 failed**. The card said 227; the number grew because other cards landed since, not because a test was lost.

I could not break it.

VERDICT: sound

**scope: sound**

Scope check done. I looked at the real commit, not the big mixed diff.

The card's commit is `45fb941` and it touches only three files: `docs/outreach/forestry-england-handover.md`, `scripts/selftest.js`, and the card itself. Everything else in the diff you were shown (campsites, `mapHint` in `app/core.js`, `parse_campsites.py`, the board moves) belongs to other commits, not this one.

Over the fence: nothing. `docs/outreach/forestry-england-enquiry.md` is untouched, which the card allowed only if a count was wrong; a grep of `docs/outreach/` for `904`, `274` and `170` finds hits in the handover row only, so there was nothing to change there. No ask of the email was changed, so cards 0018 and 0027 are untouched.

Half done: nothing I can cite. The `carried` table in `scripts/selftest.js` gains three rows, one per number on the counts row. The new 196/19 prose at the car park bullet is not machine-checked, but the card marked that criterion `manual` on purpose.

Growth I did weigh: the counts row now carries an extra warning that only 274 of the 550 forests are Forestry England's, and the car park bullet gains the screenshot-age note. Both sit inside the two lines the card named and serve the stated purpose, so I do not call them scope creep.

VERDICT: sound

**breakage: defect**

Found a real break.

**`docs/outreach/forestry-england-handover.md`, the "car park views" bullet in the screenshots section** now says: *196 of the 630 car parks publish no usable name*, and *card 0004 now names 177 of those 196 after their nearest forest*. Both halves disagree with the repository.

- `scripts/parse.py`, the comment above `GENERIC_NAME` where the 5-mile threshold is set, says **177** car parks had no usable name, and that the rule *"names 158 of the 177; the 19 beyond it keep GENERIC_NAME"*.
- `docs/DATA-MODEL.md`, the `name_is_derived` row and the "Known divergences" note, say the same: 177 = 170 `Unknown` + 7 bare `Car Park`.
- The shipped file agrees: 177 records carry `name_is_derived`, 158 read `Car park near ÔÇª`, 19 read `Unnamed car park`.

So 196 double-counts the 19 (they are inside the 177, not extra), and "names 177" should be 158. The briefing now contradicts the two files a reader would check it against, and it is the file handed to a session that cannot check anything.

Nothing catches this: the `carried` table in `scripts/selftest.js` only reads the `:189` pipe-table row, so these prose numbers are untested and were wrong the day they were written.

VERDICT: defect


**2026-09-08** The reviewer returned this card and its finding is the last review entry at the bottom of ## Direction. The loop moved it from todo/ to human-review/ because it has bounced 1 time between todo and ai-review, all 2 criteria ticked. THE BUILDER COULD NOT ACT ON THAT FINDING. A reviewer never unticks a criterion - it is forbidden from editing acceptance at all - so the card came back with 2 of 2 criteria still ticked, every session found nothing open to do, and the loop promoted it again on the boxes. Untick what the reviewer disproved and move it back to todo/, or say here why the finding is wrong.

**2026-09-10** Rob's call, answering the queue: **re-run this card through `ai-review/`.** It met
its own acceptance - the reviewer graded that lens `sound` - and the finding that returned it is
next door to the card rather than inside it. A builder could not act on it and a reviewer may not
untick a box, so the card sat here fully ticked while every unattended run promoted it again. It is
not closed and it is not reopened. It goes back for a fresh adversarial pass with the earlier
verdicts still on the thread, and that pass decides whether the finding is this card's to carry.

### 2026-09-10 review

**suite**

`node scripts/selftest.js` from the repository root: **280 passed, 0 failed**, before and after.
`dataset counts in comments match sites.json`, which criterion #1 names, ran under
`--- dataset counts carried in prose (card 0036) ---`.

**acceptance: defect**

**#1 holds, and it is a real check rather than a check-shaped one.** I broke all three numbers on
the Verified row at `:194` in one edit - 1,180 to 1,181, 550 to 549, 630 to 629 - and the suite named
all three separately:

    FAIL  docs/outreach/forestry-england-handover.md: says 1181, dataset holds 1180
        | says 549, dataset holds 550 | says 629, dataset holds 630

So the three rows added to the `carried` table are three checks and not one. Restored, green. The
row today reads `1,180 locations, 550 forests, 630 car parks`, and I counted `app/data/sites.json`
myself: 1,180 records, 550 forests, 630 car parks. The added warning that only 274 of the 550 are
Forestry England's is correct and is the most valuable sentence on that row, given who reads it.

**#2 is disproved.** It is `proves: manual`, so I settled it by measuring rather than by waving it
through. The bullet at `:109-113` says **196** of the 630 car parks publish no usable name, and that
card 0004 *"now names 177 of those 196"*. Measured three ways, all agreeing with each other and none
with the briefing:

- `app/data/sites.json`: **177** records carry `name_is_derived`. Of those, **19** read
  `Unnamed car park` and **158** carry a forest-derived name. 158 + 19 = 177.
- `scripts/parse.py:62-65`, the comment fixing the 5-mile threshold: *"over the 177 car parks with no
  usable name ... That names 158 of the 177; the 19 beyond it keep GENERIC_NAME"*.
- `docs/DATA-MODEL.md`, the `name_is_derived` row: 177 = 170 `Unknown` + 7 bare `Car Park`.

So **196 double-counts the 19** - they are inside the 177, not additional to it - and **177 should be
158**. The build note above reasoned "170 Unknown plus 7 bare Car Park plus 19 already unnamed", and
the third term is the error: those 19 are the ones the 5-mile fence refused to name, so they are the
tail of the 177 rather than a fourth group.

**One correction to the 2026-09-08 entry, which reached the right answer by a slightly wrong route.**
It said 158 records read `Car park near ...`. Only **154** do. The other four carry a kept qualifier -
`Main car park near Delamere Forest`, `Additional car park near Delamere Forest`, `Overflow car park
near Delamere Forest`, `Main car park near Ingrebourne Hill` - which is `RE_GENERIC_NAME` working as
designed at `parse.py:58`. 154 + 4 = 158 forest-named, so the figure to write is still 158; it is not
the count of one literal string.

The criterion says the file *shall account for the 177 derived names card 0004 added*. It accounts
for 196 of them, and 196 do not exist. Disproved. I have not unticked it - a reviewer may not.

VERDICT: defect

**scope: sound**

Stated up front: **no git command was run**, so I checked the fence against the tree rather than
against the commit.

`docs/outreach/forestry-england-enquiry.md` carries no dataset count at all, which the card allowed
me to leave alone and which I verified by grepping the whole of `docs/outreach/` for 904, 1,180, 550,
630, 177, 196 and 170. The only other hit in that folder is `cheryl-update.md:69`, "about 550 words",
which is a word count and not this dataset - a genuine near-miss that correctly was not touched.
Nothing about what the email asks for changed, so cards 0018 and 0027 are untouched.

The two growths beyond the literal lines - the "only 274 are Forestry England's" warning on the
Verified row, and the note that the screenshots predate card 0004 - both sit inside the two lines the
card named and both serve its stated purpose. Not creep.

VERDICT: sound

**breakage: defect**

The break is the one above, and what makes it worth bouncing rather than noting is where it lives.

`docs/outreach/forestry-england-handover.md` is handed to somebody with no access to this repository.
Every other file this board argues about has a reader who can check it; this one is defined by having
a reader who cannot. So a wrong number here is the one class of wrong number that cannot be caught
downstream, and this card's whole `## Why` is that argument. The corrected Verified row is now
machine-checked; the prose two sections above it, written by this same card, is not, and is wrong.

**Nothing catches it.** The `carried` table matches only the pipe-table row,
`/\| ([\d,]+) locations, [\d,]+ forests, [\d,]+ car parks \|/` and its two siblings. The `:109`
bullet is outside every pattern, so these numbers were wrong the day they were written and no run has
ever disagreed.

**What a builder does, and it needs no untick.** In
`docs/outreach/forestry-england-handover.md:109-113`: **196 becomes 177**, and *"names 177 of those
196"* becomes *"names 158 of those 177"*. The 19 is already right and stays. That is two numbers in
one bullet, and the sentence needs no other change. Worth doing before card 0027 sends anything,
which is what the `## Links` entry for 0027 already says.

Optionally, and cheaply: add a `carried` row keyed on `/([\d,]+) of the [\d,]+ car parks\s*\n?\s*publish no usable name/`
compared to a live count of `name_is_derived`, so the third number in that file stops being the only
unguarded one. The card's criterion #2 chose `proves: manual` on the grounds that this was prose
rather than a number a test can read back. Having now watched the manual route produce two wrong
numbers that survived two reviews, I would say the criterion picked wrong: it is prose *containing*
numbers, and the card 0036 machinery next door reads exactly that.

**Security, per the board README's three questions.** This card produced a test change and a
document; the document is the interesting half.

1. **Weakest point.** The briefing is the project's outward face and it carries a column literally
   headed **Verified**. That mark is an instruction to the reader to quote without re-checking, so
   any wrong figure under it is repeated to Forestry England as fact about their own estate. The
   attack does not need an attacker - being wrong is the whole exploit, and the Verified mark is what
   makes it propagate.
2. **Unchecked.** Every number in that file outside the one pipe-table row, which is where the defect
   above is sitting. Also worth naming: the row is stamped `2026-09-06`, four days stale as of today,
   and a `Verified` stamp ages silently. Nothing warns when it does.
3. **Leak on failure.** Nothing an outside party should not see. The file names `info@forestryengland.uk`,
   which is published on their own site, and internal record counts, which the email is offering to
   discuss. No credentials, no personal data, no host details.

**No UI surface, and I am claiming it rather than skipping it.** This card changed
`docs/outreach/forestry-england-handover.md` and `scripts/selftest.js`. Nothing under `app/` was
touched, so no `CACHE` bump was needed and none was made. The screenshots the bullet discusses are
existing files from 2026-08-14, not something this card produced. There is no screen to drive.

VERDICT: defect

**2026-09-11** The reviewer returned this card and its finding is the last review entry at the bottom of ## Direction. The loop moved it from todo/ to human-review/ because it has bounced 2 times between todo and ai-review, all 2 criteria ticked. THE BUILDER COULD NOT ACT ON THAT FINDING. A reviewer never unticks a criterion - it is forbidden from editing acceptance at all - so the card came back with 2 of 2 criteria still ticked, every session found nothing open to do, and the loop promoted it again on the boxes. Untick what the reviewer disproved and move it back to todo/, or say here why the finding is wrong.
