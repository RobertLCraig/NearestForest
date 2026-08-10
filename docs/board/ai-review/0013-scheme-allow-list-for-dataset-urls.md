# Scheme allow-list for dataset URLs

## Why
The detail sheet builds `<a href="' + esc(site.url) + '">` from a field that originates on a
website nobody here controls. `esc()` escapes `"` and `'`, so an attribute breakout is impossible,
and the 2026-08-10 review audited all 904 records and found every `url` an `https://` page on
`forestryengland.uk`, with no `<`, `>`, `javascript:`, `onerror` or entity payload in any string
field anywhere in the dataset.

So nothing is exploitable today. What is missing is the check that keeps it that way: escaping
cannot stop `javascript:` sitting perfectly legitimately *inside* an href, and `parse.py` passed
`f["url"]` straight through with no scheme test. That is a latent XSS that depends on an upstream
site staying well-behaved, and it is one line to close at each end.

Two ends, on purpose. The generator refuses to emit a bad URL, and the app refuses to render one,
because **the app ships the dataset rather than deriving it**: the scheme belongs checked where it
is used, not trusted from where it came.

## Not this card
Not sanitising other dataset fields; they are escaped at every render site and the review confirmed
it. Not a general URL allow-list for outbound links elsewhere in the app, because there are none:
the three map deep links are built by `NF.navUrl` from coordinates, not from data.

## Acceptance
<!-- AC:BEGIN -->
- [x] #1 WHEN a site record carries a URL that is not `https://`, THE APP SHALL render the detail
      sheet without a link rather than rendering the URL.
- [x] #2 WHEN `parse.py` encounters a URL that is not an https page on forestryengland.uk, THE
      BUILD SHALL report it and exit non-zero rather than emit the dataset.
- [x] #3 WHEN the shipped dataset is checked, THE APP SHALL find every URL passes the same guard
      the renderer applies.
<!-- AC:END -->

## Tasks
- [x] `NF.safeHref` in `core.js`, so the rule is pure logic and testable in node
- [x] `app.js` renders the link through it, and gains `rel="noreferrer"` alongside `noopener`
- [x] `parse.py` validates scheme and host in `validate()`, which already exits non-zero
- [x] Self-tests: the guard against `javascript:`, `data:`, `http:`, protocol-relative and
      leading-whitespace forms, plus a sweep of every URL in the shipped dataset

## Plan
`safeHref` goes in `core.js` rather than `app.js` because CLAUDE.md says pure logic goes there, and
because it makes the rule testable against the real shipped code instead of eyeballed. It returns
the URL or null, so the caller cannot accidentally render an empty href.

`rel="noreferrer"` rides along here rather than getting its own card: it is the same line, and the
review flagged that following the link told Forestry England which page sent you.
