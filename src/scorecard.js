import { SCORECARD_API_KEY } from './config';

// U.S. Department of Education College Scorecard API.
const BASE = 'https://api.data.gov/ed/collegescorecard/v1/schools';
const FIELDS = [
  'school.name', 'school.city', 'school.state', 'school.school_url', 'school.price_calculator_url',
  'latest.admissions.admission_rate.overall', 'latest.admissions.sat_scores.average.overall',
  'latest.cost.tuition.in_state', 'latest.cost.tuition.out_of_state',
  'latest.cost.avg_net_price.public', 'latest.cost.avg_net_price.private', 'latest.student.size',
].join(',');
const cache = {};

export const hasScorecard = () => !!SCORECARD_API_KEY;

export async function fetchScorecard(c) {
  if (!SCORECARD_API_KEY) return null;
  if (cache[c.id] !== undefined) return cache[c.id];
  try {
    const url = `${BASE}?api_key=${encodeURIComponent(SCORECARD_API_KEY)}&school.name=${encodeURIComponent(c.full)}&school.state=${c.st}&fields=${FIELDS}&per_page=5`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(String(res.status));
    const json = await res.json();
    const r = (json.results || [])[0];
    if (!r) { cache[c.id] = null; return null; }
    const g = (k) => (r[k] === undefined ? null : r[k]);
    const out = {
      name: g('school.name'),
      url: g('school.school_url'),
      calc: g('school.price_calculator_url'),
      admit: g('latest.admissions.admission_rate.overall'),
      sat: g('latest.admissions.sat_scores.average.overall'),
      inState: g('latest.cost.tuition.in_state'),
      outState: g('latest.cost.tuition.out_of_state'),
      net: g('latest.cost.avg_net_price.public') ?? g('latest.cost.avg_net_price.private'),
      size: g('latest.student.size'),
    };
    cache[c.id] = out;
    return out;
  } catch (e) {
    return null;
  }
}
export const fullUrl = (u) => (!u ? null : /^https?:\/\//.test(u) ? u : `https://${u}`);
