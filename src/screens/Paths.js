import React from 'react';
import { Linking, Pressable, Text, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, font } from '../theme';
import { useStore } from '../store';
import { Screen, Pad, Row, H1, Eyebrow, Txt, Card, Chip, Seg, Btn, Icon, IconBadge, Emblem, Pill, tap, yay, useToast } from '../ui';
import { BRANCHES, MIL_STEPS, MIL_PAY, TRADES, TRAIN_WAYS, CAREER_CARDS } from '../content/paths';
import { COLLEGE_LIST, COST, fmtK } from '../content/colleges';
import { STATES } from '../content/quiz';
import { CollegeHub } from './Colleges';
import { FafsaBanner } from './Fafsa';
import { dayBlocks, gaps, newId, DAYS_FULL, fmtTime } from '../logic';

function Hero({ color, icon, eyebrow, title, sub }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ backgroundColor: color, paddingTop: insets.top + 18, paddingBottom: 26, paddingHorizontal: 20, overflow: 'hidden' }}>
      <Svg style={{ position: 'absolute', right: -40, top: -20 }} width={240} height={240}>
        <Defs><LinearGradient id="h" x1="0" y1="0" x2="1" y2="1"><Stop offset="0" stopColor="#FFFFFF" stopOpacity="0.22" /><Stop offset="1" stopColor="#FFFFFF" stopOpacity="0" /></LinearGradient></Defs>
        <Circle cx="140" cy="100" r="100" fill="url(#h)" />
        <Circle cx="60" cy="200" r="50" fill="#FFFFFF" opacity="0.07" />
        <Rect x="150" y="170" width="60" height="60" rx="16" fill="#FFFFFF" opacity="0.06" />
      </Svg>
      <Row gap={14} style={{ alignItems: 'flex-end' }}>
        <View style={{ width: 64, height: 64, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' }}><Icon name={icon} color="#FFFFFF" size={36} /></View>
        <View style={{ flex: 1 }}>
          <Text style={[font.eyebrow, { color: 'rgba(255,255,255,0.8)' }]}>{eyebrow}</Text>
          <Text style={[font.display, { color: '#FFFFFF', fontSize: 30, lineHeight: 32 }]}>{title}</Text>
        </View>
      </Row>
      {sub ? <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 15, marginTop: 12 }}>{sub}</Text> : null}
    </View>
  );
}

