export const ACTS = ['Sports', 'A job', 'Gym / working out', 'Clubs', 'Volunteering', 'Band / music', 'Theater / choir', 'Art', 'Church / youth group', 'Watching siblings', 'Tutoring', 'Dual credit', 'Side hustle', 'Nothing yet'];
export const PROTECT = ['Friday nights', 'Saturday daytime', 'Saturday nights', 'Sunday mornings', 'Sunday afternoons', 'Weeknights after 9'];
export const GRADE_NAME = { '9th': 'Freshman', '10th': 'Sophomore', '11th': 'Junior', '12th': 'Senior' };
export const SAVING_LABEL = { car: 'First car', family: 'Helping my family', college: 'College fund', spending: 'Spending money', bills: 'Phone and bills' };
export const AFTER_LABEL = { '4yr': 'A 4-year college', cc: 'Community college first', trade: 'Trade school', military: 'Military', work: 'Start working', unsure: 'Not sure yet' };

export const Q = {
  grade: { title: 'What grade are you in?', grid: true, opts: [['9th', 'Freshman'], ['10th', 'Sophomore'], ['11th', 'Junior'], ['12th', 'Senior']] },
  gym: { title: 'How many days a week do you want to train?', sub: 'Baseline suggests a split that fits around sports, work and rest.', grid: true, opts: [['2', 'days a week'], ['3', 'days a week'], ['4', 'days a week'], ['5', 'days a week'], ['6', 'days a week'], ['?', 'Not sure, help me pick']] },
  gymplan: { title: 'Do you have a workout split?', sub: 'A split is how you divide your workouts across the week.', opts: [['own', 'I have my own split', "You'll type it in after setup"], ['help', 'Help me build one', 'Baseline recommends a split'], ['simple', 'Keep it simple', 'Just put "Workout" on my calendar']] },
  saving: { title: 'What are you working toward?', sub: 'Baseline can track your money goal next to your hours.', opts: [['car', 'A car', 'Payment, gas and insurance'], ['family', 'Helping my family'], ['college', 'Saving for college'], ['spending', 'Spending money'], ['bills', 'Phone and bills'], ['none', 'Not saving yet']] },
  after: { title: 'What are you thinking after high school?', sub: 'No wrong answers. You can change this anytime.', opts: [['4yr', 'A 4-year college'], ['cc', 'Community college first'], ['trade', 'Trade school'], ['military', 'Military'], ['work', 'Start working'], ['unsure', 'Not sure yet', 'You\'ll see every path']] },
  branch: { title: 'Which branch are you interested in?', opts: [['army', 'Army'], ['navy', 'Navy'], ['airforce', 'Air Force'], ['marines', 'Marine Corps'], ['coast', 'Coast Guard'], ['space', 'Space Force'], ['unsure', 'Not sure yet']] },
  milpay: { title: 'Do you want the military to help pay for school?', opts: [['rotc', 'Yes, through ROTC in college'], ['academy', 'Yes, at a service academy', 'Like West Point or the Naval Academy'], ['gi', 'Yes, after I serve', 'With the GI Bill'], ['maybe', 'Maybe, tell me more'], ['no', 'No, I just want to serve']] },
  trade: { title: 'Which trade interests you?', opts: [['hvac', 'HVAC'], ['elec', 'Electrician'], ['plumb', 'Plumbing'], ['weld', 'Welding'], ['auto', 'Automotive'], ['cosmo', 'Cosmetology'], ['med', 'Medical (CNA, medical assistant)'], ['build', 'Construction and carpentry'], ['unsure', 'Not sure yet']] },
  major: { title: 'What are you interested in studying?', opts: [['cs', 'Computer science'], ['eng', 'Engineering'], ['bus', 'Business'], ['health', 'Health and nursing'], ['arts', 'Arts and design'], ['edu', 'Education'], ['undecided', 'Not sure yet']] },
  budget: { title: 'How much can your family pay for college each year?', sub: "Be honest. Baseline uses this to show schools that won't break the bank.", opts: [['low', 'Very little or nothing', 'Show me the cheapest paths and aid'], ['mid', 'Some, but cost really matters'], ['high', "Cost isn't a big worry"], ['unknown', 'Not sure yet']] },
  test: { title: 'Where are you with the SAT or ACT?', opts: [['none', "Haven't taken anything yet"], ['psat', 'Took the PSAT'], ['taken', 'Took the SAT or ACT', 'Want to raise my score'], ['done', "Took it and I'm happy with my score"]] },
};

