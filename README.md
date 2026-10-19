# Ajith Raj Portfolio and Personal Panchangam

This Next.js app includes an installable Malayalam Panchangam at `/panchangam/`.

## Run locally

Requirements: Node.js 20.9 or later and npm.

```bash
npm install
npm run dev
```

Open `http://localhost:3000/panchangam/`. In the product menu, choose **Personal Panchangam**.

## TraceDraw

Open `http://localhost:3000/tracedraw/` or choose **TraceDraw** from the product menu. Start tracing to request camera access, then import a JPG, PNG, or WebP image. Move it with one finger, pinch to resize, and use the toolbar to adjust opacity, zoom, rotation, and image locking. Recent images are saved in this browser's IndexedDB and are not uploaded.

## ImageTrace

Open `http://localhost:3000/imagetrace/` or choose **ImageTrace** from the product menu. Browse a JPG, PNG, or WebP image, position it by dragging or pinching, then set brightness and contrast before locking it in place. Fit, fill, and maximum zoom are available; adjustments and images are saved separately from TraceDraw on this device. ImageTrace displays the image directly and does not use a camera or upload images.

Use **Enter tracing mode** for a distraction-free screen with a floating lock control. Screen Awake is available when the browser supports the Screen Wake Lock API. On iOS, open the app in Safari and use Share → **Add to Home Screen**; on Android, choose **Install app** when offered. The ImageTrace app shell and static app assets are cached for offline launches after the route has been opened online once.

Production build and run:

```bash
npm run build
npm run start
```

No environment variable or paid Panchangam provider is required. `NEXT_PUBLIC_SITE_URL` may optionally be set to the canonical HTTPS origin used for metadata. Both birth and daily locations are restricted to Kerala's 14 districts. Search by the Malayalam or English district name; select a district from the list. Coordinates are district reference points from OpenStreetMap administrative boundaries, not street-level birth locations. The district list and coordinates are bundled locally and work offline.

## How Panchangam data is calculated

- Astronomy Engine supplies geocentric ecliptic longitudes and observer-based sunrise/sunset calculations.
- Tithi, nakshatra, yoga, karana, Moon sign, and the displayed planetary sign positions are derived from those longitudes using a linearized Lahiri ayanamsa approximation.
- Rahu Kalam, Yamagandam, Gulika Kalam, Abhijit Muhurtham, and Brahma Muhurtham use traditional weekday/daylight-segment rules. They are labelled as traditional interpretations, not predictions or guaranteed outcomes.
- Dur Muhurtham, Varjyam, Amrita Kalam, and Abhijit Muhurtham are computed from traditional daylight-based rules and shown as part of the personal Panchangam record when they fall within the day.
- Each record keeps the selected location/time zone, calculation timestamp, engine, ayanamsa method, and source metadata. Records older than 24 hours are marked stale and recalculated when the app is online.

The results are intended for informational use. Astrological classifications are traditional beliefs, not scientifically established advice.

## Local privacy, caching, and offline use

- Birth details are saved in browser `localStorage`; Panchangam records are stored in IndexedDB.
- The app calculates a 92-day window for the selected daily location and keeps a rolling 92-day cache.
- Use **ഡാറ്റ മായ്ക്കുക** in the dashboard to remove the saved birth profile and Panchangam records from this browser.
- The service worker caches the app route and its static Next.js assets. Install from the browser's install control when offered. On iOS, use Safari's Share menu and choose **Add to Home Screen**.
- Offline calculations use the bundled astronomy engine. Place search and new geocoding still require an internet connection.

## Deployment

Deploy as a standard Next.js application with `npm run build` and `npm run start`, or use a compatible Next.js host. Serve the app over HTTPS in production: service workers and PWA installation require a secure context (localhost is permitted for development). Ensure the deployment serves `public/panchangam-sw.js`, `public/panchangam-icon.svg`, `public/tracedraw/sw.js`, `public/tracedraw/icon-192.png`, `public/tracedraw/icon-512.png`, `public/tracedraw/manifest.webmanifest`, `public/imagetrace/sw.js`, `public/imagetrace/icon.svg`, `public/imagetrace/icon-192.png`, `public/imagetrace/icon-512.png`, `public/imagetrace/manifest.webmanifest`, and the generated `/manifest.webmanifest` route without rewriting them.
