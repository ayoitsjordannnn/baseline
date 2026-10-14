// Pure planner logic. No React Native imports here, so it can be tested with plain Node.

export const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export const DAYS_FULL = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const DAY_START = 5; // timeline starts 5 AM
export const DAY_END = 23; // and ends 11 PM

export function fmtTime(h) {
  let hh = Math.floor(h);
  let mm = Math.round((h - hh) * 60);
  if (mm === 60) { hh += 1; mm = 0; }
  const ap = hh >= 12 && hh < 24 ? 'PM' : 'AM';
  let h12 = hh % 12;
  if (h12 === 0) h12 = 12;
  return `${h12}:${String(mm).padStart(2, '0')} ${ap}`;
}
export function fmtShort(h) {
  return fmtTime(h).replace(':00', '').replace(' AM', 'a').replace(' PM', 'p');
}
export function fmtDur(v) {
  const h = Math.floor(v + 1e-6);
  const m = Math.round((v - h) * 60);
  if (h && m) return `${h}h ${m}m`;
  if (h) return `${h}h`;
  return `${m}m`;
}
export function fmtRange(a, b) {
  const sameHalf = (a < 12) === (b < 12);
  return `${sameHalf ? fmtTime(a).replace(/ (AM|PM)$/, '') : fmtTime(a)}–${fmtTime(b)}`;
}
export const snap = (h, step = 0.25) => Math.round(h / step) * step;
export const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

// Monday of the week containing `date`.
export function weekStart(date = new Date()) {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const dow = (d.getDay() + 6) % 7; // 0 = Monday
  d.setDate(d.getDate() - dow);
  return d;
}
export function dateOf(start, i) {
  const d = new Date(start);
  d.setDate(d.getDate() + i);
  return d;
}
export const todayIndex = (date = new Date()) => (date.getDay() + 6) % 7;
export const nowHours = (date = new Date()) => date.getHours() + date.getMinutes() / 60;

export function dayBlocks(week, day) {
  return week.filter((b) => b.day === day).sort((a, b) => a.start - b.start || a.end - b.end);
}
export function overlaps(week, day, start, end, excludeId) {
  return week.filter((b) => b.day === day && b.id !== excludeId && b.type !== 'free' && b.start < end && start < b.end);
}

// Free windows of at least `min` hours between `from` and `to`.
export function gaps(blocks, from = 6, to = 22.5, min = 0.5) {
  const busy = blocks.filter((b) => b.end > from && b.start < to).map((b) => [Math.max(from, b.start), Math.min(to, b.end)]).sort((a, b) => a[0] - b[0]);
  const out = [];
  let cur = from;
  for (const [s, e] of busy) {
    if (s - cur >= min) out.push({ start: cur, end: s });
    cur = Math.max(cur, e);
  }
  if (to - cur >= min) out.push({ start: cur, end: to });
  return out;
}

export function bookedHours(blocks) {
  return blocks.filter((b) => b.type !== 'free').reduce((a, b) => a + (b.end - b.start), 0);
}
export function loadLabel(h) {
  if (h < 4) return { label: 'Chill', level: 0 };
  if (h < 8) return { label: 'Steady', level: 1 };
  if (h < 12) return { label: 'Busy', level: 2 };
  return { label: 'Packed', level: 3 };
}
export function weekTotals(week) {
  const t = { school: 0, work: 0, practice: 0, study: 0, gym: 0 };
  week.forEach((b) => { if (t[b.type] !== undefined) t[b.type] += b.end - b.start; });
  return t;
}
// Rough sleep window: from the last thing tonight to the first thing tomorrow.
export function sleepWindow(week, day) {
  const tonight = dayBlocks(week, day).filter((b) => b.type !== 'free');
  const tomorrow = dayBlocks(week, (day + 1) % 7).filter((b) => b.type !== 'free');
  const last = tonight.length ? Math.max(...tonight.map((b) => b.end)) : 22;
  const first = tomorrow.length ? tomorrow[0].start : 8;
  const bed = Math.max(last + 0.5, 21.5);
  return Math.max(0, 24 - bed + first - 0.5);
}
export function nextUp(blocks, now) {
  return blocks.find((b) => b.type !== 'free' && b.end > now && !b.done) || null;
}

// What to suggest for an open gap.
export function suggestion(gap, totals, goals) {
  const len = gap.end - gap.start;
  if (totals.study < goals.studyHours && len >= 0.5) return { type: 'study', title: 'Study session', dur: Math.min(1, len) };
  if (goals.gymDays && totals.gym < goals.gymDays && len >= 1) return { type: 'gym', title: 'Workout', dur: 1 };
  return { type: 'free', title: 'Free time', dur: Math.min(1, len) };
}

export const PRESETS = [
  { k: 'practice', label: 'Practice', type: 'practice', title: 'Practice', start: 15.5, dur: 2 },
  { k: 'game', label: 'Game', type: 'practice', title: 'Game', start: 17, dur: 3 },
  { k: 'work', label: 'Work shift', type: 'work', title: 'Shift', start: 16, dur: 5 },
  { k: 'gym', label: 'Gym', type: 'gym', title: 'Workout', start: 6, dur: 1 },
  { k: 'study', label: 'Study', type: 'study', title: 'Study session', start: 19, dur: 1 },
  { k: 'homework', label: 'Homework', type: 'school', title: 'Homework', start: 20, dur: 1 },
  { k: 'club', label: 'Club', type: 'school', title: 'Club meeting', start: 15.5, dur: 1 },
  { k: 'hang', label: 'Hang out', type: 'free', title: 'Hang out', start: 19, dur: 3 },
  { k: 'appt', label: 'Appointment', type: 'free', title: 'Appointment', start: 16, dur: 1 },
];

