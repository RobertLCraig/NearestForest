# Handover: the Forestry England enquiry

**Project:** NearestForest
**Stage:** drafted, not sent
**Date of this handover:** 2026-08-15

## 0. What this document is, and what it is not

This is a self-contained briefing for a Claude session that **has no access to the repository, the
live site, or the internet**. Everything needed is written out below rather than linked, including
the full text of the draft email and the screenshots. Do not assume a file mentioned here can be
opened.

**Use this session for:** redrafting the email, folding in a reviewer's edits, arguing about the
asks, sharpening the wording, and drafting a reply when Forestry England answer.

**Do not use this session for:** code, the data pipeline, the map, deployment, or anything touching
the app itself. That work needs Claude Code running in `C:\Dev\NearestForest`, which should start by
reading `docs/HANDOVER.md` and running `/handover resume`. If Rob asks for any of that here, say so
and point him back rather than guessing at a codebase you cannot see.

**The canonical source** is `docs/outreach/forestry-england-handover.md` in the repository. This Word
copy is generated from it, so edits made directly in Word live only in the Word file.

## 1. The app, in one page

**NearestForest** finds the closest Forestry England site to wherever you are and hands it to a
phone's map app in one tap. It is live and free at **https://forestlocator.enhanceify.co.uk/** and
the source is public at **github.com/RobertLCraig/NearestForest**.

Rob built it for himself. He drives long distances, and rather than eating in a restaurant or a
service station car park he and his girlfriend started driving to Forestry England sites to have
lunch and a short walk. Working out which forest was nearest, from a phone, in a lay-by, on a weak
signal, is what Forestry England's own finder does badly, so he built something that does only that.
He has since shown it to a number of people and every one of them asked for it on their own phone,
which is what turned it from a personal tool into something worth distributing.

Facts worth having to hand, all verified:

- **904 locations.** 274 named forests, plus 630 official car parks.
- **Under 700 KB in total**, everything bundled, so **after the first load it works with no internet
  connection at all**. Forest car parks often have little or no mobile signal, which is the point.
- It is a **PWA (Progressive Web App)**: it opens in a phone browser and can be added to the Home
  Screen so it behaves like an installed app. It is not on any app store yet.
- Each site shows distance, compass direction, sat-nav postcode, parking, facilities and opening
  times. It uses the **sat-nav postcode rather than the postal one** where they differ, which they
  genuinely do (Bedgebury publishes TN17 2SJ for sat nav and TN17 2SL as its postal code).
- Opening times are modelled as **open always / open until dusk / set hours / not published**, and
  for the dusk ones it calculates real sunset for that site's own latitude. Measured across the
  dataset: 94 always, 104 dusk, 43 hours, 27 unknown.
- **No accounts, no login, no tracking, no analytics, no adverts.** There is no server for it to send
  anything to and a phone's location never leaves the phone.
- It is a **snapshot, not a live feed**, and each site shows the date its data was last checked and
  links to its page on the Forestry England website.

## 2. The licensing question, which was researched and answered

**Rob asked whether this email is a step he even needs to take. On the data, the answer is no.** That
finding reshaped the draft, so it belongs before anything else.

Checked on 2026-08-15 against the primary sources, not assumed:

| Source | What it actually says |
|---|---|
| Forestry England's Crown copyright page | "You may use and re-use the information featured on this website (**not including logos or images**) free of charge in any format or medium, under the terms of the Open Government Licence." Excludes third-party material. Asks for the credit "Crown Copyright, courtesy Forestry England (date of publication), licensed under the Open Government Licence". |
| Open Government Licence v3.0 | You may "copy, publish, distribute and transmit the Information; adapt the Information; **exploit the Information commercially and non-commercially**". "Information" is defined as material "protected by copyright **or by database right**". |
| OGL v3 exclusions | Logos, crests, the Royal Arms, military insignia, personal data, third-party rights, and "other intellectual property rights, including patents, **trade marks**, and design rights". |
| forestryengland.uk/robots.txt | Stock Drupal. Disallows `/admin`, `/user/*`, `/search`, `/core/`, `/profiles/`. **Nothing covering the forest pages the scraper reads.** |

