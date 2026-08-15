# Do we write to Forestry England, and with which asks?

> **This card is not blocked. Send it from an address that can send.** As of 2026-08-14 Rob cannot
> send from `enhanceify.co.uk` (receiving is fine, outbound is not; see 0010 for the measurement).
> Nothing about this card requires that domain, unlike 0010, where the sending address is the thing
> being checked. So use whichever address works, and set the signature to match, because a reply is
> the entire point of the card. Do not wait for the mail fix.

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

**This card was opened on a premise that turned out to be false, and the correction is the most
useful thing on it.** It originally said the forest data "rests on nothing anyone has agreed to",
and that the email was therefore a permission request. Researched on 2026-08-15 and written up in
DECISIONS 2026-08-15 with every source linked:

- Forestry England's own Crown copyright page offers the website's information for reuse under the
  Open Government Licence, excluding logos and images.
- OGL v3 permits adaptation and **commercial** exploitation, and covers database right.
- Their robots.txt does not touch the forest pages.

**So no permission is needed for the data, or to charge for the result.** The old framing was
over-cautious, and the PRD constraint it came from has been superseded.

What the licence explicitly does **not** cover is trade marks. An app store listing that says
"Forestry England" is precisely that, and no amount of reading settles it, because it is theirs to
answer. That is now the only hard reason this card exists.

The other two reasons are softer and still good. **It is a pitch, not a disclosure.** Forestry
England's remit is getting people into forests, and this gets people into forests, including the
quiet sites nobody searches for by name. And telling them beforehand costs nothing, while being
found later costs goodwill Rob may want when he asks about the name.

Contact route confirmed 2026-08-14 on their own pages: `info@forestryengland.uk` is given both on
[Contact us](https://www.forestryengland.uk/contact-us) for general enquiries and on
[Ways to work together](https://www.forestryengland.uk/our-commercial-partnerships) as the route for
business proposals and expressions of interest. There is no separate digital or partnerships inbox
published.

## Options

1. **Send it as drafted: a pitch, with the name question inside it.** Leads with what the app does
   for Forestry England (gets people to forests, surfaces the sites nobody searches for, prevents
   wasted trips to locked gates, drives traffic back to their own pages, costs them nothing), then
   asks the three questions. Cost: a general inbox may still file it as sales, and it invites
   conditions on naming that would mean real work.

2. **Send a bare trade mark question.** Two paragraphs: here is the app, may I use your name in an
   app store listing. Cost: it throws away the only chance to interest them, and a bare licensing
   question from a stranger is the easiest kind of email to ignore or refuse by default. It also
   makes the name sound like the point, which invites a cautious no.

3. **Send nothing and list it without using their name.** Genuinely viable now the data question is
   settled: call it something generic, describe it as finding forest car parks, never say "Forestry
   England" in the listing. Cost: the listing becomes much harder to find and much less obviously
   useful, and it looks evasive if anyone at Forestry England notices later. It also throws away a
   relationship worth having before Scotland, Wales and Ireland each need their own conversation.

## Recommendation

**Option 1.** The data question is answered, so this is no longer a request that can be refused into
a problem. The worst realistic outcome is silence, which changes nothing, and the second worst is a
condition on naming, which is an afternoon's work and better learned now than after a store listing.

The pitch framing is the part that matters and it is Rob's own instruction, on 2026-08-15: the
audience at `info@` is clerical and non-technical, so the email leads with what it does for them
rather than how it works. **Any redraft that starts explaining the technology has lost the thread.**

**Do not chase.** Public bodies are slow and a second email converts a low-priority enquiry into an
irritation. One send, one recheck date, then move on.

**Card 0019 should land first if it can.** The email says Rob will use their own attribution wording,
and it is better if that is already true when they look.

Note that the name question only matters for Android in the near term. An iOS release needs a Mac and
an Apple Developer account, which the PRD lists as a hard constraint; Google Play will take a wrapped
PWA built on Windows. Rob's position on 2026-08-14 was to worry about Apple later if approval comes.

## Direction

**2026-08-15** Not a permission request and not an offer to hand it over. It is a pitch. Lead with
what it does for them and why it is worth their time. The audience is clerical and administrative
staff at a conservation body, not engineers, so cut the technicalities: no payload sizes, no jargon,
and drop the "it is a snapshot, not a live feed" caveat entirely, since that is an internal concern
that will change as the project grows and it means nothing to the reader.
