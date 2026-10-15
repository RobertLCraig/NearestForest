---
not_for_the_loop: the first step is an email to Natural Resources Wales, sent by Rob from r@enhanceify.co.uk
---
# Welsh car parks from NRW's recreation points

## Why
**The Car parks tab shows no Welsh car parks.** A driver in Wales sees an English car park as the
nearest one, even when a Welsh one is closer. The Forests and Campsites tabs already cover Wales.

**What it costs.** The app gives a wrong answer in Wales, and it gives it with no warning.

**How it came to be this way.** `0017` asked how much of Wales to ship. Its 2026-09-29 answer was
option 1, the named sites only, because option 1 needs nobody's permission. Option 2, the car parks,
needs a licence answer from NRW. `0017` said option 2 belongs on its own later card. This is that card.

The licence question, measured on `0017` on 2026-08-14: NRW's own metadata record (NRW_DS116288)
says the recreation data is Open Government Licence with no access restrictions. The data.gov.uk
entry for the same dataset says it needs NRW's prior approval before use in an internet application.
This app is an internet application, so NRW must say which statement applies.

## Links

**Relates to**
- `0017` - the finished decision card. Its option 2 text and its 2026-09-29 entry are the source of
  this card, and its `## Why` holds the measurements of the NRW data.
- `0079` - option 1, the 116 named Welsh sites. A Welsh car park may be joined to these for its name.
- `0004` - England's car parks have unnamed assets, and this data has the same problem at a larger scale.

## Not this card
Not the named Welsh sites (`0079` built them). Not Scottish car parks: no open dataset exists.

## Acceptance
<!-- AC:BEGIN -->
- [ ] #1 WHEN the email in `docs/outreach/nrw-licence-enquiry.md` is sent, NRW's answer SHALL be
      pasted into this card's `## Comments`, dated. proves: manual - only Rob can send it
- [ ] #2 WHEN NRW give a written yes that names the licence, THE APP SHALL list Welsh car parks from
      `NRW_GB_RECREATION_POINTS` in the Car parks tab, filtered to parking asset types. proves: none -
      the test names are written when the build starts, after the answer
- [ ] #3 WHEN NRW say no, or the answer has not arrived by the recheck date the sender sets, this
      card SHALL go to `discarded/` with that reason. proves: manual
<!-- AC:END -->

## Tasks
- [ ] Send the email and record the answer.
- [ ] On a yes: decode the integer `POINT_ASSET_TYPE` values, filter to parking, and build.

## Plan
Stand in `C:\Dev\NearestForest`. The email is written and ready in
`docs/outreach/nrw-licence-enquiry.md`; NRW publish a contact form, so take the recipient from
https://naturalresources.wales/about-us/contact-us/?lang=en when sending.

On a yes, the data is the DataMapWales GeoServer WFS (`inspire-nrw`), which serves JSON in
EPSG:4326. `NRW_GB_RECREATION_POINTS` held 3,472 points on 2026-08-14. `POINT_ASSET_TYPE`, `STATUS`
and `SURFACE_TYPE` are bare integers with no decode in the service, so the decode table is part of
this build. The precache cost is the real constraint: `0017` estimated about 2 MB for all of it, so
filter to parking before deciding the size is acceptable. Record the licence answer in
`docs/DECISIONS.md` before the data goes in.
