import React, { useEffect, useMemo, useState } from 'react';
import { Linking, Pressable, Text, TextInput, View } from 'react-native';
import { useTheme, font } from '../theme';
import { useStore } from '../store';
import { Screen, Pad, Row, H1, Eyebrow, Txt, Card, Chip, Seg, Btn, Bar, Icon, Emblem, CampusArt, FitPill, Pill, TopBar, tap, yay, useToast } from '../ui';
import { COLLEGE_LIST, COLLEGES, TIER, MAJOR_CODE, MAJOR_NAME, MAJOR_BY_CODE, CS_HARD, costOf, fmtK, dollarSigns, satEq, fitFor, okFit } from '../content/colleges';
import { STATES } from '../content/quiz';
import { FafsaBanner } from './Fafsa';
import { fetchScorecard, fullUrl, hasScorecard } from '../scorecard';
import { DAYS, DAYS_FULL, fmtTime, fmtRange, overlaps } from '../logic';

function SaveButton({ c }) {
  const t = useTheme();
  const { profile, setProfile } = useStore();
  const toast = useToast();
  const on = profile.saved.includes(c.id);
  return (
    <Pressable
      onPress={() => { yay(); setProfile((p) => ({ saved: on ? p.saved.filter((x) => x !== c.id) : [...p.saved, c.id] })); toast(on ? `Removed ${c.name}.` : `Saved ${c.name} to My colleges.`); }}
      accessibilityRole="button" accessibilityLabel={on ? `Remove ${c.name}` : `Save ${c.name}`} hitSlop={6}
      style={({ pressed }) => ({ width: 44, height: 44, borderRadius: 14, borderWidth: 1, borderColor: on ? t.btn : t.line, backgroundColor: on ? t.btn : t.surface, alignItems: 'center', justifyContent: 'center', transform: [{ scale: pressed ? 0.9 : 1 }] })}>
      <Icon name={on ? 'check' : 'plus'} color={on ? t.btnInk : t.ink} size={20} width={2.6} />
    </Pressable>
  );
}

export function CollegeRow({ c, nav }) {
  const t = useTheme();
  const { profile } = useStore();
  const cost = costOf(c, profile.state);
  return (
    <Card style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 }}>
      <Pressable onPress={() => { tap(); nav.push('college', { id: c.id }); }} style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 }} accessibilityRole="button" accessibilityLabel={`Open ${c.full}`}>
        <Emblem c={c} />
        <View style={{ flex: 1, gap: 3 }}>
          <Text numberOfLines={1} style={{ fontWeight: '800', fontSize: 16, color: t.ink }}>{c.name}</Text>
          <Text numberOfLines={1} style={{ fontSize: 12, color: t.muted }}>{c.city} · ~{fmtK(cost.amt)}/yr · {TIER[c.tier].label}</Text>
          <FitPill fit={fitFor(c, profile)} />
        </View>
      </Pressable>
      <SaveButton c={c} />
    </Card>
  );
}

