import React from 'react';
import { Linking, Pressable, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, font } from '../theme';
import { useStore } from '../store';
import { Screen, Pad, Row, Eyebrow, Txt, Card, Seg, Btn, Icon, IconBadge, Pill, Bar, yay, useToast } from '../ui';
import { SAT_RESOURCES, SAT_SECTIONS } from '../content/paths';
import { recHours } from '../content/quiz';
import { satEq } from '../content/colleges';
import { DAYS_FULL, dayBlocks, gaps, fmtTime, newId, weekTotals } from '../logic';

const COLORS = { bluebook: '#2F5FD0', khan: '#13795B', bank: '#6141B8', schoolhouse: '#E0782F', qotd: '#C2410C' };
const PLAN = {
  math: ['Khan Academy: one Math skill', 'Question Bank: 15 Math questions', 'Review every mistake'],
  rw: ['Khan Academy: one Reading & Writing skill', 'Question Bank: 2 passage sets', 'Learn 10 words in context'],
};

export default function Sat({ nav }) {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const { profile, setProfile, week, dispatch } = useStore();
  const toast = useToast();
  const sc = t.types.study;
  const goal = profile.hours || recHours(profile).h;
  const have = weekTotals(week).study;
  const score = satEq(profile);
  const done = SAT_RESOURCES.filter((r) => profile.satDone[r.k]).length;

  const addPlan = () => {
    const need = Math.max(1, Math.round(goal - have));
    const added = [];
    const order = [0, 2, 1, 3, 6, 5, 4];
    for (const d of order) {
      if (added.length >= need) break;
      const all = [...week, ...added];
      const g = gaps(dayBlocks(all, d), d >= 5 ? 10 : 18, 22, 1)[0];
      if (!g) continue;
      const focus = SAT_SECTIONS.find((s) => s[0] === profile.satFocus);
      added.push({ id: newId(), day: d, type: 'study', title: `SAT ${focus[1]}`, start: g.start, end: g.start + 1, done: false, detail: PLAN[profile.satFocus][added.length % 3] });
    }
    if (!added.length) { toast('Your week is full. Try freeing an evening first.'); return; }
    dispatch({ type: 'add', blocks: added });
    yay();
    toast(`Added ${added.length} SAT session${added.length === 1 ? '' : 's'}: ${added.map((x) => `${DAYS_FULL[x.day].slice(0, 3)} ${fmtTime(x.start)}`).join(', ')}.`);
  };

  return (
    <Screen padTop={false} footer={<Btn title={`Add ${Math.max(1, Math.round(goal - have))} study session${Math.round(goal - have) > 1 ? 's' : ''} to my week`} icon="plus" color={sc.c} textColor="#FFFFFF" onPress={addPlan} />}>
      <View style={{ backgroundColor: '#2A1B6B', paddingTop: insets.top + 8, paddingBottom: 24, paddingHorizontal: 20, overflow: 'hidden' }}>
        <Svg style={{ position: 'absolute', right: -30, top: 10 }} width={220} height={200}>
          <Circle cx="120" cy="90" r="80" fill="#8E73DE" opacity="0.35" />
          <Circle cx="170" cy="40" r="30" fill="#F2C48D" opacity="0.5" />
          <Path d="M20 180 L80 120 L120 150 L200 60" stroke="#C9BCF7" strokeWidth="6" fill="none" strokeLinecap="round" />
        </Svg>
        <Pressable onPress={nav.pop} accessibilityLabel="Back" style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
          <Icon name="back" color="#FFFFFF" />
        </Pressable>
        <Text style={[font.eyebrow, { color: '#C9BCF7' }]}>SAT study hub</Text>
        <Text style={[font.display, { color: '#FFFFFF', fontSize: 32, lineHeight: 34 }]}>Where to study,{'\n'}free and official</Text>
        <Row style={{ marginTop: 16 }} gap={10}>
          <View style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 16, padding: 12 }}>
            <Text style={{ color: '#C9BCF7', fontSize: 12, fontWeight: '700' }}>YOUR SCORE</Text>
            <Text style={{ color: '#FFFFFF', fontSize: 26, fontWeight: '900' }}>{score == null ? '—' : score}</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 16, padding: 12 }}>
            <Text style={{ color: '#C9BCF7', fontSize: 12, fontWeight: '700' }}>STUDY THIS WEEK</Text>
            <Text style={{ color: '#FFFFFF', fontSize: 26, fontWeight: '900' }}>{have.toFixed(1).replace('.0', '')}<Text style={{ fontSize: 15 }}> / {goal} hrs</Text></Text>
          </View>
        </Row>
      </View>

      <Pad gap={12} style={{ marginTop: 18 }}>
        <Eyebrow>Your focus</Eyebrow>
        <Seg value={profile.satFocus} onChange={(k) => setProfile({ satFocus: k })} options={SAT_SECTIONS.map(([k, n]) => [k, n])} />
        {SAT_SECTIONS.filter((s) => s[0] === profile.satFocus).map(([k, n, about]) => (
          <Card key={k} tint={sc.t}>
            <Txt bold color={sc.i}>{n}</Txt><Txt small color={sc.i}>{about}</Txt>
            <Eyebrow color={sc.i} style={{ marginTop: 6 }}>A good 1-hour session</Eyebrow>
            {PLAN[k].map((x, i) => <Txt key={x} small color={sc.i}>{i + 1}. {x}</Txt>)}
          </Card>
        ))}

        <Row style={{ justifyContent: 'space-between', marginTop: 4 }}><Eyebrow>Free official resources</Eyebrow><Txt small muted>{done} of {SAT_RESOURCES.length} tried</Txt></Row>
        <Bar pct={(done / SAT_RESOURCES.length) * 100} color={sc.c} height={8} />
        {SAT_RESOURCES.map((r) => {
          const on = !!profile.satDone[r.k];
          const c = COLORS[r.k] || sc.c;
          return (
            <Card key={r.k} style={{ padding: 0, overflow: 'hidden', gap: 0 }}>
              <View style={{ height: 6, backgroundColor: c }} />
              <View style={{ padding: 14, gap: 8 }}>
                <Row gap={12} style={{ alignItems: 'flex-start' }}>
                  <IconBadge icon={r.icon} color={c} size={48} />
                  <View style={{ flex: 1 }}>
                    <Txt bold>{r.name}</Txt>
                    <Txt small muted>{r.by} · Free</Txt>
                  </View>
                  {on ? <Pill label="Tried" bg={t.okT} fg={t.okI} /> : null}
                </Row>
                <Txt small soft>{r.what}</Txt>
                <Txt small><Txt small bold>How: </Txt>{r.how}</Txt>
                <View style={{ backgroundColor: t.track, borderRadius: 10, padding: 10 }}><Txt small bold>Tip: {r.best}</Txt></View>
                <Row gap={8}>
                  <Btn title="Open" icon="chevron" color={c} textColor="#FFFFFF" onPress={() => Linking.openURL(r.url)} />
                  <Btn kind="secondary" title={on ? 'Tried it' : 'Mark tried'} icon={on ? 'check' : undefined} onPress={() => { yay(); setProfile((p) => ({ satDone: { ...p.satDone, [r.k]: !p.satDone[r.k] } })); }} />
                </Row>
              </View>
            </Card>
          );
        })}
        <Card>
          <Txt bold>Taking the ACT instead?</Txt>
          <Txt small soft>Most colleges accept either test. ACT offers free practice tests and prep at act.org.</Txt>
          <Row><Btn kind="secondary" title="ACT free prep" onPress={() => Linking.openURL('https://www.act.org/content/act/en/products-and-services/the-act/test-preparation.html')} /></Row>
        </Card>
        <Txt small muted>Also ask your school: many offer the SAT free on a school day, and fee waivers if money is tight.</Txt>
      </Pad>
    </Screen>
  );
}