function Checklist({ items, state, onToggle, extra }) {
  const t = useTheme();
  return items.map(([title, body], i) => {
    const on = !!state[i];
    return (
      <Card key={title} onPress={() => onToggle(i)} tint={on ? t.okT : undefined} style={{ flexDirection: 'row', gap: 12 }}>
        <View style={{ width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor: on ? t.types.work.c : t.line, backgroundColor: on ? t.types.work.c : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
          {on ? <Icon name="check" color="#FFFFFF" size={16} width={3} /> : <Text style={{ fontWeight: '800', color: t.muted, fontSize: 12 }}>{i + 1}</Text>}
        </View>
        <View style={{ flex: 1, gap: 2 }}>
          <Txt bold>{title}</Txt><Txt small soft>{body}</Txt>
          {extra ? extra(i) : null}
        </View>
      </Card>
    );
  });
}

export function Military({ nav, embedded }) {
  const t = useTheme();
  const { profile, setProfile, week, dispatch } = useStore();
  const toast = useToast();
  const key = profile.branch || 'unsure';
  const b = BRANCHES[key];
  const done = MIL_STEPS.filter((_, i) => profile.milSteps[i]).length;
  const addAsvab = () => {
    const added = [];
    [2, 6].forEach((d) => {
      const g = gaps(dayBlocks(week, d), d >= 5 ? 10 : 15.5, 21.5, 0.75)[0];
      if (g) added.push({ id: newId(), day: d, type: 'study', title: 'ASVAB practice', start: g.start, end: g.start + 0.75, done: false, detail: 'Math and word knowledge' });
    });
    dispatch({ type: 'add', blocks: added });
    yay();
    toast(`Added ${added.length} ASVAB practice session${added.length === 1 ? '' : 's'}: ${added.map((x) => `${DAYS_FULL[x.day]} ${fmtTime(x.start)}`).join(', ')}.`);
  };
  return (
    <>
      {embedded ? null : <Hero color={b.color} icon={b.icon} eyebrow="Military" title="Your path to serve" sub="Enlisting, officer programs, and getting school paid for." />}
      <Pad gap={12} style={{ marginTop: 16 }}>
        <FafsaBanner nav={nav} />
        <Eyebrow>Pick a branch</Eyebrow>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {Object.keys(BRANCHES).map((k) => {
            const x = BRANCHES[k];
            const on = k === key;
            return (
              <Pressable key={k} onPress={() => { tap(); setProfile({ branch: k }); }} accessibilityRole="button" accessibilityState={{ selected: on }}
                style={({ pressed }) => ({ width: '30.8%', borderRadius: 18, padding: 10, alignItems: 'center', gap: 6, backgroundColor: on ? x.color : t.surface, borderWidth: 1, borderColor: on ? x.color : t.line, transform: [{ scale: pressed ? 0.95 : 1 }] })}>
                <IconBadge icon={x.icon} color={on ? 'rgba(255,255,255,0.2)' : x.color} size={46} />
                <Text numberOfLines={1} style={{ fontWeight: '800', fontSize: 12, color: on ? '#FFFFFF' : t.ink }}>{x.name}</Text>
              </Pressable>
            );
          })}
        </View>
        <Card>
          <Row><IconBadge icon={b.icon} color={b.color} /><View style={{ flex: 1 }}><Text style={{ fontSize: 20, fontWeight: '900', color: t.ink }}>{b.name}</Text><Txt small soft>{b.about}</Txt></View></Row>
          {b.jobs.length ? <><Eyebrow style={{ marginTop: 6 }}>Example jobs</Eyebrow><Row wrap gap={6}>{b.jobs.map((j) => <Pill key={j} label={j} bg={t.track} fg={t.ink} />)}</Row></> : null}
          {b.url ? <Row style={{ marginTop: 6 }}><Btn kind="secondary" title={`Official ${b.name} site`} onPress={() => Linking.openURL(b.url)} /></Row> : null}
        </Card>
        <Row style={{ justifyContent: 'space-between' }}><Eyebrow>Steps to enlist</Eyebrow><Txt small muted>{done} of {MIL_STEPS.length}</Txt></Row>
        <Checklist items={MIL_STEPS} state={profile.milSteps} onToggle={(i) => { yay(); setProfile((p) => ({ milSteps: { ...p.milSteps, [i]: !p.milSteps[i] } })); }}
          extra={(i) => (i === 1 ? <Pressable onPress={addAsvab}><Txt small bold color={t.types.study.i}>Add ASVAB practice to my week →</Txt></Pressable> : i === 2 ? <Pressable onPress={() => nav.push('gym')}><Txt small bold color={t.types.gym.i}>Plan your training →</Txt></Pressable> : null)} />
        <Eyebrow>Getting school paid for</Eyebrow>
        {MIL_PAY.map(([k, title, body]) => {
          const mine = profile.milpay === k;
          return (
            <Card key={k} border={mine ? t.types.school.c : undefined} style={mine ? { borderWidth: 2 } : null}>
              <Row style={{ justifyContent: 'space-between' }}><Txt bold>{title}</Txt>{mine ? <Pill label="Your interest" bg={t.types.school.t} fg={t.types.school.i} /> : null}</Row>
              <Txt small soft>{body}</Txt>
            </Card>
          );
        })}
        {profile.milpay === 'rotc' || profile.milpay === 'academy' ? <Row><Btn kind="secondary" title="ROTC and academies need strong grades. See college fit" onPress={() => { setProfile({ explore: profile.after !== 'unsure', pathView: 'college' }); }} /></Row> : null}
      </Pad>
    </>
  );
}

export function Trades({ nav, embedded }) {
  const t = useTheme();
  const { profile, setProfile } = useStore();
  const key = profile.trade || 'unsure';
  const tr = TRADES[key];
  const near = COLLEGE_LIST.filter((c) => c.tier === 0 && c.st === profile.state);
  const tradeColor = '#0F6249';
  return (
    <>
      {embedded ? null : <Hero color={tradeColor} icon={tr.icon} eyebrow="Trades" title="Learn a trade" sub="Real skills, real pay, and often way less debt." />}
      <Pad gap={12} style={{ marginTop: 16 }}>
        <FafsaBanner nav={nav} />
        <Eyebrow>Pick a trade</Eyebrow>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {Object.keys(TRADES).map((k) => {
            const x = TRADES[k];
            const on = k === key;
            return (
              <Pressable key={k} onPress={() => { tap(); setProfile({ trade: k }); }} accessibilityRole="button" accessibilityState={{ selected: on }}
                style={({ pressed }) => ({ width: '30.8%', minHeight: 96, borderRadius: 18, padding: 10, alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: on ? tradeColor : t.surface, borderWidth: 1, borderColor: on ? tradeColor : t.line, transform: [{ scale: pressed ? 0.95 : 1 }] })}>
                <Icon name={x.icon} color={on ? '#FFFFFF' : tradeColor} size={28} />
                <Text numberOfLines={2} style={{ fontWeight: '800', fontSize: 12, textAlign: 'center', color: on ? '#FFFFFF' : t.ink }}>{x.name.split(' (')[0]}</Text>
              </Pressable>
            );
          })}
        </View>
        <Card tint={t.okT}>
          <Row><IconBadge icon={tr.icon} color={tradeColor} /><View style={{ flex: 1 }}><Text style={{ fontSize: 20, fontWeight: '900', color: t.ink }}>{tr.name}</Text><Txt small soft>{tr.does}</Txt></View></Row>
          {tr.day ? <Txt small><Txt small bold>A day on the job: </Txt>{tr.day}</Txt> : null}
          <Txt small><Txt small bold>Training: </Txt>{tr.train}</Txt>
          {tr.cert ? <Txt small><Txt small bold>Licenses: </Txt>{tr.cert}</Txt> : null}
        </Card>
        <Eyebrow>Ways to train, cheapest first</Eyebrow>
        {TRAIN_WAYS.map(([p, title, body]) => (
          <Card key={title} style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{ width: 52, height: 36, borderRadius: 12, backgroundColor: t.okT, alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontWeight: '900', color: t.okI }}>{p}</Text></View>
            <View style={{ flex: 1 }}><Txt bold>{title}</Txt><Txt small soft>{body}</Txt></View>
          </Card>
        ))}
        <Eyebrow>Schools to check in {STATES[profile.state] || profile.state}</Eyebrow>
        {near.length ? near.map((c) => (
          <Card key={c.id} onPress={() => nav.push('college', { id: c.id })} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Emblem c={c} />
            <View style={{ flex: 1 }}><Txt bold>{c.name}</Txt><Txt small muted>{c.city} · about {fmtK(COST.cc.amt)}/yr typical tuition</Txt></View>
            <Pill label="$" bg={t.okT} fg={t.okI} />
          </Card>
        )) : <Card><Txt soft>Search for community and technical colleges in {STATES[profile.state] || 'your state'}. Baseline will list programs near you as it grows.</Txt></Card>}
        <Txt small muted>Program offerings vary by campus, so check each school's program list. Tuition shown is the national average for public 2-year colleges (College Board, 2025–26).</Txt>
        <Card><Txt bold>Start now</Txt><Txt small soft>Ask your counselor about CTE and dual-credit classes. Some high schools let you earn trade certifications before you graduate.</Txt></Card>
      </Pad>
    </>
  );
}

export function Careers({ nav, embedded }) {
  const t = useTheme();
  const { setProfile, profile } = useStore();
  return (
    <>
      {embedded ? null : <Hero color="#7A3D00" icon="briefcase" eyebrow="Careers" title="Start working" sub="Get paid, learn skills, and keep your options open." />}
      <Pad gap={12} style={{ marginTop: 16 }}>
        {CAREER_CARDS.map(([icon, title, body]) => (
          <Card key={title} style={{ flexDirection: 'row', gap: 12 }}>
            <IconBadge icon={icon} color="#B85A12" size={46} />
            <View style={{ flex: 1 }}><Txt bold>{title}</Txt><Txt small soft>{body}</Txt></View>
          </Card>
        ))}
        <Row><Btn kind="secondary" title="Explore trades" onPress={() => setProfile({ explore: profile.after !== 'unsure', pathView: 'trade' })} /></Row>
        <Row><Btn kind="secondary" title="Explore the military" onPress={() => setProfile({ explore: profile.after !== 'unsure', pathView: 'military' })} /></Row>
      </Pad>
    </>
  );
}

// The middle tab: changes with the student's path. "Not sure yet" sees everything.
export default function PathsTab({ nav }) {
  const t = useTheme();
  const { profile, setProfile } = useStore();
  const exploring = profile.after === 'unsure' || profile.explore;
  if (!exploring) {
    if (profile.after === 'military') return <Screen padTop={false}><Military nav={nav} /></Screen>;
    if (profile.after === 'trade') return <Screen padTop={false}><Trades nav={nav} /></Screen>;
    if (profile.after === 'work') return <Screen padTop={false}><Careers nav={nav} /></Screen>;
    return <Screen><CollegeHub nav={nav} /></Screen>;
  }
  const v = profile.pathView || 'college';
  return (
    <Screen>
      <Pad gap={10}>
        {profile.explore && profile.after !== 'unsure' ? <Chip small label="← Back to my path" onPress={() => setProfile({ explore: false })} style={{ alignSelf: 'flex-start' }} /> : null}
        <Eyebrow>Explore every path</Eyebrow>
        <Seg value={v} onChange={(k) => setProfile({ pathView: k })} options={[['college', 'College'], ['trade', 'Trades'], ['military', 'Military'], ['work', 'Work']]} />
      </Pad>
      <View style={{ height: 14 }} />
      {v === 'college' ? <CollegeHub nav={nav} /> : v === 'trade' ? <><Pad><H1>Learn a trade</H1></Pad><Trades nav={nav} embedded /></> : v === 'military' ? <><Pad><H1>Your path to serve</H1></Pad><Military nav={nav} embedded /></> : <><Pad><H1>Start working</H1></Pad><Careers nav={nav} embedded /></>}
    </Screen>
  );
}
export const pathLabel = (p) => ({ military: 'Military', trade: 'Trades', work: 'Careers', unsure: 'Paths' }[p.after] || 'Colleges');