export function CollegeHub({ nav }) {
  const t = useTheme();
  const { profile } = useStore();
  const sat = satEq(profile);
  const fits = profile.saved.map((id) => fitFor(COLLEGES[id], profile));
  const balanced = fits.some((f) => f.includes('reach') || f === 'Reach') && fits.includes('Target') && fits.includes('Likely');
  const matches = COLLEGE_LIST.filter((c) => okFit(fitFor(c, profile))).length;
  return (
    <>
      <Pad gap={14}>
        <Row style={{ justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <View style={{ flex: 1 }}><Eyebrow>College hub</Eyebrow><H1>My colleges</H1></View>
          <Pressable onPress={() => { tap(); nav.push('discover'); }} accessibilityRole="button" style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: t.btn, borderRadius: 14, paddingHorizontal: 14, minHeight: 46, transform: [{ scale: pressed ? 0.95 : 1 }] })}>
            <Icon name="search" color={t.btnInk} size={18} /><Text style={{ color: t.btnInk, fontWeight: '800' }}>Discover</Text>
          </Pressable>
        </Row>
        <Pressable onPress={() => nav.tab('me')} accessibilityRole="button" accessibilityLabel="Your stats. Tap to edit in your profile."
          style={{ backgroundColor: t.btn, borderRadius: 20, padding: 16, flexDirection: 'row' }}>
          {[[profile.gpaUnsure ? '—' : profile.gpa.toFixed(1), 'GPA'], [sat ? String(profile.scoreType === 'act' ? profile.act : profile.sat) : '—', profile.scoreType === 'act' ? 'ACT' : 'SAT'], [profile.state, 'Home'], [{ cs: 'CS', eng: 'Eng', bus: 'Bus', health: 'Health', arts: 'Art', edu: 'Ed' }[profile.major] || '—', 'Major']].map(([v, l]) => (
            <View key={l} style={{ flex: 1 }}><Text style={{ color: t.btnInk, fontSize: 22, fontWeight: '900' }}>{v}</Text><Text style={{ color: t.btnInk, opacity: 0.7, fontSize: 12 }}>{l}</Text></View>
          ))}
        </Pressable>
        <Text style={{ color: t.soft, fontSize: 14 }}><Text style={{ fontWeight: '800', color: t.ink }}>{matches} colleges</Text> are a target or likely fit for you right now.</Text>
        <FafsaBanner nav={nav} />
        <Row gap={10}>
          <Card style={{ flex: 1 }} onPress={() => nav.push('transcript')}>
            <Icon name="doc" color={t.types.school.c} size={26} />
            <Txt bold>Transcript check</Txt><Txt small muted>See the GPA you can still reach</Txt>
          </Card>
          <Card style={{ flex: 1 }} onPress={() => nav.push('sat')}>
            <Icon name="book" color={t.types.study.c} size={26} />
            <Txt bold>SAT study hub</Txt><Txt small muted>Free official practice</Txt>
          </Card>
        </Row>
        <Eyebrow>Saved</Eyebrow>
      </Pad>
      <Pad gap={14} style={{ marginTop: 12 }}>
        {profile.saved.length ? profile.saved.map((id) => {
          const c = COLLEGES[id];
          const cost = costOf(c, profile.state);
          return (
            <Card key={id} onPress={() => nav.push('college', { id })} style={{ padding: 0, overflow: 'hidden', gap: 0 }}>
              <CampusArt c={c} height={96} />
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 }}>
                <View style={{ marginTop: -36 }}><Emblem c={c} size={54} ring /></View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: '900', fontSize: 18, color: t.ink }}>{c.name}</Text>
                  <Text style={{ fontSize: 13, color: t.muted }}>{c.city} · {c.pub ? (c.st === profile.state ? 'In-state' : 'Out-of-state') : 'Private'} · ~{fmtK(cost.amt)}/yr</Text>
                </View>
                <FitPill fit={fitFor(c, profile)} />
              </View>
            </Card>
          );
        }) : <Card><Txt soft>No colleges saved yet. Tap Discover to search any college.</Txt></Card>}
        {profile.saved.length >= 2 ? <Txt small soft>{balanced ? 'You have reach, target and likely schools. A balanced list keeps you covered.' : 'Try to save at least one reach, one target and one likely school.'}</Txt> : null}
      </Pad>
    </>
  );
}

