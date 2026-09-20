# Build the iOS Shortcut

## What I need from you

**Build the Shortcut from `docs/build/IOS-SHORTCUT.md`, then use it and the PWA side by side for a
couple of weeks and say which one you actually reach for.**

No longer blocked: card 0005 deployed the endpoint on 2026-08-08. Step 3 of the recipe should call

    https://forestlocator.enhanceify.co.uk/api/nearest.php?lat=<lat>&lng=<lng>&n=5

which is live now and returns Friston Forest first from Brighton.

The comparison is the point of building both. The two things worth noticing:
1. Does Siri triggering actually get used while driving, or does the phone stay in the cradle?
2. Does the Shortcut fail in a real forest car park where the PWA keeps working?

**Pass** is the Shortcut built and working, plus a verdict recorded under `## Direction` naming
which of the two you kept using.

**Fail** is the recipe being wrong, which is a real possibility: if an action name has changed in
the current Shortcuts app, note it here and move the card to `todo/` so the doc gets fixed rather
than working around it on the phone.

**Why it needs you** A `.shortcut` file is a signed Apple format that cannot be generated
off-device, so the build is five minutes by hand rather than something anybody can hand you. The
verdict is the other half: only real use over a couple of weeks settles which access method is worth
keeping, and keeping both forever is a maintenance cost for a personal app.

## Why
Two access methods were built deliberately (DECISIONS 2026-08-08) because they have different
strengths and only real use settles which is worth keeping. The Shortcut is hands-free and needs
signal; the PWA needs a tap and works with no connection at all. Keeping both forever is a
maintenance cost for a personal app, so one should probably win.

## Links

**Relates to**
- `0005` - deployed `api/nearest.php`, which is the endpoint step 3 of the recipe calls. This card
  could not be built at all until that landed.
- `0001` - checks the other half of the comparison, the PWA on the same phone. The verdict this
  card asks for is a verdict about both.

## Not this card
Not changing the endpoint or the PWA. If the recipe is wrong or an action name has changed in the
current iOS Shortcuts app, note it here and move to `todo/` so the doc gets fixed.

## Acceptance
<!-- AC:BEGIN -->
- [ ] #1 WHEN "Hey Siri, Nearest Forest" is spoken, THE APP SHALL offer a chooseable list of the
      five nearest forests with distances.
- [ ] #2 WHEN a forest is chosen from that list, THE APP SHALL open the selected map app with
      driving directions to it.
- [ ] #3 WHEN the same location is used, THE APP SHALL return the same nearest site as the PWA.
<!-- AC:END -->

## Tasks
- [ ] Build the seven-action Shortcut from `docs/build/IOS-SHORTCUT.md`
- [ ] Add the three-way map app menu, or decide one app is enough and note which
- [ ] Cross-check its top result against the PWA from the same spot
- [ ] Use both for two weeks, then record the verdict under `## Direction`

## Direction
**2026-08-08** The endpoint this recipe depends on is deployed and verified. Substitute
`forestlocator.enhanceify.co.uk` wherever `docs/build/IOS-SHORTCUT.md` leaves the host as a
placeholder.

## Comments

**2026-09-20** Rob: "not had any luck with this so far, run into issues with the shortcut using
location variables."

**That is a finding about the recipe, not a reason to leave the card sitting here**, so it is
written down while it is fresh rather than lost in a chat. Step 2 of
`docs/build/IOS-SHORTCUT.md` is the suspect: it asks for the **Latitude** and **Longitude** magic
variables from **Get Current Location** to be inserted into a Text action. Three things are known
to go wrong at exactly that point in Shortcuts and the recipe warns about none of them.

1. **The magic variable inserts as `Current Location` rather than as a number.** Tapping the
   variable chip and choosing **Get Details of Location > Latitude** is what pins it to the number.
   Inserted straight from the suggestion bar it often carries the whole location object, and the
   URL then contains a place name.
2. **Shortcuts helpfully formats the number.** A latitude can arrive as `50.8168` or as `50.8168°`
   or with a thousands separator depending on locale, and any of those make
   `api/nearest.php` reject the parameter rather than fail silently, which is the endpoint behaving
   correctly and looking like a broken Shortcut.
3. **Location permission for the Shortcuts app itself** is separate from Safari's. If it has never
   been granted, **Get Current Location** returns nothing and every step downstream fails with a
   message about the URL rather than about location.

**None of this is confirmed.** It is the list of things to check first, from the shape of the
symptom, and whichever one it turns out to be belongs in the recipe as a warning so the next person
does not lose the same evening.

**What would settle it fastest.** Put a **Show Result** action straight after step 2 and read the
URL it built. Either it looks like
`https://forestlocator.enhanceify.co.uk/api/nearest.php?lat=50.8168&lng=-0.0894&n=5`, in which case
the fault is downstream, or it does not, in which case the URL itself says which of the three it is.
Pasting that same URL into Safari is the control: it is live and returns Friston Forest first from
Brighton.

**The card stays here and keeps all three criteria open.** Nothing an unattended session can do
reaches an iOS Shortcut, and the comparison this card exists for, which of the two you actually
reach for, needs the Shortcut to exist first.

**Worth remembering what the comparison is for.** The Shortcut is the only thing that uses
`api/nearest.php`, and that endpoint covers the forest tabs only. Campsites are not in it. So if the
Shortcut wins on convenience it wins over a smaller dataset, and that is part of the answer rather
than a footnote to it.
