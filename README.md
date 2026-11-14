# Asish & Ipsita: the short invitation

A one-page engagement invitation for Asish Sahoo and Ipsita Senapati
(Sunday, 6 December 2026, Pal Heights Mantra, Pahala, Bhubaneswar).
It uses the same embroidered artwork as the full site, in about a quarter of the scrolling.

What guests see:

1. While the page loads, twelve lotus petals open around the wax seal. When everything has arrived, the seal is pressed and flies onto
   a silk envelope with a large **Open the invitation** button.
2. The invitation card, which assembles itself as the envelope opens: the film playing inside a jewelled jharokha window
   (velvet and zari, set stones, pearl strings, pillars with amalaka capitals, pearls swaying in the opening), the Ganesh mantra (in Roman letters),
   "Jai Jagannath" (the only line in Odia script), both sets of parents, the names, the date and the venue,
   with three buttons: **RSVP**, **Directions** and **Add to calendar**.
3. One card with the date and the calendar buttons, beside the venue address, a map and **Get directions**.
4. The photographs: they fly in, line up and form a ring around the word *Moments*. Scrolling on (or waiting a moment)
   opens the ring into an arch. Guests can swipe or drag along it, or use the **Previous** and **Next** buttons;
   tapping a photograph shows it larger. The ring holds still for a short stretch of scrolling while it opens,
   but the page never captures the mouse wheel or gets stuck.
5. A short reply form that sends the RSVP on WhatsApp.
6. At the end, the names are written in gold and a split-flap clock counts down to the day.

On phones, a bar at the bottom keeps **Directions** and **RSVP** one tap away.
Buttons are at least 52 px tall, the text is large, and nothing depends on scroll tricks or hidden gestures.
Every tap or touch leaves a little gold stardust, and a fine trail follows a finger (or the mouse) as it moves.
The names catch the light now and then, light sweeps across the gold lettering, stars glint on the zari borders,
titles are written on by a sparkling pen, the countdown tiles flip over, and each card unfolds as it comes into view.
Visitors who have reduced motion turned on get the same page without the movement or the stardust.

## Put it on GitHub Pages

1. Create a new repository on GitHub (for example `asish-ipsita`).
2. Upload everything in this folder (`index.html`, `assets/`, `README.md`, `.nojekyll`) to the root of the repository.
3. Go to **Settings → Pages**, set **Source** to *Deploy from a branch*, choose `main` and `/ (root)`, then save.
4. After a minute the site is live at `https://<your-username>.github.io/asish-ipsita/`.

To host both versions, put this one at the root and the full version in a folder named `full/`.
It will then be at `…/asish-ipsita/full/`.

To preview on your own computer, run `python3 -m http.server` in this folder and open http://localhost:8000.

## Things to edit

Everything is in `CONFIG` near the end of `index.html` unless noted.

| What | Where |
| --- | --- |
| Ceremony time | `time`, e.g. `'18:30'` (IST, 24-hour). The time then appears on the card, and the countdown and calendar entry use it. |
| WhatsApp number that receives RSVPs | `rsvpWhatsApp`, e.g. `'919876543210'` (country code + number, no `+`). If you leave it blank, guests pick the contact in WhatsApp themselves. |
| Photographs | `moments`: each entry has a `src` and a `title`. Local files such as `assets/photos/01.jpg` work. The ring needs about 12 cards, so with fewer photos they repeat (5 photos make 15 cards). With 12 or more, each appears once. |
| Film in the arch | `film.src` and `film.poster`. It plays muted while the card is on screen. |
| Google Maps key | `venue.mapsKey`. If the key is missing or refused, the page shows a plain Google Maps embed instead. |
| Map pins | `venue.pin` is the hotel (taken from the Pal Heights Mantra Google Maps link); `venue.landmarks` lists the other pins (add `side: 'b'` to put a label under its pin). `venue.maps` is the link the Directions buttons open. |

The current photos are Unsplash placeholders. Replace them with your own before you share the link widely.

## Protect the Google Maps key

The key sits in the page, as on every website that uses Google Maps. Lock it down so nobody else can use it on your bill:

1. Open Google Cloud Console → **APIs & Services → Credentials** and click the key.
2. Under **Application restrictions**, choose **Websites** and add `https://<your-username>.github.io/*`
   (and `http://localhost:8000/*` if you preview locally).
3. Under **API restrictions**, choose **Restrict key** and tick **Maps JavaScript API** only.
4. Make sure the project has billing enabled and the Maps JavaScript API turned on.

## WhatsApp link preview

WhatsApp needs a full URL for the preview image. Once the site is live, change
`<meta property="og:image" content="assets/og-image.jpg">` to the full address,
e.g. `https://<your-username>.github.io/asish-ipsita/assets/og-image.jpg`.

## Hindu calendar details used

Sunday, 6 December 2026: Margashirsha Krishna Trayodashi (Purnimanta, as followed in Odisha), a Ravi Pradosh.
Check with your family priest for the exact muhurta.

## Files

- `index.html`: the page, its styles and `CONFIG`
- `assets/js/short.js`: loader, envelope, stardust, reveals, film, countdown and calendar, map, the photo ring and arch, photo viewer, RSVP
- `assets/js/ornaments.js`: arch shapes and the divider
- `assets/art/`: the embroidered artwork and silk textures

## Credits

Fonts: Cormorant Garamond, Jost (SIL Open Font License).
Animation: GSAP (GreenSock standard license, free).
Map: Google Maps JavaScript API.
Placeholder photographs: Unsplash (Unsplash License).