**So:** the car park dataset was always OGL. The forest details are offered under the same licence by
Forestry England's own copyright page. The app uses text only, no logos and no photographs. Selling
it or taking donations needs nobody's permission, because OGL expressly permits commercial use.

**The one real gap is the trade mark.** OGL excludes trade marks by name. An app store listing that
uses "Forestry England" to describe itself is the part no licence covers, and it is the single
strongest reason the email still gets sent.

**This is a reading of two published licences, not legal advice.** Both are linked in the project's
decision log so anyone can check rather than take it on trust.

## 3. What the email is now for

It is **not** a request for permission, and it must not read like one. Three purposes, in order:

1. **Courtesy.** Rob would rather they heard it from him than came across it. That costs nothing and
   buys goodwill he may need later.
2. **The trade mark and branding question**, which is genuinely theirs to answer and which gates an
   app store listing.
3. **Leaving a commercial door open** without walking through it. He is not asking them to take the
   project on. Earlier drafts led with "would you want to take it on", and Rob rejected that framing
   on 2026-08-15.

The email also **states his intentions up front** rather than asking approval for them: keep it free
on the web, list it on app stores with donations or a low price, and extend it to Scotland, Wales,
Northern Ireland and Ireland, then Europe and the United States.

## 4. The draft as it currently stands

**To:** info@forestryengland.uk
**Subject:** A free offline app for finding the nearest Forestry England site, and what I plan to do with it

> Hello,
>
> I originally built this for myself as I was struggling to use your website to find forest
> locations while I was on the go, travelling the country.
>
> I drive a lot, and when I stop for a meal I would rather eat somewhere with a view than in a
> restaurant or a service station car park. So my girlfriend and I got into the habit of driving to
> Forestry England sites just to have lunch, maybe take a short walk after, which is how I ended up
> parked in a lay-by trying to work out which of your forests was nearest. Your finder is fine at a
> desk. On a phone, on the move, with one bar of signal, I could not get an answer out of it (and
> forest car parks often have limited to no mobile signal).
>
> So I built a page that does one thing: it opens to a list of your sites sorted nearest first, and
> one tap hands the chosen one to Apple Maps, Google Maps or Waze.
>
> I built it for myself, but I have since shown it to quite a few people, and the reaction has been
> consistent enough that I no longer think the problem was only mine. Everyone who has seen it has
> asked for it on their own phone. So I would like to keep it running, and to put it in front of
> more people than I can reach by showing them my phone.
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
> **Where the data comes from, and why I am writing**
>
> The 630 car parks come from the dataset you publish under the Open Government Licence. The forest
> details (name, sat-nav postcode, opening times, parking, facilities) are read from your own public
> forest pages, which your Crown copyright page offers for reuse under that same licence.
>
> I have read both, and I believe the app sits inside them. I have not used your logos, your
> photographs, or anything marked as belonging to a third party. So I am not writing to ask
> permission to use the information, and I would rather say that plainly than imply otherwise.
>
> I am writing for two reasons. The first is that I would simply rather you heard about this from me
> than came across it. The second is that there are things the Open Government Licence explicitly
> does not cover, and those are yours to answer rather than mine to assume.
>
> **What I would like to ask**
>
> 1. Is there anything you would want changed? If a field is wrong, or you would rather I did not
> show something, or you want the wording altered, tell me and I will do it. I would also like to
> get the credit right: I plan to use your own stated wording, "Crown Copyright, courtesy Forestry
> England, licensed under the Open Government Licence", alongside the existing credit for the car
> park data.
>
> 2. Your name and branding. The licence specifically excludes trade marks, and the app has to be
> able to say what it does, which is find Forestry England sites. Are you content with that, and are
> there conditions you would want if it were listed on an app store? I would follow them.
>
> 3. Would you want any involvement? I am not asking you to take it on or to run it. But if it is
> useful to you, or there is something you would want it to do, I am open to that conversation,
> including a commercial one.
>
> **What I intend to do with it**
>
> I would rather set this out now than have it come as a surprise later.
>
> Keep it running free on the web, as it is today.
>
> Put it on the app stores, most likely free with donations accepted, possibly at a low price. I am
> not trying to make a living from it, but if it turns out to be useful to a lot of people I would
> like it to at least pay for itself.
>
> Extend it beyond England. The obvious next steps are Forestry and Land Scotland, Natural Resources
> Wales, and then Northern Ireland and Ireland, so that it answers the question anywhere in these
> islands rather than stopping at a border a driver cannot see. Further out I would like to take the
> same idea to Europe and the United States. Each of those means a separate conversation with a
> separate body, and this is the first of them.
>
> **One thing I should be upfront about**
>
> It is a snapshot, not a live feed. It does not know about a closure or a notice you posted
> yesterday, and I would not want that to embarrass you. Every site links through to its page on
> your website for current information, and each one shows the date its data was last checked. If it
> would help, I can make that limitation more prominent, and I can commit to refreshing on whatever
> schedule you would want.
>
> I am happy to walk anyone through it, or to pass it to whichever team this belongs with. If I have
> written to the wrong address, I would be grateful if you could point me at the right one.
>
> Many Thanks,
>
> Robert Craig

