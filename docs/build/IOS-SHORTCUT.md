# Building the iOS Shortcut

_Last updated: 2026-08-08_

The second access method (see [DECISIONS](../DECISIONS.md), 2026-08-08). Siri-triggerable and
therefore hands-free, which the PWA cannot be. It calls `api/nearest.php` because Shortcuts is far
too slow to rank 904 sites on device.

**Why this is a written recipe and not a file:** `.shortcut` files are a signed Apple format that
cannot be generated off-device. Building it by hand takes about five minutes and you can then share
it to iCloud yourself if you want a backup link.

## Prerequisite

The app must be deployed and `api/nearest.php` reachable over HTTPS. Check it first, in Safari on
the phone, before building anything:

```
https://<your-domain>/api/nearest.php?lat=50.8168&lng=-0.0894&n=3
```

A pass looks like JSON starting `{"ok":true,` and listing Friston Forest first. Anything else, stop
and fix the deploy: every step below depends on this responding.

## The Shortcut

Shortcuts app → **+** → rename to **Nearest Forest** (this is the Siri phrase, so keep it short and
say it out loud once to check it dictates cleanly).

| # | Action | Settings |
|---|--------|----------|
| 1 | **Get Current Location** | no settings |
| 2 | **Text** | `https://<your-domain>/api/nearest.php?lat=` then insert the **Latitude** magic variable from step 1, then `&lng=`, then the **Longitude** magic variable, then `&n=5` |
| 3 | **Get Contents of URL** | URL = the **Text** output of step 2. Method GET. |
| 4 | **Get Dictionary Value** | Get **Value** for key `results` in the output of step 3 |
| 5 | **Choose from List** | Input = step 4. Turn **Select Multiple** off. Set **Prompt** to `Nearest forest` |
| 6 | **Get Dictionary Value** | Get **Value** for key `apple_url` in the output of step 5 |
| 7 | **Open URLs** | Input = step 6 |

Step 5 shows each entry using its `label` field automatically, which reads as
`Friston Forest - 10.8 miles (BN20 0AT)`.

### Asking which map app each time

To match the PWA's behaviour, replace steps 6 and 7 with:

| # | Action | Settings |
|---|--------|----------|
| 6 | **Choose from Menu** | Three items: `Apple Maps`, `Google Maps`, `Waze` |
| 6a | under *Apple Maps*: **Get Dictionary Value** | key `apple_url` from step 5, then **Open URLs** |
| 6b | under *Google Maps*: **Get Dictionary Value** | key `google_url` from step 5, then **Open URLs** |
| 6c | under *Waze*: **Get Dictionary Value** | key `waze_url` from step 5, then **Open URLs** |

Skip this if you find you always pick the same app. One less tap matters more in a car than
flexibility you never use, and that is part of what the two-method comparison is meant to settle.

## Running it hands-free

"Hey Siri, Nearest Forest". Siri reads the list aloud and accepts a spoken choice.

Add it to CarPlay: Shortcuts → the shortcut → **(i)** → **Add to Home Screen** puts it on the phone;
CarPlay surfaces shortcuts through the Shortcuts CarPlay app, so pin it there too.

## Useful variations

- **Car parks instead of named forests:** append `&source=carpark` in step 2. Add `&source=all` to
  mix both. Bear in mind 170 car parks are unnamed, so the list reads poorly aloud.
- **More or fewer options:** change `&n=5`. The endpoint clamps to 25.
- **Show opening times:** the `access` key on each result is `always`, `dusk`, `hours` or `unknown`,
  and `opening` carries the full published text if you want Siri to read it.

## Known limits

- **Needs signal.** This is the real difference from the PWA, which works with no connection at all.
  In a dead-signal car park the Shortcut fails and the PWA does not. Expect this and judge the two
  methods on it.
- **Straight-line distance**, same as the PWA. See [DECISIONS](../DECISIONS.md).
- If `api/nearest.php` returns `{"ok":false,...}` the `error` string says exactly what went wrong;
  step 5 will show an empty list rather than a message, so check the URL in Safari when that happens.
