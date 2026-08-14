# Handover: the Forestry England enquiry

**Project:** NearestForest
**Stage:** drafted, not sent
**Date of this handover:** 2026-08-14

## 0. What this document is, and what it is not

This is a self-contained briefing for a Claude session that **has no access to the repository, the
live site, or the internet**. Everything needed is written out below rather than linked, including
the full text of the draft email. Do not assume a file mentioned here can be opened.

**Use this session for:** redrafting the email, folding in a reviewer's edits, arguing about which
asks to keep, sharpening the wording, and drafting a reply when Forestry England answer.

**Do not use this session for:** code, the data pipeline, the map, deployment, or anything touching
the app itself. That work needs Claude Code running in `C:\Dev\NearestForest`, which should start by
reading `docs/HANDOVER.md` and running `/handover resume`. If Rob asks for any of that here, say so
and point him back rather than guessing at a codebase you cannot see.

**The canonical source of this document** is `docs/outreach/forestry-england-handover.md` in the
repository. This Word copy is generated from it and is not tracked in version control, so if it is
edited directly those edits live only in the Word file.

## 1. The app, in one page

**NearestForest** finds the closest Forestry England site to wherever you are and hands it to a
phone's map app in one tap. It is live and free at **https://forestlocator.enhanceify.co.uk/** and
the source is public at **github.com/RobertLCraig/NearestForest**.

Rob built it for himself. He drives long distances, and rather than eating in a restaurant or a
service station car park he and his girlfriend started driving to Forestry England sites to have
lunch. Working out which forest was nearest, from a phone, in a lay-by, on a weak signal, is what
Forestry England's own finder does badly, so he built something that does only that.

Facts worth having to hand, all verified:

- **904 locations.** 274 named forests, plus 630 official car parks.
- **Under 700 KB in total**, everything bundled, so **after the first load it works with no internet
  connection at all**. Forest car parks are exactly where mobile data dies, which is the whole point.
- It is a **PWA (Progressive Web App)**: it opens in a phone browser and can be added to the Home
  Screen so it behaves like an installed app. It is not on any app store.
- Each site shows distance, compass direction, sat-nav postcode, parking, facilities and opening
  times. It uses the **sat-nav postcode rather than the postal one** where they differ, which they
  genuinely do (Bedgebury publishes TN17 2SJ for sat nav and TN17 2SL as its postal code).
- Opening times are modelled as **open always / open until dusk / set hours / not published**, and
  for the dusk ones it calculates real sunset for that site's own latitude. It will not claim a gate
  is open when it has no basis for saying so. Measured across the dataset: 94 always, 104 dusk, 43
  hours, 27 unknown.
- **No accounts, no login, no tracking, no analytics, no adverts.** There is no server for it to send
  anything to and a phone's location never leaves the phone.
- It is a **snapshot, not a live feed.** It does not know about a closure posted yesterday. Each site
  links through to its page on the Forestry England website for current information.

## 2. Why we are writing to them at all

**Rob's opening question was commercial: would they buy it, and if not, would they let him put it on
an app store. The question underneath that one is permission, and it is the one that matters.**

The data comes from two places and they sit on very different footings:

- **The 630 car parks** come from a dataset Forestry England publishes under the **Open Government
  Licence v3.0**. That is fine, it always was, and the app credits it in the footer.
- **The 274 forests** (name, postcode, opening times, facilities) are **read from Forestry England's
  own public web pages**. Nothing anyone has agreed to covers that.

The project's own written constraint says the forest list is scraped "**for personal use; it is not
redistributed as a dataset**". Both halves of that sentence stopped being true when the app was
shared with other people and the repository was made public with the generated dataset committed
inside it.

So there is an unmanaged position. It gets resolved either way, either by Rob asking or by a
complaint arriving at a worse moment. That is the argument for sending.

## 3. The three asks, and why they are in this order

| # | The ask | Why it sits here |
|---|---|---|
| 1 | Would you want to take it on? | Leads with the offer rather than a price. A public body usually cannot buy software from an individual without procurement, so a blunt "would you buy it" invites a reflex no even from someone interested. |
| 2 | If not, are you content for it to stay online, free and public? | **The load-bearing one.** Cheapest yes to get, most likely to be granted, and it settles the permission problem in section 2. If the answer is no, asks 1 and 3 are moot. |
| 3 | And if so, may I publish it on an app store? | Donations or a low price. Deliberately last, because it is the ask they are least likely to bless and the one most likely to raise their trademark and brand people. |