## 5. The screenshots

Sixteen exist, in `docs/img/2026-08-14_Screenshots`. The four proposed as attachments are below.

![The list, sorted nearest first](../img/2026-08-14_Screenshots/web/IMG_5821.jpg) ![A site in detail, with the data-checked date](../img/2026-08-14_Screenshots/web/IMG_5822.jpg) ![One tap to Apple Maps, Google Maps or Waze](../img/2026-08-14_Screenshots/web/IMG_5825.jpg) ![Every forest at once, drawn with no connection](../img/2026-08-14_Screenshots/web/IMG_5829.jpg)

**The fourth earns its place twice.** The outline it draws is Great Britain, and Scotland and Wales
are visibly empty of markers. It makes the expansion point better than a sentence does.

**Three are deliberately excluded, and a redraft should not quietly add them back:**

![Tiles on: the attribution along the bottom is illegible](../img/2026-08-14_Screenshots/web/IMG_5794.jpg) ![Car parks list: three rows read "Unnamed car park"](../img/2026-08-14_Screenshots/web/IMG_5826.jpg) ![The same problem on the map](../img/2026-08-14_Screenshots/web/IMG_5827.jpg)

- **The tiled map shots** render the Thunderforest and OpenStreetMap attribution as grey on a pale
  basemap, close to unreadable. That is an open defect and a licence obligation, and this email
  argues the project handles licensing properly. Do not attach a picture of the opposite.
- **The car park views** show rows and markers reading "Unnamed car park". 170 of the 630 car parks
  have no name in the published dataset. That is a known open task, and it is not the first
  impression to lead with.

## 6. Where things stand

- **Nothing has been sent.** No contact of any kind has been made with Forestry England.
- **The address is confirmed**, not guessed. `info@forestryengland.uk` appears on Forestry England's
  own Contact us page for general enquiries, and again on their Ways to work together page as the
  route for business proposals. There is no separate digital or partnerships inbox published.
- **The signature is incomplete.** Phone number and email address are placeholders.
- **The sending address is an open question.** Rob cannot currently send from his `enhanceify.co.uk`
  domain (receiving works, sending does not). Nothing about this email requires that domain, so it
  can go from any working address, but **the signature must match the address it is sent from**,
  because a reply is the entire point.
