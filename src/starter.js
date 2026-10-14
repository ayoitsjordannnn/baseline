// Builds a first week from the setup quiz answers. Everything it adds can be edited or deleted.
import { gaps, dayBlocks, findSlot, isProtected, newId } from './logic';
import { activeSplit, WORKOUT } from './content/training';
import { recHours, hasJob } from './content/quiz';

export function starterWeek(p) {
  const w = [];
  const add = (b) => w.push({ id: newId(), done: false, ...b });
  const sports = !!p.acts.Sports;
  for (let d = 0; d < 5; d++) {
    if (sports && (d === 0 || d === 2)) add({ day: d, type: 'practice', title: 'Morning practice', start: 5.75, end: 7.25 });
    add({ day: d, type: 'school', title: 'School', start: 7.75, end: 15.08 });
    if (sports && d < 4) add({ day: d, type: 'practice', title: 'Practice', start: 15.5, end: 17.5 });
    if (sports && d === 4) add({ day: d, type: 'practice', title: 'Game', start: 17, end: 20.5 });
  }
  if (p.acts.Clubs) add({ day: 1, type: 'school', title: 'Club meeting', start: sports ? 7 : 15.5, end: sports ? 7.75 : 16.5 });
  if (p.acts['Band / music'] || p.acts['Theater / choir']) add({ day: 3, type: 'school', title: p.acts['Band / music'] ? 'Band rehearsal' : 'Rehearsal', start: sports ? 18 : 15.5, end: sports ? 19.5 : 17.5 });
  if (p.acts['Church / youth group']) add({ day: 6, type: 'free', title: 'Church', start: 10, end: 12 });
  if (p.acts.Volunteering) add({ day: 5, type: 'free', title: 'Volunteering', start: 9, end: 11, detail: 'Log your hours for applications' });

  if (hasJob(p)) {
    let shifts = 0;
    [1, 3, 5, 6, 2, 0, 4].forEach((d) => {
      if (!p.can[d] || shifts >= 3) return;
      const weekend = d >= 5;
      const start = weekend ? 10 : sports ? 18 : 16;
      const end = weekend ? 16 : 21;
      const clash = dayBlocks(w, d).some((b) => b.type !== 'free' && b.start < end && start < b.end);
      if (clash) return;
      add({ day: d, type: 'work', title: p.acts['A job'] ? 'Shift' : 'Side hustle', start, end });
      shifts++;
    });
  }

  if (p.acts['Gym / working out']) {
    activeSplit(p).forEach((x) => {
      const s = findSlot(w, x.d, 1, p.protect);
      if (s != null) add({ day: x.d, type: 'gym', title: x.label === 'Workout' ? 'Workout' : `Gym · ${x.label}`, start: s, end: s + 1, auto: true, detail: (WORKOUT[x.label] || WORKOUT.Workout)[0] });
    });
  }

  const goal = p.hours || recHours(p).h;
  let need = goal;
  const title = ['11th', '12th'].includes(p.grade) && p.test !== 'done' ? 'SAT practice' : 'Study session';
  for (const d of [0, 1, 2, 3, 6, 5, 4]) {
    if (need <= 0) break;
    const dur = d >= 5 ? Math.min(2, need) : Math.min(1, need);
    const g = gaps(dayBlocks(w, d), d >= 5 ? 13 : 19, 22, dur).find((x) => !isProtected(p.protect, d, x.start, x.start + dur));
    if (!g) continue;
    add({ day: d, type: 'study', title, start: g.start, end: g.start + dur });
    need -= dur;
  }
  return w;
}