export const STATES = { AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California', CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', DC: 'Washington, D.C.', FL: 'Florida', GA: 'Georgia', HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois', IN: 'Indiana', IA: 'Iowa', KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana', ME: 'Maine', MD: 'Maryland', MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota', MS: 'Mississippi', MO: 'Missouri', MT: 'Montana', NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire', NJ: 'New Jersey', NM: 'New Mexico', NY: 'New York', NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio', OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania', RI: 'Rhode Island', SC: 'South Carolina', SD: 'South Dakota', TN: 'Tennessee', TX: 'Texas', UT: 'Utah', VT: 'Vermont', VA: 'Virginia', WA: 'Washington', WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming' };

export function defaultProfile() {
  const acts = {};
  ACTS.forEach((a) => { acts[a] = false; });
  return {
    onboarded: false, grade: null, acts, gym: null, gymKinds: {}, gymplan: null, saving: null, after: null, branch: null, milpay: null, trade: null,
    major: null, budget: null, test: null, gpa: 3.5, gpaUnsure: false, scoreType: null, sat: 1100, act: 22, state: 'TX', hours: null, hoursTouched: false, protect: {},
    splitMode: 'rec', splitKey: null, own: ['Push', 'Rest', 'Pull', 'Rest', 'Legs', 'Rest', 'Rest'],
    saved: ['uw', 'utd', 'dallas'], costCap: 0, discover: 'real', pathView: 'college', explore: false,
    milSteps: {}, fafsa: { steps: {}, submitted: false, snooze: 0 }, plan: 'balanced', can: [false, true, true, true, false, true, false],
    satFocus: 'math', satDone: {}, transcript: null, tScen: 3.7, visitAdded: {},
  };
}

export const collegeBound = (p) => ['4yr', 'cc', 'unsure'].includes(p.after);
export const hasJob = (p) => p.acts['A job'] || p.acts['Side hustle'];
export const fafsaRelevant = (p) => collegeBound(p) || p.milpay === 'rotc' || p.after === 'trade';

export function recHours(p) {
  if (!collegeBound(p)) return { h: 2, why: 'A lighter plan for tough classes fits your path.' };
  let h = { '9th': 2, '10th': 3, '11th': 5, '12th': 4 }[p.grade] || 3;
  const r = [`${GRADE_NAME[p.grade] || 'Your'} year`];
  if ((p.grade === '11th' || p.grade === '12th') && p.test === 'taken') { h += 1; r.push('raising your score'); }
  if (p.test === 'done') { h = Math.max(2, h - 2); r.push('your score is set'); }
  const busy = (p.acts.Sports ? 1 : 0) + (hasJob(p) ? 1 : 0) + (p.acts.Clubs ? 1 : 0);
  if (busy >= 2) { h = Math.max(2, h - 1); r.push('a busy week'); }
  return { h, why: 'Based on: ' + r.join(', ') + '.' };
}

export function questionVisible(id, p) {
  if (id === 'gym' || id === 'gymkind' || id === 'gymplan') return !!p.acts['Gym / working out'];
  if (id === 'saving') return hasJob(p);
  if (id === 'branch' || id === 'milpay') return p.after === 'military';
  if (id === 'trade') return p.after === 'trade';
  if (id === 'major' || id === 'budget') return collegeBound(p);
  return true;
}
export const STEPS = ['intro', 'grade', 'acts', 'gym', 'gymkind', 'gymplan', 'saving', 'after', 'branch', 'milpay', 'trade', 'major', 'budget', 'test', 'stats', 'hours', 'protect', 'pep', 'loading', 'summary'];
export const QUESTION_STEPS = STEPS.filter((s) => !['intro', 'pep', 'loading', 'summary'].includes(s));

// School-year position from today's date (most U.S. schools start mid-August).
export function schoolWeek(now = new Date()) {
  const y = now.getMonth() >= 7 ? now.getFullYear() : now.getFullYear() - 1;
  const start = new Date(y, 7, 13);
  const end = new Date(y + 1, 4, 28);
  if (now < start || now > end) return { summer: true, week: 0 };
  return { week: Math.min(36, Math.floor((now - start) / (7 * 864e5)) + 1), sem: now.getMonth() >= 7 ? 'Fall semester' : 'Spring semester' };
}
export function fafsaOpenDate(p, now = new Date()) {
  // FAFSA opens Oct 1 each year for the next school year; seniors file in the fall of senior year.
  const g = { '9th': 9, '10th': 10, '11th': 11, '12th': 12 }[p.grade] || 12;
  const seniorFall = (now.getMonth() >= 7 ? now.getFullYear() : now.getFullYear() - 1) + (12 - g);
  return new Date(seniorFall, 9, 1);
}
