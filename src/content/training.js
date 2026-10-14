export const SPLITS = {
  fb2: { name: 'Full body ×2', cat: 'lift', days: ['Full body A', 'Full body B'] },
  fb3: { name: 'Full body ×3', cat: 'lift', days: ['Full body A', 'Full body B', 'Full body A'] },
  ppl3: { name: 'Push / Pull / Legs', cat: 'lift', days: ['Push', 'Pull', 'Legs'] },
  ulf3: { name: 'Upper / Lower / Full', cat: 'lift', days: ['Upper', 'Lower', 'Full body'] },
  arnold3: { name: 'Arnold split', cat: 'lift', days: ['Chest & back', 'Shoulders & arms', 'Legs'] },
  ul4: { name: 'Upper / Lower', cat: 'lift', days: ['Upper', 'Lower', 'Upper', 'Lower'] },
  phul4: { name: 'PHUL (power + size)', cat: 'lift', days: ['Upper power', 'Lower power', 'Upper size', 'Lower size'] },
  bro5: { name: 'Bro split', cat: 'lift', days: ['Chest', 'Back', 'Shoulders', 'Arms', 'Legs'] },
  ulppl5: { name: 'Upper / Lower + PPL', cat: 'lift', days: ['Upper', 'Lower', 'Push', 'Pull', 'Legs'] },
  ppl6: { name: 'Push / Pull / Legs ×2', cat: 'lift', days: ['Push', 'Pull', 'Legs', 'Push', 'Pull', 'Legs'] },
  arnold6: { name: 'Arnold split ×2', cat: 'lift', days: ['Chest & back', 'Shoulders & arms', 'Legs', 'Chest & back', 'Shoulders & arms', 'Legs'] },
  run3: { name: 'Beginner running', cat: 'cardio', days: ['Easy run', 'Intervals', 'Long run'] },
  run4: { name: 'Running + strength', cat: 'cardio', days: ['Easy run', 'Full body A', 'Intervals', 'Long run'] },
  hybrid4: { name: 'Hybrid: lift + cardio', cat: 'cardio', days: ['Upper', 'Cardio', 'Lower', 'Cardio'] },
  cardio3: { name: 'Cardio & conditioning', cat: 'cardio', days: ['Cardio', 'Intervals', 'Cardio'] },
  body3: { name: 'Bodyweight at home', cat: 'other', days: ['Bodyweight A', 'Bodyweight B', 'Bodyweight A'] },
  cond3: { name: 'Sports conditioning', cat: 'other', days: ['Speed & agility', 'Full body A', 'Conditioning'] },
};
export const SPLIT_CATS = [['lift', 'Lifting'], ['cardio', 'Running & cardio'], ['other', 'Home & sports']];
export const PATTERN = { 1: [2], 2: [1, 5], 3: [0, 2, 5], 4: [0, 1, 3, 5], 5: [0, 1, 2, 4, 5], 6: [0, 1, 2, 3, 4, 5] };
export const WORKOUT = {
  'Full body A': ['Everything, moderate weight', ['Squats', 'Push-ups or bench press', 'Rows', 'Plank']],
  'Full body B': ['Everything, moderate weight', ['Hip hinge (deadlift or RDL)', 'Overhead press', 'Pull-ups or lat pulldown', 'Lunges']],
  'Full body': ['Everything, moderate weight', ['Squats', 'Push-ups or bench press', 'Rows', 'Plank']],
  Push: ['Chest, shoulders, triceps', ['Bench press', 'Overhead press', 'Incline dumbbell press', 'Triceps dips']],
  Pull: ['Back, biceps', ['Pull-ups or lat pulldown', 'Rows', 'Face pulls', 'Biceps curls']],
  Legs: ['Quads, hamstrings, glutes, calves', ['Squats', 'Romanian deadlift', 'Lunges', 'Calf raises']],
  Upper: ['Chest, back, shoulders, arms', ['Bench press', 'Rows', 'Overhead press', 'Pull-ups']],
  Lower: ['Legs and core', ['Squats', 'Hip hinge', 'Split squats', 'Core work']],
  'Upper power': ['Upper body, heavy and low reps', ['Bench press', 'Barbell rows', 'Overhead press']],
  'Lower power': ['Lower body, heavy and low reps', ['Squats', 'Deadlift', 'Leg press']],
  'Upper size': ['Upper body, lighter and more reps', ['Incline dumbbell press', 'Cable rows', 'Lateral raises', 'Curls']],
  'Lower size': ['Lower body, lighter and more reps', ['Front squats', 'Lunges', 'Leg curls', 'Calf raises']],
  Chest: ['Chest', ['Bench press', 'Incline press', 'Flyes', 'Push-ups']],
  Back: ['Back', ['Pull-ups', 'Rows', 'Lat pulldown', 'Back extensions']],
  Shoulders: ['Shoulders', ['Overhead press', 'Lateral raises', 'Rear delt flyes']],
  Arms: ['Biceps, triceps, forearms', ['Curls', 'Triceps pushdowns', 'Hammer curls', 'Dips']],
  'Chest & back': ['Chest and back', ['Bench press', 'Rows', 'Push-ups', 'Pull-ups']],
  'Shoulders & arms': ['Shoulders, biceps, triceps', ['Overhead press', 'Lateral raises', 'Curls', 'Triceps extensions']],
  'Easy run': ['Easy pace, you can still talk', ['20–30 min easy run', 'Walk breaks are fine']],
  Intervals: ['Short fast bursts', ['Warm up 10 min', '6 × 1 min fast, 2 min easy', 'Cool down']],
  'Long run': ['Your longest run of the week', ['30–45 min at an easy pace', 'Add distance slowly']],
  Cardio: ['Heart and lungs', ['20–30 min run, bike, row or swim', 'Keep it steady']],
  Conditioning: ['Game-day stamina', ['Sprints or shuttle runs', 'Jump rope', 'Circuits']],
  'Speed & agility': ['Quickness and footwork', ['Ladder drills', 'Short sprints', 'Cone drills', 'Jumps']],
  'Bodyweight A': ['Everything, no equipment', ['Push-ups', 'Squats', 'Lunges', 'Plank']],
  'Bodyweight B': ['Everything, no equipment', ['Pike push-ups', 'Glute bridges', 'Burpees', 'Side plank']],
  Workout: ['Lift, run, play or take a class', ['Warm up 5–10 minutes', 'Anything that gets you moving counts']],
};
export const OWN_LABELS = ['Rest', 'Push', 'Pull', 'Legs', 'Upper', 'Lower', 'Full body', 'Chest', 'Back', 'Shoulders', 'Arms', 'Chest & back', 'Easy run', 'Intervals', 'Long run', 'Cardio', 'Workout'];
export const KINDS = ['Lifting', 'Running', 'Cardio & conditioning', 'Bodyweight / home', 'Sports training'];
const LEG_DAYS = /Legs|Lower|Full body|Long run|Intervals|Conditioning|Speed/;

