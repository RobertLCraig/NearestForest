---
needs: 0016
waiting_on: NRW's answer on the recreation data licence - recheck 2026-09-11
---
# How much of Wales can we actually ship?

## What I need from you

**One email and one choice.**

1. Send Natural Resources Wales the licence question below, and paste their answer into this card.
2. Once they answer, pick option 1, 2 or 3.

**Answer 0016 first.** It carries the scope call that gates both cards, because the PRD's non-goals
currently rule out Wales and Scotland outright. If that answer is no, discard this card unread and
do not send the email.

---

**On 1.** NRW publishes two contradictory statements about the same dataset. Their own metadata
record says it is Open Government Licence with attribution and that "there are no access
restrictions on this data. NRW may release, publish or disseminate it freely". The data.gov.uk entry
for that same dataset says it is used internally for recreation management and "should not be used
in internet applications or publications without Natural Resources Wales' prior approval". This app
is a public internet application, so one of those two sentences decides whether option 2 exists.

Their enquiries address is on
[naturalresources.wales/contact-us](https://naturalresources.wales/about-us/contact-us/?lang=en).
Something like:

> I'm building a small free public web app that lists the nearest publicly accessible forest sites
> in Great Britain and hands the chosen one to a phone's map app. I'd like to include your
> recreation data, specifically NRW_GB_RECREATION_POINTS and NRW_GB_RECREATION_AREAS as published on
> DataMapWales.
>
> Your metadata record (NRW_DS116288) states these are available under the Open Government Licence
> with attribution and carry no access restrictions. The data.gov.uk entry for the same dataset says
> they should not be used in internet applications without your prior approval. Could you confirm
> which applies? If prior approval is what's needed, please treat this as that request. Attribution
> would read "Contains Natural Resources Wales information © Natural Resources Wales and Database
> Right".

Pass is a written yes naming the licence: that unlocks option 2.
Fail is either a no, or nothing by the recheck date. Either way we take option 1 and move on, since
option 1 needs no permission from anyone.

**On 2.** The choice is what Welsh coverage is worth to you, and the sizes differ by a factor of
thirty. See the options below; my recommendation is there too.

**Why it needs you.** The first part is a permission question with an outside party, and chasing
them is not something an agent can do. The second is a judgement about how much offline payload a
country you rarely drive to is worth, and nothing in the repo settles that.

## Why
Wales is the last gap after 0016. Natural Resources Wales manages the Welsh Government Woodland
Estate and publishes visitor sites the same way the other two agencies do, but the shape is worse
than either: the names and the coordinates live in different places.

Measured on 2026-08-14:

- [naturalresources.wales/days-out/places-to-visit](https://naturalresources.wales/days-out/places-to-visit/?lang=en)
  lists **116 sites** across five regions (36 north-west, 13 north-east, 17 mid, 32 south-west, 18
  south-east). Each page carries a postcode, an OS grid reference, what3words, parking charges,
  facilities and trails, in prose, much like the English pages. `robots.txt` is fully open.
- **Those pages carry no latitude or longitude.** The only coordinates in the markup sit inside a
  Google Maps embed URL, which is exactly the kind of thing that changes shape without warning.
- The open data is on DataMapWales as a GeoServer WFS (`inspire-nrw`, 271 layers), which does serve
  `application/json` in EPSG:4326, so reprojection is server-side as it is for the English car
  parks. `NRW_GB_RECREATION_POINTS` holds **3,472 points**, `NRW_GB_RECREATION_AREAS` 315 polygons.
- That data is rougher than the English equivalent. `ASSET_NAME` is null on most area records and
  untidy on the points (`"near toilets Car Park 3       "`), and `POINT_ASSET_TYPE`, `STATUS` and
  `SURFACE_TYPE` come through as **bare integers with no decode in the service** — England's layer
  hands over `Gravel` and `Permanent - Official`, Wales hands over `1` and `2`. Its reference date
  is January 2022.

## Options
1. **The 116 named sites only, coordinates derived on our side.** Take the names, postcodes,
   facilities and parking text from the web pages, and get each coordinate from the published OS
   grid reference. Cost: an OSGB36 to WGS84 conversion, which is either a new build-time dependency
   or about sixty lines of maths, plus a fallback for any page whose grid reference is missing or
   malformed. Needs nobody's permission: it is the same footing as the English pages this project
   already scrapes. Adds roughly 66 KB. No car parks for Wales.
2. **Option 1 plus the recreation points.** Adds up to 3,472 records to the Car parks tab, filtered
   to the parking asset types once the integer domains are decoded. Cost: NRW's written yes, a
   decode table that does not exist in the service, and a dataset four times the size of everything
   shipped so far — about 2 MB on top of a 515 KB baseline, all of it precached onto the phone. It
   would make Wales better covered than England.
3. **Skip Wales.** Cost: the app is wrong in Wales, silently, by listing an English or Scottish site
   as nearest when a Welsh one is closer. Everything else stays as it is.

## Recommendation
**Option 1, and send the email anyway.** The named sites are what the Forests tab shows, and they
are the ones with facilities, opening text and a sat-nav postcode — the fields the app actually
displays. The 3,472 points are mostly unnamed assets, which is the problem card 0004 already exists
to fix for England, and importing them would import that problem at four times the scale onto a
device where the offline cache has already destroyed itself once.

Option 3 is worse than it looks. The failure it accepts is the silent kind: the app does not say "I
don't know about Wales", it confidently names something further away.

If NRW confirms the open licence, the points are still worth having later, as their own card,
filtered to parking and joined to the named sites. That is a better shape than taking all of it
because it was available.