export function Discover({ nav }) {
  const t = useTheme();
  const { profile, setProfile } = useStore();
  const [q, setQ] = useState('');
  const [shown, setShown] = useState(20);
  const code = MAJOR_CODE[profile.major];
  const cap = profile.costCap || 0;
  const capOk = (c) => !cap || costOf(c, profile.state).amt <= cap;
  const mode = profile.discover || 'real';
  const { list, head } = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (query) {
      const w = query.split(/\s+/);
      const l = COLLEGE_LIST.filter((c) => w.every((x) => c.hay.includes(x))).sort((a, b) => b.tier - a.tier || a.name.localeCompare(b.name));
      return { list: l, head: `${l.length} result${l.length === 1 ? '' : 's'}` };
    }
    const capTxt = cap ? ` under ${fmtK(cap)} a year` : '';
    if (mode === 'value') {
      const l = COLLEGE_LIST.filter((c) => okFit(fitFor(c, profile)) && c.tier > 0 && capOk(c)).sort((a, b) => costOf(a, profile.state).amt - costOf(b, profile.state).amt || b.tier - a.tier);
      return { list: l, head: `${l.length} 4-year colleges you can get into${capTxt}, cheapest first, then the strongest. Community college is cheaper still, and you can transfer later.` };
    }
    if (mode === 'best') {
      const l = COLLEGE_LIST.filter((c) => (code ? c.maj.includes(code) && c.tier >= 2 : c.tier >= 4) && capOk(c)).sort((a, b) => b.tier - a.tier || a.name.localeCompare(b.name));
      return { list: l, head: `${l.length} colleges known for ${code ? MAJOR_NAME[profile.major].toLowerCase() : 'strong academics'}${capTxt}, most selective first.` };
    }
    const home = (c) => (c.pub && c.st === profile.state ? 1 : 0);
    const has = (c) => (code && c.maj.includes(code) ? 1 : 0);
    const l = COLLEGE_LIST.filter((c) => okFit(fitFor(c, profile)) && capOk(c)).sort((a, b) => home(b) - home(a) || has(b) - has(a) || b.tier - a.tier);
    return { list: l, head: `${l.length} colleges where you're a target or likely fit${capTxt}. ${profile.state} schools first.` };
  }, [q, mode, cap, profile]); // eslint-disable-line react-hooks/exhaustive-deps
  const top = list[0];
  return (
    <Screen>
      <TopBar title="Discover colleges" onBack={nav.pop} />
      <Pad gap={12}>
        <H1>Find your colleges</H1>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: t.surface, borderWidth: 1, borderColor: t.line, borderRadius: 16, paddingHorizontal: 12 }}>
          <Icon name="search" color={t.muted} size={18} />
          <TextInput value={q} onChangeText={(v) => { setQ(v); setShown(20); }} placeholder="Search any college, city or state" placeholderTextColor={t.muted} style={{ flex: 1, minHeight: 50, fontSize: 16, color: t.ink }} autoCorrect={false} accessibilityLabel="Search colleges" />
          {q ? <Pressable onPress={() => setQ('')} hitSlop={8} accessibilityLabel="Clear search"><Icon name="close" color={t.muted} size={18} /></Pressable> : null}
        </View>
        {!q ? (
          <>
            <Seg value={mode} onChange={(v) => { setProfile({ discover: v }); setShown(20); }} options={[['real', 'Realistic'], ['value', 'Best value'], ['best', code ? `Best for ${{ c: 'CS', e: 'Eng', b: 'Business', h: 'Health', a: 'Arts', d: 'Ed' }[code]}` : 'Top']]} />
            <Row wrap gap={6}>{[[0, 'Any cost'], [15000, 'Under $15k/yr'], [35000, 'Under $35k/yr']].map(([v, l]) => <Chip key={v} small label={l} on={cap === v} onPress={() => setProfile({ costCap: v })} />)}</Row>
          </>
        ) : null}
        <Txt small soft>{head}</Txt>
        {top && !q ? (
          <Card onPress={() => nav.push('college', { id: top.id })} style={{ padding: 0, overflow: 'hidden', gap: 0 }}>
            <CampusArt c={top} height={150} />
            <View style={{ padding: 14, gap: 6 }}>
              <Row style={{ justifyContent: 'space-between' }}><Eyebrow>Top pick</Eyebrow><FitPill fit={fitFor(top, profile)} /></Row>
              <Row><Emblem c={top} /><View style={{ flex: 1 }}><Text style={{ fontWeight: '900', fontSize: 20, color: t.ink }}>{top.name}</Text><Txt small muted>{top.city} · ~{fmtK(costOf(top, profile.state).amt)}/yr tuition</Txt></View><SaveButton c={top} /></Row>
            </View>
          </Card>
        ) : null}
        {(q ? list : list.slice(1)).slice(0, shown).map((c) => <CollegeRow key={c.id} c={c} nav={nav} />)}
        {!list.length ? <Card><Txt soft>No colleges match “{q}” in Baseline's list of {COLLEGE_LIST.length} yet. More schools are coming.</Txt></Card> : null}
        {list.length > shown + 1 ? <Row><Btn kind="secondary" title={`Show more (${list.length - shown - 1} left)`} onPress={() => setShown(shown + 20)} /></Row> : null}
        <Txt small muted>Fit is an estimate from your GPA, test score, home state and major, grouped by how selective each school is. Costs are national average tuition for each type of school (College Board, 2025–26) unless real school data is turned on.</Txt>
      </Pad>
    </Screen>
  );
}

