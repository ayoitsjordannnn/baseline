// Unit tests for the planner math. Run: npm test
import assert from 'node:assert/strict';
import { parseQuick, gaps, fmtTime, fmtDur, overlaps, loadLabel, findSlot, isProtected, weekTotals, nextUp } from '../src/logic';
import { fitFor, COLLEGES, satEq, costOf } from '../src/content/colleges';
import { defaultProfile, recHours, questionVisible, fafsaOpenDate } from '../src/content/quiz';
import { activeSplit, recSplit, gymWarnings } from '../src/content/training';
import { starterWeek } from '../src/starter';
import { gpaOf } from '../src/screens/Transcript';

let n = 0;
const test = (name, fn) => { try { fn(); n++; } catch (e) { console.log(`FAIL ${name}\n  ${e.message}`); process.exitCode = 1; } };

test('parse practice range', () => {
  const r = parseQuick('practice mon wed 4-6');
  assert.equal(r.type, 'practice'); assert.deepEqual(r.days, [0, 2]); assert.equal(r.start, 16); assert.equal(r.dur, 2);
});
test('parse early practice stays AM', () => { assert.equal(parseQuick('practice 6-7:30 tue').start, 6); });
test('parse work weekends', () => { const r = parseQuick('work weekends 10am-4pm'); assert.deepEqual(r.days, [5, 6]); assert.equal(r.start, 10); assert.equal(r.dur, 6); });
test('parse SAT is study, not Saturday', () => { const r = parseQuick('sat prep thursday 7pm'); assert.equal(r.type, 'study'); assert.deepEqual(r.days, [3]); assert.equal(r.start, 19); });
test('parse tomorrow', () => { assert.deepEqual(parseQuick('gym tomorrow', 6).days, [0]); });
test('gaps', () => {
  const g = gaps([{ start: 8, end: 15 }, { start: 16, end: 18 }], 6, 22, 0.5);
  assert.deepEqual(g, [{ start: 6, end: 8 }, { start: 15, end: 16 }, { start: 18, end: 22 }]);
});
test('format', () => { assert.equal(fmtTime(13.5), '1:30 PM'); assert.ok(fmtDur(1.5).length > 0); });
test('free blocks never conflict', () => {
  const w = [{ id: 'a', day: 0, type: 'free', start: 9, end: 12 }, { id: 'b', day: 0, type: 'work', start: 13, end: 15 }];
  assert.equal(overlaps(w, 0, 10, 11).length, 0); assert.equal(overlaps(w, 0, 14, 16).length, 1);
});
test('load labels', () => { assert.equal(loadLabel(2).label, 'Chill'); assert.equal(loadLabel(13).label, 'Packed'); });
test('protected time', () => {
  assert.ok(isProtected({ 'Weeknights after 9': true }, 2, 21, 22));
  assert.ok(!isProtected({ 'Weeknights after 9': true }, 5, 21, 22));
  assert.ok(isProtected({ 'Friday nights': true }, 4, 19, 20));
});
test('findSlot skips busy time', () => {
  const w = [{ day: 0, type: 'school', start: 7.75, end: 15.08 }, { day: 0, type: 'work', start: 16, end: 21 }];
  const s = findSlot(w, 0, 1);
  assert.ok(s != null && (s + 1 <= 16 || s >= 21 || s + 1 <= 7.75));
});
test('nextUp skips done', () => {
  const b = [{ type: 'school', start: 8, end: 15, done: true }, { type: 'work', start: 16, end: 20, done: false }];
  assert.equal(nextUp(b, 9).type, 'work');
});
test('UW CS is a far reach for an average student, likely for community college', () => {
  const p = { ...defaultProfile(), gpa: 3.2, scoreType: 'sat', sat: 1050, state: 'TX', major: 'cs' };
  assert.equal(fitFor(COLLEGES.uw, p), 'Far reach');
  assert.equal(fitFor(COLLEGES.dallas, p), 'Likely');
});
test('in-state is cheaper', () => {
  assert.ok(costOf(COLLEGES.utd, 'TX').amt < costOf(COLLEGES.utd, 'CA').amt);
});
test('ACT converts to SAT', () => { assert.ok(satEq({ scoreType: 'act', act: 30 }) > 1300); assert.equal(satEq({ scoreType: null }), null); });
test('study hours: junior raising score gets more', () => {
  const p = { ...defaultProfile(), grade: '11th', after: '4yr', test: 'taken' };
  assert.ok(recHours(p).h >= 5);
});
test('quiz branches', () => {
  const p = { ...defaultProfile(), after: 'military' };
  assert.ok(questionVisible('branch', p)); assert.ok(!questionVisible('major', p));
});
test('FAFSA date: freshman in Oct 2026 opens Oct 2029', () => {
  const d = fafsaOpenDate({ grade: '9th' }, new Date(2026, 9, 14));
  assert.equal(d.getFullYear(), 2029); assert.equal(d.getMonth(), 9);
});
test('own split keeps typed names, drops rest days', () => {
  const p = { ...defaultProfile(), splitMode: 'own', own: ['Glutes & abs', 'Rest', 'Pull', '', 'Legs', 'Rest', 'Rest'] };
  assert.deepEqual(activeSplit(p).map((x) => x.label), ['Glutes & abs', 'Pull', 'Legs']);
});
test('athletes get a lighter split', () => {
  const p = { ...defaultProfile(), gym: '5', acts: { ...defaultProfile().acts, Sports: true } };
  assert.equal(recSplit(p).key, 'fb3');
});
test('leg day before a game warns', () => {
  const plan = [{ d: 3, label: 'Legs' }];
  const w = gymWarnings(plan, [{ day: 4, title: 'Soccer game' }], defaultProfile(), ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']);
  assert.ok(w.some((x) => /before a game/.test(x)));
});
test('starter week has no overlapping commitments and hits study goal', () => {
  const acts = { ...defaultProfile().acts, Sports: true, 'A job': true, 'Gym / working out': true, Clubs: true, 'Band / music': true };
  const p = { ...defaultProfile(), grade: '11th', after: '4yr', test: 'taken', acts, gym: '4', hours: 5, protect: { 'Friday nights': true } };
  const w = starterWeek(p);
  for (const b of w) assert.equal(overlaps(w.filter((x) => x !== b), b.day, b.start, b.end).length, 0, `${b.title} on day ${b.day} overlaps`);
  assert.ok(weekTotals(w).study >= 4, 'study hours placed');
  assert.ok(w.every((b) => b.type !== 'study' || !isProtected(p.protect, b.day, b.start, b.end)));
});
test('GPA math', () => {
  const c = [{ grade: 'A', level: 'ap' }, { grade: 'B', level: 'reg' }];
  assert.equal(gpaOf(c, false), 3.5); assert.equal(gpaOf(c, true), 4);
});
console.log(`${n} logic tests passed`);
