# 🐱 Mood Cat

A private, local-only mood check-in Progressive Web App for pre-teens aged 10–12.

**No login. No cloud. No parent dashboard. Everything stays on the device.**

---

## Quick start

```bash
npm install
npm run dev
```
Open http://localhost:5173

## Production build

```bash
npm run build
npx serve dist
```

PWA requires HTTPS (or localhost) for service worker registration.

---

## Install as PWA

- **Chrome/Edge:** Install icon in address bar
- **Safari iOS:** Share → Add to Home Screen
- **Android Chrome:** Menu → Add to Home Screen

Once installed, the app works fully offline.

---

## What it does

1. Name your cat and choose a colour/pattern
2. Daily mood check-in: Happy / Calm / Sad / Angry / Worried / Low energy / Not sure
3. Mood-specific follow-up question → relevant 5-minute activity
4. 5-minute countdown timer with pause/resume
5. Post-activity reflection (better / same / worse)
6. Trusted adult message if "worse" is selected
7. Optional note (500 chars) or doodle (canvas drawing tool)
8. Local history with weekly mood summary
9. Paw-print rewards → unlockable cat accessories

---

## Tech stack

React + TypeScript + Vite · Dexie.js (IndexedDB) · React Router · vite-plugin-pwa

---

## Structure

```
src/
  App.tsx                 # Root, routing, nav bar
  styles.css              # Design system (CSS variables)
  db/index.ts             # Dexie DB + all storage helpers
  data/moods.ts           # Mood data, activities, cat patterns
  hooks/
    useAppState.ts        # Profile + rewards
    useCheckIn.tsx        # In-progress check-in state
  components/CatSVG.tsx   # SVG cat with expressions + accessories
  screens/
    Setup.tsx             # First-launch 3-step cat setup
    Home.tsx              # Home + paw counter + progress
    MoodScreen.tsx        # 6 moods + Not sure
    FollowUp.tsx          # Mood-specific follow-up
    ActivityScreen.tsx    # Activity + 5-min timer
    ReflectionScreen.tsx  # Better/same/worse + trusted adult message
    NoteAndDoodle.tsx     # Optional note or doodle + saves check-in
    HistoryScreen.tsx     # History list + weekly summary
    CatCustomise.tsx      # Cat name, pattern, accessories
    SettingsScreen.tsx    # Export JSON, delete all data
```

---

## Unlock thresholds

| Paw prints | Unlock |
|---:|---|
| 3 | Blue Collar |
| 5 | Star Background |
| 10 | Cosy Blanket |
| 15 | Fish Toy |
| 20 | Wizard Hat |
| 25 | Moon Background |
| 30 | Sparkle Collar |
| 40 | Cat Bed |
| 50 | Crown |

---

## Known limitations

- Doodles stored as base64 PNG in IndexedDB — accumulate over time; no in-app delete per check-in yet
- No audio alert on timer completion (visual only, by spec)
- Single profile only (multi-profile is a future enhancement)
- No push notification reminders (out of MVP scope)
- Google Fonts require one online load before offline caching kicks in

---

## Privacy

- No login, no accounts
- All data stays in browser IndexedDB on this device
- No analytics, no advertising, no third-party tracking
- Export as JSON or delete everything from Settings
