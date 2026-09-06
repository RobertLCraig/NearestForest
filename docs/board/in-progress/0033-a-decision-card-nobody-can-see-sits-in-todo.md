# A decision card nobody can see sits in `todo/`

## Why
Card `0025` asks Rob one question: when a card's ask must sit above `## Why`, does the ask win or
does the problem statement win? Its `## Comments` thread is empty, so it has never been answered.
It sits in `docs/board/todo/`, and `git log --follow` shows it was created there on its only commit
and has never been anywhere else.

`docs/board/README.md` says `human-review/` is where a card sits when "nothing moves until a person
spends attention", and that a decision leaves that lane by gaining a `**Decided:**` entry. `todo/`
means "ready to pick up, nothing in the way". `0025` is neither ready nor pickable: no amount of
reading settles it, and its own `## Why` says so.

What it costs. Two things, and both have already happened. A person sweeping `human-review/` never
sees it, which is why `docs/HANDOVER.md` listed seven cards waiting on Rob when the true number was
eight; card `0032` found that on 2026-09-06 by counting. And `todo/` is the lane the unattended loop
draws from, so a session can be handed a decision that is explicitly a person's to make, with the
recommendation already written on it and nothing but the loop's own rules stopping it from answering
its own question. Meanwhile `0021` holds a lane at five criteria out of six waiting on the answer.

How it came to be this way. The card was written straight into `todo/` in one commit, so no move
ever put it in the wrong place. Nothing on the board re-reads a card's shape against the folder it is
in, so a card born in the wrong lane stays there.

## Links

**Relates to**
- `0025` - the card in the wrong lane. Its ask, its three options and its recommendation are all
  written and ready; only its position is wrong.
- `0021` - blocked on `0025`'s answer, and the reason the mislaid card costs something today.
- `0032` - found this while checking the count of cards waiting on a person in `docs/HANDOVER.md`.
  Its comment entry records both the count it corrected and this.

## Not this card
Not answering `0025`. The answer is Rob's and the recommendation on that card already says which
option it would take. Not editing `0025`'s text: its shape is fine, its folder is not. Not building a
board check that catches this class of fault, which is a different and larger piece of work.

## Acceptance
<!-- AC:BEGIN -->
- [ ] #1 WHEN a card asks a person to decide something and carries no `**Decided:**` entry, THE BOARD
      SHALL hold that card in `docs/board/human-review/`. proves: none - a card's lane is a folder,
      and this project's suite is one node script over the app; the check is
      `ls docs/board/human-review` showing `0025` there and `ls docs/board/todo` not showing it
<!-- AC:END -->

## Tasks
- [ ] `git mv docs/board/todo/0025-which-wins-when-the-ask-comes-before-the-problem.md docs/board/human-review/`
- [ ] Check the rest of `todo/` the same way: a card whose thread has no `**Decided:**` entry and
      whose body asks a question is in the wrong lane too

## Plan
Work in the NearestForest repository, on a branch off `main`. Nothing outside `docs/board/` changes.

The move is one command from the repository root:

    git mv docs/board/todo/0025-which-wins-when-the-ask-comes-before-the-problem.md docs/board/human-review/

Then sweep the lane, because one card born in the wrong folder means nothing was checking. Every card
in `todo/` that carries a `## Options` section is a decision by the board's own derivation rule
(`docs/board/README.md`, "Two kinds of card, and the kind is derived"), and a decision with no
`**Decided:**` entry in its thread has not been answered. From the repository root:

    Select-String -Path docs/board/todo/*.md -Pattern '^## Options' -List

For each hit, read its `## Comments` and move it only if no entry begins `**Decided:**`. An answered
decision belongs in `todo/`, which is the rule that makes this a read rather than a bulk move.

It worked when `human-review/` holds `0025`, `todo/` does not, and every remaining `todo/` card with
`## Options` has an answer in its thread.

## Comments
**2026-09-06** Raised by card `0032` while it corrected the counts in `docs/HANDOVER.md`. The count
of cards waiting on a person was wrong by exactly this one card, and it was wrong because the card is
not in the lane a count would look in. `0032` corrected the number and added `0025` to the brief's
list; it did not move the card, because its session may not move cards between lanes.
