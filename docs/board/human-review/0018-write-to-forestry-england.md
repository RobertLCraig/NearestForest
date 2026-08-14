# Do we write to Forestry England, and with which asks?

> **Do not send from an @enhanceify.co.uk address until the mail is fixed.** Measured 2026-08-14:
> the domain's MX records point at Cloudflare Email Routing, not at Migadu, so mail to that domain
> is being forwarded by Cloudflare and never reaches the Migadu mailbox. A reply from Forestry
> England is the entire point of this card, so send from an address that is known to receive, or fix
> the mail first. Same blocker as 0010, and 0017's email to Natural Resources Wales. It belongs on
> the **enhanceify-V2** board.

## What I need from you

**One choice, then one send.**

1. Read the draft at `docs/outreach/forestry-england-enquiry.md` and pick option 1, 2 or 3 below.
2. If 1 or 2, fill in the `[phone]` and `[email]` placeholders in the signature and send it to
   **info@forestryengland.uk**.
3. Paste whatever comes back into this card.

---

**Pass** is a written reply naming which of the asks they agree to. Any of these is a pass, because
all three settle something that is currently unsettled:

- a yes to the app staying public, which is the one that matters
- a no to the app staying public, which is worth knowing now rather than later
- a handoff to another team, which means it reached a person

**Fail** is silence by **2026-09-11** (four weeks). Treat that as a soft yes to the status quo, set
this card aside, and do not chase twice. A reply asking for the app to come down is **not** a fail
and is not this card: it is an action with a deadline, and it gets its own card immediately.

**Why it needs you.** Three reasons, and none of them are things an agent can settle.

- It is outward-facing correspondence to a public body, sent in your name.
- It reveals the app's existence to the organisation whose data it uses. That is a risk you own, not
  one I can price.
- **Ask 3 contradicts the PRD in writing.** Non-goals currently say "No App Store release, no Apple
  Developer account". Asking their permission to publish means intending to change that line, the
  same way 0016 and 0017 mean changing the England-only line.

**The review copy is not in the repo.** A `.docx` was generated for Cheryl to mark up at
`docs/outreach/Forestry-England-enquiry-DRAFT.docx`, and `*.docx` is gitignored on purpose: an
unsent draft addressed to a third party has no business in a public repository. The markdown is the
source. If the Word copy comes back with edits, fold them into the markdown and regenerate.

## Why

The app is live at forestlocator.enhanceify.co.uk, the repo is public, and `sites.json` is committed
in it. The PRD's Licensing constraint describes something narrower than that: "the forest list is
scraped from Forestry England's public pages **for personal use; it is not redistributed as a
dataset**". Both halves of that sentence stopped being true when the app was shared with other
people and the repo was made public.

The car park half is fine and always was: Open Government Licence v3.0, attributed in the app's
footer. The forest half (name, sat-nav postcode, opening times, facilities, parsed out of their
Drupal pages) rests on nothing anyone has agreed to.

So there is an unmanaged position, and it is not primarily a commercial one. Rob's opening question
was whether they would buy it. The question underneath that is whether they mind it existing, and
that one gets answered either way, by them or by a takedown request at a worse moment.

Contact route confirmed 2026-08-14 on their own pages: `info@forestryengland.uk` is given both on
[Contact us](https://www.forestryengland.uk/contact-us) for general enquiries and on
[Ways to work together](https://www.forestryengland.uk/our-commercial-partnerships) as the route for
business proposals and expressions of interest. There is no separate digital or partnerships inbox
published.

## Options

1. **Send it as drafted, all three asks.** Offers them the app and the code, asks whether it may stay
   public, and asks whether it may go on an app store as a donation-supported or paid release. Cost:
   it puts a commercial ask in front of an organisation that may not be able to act on one, and a
   general inbox may read the whole thing as sales and bin it. It also opens the door to conditions
   on naming and branding that would mean real work.

2. **Send the permission ask only.** Drop asks 1 and 3, keep "here is what I built, here is where the
   data comes from, are you content for it to stay up". Cost: it forecloses the commercial
   conversation before anyone has read it, and getting a second bite later looks like moving the
   goalposts. Cheapest yes available, and the least likely to be filed as sales.

3. **Send nothing.** Cost: the position above stays unmanaged indefinitely, the app store route is
   closed permanently (an Apple or Google review would raise the trademark question anyway, and there
   would be no answer to give), and the day it does surface, it surfaces as their complaint rather
   than as Rob's question.

## Recommendation

**Option 1, as drafted.** The exposure already exists, so the only thing sending changes is whether
the answer arrives on Rob's timing or theirs. The commercial ask is worth including because it costs
one paragraph and it is already softened to "would you want to take this on, and if there is budget I
would welcome it" rather than a price. Their own partnerships page invites expressions of interest,
so it is not an unsolicited pitch into a vacuum.

The worst realistic outcome of option 1 is a request to change the name or add a disclaimer, which is
an afternoon's work and something Rob would want to do anyway. The worst outcome of option 3 is the
same request arriving as a complaint after an app store listing.

**Do not chase.** Public bodies are slow and a second email converts a low-priority enquiry into an
irritation. One send, one recheck date, then move on.

Note that ask 3's answer only matters for Android in the near term. An iOS release needs a Mac and an
Apple Developer account, which the PRD lists as a hard constraint; Google Play will take a wrapped
PWA built on Windows. Rob's position on 2026-08-14 was to worry about Apple later if approval comes.