export function gymDays(p) {
  const n = parseInt(p.gym, 10);
  if (n) return n;
  return p.acts.Sports ? 2 : 3;
}
export function recSplit(p) {
  const n = gymDays(p);
  const k = KINDS.filter((x) => p.gymKinds && p.gymKinds[x]);
  const lift = k.includes('Lifting') || !k.length;
  const run = k.includes('Running');
  const cardio = k.includes('Cardio & conditioning');
  if (run && !lift) return { key: n >= 4 ? 'run4' : 'run3', why: 'A simple running week: an easy run, a faster day and a longer run. Add distance slowly from week to week.' };
  if ((run || cardio) && lift) return { key: 'hybrid4', why: 'Mixes lifting and cardio so you build strength and endurance without overdoing either.' };
  if (cardio && !lift) return { key: 'cardio3', why: 'Three cardio days with one harder interval day keeps your heart and lungs in shape.' };
  if (k.includes('Sports training') && !lift) return { key: 'cond3', why: 'Speed, strength and conditioning days built to make you better at your sport.' };
  if (k.includes('Bodyweight / home') && !lift) return { key: 'body3', why: 'No gym needed: push-ups, squats, lunges and core work at home.' };
  if (p.acts.Sports) {
    const key = n <= 2 ? 'fb2' : 'fb3';
    return { key, why: `You play a sport, so ${key === 'fb2' ? '2' : '3'} full-body days keep you strong without wearing out your legs before games. Save a bigger split for the off-season.` };
  }
  const why = {
    2: 'Two full-body days hit every muscle twice a week. Great for starting out.',
    3: 'Three full-body days is the classic starter plan: simple, and every muscle gets worked often.',
    4: 'Upper / Lower gives each muscle two days a week with rest in between.',
    5: 'Five days mixes Upper / Lower with Push / Pull / Legs for more volume.',
    6: 'Push / Pull / Legs twice is a lot. Sleep 8+ hours and keep one full rest day.',
  }[n];
  return { key: { 2: 'fb2', 3: 'fb3', 4: 'ul4', 5: 'ulppl5', 6: 'ppl6' }[n], why };
}
export function curSplitKey(p) {
  return p.splitKey && SPLITS[p.splitKey] ? p.splitKey : recSplit(p).key;
}
export function activeSplit(p) {
  if (p.splitMode === 'own') return p.own.map((label, d) => ({ d, label })).filter((x) => x.label && x.label !== 'Rest');
  if (p.splitMode === 'simple') return PATTERN[gymDays(p)].map((d) => ({ d, label: 'Workout' }));
  const days = SPLITS[curSplitKey(p)].days;
  const pat = PATTERN[days.length];
  return days.map((label, i) => ({ d: pat[i], label }));
}
export function gymWarnings(plan, week, p, DAYS, DAYS_FULL) {
  const w = [];
  const games = [...new Set(week.filter((b) => /game|match|meet/i.test(b.title)).map((b) => b.day))];
  plan.forEach((x) => {
    if (LEG_DAYS.test(x.label) && games.includes((x.d + 1) % 7)) w.push(`${x.label} on ${DAYS_FULL[x.d]} is the day before a game. Tired legs can slow you down, so try moving it.`);
  });
  if (plan.length >= 7) w.push('Seven days a week leaves no time to recover. Muscles grow on rest days, so keep at least one full day off.');
  else if (plan.length >= 6) w.push('Six training days leaves little time to recover. Keep one full rest day and get 8+ hours of sleep.');
  for (let i = 0; i < plan.length; i++) for (let j = 0; j < plan.length; j++) {
    if (i !== j && (plan[i].d + 1) % 7 === plan[j].d && plan[i].label === plan[j].label && !/Workout|Easy run|Cardio/.test(plan[i].label)) {
      w.push(`${plan[i].label} two days in a row (${DAYS[plan[i].d]} and ${DAYS[plan[j].d]}). Give those muscles a day to recover.`);
    }
  }
  if (p.acts.Sports && plan.length > 3) w.push("That's a lot on top of practice. During season, most athletes train 2–3 extra days a week.");
  return [...new Set(w)];
}
export function shuffleSplit(p) {
  const k = KINDS.filter((x) => p.gymKinds && p.gymKinds[x]);
  const cats = new Set();
  if (!k.length || k.includes('Lifting')) cats.add('lift');
  if (k.includes('Running') || k.includes('Cardio & conditioning')) cats.add('cardio');
  if (k.includes('Bodyweight / home') || k.includes('Sports training')) cats.add('other');
  const cur = curSplitKey(p);
  const pool = Object.keys(SPLITS).filter((x) => cats.has(SPLITS[x].cat) && x !== cur && (!p.acts.Sports || SPLITS[x].days.length <= 4));
  return pool[Math.floor(Math.random() * pool.length)] || 'fb3';
}