function Stat({ label, value, sub, color }) {
  const t = useTheme();
  return (
    <Card style={{ flex: 1, gap: 2 }}>
      <Txt small muted>{label}</Txt>
      <Text style={{ fontSize: 24, fontWeight: '900', color: t.ink }}>{value}</Text>
      {sub ? <Txt small bold color={color || t.muted}>{sub}</Txt> : null}
    </Card>
  );
}

export function College({ nav, params }) {
  const t = useTheme();
  const { profile } = useStore();
  const c = COLLEGES[params.id];
  const [sc, setSc] = useState(null);
  useEffect(() => { let live = true; fetchScorecard(c).then((r) => { if (live) setSc(r); }); return () => { live = false; }; }, [c]);
  const f = fitFor(c, profile);
  const T = TIER[c.tier];
  const sat = satEq(profile);
  const gpa = profile.gpaUnsure ? null : profile.gpa;
  const cost = costOf(c, profile.state);
  const fitTone = { 'Far reach': t.types.practice, Reach: t.types.study, Target: t.types.school, Likely: t.types.work }[f];
  const explain = {
    Likely: 'Your numbers are above what this school usually looks for. Apply with confidence.',
    Target: 'Your numbers are in range. A strong application and essay can make the difference.',
    Reach: 'Your numbers are a bit below most admits. Worth applying if you love it, with targets as backup.',
    'Far reach': `Very few students get in here${c.tier === 5 ? ', even with perfect scores' : ''}. Aim high, but keep strong targets and likely schools on your list.`,
  }[f] + (profile.major === 'cs' && CS_HARD.has(c.id) ? ' Computer science here is more competitive than the school overall.' : '');
  const status = (v, target, step) => (v == null ? ['Not set', t.muted] : v >= target ? ['Right on track', t.okI] : v >= target - step ? ['Close', t.types.school.i] : ['Below most admits', t.types.practice.i]);
  const [gs, gc] = status(gpa, c.special ? 3.84 : T.gpa, 0.2);
  const [ss, scol] = status(sat, c.special ? 1400 : T.sat, 80);
  const uwCs = c.special && profile.major === 'cs';
  return (
    <Screen padTop={false} footer={<>
      <Btn kind="secondary" title="Plan a visit" icon="map" onPress={() => nav.push('visit', { id: c.id })} />
      <SaveButton c={c} />
    </>}>
      <View>
        <CampusArt c={c} height={220} />
        <View style={{ position: 'absolute', top: 54, left: 12 }}>
          <Pressable onPress={nav.pop} accessibilityLabel="Back" style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: t.surface, alignItems: 'center', justifyContent: 'center' }}><Icon name="back" color={t.ink} /></Pressable>
        </View>
        <View style={{ position: 'absolute', bottom: -30, left: 20 }}><Emblem c={c} size={70} ring /></View>
      </View>
      <Pad gap={14} style={{ marginTop: 40 }}>
        <Row gap={8}><FitPill fit={f} /><Txt small muted>{sc ? 'Estimated fit' : 'Estimated fit'}</Txt></Row>
        <H1>{uwCs ? "The school looks open. The major isn't." : c.full}</H1>
        <Txt muted>{uwCs ? `${c.full} · ` : ''}{c.city} · {c.pub ? 'Public' : 'Private'}{c.pub ? ` · ${c.st === profile.state ? 'In-state for you' : 'Out-of-state for you'}` : ''}</Txt>
        <Card tint={fitTone.t}><Txt color={fitTone.i}>{explain}</Txt></Card>

        {uwCs ? (
          <Card>
            <Eyebrow>Share of applicants admitted, Fall 2025</Eyebrow>
            {c.rates.map(([l, v]) => {
              const me = (l === 'CS major, out-of-state' && profile.state !== c.st) || (l === 'CS major, in-state' && profile.state === c.st);
              return (
                <View key={l} style={{ gap: 4, marginTop: 6 }}>
                  <Row style={{ justifyContent: 'space-between' }}><Txt bold={me}>{l}{me ? ' (you)' : ''}</Txt><Txt bold color={me ? t.types.practice.i : t.ink}>{v}%</Txt></Row>
                  <Bar pct={(v / 50) * 100} color={me ? t.types.practice.c : l.startsWith('CS') ? t.types.school.c : t.types.free.c} />
                </View>
              );
            })}
            <Txt small muted>In 2023 and 2024, out-of-state CS was 1–2%. Rates change every year.</Txt>
          </Card>
        ) : null}

        {sc ? (
          <Card>
            <Row style={{ justifyContent: 'space-between' }}><Eyebrow>Real numbers</Eyebrow><Pill label="College Scorecard" bg={t.okT} fg={t.okI} /></Row>
            <Row gap={10} wrap>
              {sc.admit != null ? <View style={{ minWidth: '45%' }}><Txt small muted>Admitted</Txt><Text style={{ fontSize: 22, fontWeight: '900', color: t.ink }}>{Math.round(sc.admit * 100)}%</Text></View> : null}
              {sc.sat != null ? <View style={{ minWidth: '45%' }}><Txt small muted>Average SAT</Txt><Text style={{ fontSize: 22, fontWeight: '900', color: t.ink }}>{Math.round(sc.sat)}</Text></View> : null}
              {sc.net != null ? <View style={{ minWidth: '45%' }}><Txt small muted>Average net price</Txt><Text style={{ fontSize: 22, fontWeight: '900', color: t.ink }}>{fmtK(sc.net)}/yr</Text></View> : null}
              {sc.size != null ? <View style={{ minWidth: '45%' }}><Txt small muted>Undergrads</Txt><Text style={{ fontSize: 22, fontWeight: '900', color: t.ink }}>{Math.round(sc.size).toLocaleString()}</Text></View> : null}
            </Row>
            <Row gap={8} wrap>
              {sc.url ? <Chip small label="Website" onPress={() => Linking.openURL(fullUrl(sc.url))} /> : null}
              {sc.calc ? <Chip small label="Net price calculator" onPress={() => Linking.openURL(fullUrl(sc.calc))} /> : null}
            </Row>
          </Card>
        ) : null}

        {c.tier ? (
          <>
            <Eyebrow>You vs. typical admits</Eyebrow>
            <Row gap={10}>
              <Stat label="GPA" value={`${gpa != null ? gpa.toFixed(1) : '—'} / ${(c.special ? 3.84 : T.gpa).toFixed(2)}`} sub={gs} color={gc} />
              <Stat label="SAT" value={`${sat ?? '—'} / ${sc && sc.sat ? Math.round(sc.sat) : c.special ? '1400' : T.sat}`} sub={sat == null ? 'No score yet' : ss} color={scol} />
            </Row>
            {!c.special ? <Txt small soft>Schools that are {T.label.toLowerCase()} usually admit students with about a {T.gpaTxt} GPA and SAT scores {T.satTxt}.</Txt> : <Txt small soft>1400+ is above the middle range of UW's admitted students. "College ready" on the SAT is a minimum, not a competitive score.</Txt>}
          </>
        ) : <Card><Txt bold>Open admission</Txt><Txt soft>If you finish high school, you're in. Placement tests may decide your first classes, and many students transfer to a 4-year school later.</Txt></Card>}

        <Card>
          <Row style={{ justifyContent: 'space-between' }}><Eyebrow>What it costs</Eyebrow><Pill label={dollarSigns(cost.amt)} bg={t.okT} fg={t.okI} /></Row>
          <Text style={{ fontSize: 22, fontWeight: '900', color: t.ink }}>About {fmtK(sc ? (c.st === profile.state ? sc.inState : sc.outState) || cost.amt : cost.amt)} a year in tuition</Text>
          <Txt small soft>{sc ? 'From the College Scorecard.' : `That's the 2025–26 average for a ${cost.label} college.`} Housing and food cost extra.{cost.k === 'instate' ? ' After grants, the average in-state student paid about $2,300 in tuition.' : cost.k === 'priv' ? ' After grants, the average private-college student paid about $16,900 in tuition.' : cost.k === 'cc' ? ' Grants often cover community college tuition completely.' : ''}</Txt>
          <Txt small soft>Every college has a net price calculator. Search “{c.name} net price calculator” to see what your family would really pay.</Txt>
        </Card>

        {c.maj ? (
          <View style={{ gap: 8 }}>
            <Eyebrow>Known for</Eyebrow>
            <Row wrap gap={6}>{[...c.maj].map((m) => <Pill key={m} label={MAJOR_BY_CODE[m]} bg={t.types.school.t} fg={t.types.school.i} />)}</Row>
          </View>
        ) : null}

        {uwCs ? (
          <View style={{ gap: 10 }}>
            <Eyebrow>4 moves that make you more competitive</Eyebrow>
            {[['Raise your SAT', sat ? `Aim for ${Math.min(1400, Math.ceil((sat + 200) / 10) * 10)} next, then 1400+.` : 'Take a Bluebook practice test to get your starting score.', 'sat'],
              ['Show you love CS outside class', 'Build one project you can show, like a small app or website. Join or start a coding club.'],
              ['Count your job', 'A steady job shows responsibility. List it as an activity and write about what you\'ve learned.'],
              ['Keep a strong backup', 'Even with a great application, 5% is low odds. Keep an in-state school with a strong CS program on your list.']].map(([h, b, link], i) => (
              <Card key={h} onPress={link ? () => nav.push(link) : undefined} style={{ flexDirection: 'row', gap: 12 }}>
                <Text style={{ fontSize: 22, fontWeight: '900', color: t.types.study.c }}>{i + 1}</Text>
                <View style={{ flex: 1 }}><Txt bold>{h}</Txt><Txt small soft>{b}</Txt>{link ? <Txt small bold color={t.types.study.i}>Open SAT study hub →</Txt> : null}</View>
              </Card>
            ))}
          </View>
        ) : null}
        <Txt small muted>{hasScorecard() ? 'Real numbers come from the U.S. Department of Education College Scorecard.' : 'Estimates are grouped by how selective a school is. Turn on real school data in the app settings file to see each school\'s own numbers.'}</Txt>
      </Pad>
    </Screen>
  );
}