The order matters. Leading with "would you buy it" and immediately following with "if not, can I
sell it myself" tells them you will monetise their brand and data either way, which weakens the
first ask and makes the third read as a threat rather than a question.

**Ask 3 contradicts the project's own written non-goals**, which currently say "No App Store
release, no Apple Developer account". Asking permission means intending to change that line. Rob is
aware and said on 2026-08-14 that he will worry about Apple later if approval comes.

**Practical note on ask 3:** in the near term it means Android only. An iOS release needs a Mac and a
paid Apple Developer account, and Rob runs Windows only, which is a hard constraint on the project.
Google Play will accept a wrapped PWA built on Windows. **Do not promise an iOS release in any
redraft.**

## 4. The draft as it currently stands

**To:** info@forestryengland.uk
**Subject:** A free offline app I built for finding the nearest Forestry England site

> Hello,
>
> I originally built this for myself as I was struggling to use your website to find forest
> locations while I was on the go, travelling the country.
>
> I drive a lot, and when I stop for a meal I would rather eat somewhere with a view than in a
> restaurant or a service station car park. So my girlfriend and I got into the habit of driving to
> Forestry England sites just to have lunch, which is how I ended up parked in a lay-by trying to
> work out which of your forests was nearest. Your finder is fine at a desk. On a phone, on the
> move, with one bar of signal, I could not get a straight answer out of it (and forest car parks
> are precisely where the signal dies).
>
> So I built a page that does one thing: it opens to a list of your sites sorted nearest first, and
> one tap hands the chosen one to Apple Maps, Google Maps or Waze.
>
> It is live and free here: https://forestlocator.enhanceify.co.uk/
>
> **What it is**
>
> A PWA (Progressive Web App). It opens in a phone browser, and it can also be added to the Home
> Screen so it behaves like an installed app.
>
> 904 locations: your 274 named forests, and the 630 car parks from the Open Government Licence
> dataset you publish.
>
> Under 700 KB in total, with everything bundled inside it, so after the first load it works with no
> internet connection at all. That was the whole point of building it.
>
> Each site shows distance, compass direction, sat-nav postcode, parking, facilities and opening
> times. It uses the sat-nav postcode you publish rather than the postal one where the two differ
> (Bedgebury is the site that taught me they do).
>
> Opening times are handled as "open always", "open until dusk", "set hours" or "not published", and
> for the dusk ones it calculates actual sunset for that site's own latitude. It will not claim a
> gate is open when it has no basis for saying so.
>
> No accounts, no login, no tracking, no analytics, no adverts. There is no server for it to send
> anything to, and a phone's location never leaves the phone.
>
> It credits the Open Government Licence and states that it is not affiliated with you.
>
> **What I am asking**
>
> Three questions, and the second one is the one that matters most to me.
>
> 1. Is it something you would want to take on? I would genuinely rather it lived with you than with
> me. I am happy to hand over all of it: the app, the source code, and the pipeline that rebuilds
> the data from your published sources. If there is budget to pay me for it, or for my time to
> finish and maintain it, I would welcome that, but I am not making it a condition.
>
> 2. If it is not for you, are you content for it to stay online as it is, free and public? I am
> asking rather than assuming, because it is already up and the source is public. A yes or no from
> you settles it and I will act on either.
>
> 3. And if you are content with 2, would you also allow me to publish it on the app stores? Either
> free with donations accepted, or as a low-priced paid app. I would follow whatever conditions you
> wanted to attach on naming, branding and wording.
>
> **Two things I should be upfront about**
>
> Where the data comes from. The car park locations are your published Open Government Licence
> dataset, credited in the app. The forest details (name, postcode, opening times, facilities) are
> read from your own public forest pages. That part is not covered by a licence I can point to,
> which is a large part of why I am writing to you rather than carrying on quietly. If you would
> prefer I took the data a different way, or dropped a particular field, tell me and I will.
>
> It is a snapshot, not a live feed. It does not know about a closure or a notice you posted
> yesterday, and I would not want that to embarrass you. Each site already links through to its page
> on your website for current information. If it would help, I can make that limitation more
> prominent, and I can commit to refreshing the data on whatever schedule you would want.
>
> I am happy to walk anyone through it, send screenshots, or pass it to whichever team this belongs
> with. If I have written to the wrong address, I would be grateful if you could point me at the
> right one.
>
> Many Thanks,
>
> Robert Craig

## 5. Where things stand

- **Nothing has been sent.** No contact of any kind has been made with Forestry England.
- **The address is confirmed**, not guessed. `info@forestryengland.uk` appears on Forestry England's
  own Contact us page for general enquiries, and again on their Ways to work together page as the
  route for business proposals and expressions of interest. There is no separate digital or
  partnerships inbox published. Checked 2026-08-14.
