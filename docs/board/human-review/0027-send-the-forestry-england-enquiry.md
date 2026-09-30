---
not_for_the_loop: sends an email to a public body in Rob's name
---
# Send the Forestry England enquiry

## What I need from you

**Send `docs/outreach/forestry-england-enquiry.md` to info@forestryengland.uk and say here that it
went.** The draft is now the no-ask notification you chose on card `0018` on 2026-09-25, rewritten
2026-09-30: no pitch, no name question, no introductions, and no `[confirm]`, `[phone]` or
`[email]` left in it. Card `0018`'s answer is on its own thread, so nothing gates this any more.

1. Open the file and read it once. Change anything you would not say; it is 200 words.
2. Send it from any address that can send, with the three screenshots named at the foot of the
   file attached if you want them. Expected: it goes, and the signature is your name and the site.
3. Add a dated line under `## Comments` saying it was sent. Paste any reply there when it arrives.

**Pass:** a dated line here saying it was sent, and the body carried no placeholder.
**Fail:** an older draft goes out with asks in it. The Word copies in `docs/outreach/` are all the
old pitch; only the `.md` named above is current. A reply asking for the app to come down is not a
fail and not this card: it gets a card of its own straight away.

**Why it needs you.** Rule two: it is an email to a public body in your name, and no `git revert`
recalls it.

## Why
The email was drafted on 2026-08-15 and has never been sent. Two sentences about Rob are still marked
`[confirm]`, the signature still reads `[phone]` and `[email]`, and neither can be settled from the
repository. Three cold reviews were run the same day and nobody has acted on any, so the draft would
go out in the shape all three predicted would earn no reply.

How it came to be this way. The choice and the send sat on one card, which grew to 325 lines, and the
send kept queueing behind a choice that kept queueing behind more research.

## Links

**Blocked by**
- `0018` - it is the choice of which asks the email makes, and there is nothing to send until it is
  answered.

**Relates to**
- `0019` - it put Forestry England's own attribution wording in the footer. The email claims that
  wording is in use, so it is better deployed before they read it.
- `0024` - it split this card out of `0018` and moved the review notes to `docs/outreach/`.

## Not this card
Not the choice of asks, which is `0018`. Not rewriting the draft to a reviewer's taste: some of what
they say contradicts Rob's own recorded instructions, so the notes are input and not orders. Not
chasing a reply, and not a second email.

## Acceptance
<!-- AC:BEGIN -->
- [ ] #1 WHEN the email is sent, THE DRAFT SHALL carry no `[confirm]`, `[phone]` or `[email]`
      placeholder. proves: manual - only Rob can settle what is true about him
- [ ] #2 WHEN the email is sent, THE CARD SHALL say which review findings were taken and which were
      refused. proves: manual - a judgement call, not a check
- [ ] #3 WHEN a reply arrives, THE CARD SHALL carry it in `## Comments`, or one line recording that
      2026-09-11 passed in silence. proves: manual - the reply arrives in an inbox
<!-- AC:END -->

## Tasks
- [x] Settle the two `[confirm]` claims in the draft (removed with the ask they supported, 2026-09-30)
- [x] Read the review notes and decide what changes in the draft (all three reviews were about the
      asks; none applies to a no-ask email, so none was taken, 2026-09-30)
- [ ] Send to info@forestryengland.uk
- [ ] Paste the reply, or record the silence, on this card

## Plan
Work in the NearestForest repository. The only file that changes is
`docs/outreach/forestry-england-enquiry.md`, and only if you decide to change it. The review notes
are beside it at `docs/outreach/forestry-england-enquiry-review.md`.

Contact route confirmed 2026-08-14 on Forestry England's own pages: `info@forestryengland.uk` is
given both on [Contact us](https://www.forestryengland.uk/contact-us) for general enquiries and on
[Ways to work together](https://www.forestryengland.uk/our-commercial-partnerships) as the route for
business proposals. There is no separate digital or partnerships inbox published.

**Send it from an address that can send.** Sending from `enhanceify.co.uk` was broken on 2026-08-14
and unblocked on 2026-08-18. Nothing here needs that domain, so use whichever address works and set
the signature to match.

**The review copy is not in the repo.** A `.docx` was generated for Cheryl to mark up at
`docs/outreach/Forestry-England-enquiry-DRAFT.docx`, and `*.docx` is gitignored on purpose: an unsent
draft to a third party has no business in a public repo. The markdown is the source, so if the Word
copy comes back marked up, fold the edits in and regenerate.

## Comments
**2026-09-05** Split out of `0018`, which was three times this board's 100-line budget. Nothing here
is new work: the ask, the pass condition, the contact route and the `.docx` note are lifted from that
card, and the reviews they point at moved to `docs/outreach/` unedited.

**2026-09-10** Folded out of `docs/HANDOVER.md`, which is over its size budget. This is the card
that sends the thing, so the shape of `docs/outreach/` belongs here.

Markdown is the source, and **`*.docx` is gitignored**, so a Word review copy handed to a person is
not in the repository; if one comes back marked up, fold the edits into the markdown and regenerate.
Three files. `forestry-england-enquiry-review.md` is internal notes and is never sent.
`forestry-england-enquiry.md` is the email itself. `forestry-england-handover.md` is a
**self-contained** briefing for a session working in Word with no repository access, which is why it
repeats the email in full rather than linking it. **Both are rendered to Word by one throwaway
script, so the email text lives in two places that must be edited together.** The Natural Resources
Wales letter is still inline on card `0017`.

**The screenshots to attach**, from the same fold. `docs/img/2026-08-14_Screenshots/` holds six phone
shots, untracked. **IMG_5792 (the list), IMG_5796 (the detail sheet) and IMG_5797 (the map chooser)**
are the three worth attaching to this enquiry. IMG_5794 and IMG_5795 are not: they are card `0015`'s
evidence of the tile credit being unreadable.

**2026-09-20** Rob: "I think gets answered by 0018". Correct, and nothing on this card changes.

`needs: 0018` already says so in the frontmatter and `## Links` already carries the reason, so this
entry is only here to stop the next reader wondering whether this card was overlooked in the sweep.
It was not. It is waiting, and on the right thing.

**What that dependency now means in practice has changed, though.** `0018`'s direction as of today
is a notification with no ask at all. If that holds, most of what this card is written to do stops
applying: the two `[confirm]` claims about membership and site visits exist to establish standing
for an ask, and the three cold reviews in `docs/outreach/forestry-england-enquiry-review.md` are all
about why the ask fails. An email with no ask needs neither.

**So do not start this card by verifying the `[confirm]` claims.** Read `0018`'s answer first. If it
lands as a notification, this card is a rewrite rather than a fix, and a much shorter one.

`not_for_the_loop:` stands unchanged: it sends an email to a public body in Rob's name.

**2026-09-30** Attended triage. Step 1 of the ask, "have the draft rewritten", was agent work sitting
in a person's queue, so it was done: `docs/outreach/forestry-england-enquiry.md` is now the no-ask
notification card `0018` chose on 2026-09-25, about 200 words, no placeholders. The old pitch is in
`docs/outreach/backups/` and `forestry-england-handover.md` carries a superseded note at its head
so a Word session cannot send the wrong text. `needs: 0018` is removed: that card's answer is on
its own thread, and the self-test `no open card is blocked by a settled card` was red on exactly
this. What is left is the send, which is yours.