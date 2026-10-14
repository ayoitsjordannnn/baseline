// Renders every screen under many student profiles to catch crashes. Run: npm run smoke
import React from 'react';
import { renderToString } from 'react-dom/server';
import { ToastProvider } from '../src/ui';
import { defaultProfile, STEPS, Q } from '../src/content/quiz';
import { exampleWeek } from '../src/data';
import { starterWeek } from '../src/starter';
import { COLLEGE_LIST } from '../src/content/colleges';
import Today from '../src/screens/Today';
import Week from '../src/screens/Week';
import PathsTab from '../src/screens/Paths';
import Me from '../src/screens/Me';
import { Discover, College, Visit } from '../src/screens/Colleges';
import Fafsa, { FafsaModal } from '../src/screens/Fafsa';
import Sat from '../src/screens/Sat';
import Transcript from '../src/screens/Transcript';
import Gym from '../src/screens/Gym';
import Money from '../src/screens/Money';
import Widgets from '../src/screens/Widgets';
import Quiz from '../src/onboarding/Quiz';

const nav = { push() {}, pop() {}, tab() {} };
const base = () => {
  const p = defaultProfile();
  return { ...p, onboarded: true, grade: '11th', after: '4yr', major: 'cs', budget: 'mid', test: 'taken', scoreType: 'sat', sat: 1250, acts: { ...p.acts, Sports: true, 'A job': true, 'Gym / working out': true }, gym: '3', saving: 'car' };
};
const variants = {
  junior: base(),
  freshman: { ...base(), grade: '9th', test: 'none', scoreType: null },
  seniorFafsa: { ...base(), grade: '12th' },
  seniorSubmitted: { ...base(), grade: '12th', fafsa: { steps: {}, submitted: true, snooze: 0 } },
  military: { ...base(), after: 'military', branch: 'marines', milpay: 'rotc' },
  militaryUnsure: { ...base(), after: 'military', branch: null },
  trade: { ...base(), after: 'trade', trade: 'elec', state: 'TX' },
  tradeNoState: { ...base(), after: 'trade', trade: null, state: 'WY' },
  work: { ...base(), after: 'work' },
  unsure: { ...base(), after: 'unsure', pathView: 'military' },
  unsureTrade: { ...base(), after: 'unsure', pathView: 'trade' },
  unsureWork: { ...base(), after: 'unsure', pathView: 'work' },
  exploring: { ...base(), after: 'military', explore: true, pathView: 'college' },
  ownSplit: { ...base(), splitMode: 'own', own: ['Glutes & abs', 'Rest', 'Pull', 'Rest', 'Legs', 'Rest', 'Rest'] },
  simpleSplit: { ...base(), splitMode: 'simple', gym: '?' },
  runner: { ...base(), gymKinds: { Running: true }, acts: { ...base().acts, Sports: false } },
  act: { ...base(), scoreType: 'act', act: 27 },
  gpaUnsure: { ...base(), gpaUnsure: true, scoreType: null },
  noJob: { ...base(), acts: { ...defaultProfile().acts, 'Nothing yet': true } },
  transcript: { ...base(), transcript: [{ id: 'a', name: 'Algebra', grade: 'C', level: 'reg', sem: 1 }, { id: 'b', name: 'Bio', grade: 'A', level: 'ap', sem: 2 }], hoursLog: [{ k: 'Oct 5', h: 14 }, { k: 'Oct 12', h: 18 }] },
  fresh: { ...defaultProfile(), onboarded: true },
};
const weeks = { example: exampleWeek(), empty: [] };

let fails = 0, n = 0;
const run = (label, el) => {
  n++;
  try { renderToString(<ToastProvider>{el}</ToastProvider>); }
  catch (e) { fails++; console.log(`FAIL ${label}: ${e && e.stack ? e.stack.split('\n').slice(0, 4).join('\n') : e}`); }
};
const someColleges = ['uw', 'utd', 'dallas', 'tstc', ...COLLEGE_LIST.filter((_, i) => i % 9 === 0).map((c) => c.id)];
for (const scheme of ['light', 'dark']) {
  globalThis.__scheme = scheme;
  for (const [vk, profile] of Object.entries(variants)) {
    for (const [wk, week] of Object.entries({ ...weeks, starter: starterWeek(profile) })) {
      globalThis.__state = { ready: true, week, profile };
      globalThis.__dispatched = [];
      const L = `${scheme}/${vk}/${wk}`;
      run(`${L} Today`, <Today nav={nav} params={{}} />);
      run(`${L} Today d6`, <Today nav={nav} params={{ day: 6 }} />);
      run(`${L} Week`, <Week nav={nav} />);
      run(`${L} Paths`, <PathsTab nav={nav} />);
      run(`${L} Me`, <Me nav={nav} />);
      run(`${L} Discover`, <Discover nav={nav} />);
      run(`${L} Fafsa`, <Fafsa nav={nav} />);
      run(`${L} FafsaModal`, <FafsaModal nav={nav} />);
      run(`${L} Sat`, <Sat nav={nav} />);
      run(`${L} Transcript`, <Transcript nav={nav} />);
      run(`${L} Gym`, <Gym nav={nav} />);
      run(`${L} Money`, <Money nav={nav} />);
      run(`${L} Widgets`, <Widgets nav={nav} />);
      if (wk === 'example') {
        for (const id of someColleges) {
          run(`${L} College ${id}`, <College nav={nav} params={{ id }} />);
          run(`${L} Visit ${id}`, <Visit nav={nav} params={{ id }} />);
        }
      }
    }
    globalThis.__state = { ready: true, week: [], profile: { ...profile, onboarded: false } };
    for (const s of STEPS) if (s !== 'loading') run(`${scheme}/${vk} Quiz ${s}`, <Quiz initialStep={s} />);
  }
}
console.log(`${n - fails}/${n} renders passed`);
process.exit(fails ? 1 : 0);