- **The signature is incomplete.** The phone number and email address are placeholders.
- **The sending address is an open question.** Rob cannot currently send from his
  `enhanceify.co.uk` domain (receiving works, sending does not). Nothing about this email requires
  that domain, so it can go from any working address, but **the signature must match the address it
  is actually sent from**, because a reply is the entire point.
- **A reviewer has a Word copy.** It went to Cheryl on 2026-08-14 for comment. Her edits have not
  come back yet.
- **It is tracked as decision card 0018** on the project's board, sitting in the lane for things
  waiting on a person, with three options and a recommendation to send as drafted.

## 6. What happens next, in order

1. **Cheryl's edits come back.** Fold them into the draft. If they arrive as a marked-up Word file,
   the edits need copying into the markdown source, which is the version that gets kept.
2. **Rob picks the sending address** and the signature is completed.
3. **Rob picks one of three options:** send as drafted with all three asks (recommended), send with
   the permission ask only, or send nothing.
4. **Send it.** One send only.
5. **Do not chase.** Public bodies are slow, and a second email turns a low-priority enquiry into an
   irritation. If nothing has arrived by **11 September 2026**, treat the silence as a soft yes to
   the status quo and set it aside.
6. **Whatever comes back gets recorded on card 0018**, including a refusal.

## 7. Open questions only Rob can settle

- Which address to send from, given the enhanceify sending problem.
- Whether to keep ask 3 at all, given it contradicts a written project non-goal.
- Whether to attach two or three screenshots. **Recommended:** yes. A cold email to a general inbox
  describing a website gets skimmed; a picture of the list on a phone gets forwarded.
- Whether he would actually hand the project over for nothing if they said yes to ask 1.

## 8. Things to get right in any redraft

**Rob's writing voice.** This email goes out in his name, so a redraft must sound like him and not
like a language model. The rules, which he holds to strictly:

- **Never em dashes.** Use commas, colons, parentheses or full stops. Spaced hyphens ( - ) are fine
  and are his own habit.
- **British spelling throughout.** Organisation, realise, favour, licence, travelling.
- **Parentheses for asides**, and he uses a lot of them.
- **Acronyms spelled out in brackets on first use.** PWA (Progressive Web App) is already done this
  way in the draft and should stay.
- **No AI-tell words.** Banned outright: delve, navigate, tapestry, robust, leverage, holistic,
  empower, streamline, unlock, revolutionise, cutting-edge, game-changing, and the "it's not just X,
  it's Y" construction.
- **No hedging filler** (genuinely, honestly, at the end of the day) and no cheerleading.
- **Plain, direct and honest**, including when it is awkward. The section admitting where the data
  comes from is the most important paragraph in the email and must not be softened into vagueness.
- **Sign-off is "Many Thanks", then "Robert Craig"** for something this formal.

**Other things not to get wrong:**

- **Do not invent a different contact address, team name or person.** The one in section 5 was
  checked. Nothing else has been.
- **Do not promise an iOS App Store release.** See section 3.
- **Do not soften the tone into corporate politeness.** The draft is deliberately a person writing a
  letter, not an organisation issuing a proposal, and that is what gets it read.
- **Do not criticise their website beyond Rob's own first-person experience of struggling with it.**
  "I could not get a straight answer out of it" is fine. Telling their web team their site is bad is
  not, and it costs goodwill for nothing.

## 9. What is verified and what is not

| Claim | Status |
|---|---|
| info@forestryengland.uk is the right address | **Verified** on two of their own pages, 2026-08-14 |
| 904 locations, 274 forests, 630 car parks | **Verified** against the generated dataset |
| Under 700 KB, works fully offline after first load | **Verified** by measuring the shipped files |
| Car park data is Open Government Licence v3.0 | **Verified**, and credited in the app |
| Bedgebury sat-nav and postal postcodes differ | **Verified** in the data |
| Forest details rest on no agreed licence | **Verified** by reading the project's own constraint |
| Rob cannot send from enhanceify.co.uk | **Reported by Rob**, consistent with a DNS measurement |
| Google Play accepts a wrapped PWA from Windows | **General knowledge, not checked this session.** Confirm before relying on it |
| Forestry England would be willing to reply at all | **Unknown.** No contact has been made |

Never present an unverified item as a checked one. If something in a redraft needs a fact that is
not in this document, say it is missing rather than filling the gap with something plausible.
