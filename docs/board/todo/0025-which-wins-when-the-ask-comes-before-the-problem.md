# Which wins when the ask has to come before the problem?

## What I need from you

**One answer: when a card's ask must sit above `## Why`, does the ask win or does the problem
statement win?** Post it as a `**Decided:**` line in `## Comments`. Card `0021` finishes on it and
cannot finish without it.

**Pass** is option 1, 2 or 3 chosen. Any of the three closes this card and unblocks `0021`.

**Fail** is no answer, which leaves `0021` open at five criteria out of six for good, because no
amount of reading settles it.

**Why it needs you.** Two of the four reasons a decision is a person's. It is **a preference**: card
shape is how much you want to read before you are asked to do something, and you are the reader. It
is also **a cost you carry**: the fix for options 2 and 3 lands in `docs/board/README.md`, which is a
copy of a canonical file outside every repository, so only you can change it where the change
survives redistribution.

## Why

**Two rules on this board contradict each other, and a card obeying one breaks the other.**

`docs/board/README.md` says a card waiting on a person must open with `## What I need from you`,
"directly under the title", with the reasoning underneath "where it cannot stand between the reader
and the ask".

Card `0021`'s acceptance criterion #1 says a rewritten card "SHALL state the problem in `## Why`
before any solution appears anywhere in it".

Six open cards here have the ask-first shape: `0001`, `0002`, `0003`, `0010`, `0017` and `0018`. On
five of them everything above `## Why` is exactly what the README requires there and nothing more:
the ask, its pass, its fail, and why it needs a person. On `0001` the ask is five checks to run on a
phone; on `0010` it is three steps that ARE the fix. No wording puts the problem in `## Why` first
while keeping the ask directly under the title.

**What it costs.** Two unattended sessions have now worked `0021`, reached this wall and stopped in
the same place, both on 2026-09-05. Criterion #1 can be neither ticked nor honestly closed, so the
card holds a lane and each next session pays the same reading again to arrive at the same halt.

**How it came to be this way.** The README gained its "`## Why` is the PROBLEM" section on
2026-08-18. The ask-first rule for `human-review/` was already in it. Nobody read the two against
each other, because until `0021` no card had been measured against both at once.

## Links

**Relates to**
- `0021` - its criterion #1 is the half of this conflict that cannot be met. It is left open and its
  comment thread carries the card-by-card evidence behind the six cards named above.
- `0003` - the single place where the text above `## Why` is removable rather than forced: a bare
  "My recommendation is **1**" line that the README never asks for and that `## Recommendation`
  already carries. It moves only under options 2 and 3.

## Options

1. **The ask wins, and criterion #1 means "no solution inside `## Why`".** Cost: nothing to build
   and nothing to redistribute. `0021` #1 is then already met and that card closes the same day. The
   residual risk is `0003`, where a reader still meets a recommendation before the problem.
2. **The problem wins, and `## Why` moves above the ask on every card waiting on a person.** Cost:
   the canonical README changes in the ProgressBoard repository and goes out to every board, and six
   cards here are re-ordered. It also gives up what the ask-first rule bought: knowing within three
   lines of opening a card what you are being asked to do.
3. **Both, split.** The ask stays directly under the title, and its first line must name the problem
   in a clause before it names the action. Cost: the same canonical README change as option 2, plus
   a rewrite of the opening line of six cards. Nothing is re-ordered, and nothing the README
   promises is given up.

## Recommendation

**Option 1**, recorded as a clarification rather than a change. It costs nothing, it touches no file
outside this repository, and criterion #1 was written to stop cards opening with candidate solutions
and their costs, which is not what an ask is. Option 3 is the right answer instead if you open
`0001` or `0010` and still cannot tell what the card is for within three lines. That is the whole
test and it takes two minutes.

Ready to paste into `## Comments`:

    **2026-09-05** **Decided:** Option 1. Criterion #1 means no solution inside `## Why`, and the
    `human-review/` ask stays directly under the title.

## Comments