const VISIT_SLOTS = [
  { id: 'v', kind: 'Virtual tour', when: 'Sunday · 5:00 PM', day: 6, start: 17, end: 18, online: true },
  { id: 'i', kind: 'Online info session', when: 'Wednesday · 7:00 PM', day: 2, start: 19, end: 20, online: true },
  { id: 'f', kind: 'Campus tour', when: 'Friday · 1:00 PM', day: 4, start: 13, end: 14.5 },
  { id: 's', kind: 'Campus tour', when: 'Saturday · 10:00 AM', day: 5, start: 10, end: 11.5 },
];
export function Visit({ nav, params }) {
  const t = useTheme();
  const { week, profile, dispatch } = useStore();
  const toast = useToast();
  const c = COLLEGES[params.id];
  const far = c.st !== profile.state;
  const [pick, setPick] = useState('v');
  const slots = VISIT_SLOTS.map((s) => {
    const hit = overlaps(week, s.day, s.start, s.end);
    let ok = !hit.length; let msg;
    if (hit.length) msg = `Overlaps your ${hit[0].title.toLowerCase()} (${fmtRange(hit[0].start, hit[0].end)}).${hit[0].type === 'work' ? ' Ask for the time off early.' : ' Try another time.'}`;
    else if (!s.online && far) { ok = false; msg = `Fits your schedule, but it means a trip to ${c.city}. Talk to a parent about planning it.`; }
    else msg = s.online ? `Fits your week.${far ? ' A virtual tour first is a smart start for a school this far away.' : ''}` : `Fits your week. Check the drive time to ${c.city} before you go.`;
    return { ...s, ok, msg, warn: !!hit.length };
  });
  const sel = slots.find((s) => s.id === pick);
  return (
    <Screen padTop={false} footer={<>
      <Btn kind="secondary" title="Visit website" onPress={() => Linking.openURL(c.visitUrl || `https://www.google.com/search?q=${encodeURIComponent(c.full + ' campus visit')}`)} />
      <Btn title="Add to my week" onPress={() => { dispatch({ type: 'add', blocks: [{ id: 'v' + Date.now(), day: sel.day, type: 'free', title: `${sel.kind}: ${c.name}`, start: sel.start, end: sel.end, done: false }] }); yay(); toast(`Added ${sel.kind.toLowerCase()} to ${DAYS_FULL[sel.day]}.`); nav.pop(); }} />
    </>}>
      <View>
        <CampusArt c={c} height={180} />
        <View style={{ position: 'absolute', top: 54, left: 12 }}><Pressable onPress={nav.pop} accessibilityLabel="Back" style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: t.surface, alignItems: 'center', justifyContent: 'center' }}><Icon name="back" color={t.ink} /></Pressable></View>
        <View style={{ position: 'absolute', bottom: -26, left: 20 }}><Emblem c={c} size={58} ring /></View>
      </View>
      <Pad gap={12} style={{ marginTop: 36 }}>
        <H1>Visit {c.name}</H1>
        <Txt muted>Pick a time and Baseline checks it against your schedule. Times shown are examples; check the school's visit page for real ones.</Txt>
        {slots.map((s) => (
          <Card key={s.id} onPress={() => setPick(s.id)} border={s.id === pick ? t.ink : undefined} style={{ flexDirection: 'row', alignItems: 'center', borderWidth: s.id === pick ? 2 : 1 }}>
            <View style={{ flex: 1 }}><Txt bold>{s.kind}</Txt><Txt small muted>{s.when}{s.online ? ' · online' : ''}</Txt></View>
            <Pill label={s.ok ? 'Fits' : s.warn ? 'Conflict' : 'Trip'} bg={s.ok ? t.okT : s.warn ? t.types.practice.t : t.types.school.t} fg={s.ok ? t.okI : s.warn ? t.types.practice.i : t.types.school.i} />
          </Card>
        ))}
        <Card tint={sel.ok ? t.okT : t.warnT}><Txt color={sel.ok ? t.okI : t.warnI}>{sel.msg}</Txt></Card>
      </Pad>
    </Screen>
  );
}
