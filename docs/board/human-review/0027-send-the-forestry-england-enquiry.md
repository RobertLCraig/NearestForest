---
needs: 0018
not_for_the_loop: sends an email to a public body in Rob's name
---
# Send the Forestry England enquiry, once the draft is fixed

## What I need from you

**Two checks, then one send.**

1. **Confirm the two `[confirm]` claims** in `docs/outreach/forestry-england-enquiry.md`: that you
   are a Forestry England member, and that you have visited more than twenty of their sites. Fix the
   number or cut the sentence. **Do not send with either still unverified.** They are what make you
   a member who built something rather than a stranger scraping a website.
2. **Read `docs/outreach/forestry-england-enquiry-review.md`** and decide what to change. Three cold
   reviewers, given the draft and no other context, all predicted no reply at all; the sharpest line
   is "nothing in this email makes yes cheaper than no". You need not take their advice, since some
   of it contradicts your own instructions on `0018`, but nobody has yet read them.
3. **Fill the `[phone]` and `[email]` placeholders** in the signature, send it to
   **info@forestryengland.uk**, and paste whatever comes back into this card.

**Pass** is a written reply naming which of the asks they agree to. Any of these is a pass, because
all three settle something that is currently unsettled:

- a yes to the app staying public, which is the one that matters
- a no to the app staying public, which is worth knowing now rather than later
- a handoff to another team, which means it reached a person

**Fail** is silence by **2026-09-11**, four weeks. Treat that as a soft yes to the status quo, set
this card aside, and do not chase twice. A reply asking for the app to come down is **not** a fail
and is not this card: it is an action with a deadline, and it gets its own card immediately.

**Why it needs you.** It is outward-facing correspondence to a public body, sent in your name, and
it tells the organisation whose data the app uses that the app exists. That is a risk you own, and
not one an agent can price.

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
- [ ] Settle the two `[confirm]` claims in the draft
- [ ] Read the review notes and decide what changes in the draft
- [ ] Fill `[phone]` and `[email]`, and send to info@forestryengland.uk
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
