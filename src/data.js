// Example week shown the first time the app opens: a student who plays soccer,
// works as a cashier and studies for the SAT. Everything here can be edited or deleted.
export function exampleWeek() {
  const school = (d) => ({ day: d, type: 'school', title: 'School', start: 7.75, end: 15.08, detail: '7 periods' });
  const practice = (d) => ({ day: d, type: 'practice', title: 'Soccer practice', start: 5.75, end: 7.25, detail: 'Field 2' });
  const w = [
    practice(0), school(0), { day: 0, type: 'study', title: 'SAT Math practice', start: 19, end: 20, detail: 'Linear equations' },
    practice(1), { ...school(1), detail: 'Chem quiz 3rd period' },
    { day: 1, type: 'work', title: 'Shift · cashier', start: 16, end: 21 },
    { day: 1, type: 'study', title: 'SAT Reading', start: 21.5, end: 22, detail: '1 timed passage set' },
    school(2), { day: 2, type: 'work', title: 'Shift · cashier', start: 16, end: 21 },
    practice(3), school(3), { day: 3, type: 'work', title: 'Shift · cashier', start: 16, end: 20 },
    school(4), { day: 4, type: 'practice', title: 'Soccer game', start: 17, end: 21.5, detail: 'Home game' },
    { day: 5, type: 'work', title: 'Shift · cashier', start: 9, end: 17 },
    { day: 6, type: 'free', title: 'Friends & family', start: 9, end: 12, detail: 'Protected time' },
    { day: 6, type: 'study', title: 'SAT practice test', start: 14, end: 16 },
  ];
  return w.map((b, i) => ({ id: 'ex' + i, done: false, ...b }));
}

export const defaultGoals = { studyHours: 5, gymDays: 3 };