- **A reviewer has a copy.** It went to Cheryl on 2026-08-14, against the earlier and quite different
  draft. Her comments, when they arrive, may be aimed at wording that no longer exists.
- **It is tracked as decision card 0018** on the project board.

## 7. What happens next, in order

1. **Rob reads this reframed draft** and says whether the new footing is right.
2. **Cheryl's comments are reconciled** against the rewrite.
3. **Rob picks the sending address** and completes the signature.
4. **Send it, once.** Attach the four screenshots.
5. **Do not chase.** If nothing arrives by **12 September 2026**, treat the silence as no objection
   and get on with it. The licence does not require their answer.
6. **Whatever comes back gets recorded on card 0018**, including a refusal.

## 8. Open questions only Rob can settle

- Whether to send at all, now that the data question is answered and only the trade mark is open.
- Which address to send from.
- Whether "I am not trying to make a living from it" is a sentence he wants in writing to an
  organisation he might later want to pay him.
- How firm to be about the expansion plans, given that Ireland and Northern Ireland have had no
  research at all and Wales is known to be awkward.

## 9. Things to get right in any redraft

**Rob's writing voice.** This goes out in his name, so a redraft must sound like him and not like a
language model:

- **Never em dashes.** Use commas, colons, parentheses or full stops. Spaced hyphens ( - ) are his
  own habit and are fine.
- **British spelling throughout.** Organisation, realise, favour, licence, travelling.
- **Parentheses for asides**, and he uses plenty of them.
- **Acronyms spelled out on first use.** PWA (Progressive Web App) is already done this way.
- **No AI-tell words.** Banned: delve, navigate, tapestry, robust, leverage, holistic, empower,
  streamline, unlock, revolutionise, cutting-edge, game-changing, and "it's not just X, it's Y".
- **No hedging filler** and no cheerleading.
- **Plain, direct and honest**, including when awkward. The paragraph saying "I am not writing to ask
  permission" is the spine of the new draft and must not be softened back into a request.
- **Sign-off is "Many Thanks", then "Robert Craig"** for something this formal.

**Other things not to get wrong:**

- **Do not turn it back into a permission request.** That was the previous draft and it is now known
  to be the wrong footing.
- **Do not invent a different contact address, team name or person.** The one above was checked.
- **Do not promise an iOS release.** An iOS listing needs a Mac and a paid Apple Developer account,
  and Rob has neither. Android will take a wrapped PWA from Windows. The draft says "app stores"
  without committing to which, and that is deliberate.
- **Do not overstate the expansion.** Scotland is measured and ready, Wales is measured and awkward,
  Ireland and Northern Ireland are entirely unresearched. "I would like to" is accurate; "I will" is
  not.

## 10. What is verified and what is not

| Claim | Status |
|---|---|
| Forestry England offer their website content under OGL | **Verified** on their own Crown copyright page, 2026-08-15 |
| OGL v3 permits commercial exploitation and covers database right | **Verified** in the licence text, 2026-08-15 |
| OGL v3 excludes trade marks | **Verified** in the licence text, 2026-08-15 |
| robots.txt does not block the forest pages | **Verified** by fetching it, 2026-08-15 |
| info@forestryengland.uk is the right address | **Verified** on two of their own pages, 2026-08-14 |
| 904 locations, 274 forests, 630 car parks | **Verified** against the generated dataset |
| Under 700 KB, works fully offline after first load | **Verified** by measuring the shipped files |
| "Forestry England" is a registered trade mark | **Not checked.** Assumed, and the reason ask 2 exists. Do not assert it as fact |
| Google Play accepts a wrapped PWA from Windows | **General knowledge, not checked.** Confirm before relying on it |
| Scotland and Wales data is obtainable | **Verified** on the project board; Ireland and NI are **unresearched** |
| Forestry England would reply at all | **Unknown.** No contact has been made |

Never present an unverified item as a checked one. If a redraft needs a fact that is not in this
document, say it is missing rather than filling the gap with something plausible.
