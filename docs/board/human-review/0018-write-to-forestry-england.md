# Do we write to Forestry England, and with which asks?

> **This card is not blocked. Send it from an address that can send.** As of 2026-08-14 Rob cannot
> send from `enhanceify.co.uk` (receiving is fine, outbound is not; see 0010 for the measurement).
> Nothing about this card requires that domain, unlike 0010, where the sending address is the thing
> being checked. So use whichever address works, and set the signature to match, because a reply is
> the entire point of the card. Do not wait for the mail fix.

## What I need from you

**One choice, then one send.**

1. **Confirm two facts the draft claims about you**, both marked `[confirm]` in it: that you are a
   Forestry England member, and that you have visited more than twenty of their sites. Fix the
   number or cut the sentence. **Do not send with either still unverified.** They are the two claims
   in the email that are about you rather than about the app, and they are what make you a member who
   built something rather than a stranger scraping a website. Worth having, and worth being exactly
   right about.
2. Read the draft at `docs/outreach/forestry-england-enquiry.md` and pick option 1, 2 or 3 below.
3. Decide whether to add the ask nobody has considered yet: **an introduction to Forestry and Land
   Scotland and Natural Resources Wales.** It is nearly free for them to give and it would turn cards
   0016 and 0017 from cold approaches into warm ones. See the menu below.
4. Fill in the `[phone]` and `[email]` placeholders in the signature and send it to
   **info@forestryengland.uk**.
5. Paste whatever comes back into this card.

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

## The full menu of possible asks

Rob asked what else he could be asking for. Everything below is a real option; the draft uses four
of them, because a cold email with eight asks lands none.

| Ask | Value to Rob | Odds of a yes | In the draft? |
|---|---|---|---|
| **Link to it, or mention it to members** | High. Distribution is the scarce thing, and an official mention settles the name question by implication | **Highest.** Costs them nothing, no budget, no procurement | Yes, and deliberately last, because last is where a reader's eye lands |
| **Permission to use the name** | Necessary for a store listing | High | Yes, ask 3 |
| **Bring him in to work on it, or on their own finder** | **Highest of all.** Paid work and a public-sector reference, worth more than an app sale | Low from a cold email, but nonzero and free to ask | Yes, ask 2 |
| ~~**Buy it outright**~~ ~~**Licence them a version**~~ | Was high, and recurring | Medium | **No. Cut 2026-08-15**, see Direction. Rob does not want it |
| **An introduction to Forestry and Land Scotland or Natural Resources Wales** | **High and underrated.** Nearly free for them, and it turns two cold approaches into warm ones for cards 0016 and 0017 | High | **No, and it should probably be added.** Rob has not considered it |
| **An official data feed instead of scraping** | Medium. Makes the pipeline durable rather than hostage to a redesign | Medium | No. Adds a technical ask to a non-technical reader |
| **A quote for the store listing** | Medium | Medium, but only after a relationship exists | No. Premature |
| **Accuracy contact who can check the data** | Medium | Medium | No. Ask it in a reply, not a cold open |

**The primary ask is a conversation, not a decision.** Nobody sells software or wins a contract from
an unsolicited email to a general inbox. What a cold email can win is a reply from a named person.
The draft therefore asks to talk to whoever it sits with and offers a menu, rather than demanding one
answer.

## Direction

**2026-08-15** Not a permission request and not an offer to hand it over. It is a pitch. Lead with
what it does for them and why it is worth their time. The audience is clerical and administrative
staff at a conservation body, not engineers, so cut the technicalities: no payload sizes, no jargon,
and drop the "it is a snapshot, not a live feed" caveat entirely, since that is an internal concern
that will change as the project grows and it means nothing to the reader.

**2026-08-15** Structure it problem, solution, ask. An opening that begins "I built this for myself"
tells a reader who has no idea what "this" is, and no reason yet to care. State the problem in their
terms first.

**2026-08-15** Rob does want them to buy in, and the strongest outcome for him is being **hired**,
either on this or on the forest finder on their own site, ahead of an outright sale. Keep that ask in
even though its odds are low, because it costs one line.

**2026-08-15** Cheryl's standing note: keep the waffle to a minimum. The body was 989 words and is
now about 450. Treat that as the ceiling, not the target.

**2026-08-15** **Do not offer to hand the project over.** Rob spotted that a straight sale is against
his own interests: Forestry England care about England, so if they own it, the app is England-only
for ever and the whole reason for building a platform dies with the transfer. Scotland, Wales,
Northern Ireland and Ireland all go with it. **Any future draft that reintroduces "I would hand over
the app and everything behind it" has undone a deliberate decision.**

**2026-08-15** **Two asks, not three, and keeping it is the preferred one.** The licence-them-a-
version option was cut the same day it was written: it competes with his own app, it is slow, and it
is not what he wants. What is left, in his order of preference:

1. you are happy for me to carry on, which carries the app store intent, the use of the name, and
   the expansion beyond England
2. you bring me in, on this or on their own finder

The ordering is the message. Leading with "carry on" says he intends to continue and is checking
rather than petitioning, and it puts the easiest yes first. **This is not a return to asking
permission**: the pitch structure stands above it, and the only actual permission sought is for the
name, which is the one thing the licence genuinely does not give him.
