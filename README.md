# Baseline

A weekly planner built for high schoolers who juggle practice, school, a job, the SAT, the gym and a life, and who want to know what to do now to get where they're going after graduation (college, a trade, the military or work).

Built with [Expo](https://expo.dev) (React Native), so one codebase runs on iPhone and Android.

## Try it on your phone (Mac)

You only do steps 1–2 once.

1. **Install Node.js.** Go to [nodejs.org](https://nodejs.org), download the **LTS** version and run the installer.
2. **Install Expo Go on your phone** from the App Store or Google Play.
3. **Get the code.** On this GitHub page click the green **Code** button → **Download ZIP**, then double-click the ZIP to unzip it. (Or, if you use git: `git clone` the repo.)
4. **Open Terminal** (press ⌘ + Space, type *Terminal*, hit Enter), type `cd ` (with a space), drag the unzipped `baseline` folder into the Terminal window and press Enter.
5. Run these, one at a time:

   ```bash
   npm install
   npm run setup
   npm start
   ```

   `npm run setup` updates Baseline to the newest Expo version so it matches the Expo Go app on your phone. It can take a minute.
6. A QR code appears. **iPhone:** open the Camera app and point it at the code. **Android:** scan it from inside Expo Go. Your phone and Mac need to be on the same Wi‑Fi. If it says "request timed out", stop with Control + C and run `npm run tunnel` instead (it connects through the internet), then scan the new QR code.

Edit any file and save: the app on your phone reloads by itself. Shake the phone to open the developer menu.

## What's in it

| Tab | What it does |
| --- | --- |
| **Today** | Timeline of your day with a live "now" line, next-up countdown, free gaps you can tap to fill, long-press-and-drag to move blocks, check-off to mark done. |
| **Week** | Mini week grid with how loaded each day is, rings for study / workouts / work / sleep, busiest and lightest day, and one-tap study slots that skip your protected time. |
| **Colleges / Military / Trades / Careers / Paths** | The middle tab changes with the path you picked. "Not sure yet" sees everything. College hub: saved schools with fit (Likely / Target / Reach / Far reach), 179 schools to search, costs by in-state / out-of-state / private, visit planner, FAFSA. Military: all six branches, example jobs, enlistment checklist, ASVAB practice, ROTC / academies / GI Bill. Trades: eight trades, a day on the job, licenses, cheapest ways to train, community colleges in your state. |
| **You** | GPA, test score and state, study goal, protected time, and tools: SAT study hub, transcript & GPA, training plan, money & hours, FAFSA, widgets. |

Setup is a one-minute quiz (grade, what fills your week, gym plan, what you're saving for, after high school, numbers, study hours, protected time) and it builds a starter week from your answers.

### Where the numbers come from

- **College costs:** College Board, *Trends in College Pricing 2025* averages for 2025–26 (public 2-year $4,150, public 4-year in-state $11,950, out-of-state $31,880, private nonprofit about $45,000).
- **College fit:** an estimate from typical admitted-student GPA and SAT for each tier of school. It's a guide, not a promise.
- **Real school data (optional):** get a free key at [api.data.gov/signup](https://api.data.gov/signup/), paste it into `src/config.js`, and every college page shows real admission rates, SAT averages, tuition and net price from the U.S. Department of Education College Scorecard.
- **SAT prep:** only free, official resources (College Board's Bluebook, Official SAT Prep on Khan Academy, Student Question Bank, Schoolhouse.world, Question of the Day).
- **FAFSA:** opens October 1 each year for the next school year. Seniors get a reminder every time they open the app until they mark it submitted.

## Project layout

```
App.js                  tabs, navigation, setup quiz gate
src/theme.js            colors (light + dark)
src/ui.js               buttons, cards, rings, icons, sheets, campus art
src/logic.js            time math, conflicts, free gaps, the "type it" parser
src/store.js            saved data (stays on the phone)
src/starter.js          builds a first week from quiz answers
src/content/            colleges, military, trades, workouts, quiz questions
src/screens/            each screen
src/onboarding/Quiz.js  setup quiz
test/                   npm test: logic tests + renders every screen
```

## Tests

`npm test` runs the planner math tests and renders every screen under ~20 different student profiles (light and dark mode) to catch crashes.

## Roadmap / notes

- **School logos:** official logos are trademarks, so Baseline draws each school in its colors with a monogram and generated campus art. Real logos need permission from each school (many have brand/licensing offices). Free campus photos (for example Wikimedia Commons) can be added with credit.
- **Home screen widgets:** need an installed build (not Expo Go). The Widgets screen is a preview.
- **Read a transcript or work schedule from a photo:** needs a small server with an AI vision API key so the key isn't inside the app. For now classes are entered by hand.
- **Push notifications** (FAFSA, shifts): add `expo-notifications` in an installed build.
- **App Store / Google Play:** needs an Apple Developer account ($99/yr) and a Google Play account ($25 once), then `eas build`.
