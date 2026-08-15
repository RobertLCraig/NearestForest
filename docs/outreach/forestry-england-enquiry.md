# Draft email to Forestry England

*For review. Nothing has been sent.*

**To:** info@forestryengland.uk
**Subject:** A free offline app for finding the nearest Forestry England site, and what I plan to do with it

---

Hello,

I originally built this for myself as I was struggling to use your website to find forest locations
while I was on the go, travelling the country.

I drive a lot, and when I stop for a meal I would rather eat somewhere with a view than in a
restaurant or a service station car park. So my girlfriend and I got into the habit of driving to
Forestry England sites just to have lunch, maybe take a short walk after, which is how I ended up
parked in a lay-by trying to work out which of your forests was nearest. Your finder is fine at a
desk. On a phone, on the move, with one bar of signal, I could not get an answer out of it (and
forest car parks often have limited to no mobile signal).

So I built a page that does one thing: it opens to a list of your sites sorted nearest first, and one
tap hands the chosen one to Apple Maps, Google Maps or Waze.

I built it for myself, but I have since shown it to quite a few people, and the reaction has been
consistent enough that I no longer think the problem was only mine. Everyone who has seen it has
asked for it on their own phone. So I would like to keep it running, and to put it in front of more
people than I can reach by showing them my phone.

It is live and free here: **https://forestlocator.enhanceify.co.uk/**

## What it is

- A PWA (Progressive Web App). It opens in a phone browser, and it can also be added to the Home
  Screen so it behaves like an installed app.
- 904 locations: your 274 named forests, and the 630 car parks from the Open Government Licence
  dataset you publish.
- Under 700 KB in total, with everything bundled inside it, so **after the first load it works with
  no internet connection at all.** That was the whole point of building it.
- Each site shows distance, compass direction, sat-nav postcode, parking, facilities and opening
  times. It uses the sat-nav postcode you publish rather than the postal one where the two differ
  (Bedgebury is the site that taught me they do).
- Opening times are handled as "open always", "open until dusk", "set hours" or "not published", and
  for the dusk ones it calculates actual sunset for that site's own latitude. It will not claim a
  gate is open when it has no basis for saying so.
- No accounts, no login, no tracking, no analytics, no adverts. There is no server for it to send
  anything to, and a phone's location never leaves the phone.

## Where the data comes from, and why I am writing

The 630 car parks come from the dataset you publish under the Open Government Licence. The forest
details (name, sat-nav postcode, opening times, parking, facilities) are read from your own public
forest pages, which your Crown copyright page offers for reuse under that same licence.

I have read both, and I believe the app sits inside them. I have not used your logos, your
photographs, or anything marked as belonging to a third party. **So I am not writing to ask
permission to use the information**, and I would rather say that plainly than imply otherwise.

I am writing for two reasons. The first is that I would simply rather you heard about this from me
than came across it. The second is that there are things the Open Government Licence explicitly does
not cover, and those are yours to answer rather than mine to assume.

## What I would like to ask

1. **Is there anything you would want changed?** If a field is wrong, or you would rather I did not
   show something, or you want the wording altered, tell me and I will do it. I would also like to
   get the credit right: I plan to use your own stated wording, "Crown Copyright, courtesy Forestry
   England, licensed under the Open Government Licence", alongside the existing credit for the car
   park data.

2. **Your name and branding.** The licence specifically excludes trade marks, and the app has to be
   able to say what it does, which is find Forestry England sites. Are you content with that, and are
   there conditions you would want if it were listed on an app store? I would follow them.

3. **Would you want any involvement?** I am not asking you to take it on or to run it. But if it is
   useful to you, or there is something you would want it to do, I am open to that conversation,
   including a commercial one.

## What I intend to do with it

I would rather set this out now than have it come as a surprise later.

- **Keep it running free on the web**, as it is today.
- **Put it on the app stores**, most likely free with donations accepted, possibly at a low price. I
  am not trying to make a living from it, but if it turns out to be useful to a lot of people I would
  like it to at least pay for itself.
- **Extend it beyond England.** The obvious next steps are Forestry and Land Scotland, Natural
  Resources Wales, and then Northern Ireland and Ireland, so that it answers the question anywhere in
  these islands rather than stopping at a border a driver cannot see. Further out I would like to
  take the same idea to Europe and the United States. Each of those means a separate conversation
  with a separate body, and this is the first of them.

## One thing I should be upfront about

**It is a snapshot, not a live feed.** It does not know about a closure or a notice you posted
yesterday, and I would not want that to embarrass you. Every site links through to its page on your
website for current information, and each one shows the date its data was last checked. If it would
help, I can make that limitation more prominent, and I can commit to refreshing on whatever schedule
you would want.

I am happy to walk anyone through it, or to pass it to whichever team this belongs with. If I have
written to the wrong address, I would be grateful if you could point me at the right one.

Many Thanks,

Robert Craig
[phone]
[email]
https://forestlocator.enhanceify.co.uk/

---

## Proposed attachments

*Not part of the email body. Four screenshots, resized so the whole email stays light enough for a
general inbox to accept.*

![The list, sorted nearest first](../img/2026-08-14_Screenshots/web/IMG_5821.jpg) ![A site in detail, with the data-checked date](../img/2026-08-14_Screenshots/web/IMG_5822.jpg) ![One tap to Apple Maps, Google Maps or Waze](../img/2026-08-14_Screenshots/web/IMG_5825.jpg) ![Every forest at once, drawn with no connection](../img/2026-08-14_Screenshots/web/IMG_5829.jpg)

*The last one earns its place twice over: the outline it draws is Great Britain, and Scotland and
Wales are visibly empty. It makes the expansion point better than a sentence does.*