// "practice mon wed 4-6" -> partial draft. Only fields it finds are returned.
export function parseQuick(text, currentDay = 0) {
  const t = String(text || '').toLowerCase();
  const out = {};
  if (!t.trim()) return out;
  const map = [
    [/\b(gym|lift|lifting|workout|weights|leg day|push day|pull day|cardio|run)\b/, 'gym'],
    [/\b(practice|training)\b/, 'practice'],
    [/\b(game|match|meet|tournament)\b/, 'game'],
    [/\b(work|shift)\b/, 'work'],
    [/\b(study|sat|act|psat|prep|tutor)\b/, 'study'],
    [/\b(homework|hw|project|essay)\b/, 'homework'],
    [/\b(club|meeting|deca|nhs|council|band|choir|rehearsal)\b/, 'club'],
    [/\b(hang|friends|movie|party|date)\b/, 'hang'],
    [/\b(appointment|appt|doctor|dentist|lesson)\b/, 'appt'],
  ];
  const hit = map.find(([r]) => r.test(t));
  if (hit) {
    const p = PRESETS.find((x) => x.k === hit[1]);
    Object.assign(out, { preset: p.k, type: p.type, dur: p.dur, start: p.start, title: p.title });
  }
  const dayRx = [[/\bmon(day)?s?\b/, 0], [/\btue(s|sday)?s?\b/, 1], [/\bwed(nesday)?s?\b/, 2], [/\bthu(r|rs|rsday)?s?\b/, 3], [/\bfri(day)?s?\b/, 4], [/\bsat(urday)?s?\b(?!\s*(prep|test|practice))/, 5], [/\bsun(day)?s?\b/, 6]];
  let days = [];
  dayRx.forEach(([r, i]) => { if (r.test(t)) days.push(i); });
  if (/\bweekdays?\b/.test(t)) days = [0, 1, 2, 3, 4];
  if (/\bweekends?\b/.test(t)) days = [5, 6];
  if (/\b(every ?day|daily)\b/.test(t)) days = [0, 1, 2, 3, 4, 5, 6];
  if (/\btomorrow\b/.test(t)) days = [(currentDay + 1) % 7];
  if (/\btoday\b/.test(t)) days = [currentDay];
  if (days.length) out.days = [...new Set(days)];
  const morning = /\b(morning|am)\b/.test(t);
  const toH = (h, m, ap) => {
    h = +h; m = +(m || 0);
    if (ap) { ap = ap[0]; if (ap === 'p' && h < 12) h += 12; if (ap === 'a' && h === 12) h = 0; }
    else if (!morning && h >= 1 && h <= 11 && !(h >= 5 && h <= 7 && (out.type === 'practice' || out.type === 'gym'))) h += 12;
    return h + m / 60;
  };
  const r = t.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm|a|p)?\s*(?:-|–|to)\s*(\d{1,2})(?::(\d{2}))?\s*(am|pm|a|p)?/);
  if (r) {
    const ap1 = r[3] || (r[6] && +r[1] < +r[4] ? r[6] : null);
    let s = toH(r[1], r[2], ap1);
    let e = toH(r[4], r[5], r[6] || r[3]);
    if (e <= s) e += 12;
    if (e > 24) e -= 12;
    if (e > s) { out.start = s; out.dur = e - s; }
  } else {
    const one = t.match(/\b(\d{1,2})(?::(\d{2}))?\s*(am|pm|a|p)\b|\bat\s+(\d{1,2})(?::(\d{2}))?/);
    if (one) out.start = one[1] ? toH(one[1], one[2], one[3]) : toH(one[4], one[5], null);
  }
  const left = t
    .replace(/\d{1,2}(:\d{2})?\s*(am|pm|a|p)?\s*(-|–|to)?\s*(\d{1,2}(:\d{2})?\s*(am|pm|a|p)?)?/g, ' ')
    .replace(/\b(mon|tue|tues|wed|thu|thur|thurs|fri|sat|sun)(day|nesday|rsday|urday|sday)?s?\b|\b(at|on|from|and|every|weekly|weekdays?|weekends?|daily|tomorrow|today|morning)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (left.length > 2) out.title = left.replace(/^./, (c) => c.toUpperCase());
  return out;
}

let idCounter = Date.now();
export const newId = () => 'b' + (idCounter++).toString(36);

// Times a student asked Baseline to keep free: [day (-1 = every weeknight), start, end].
export const PROTECT_WINDOWS = { 'Friday nights': [4, 18, 24], 'Saturday daytime': [5, 9, 17], 'Saturday nights': [5, 18, 24], 'Sunday mornings': [6, 6, 12], 'Sunday afternoons': [6, 12, 18], 'Weeknights after 9': [-1, 21, 24] };
export function isProtected(protect, d, s, e) {
  return Object.keys(protect || {}).some((k) => {
    if (!protect[k] || !PROTECT_WINDOWS[k]) return false;
    const [pd, ps, pe] = PROTECT_WINDOWS[k];
    return (pd === d || (pd === -1 && d < 5)) && s < pe && ps < e;
  });
}
// An open slot for a workout: after the day's commitments, else early morning. Null if the day is full.
export function findSlot(week, d, dur = 1, protect) {
  const ok = (g) => !isProtected(protect, d, g.start, g.start + dur);
  const g = gaps(dayBlocks(week, d), d >= 5 ? 8 : 15.25, 21.5, dur).filter(ok);
  if (g.length) return g[0].start;
  const early = gaps(dayBlocks(week, d), 5.5, 7.5, dur).filter(ok);
  return early.length ? early[0].start : null;
}
