import React from 'react';
import { Text, TextInput, View } from 'react-native';
import { useTheme } from '../theme';
import { useStore } from '../store';
import { Screen, Pad, Row, H1, Eyebrow, Txt, Card, Chip, Seg, Btn, Icon, IconBadge, Bar, TopBar, yay, useToast } from '../ui';
import { SAVING_LABEL } from '../content/quiz';
import { DAYS, DAYS_FULL, weekTotals, weekStart, MONTHS } from '../logic';

const PLANS = {
  balanced: { name: 'Balanced', why: 'Steady progress and still a life.', parts: [['goal', 0.5], ['spend', 0.3], ['gas', 0.2]] },
  goalFirst: { name: 'Goal first', why: 'Get there fast. Less spending money for now.', parts: [['goal', 0.7], ['spend', 0.15], ['gas', 0.15]] },
  rule: { name: '50 / 30 / 20', why: 'The classic: needs, wants, then savings.', parts: [['gas', 0.5], ['spend', 0.3], ['goal', 0.2]] },
};
const PART = { goal: ['Goal', 'flag'], spend: ['Spending', 'sparkle'], gas: ['Gas & bills', 'car'] };
const GOAL_DEFAULT = { car: 5000, family: 1000, college: 3000, spending: 500, bills: 600 };
const money = (n) => '$' + Math.round(n).toLocaleString('en-US');

export default function Money({ nav }) {
  const t = useTheme();
  const { profile, setProfile, week } = useStore();
  const toast = useToast();
  const wc = t.types.work;
  const wage = profile.wage || 12;
  const hours = weekTotals(week).work;
  const pay = hours * wage;
  const plan = PLANS[profile.plan] || PLANS.balanced;
  const goalAmt = profile.goalAmt || GOAL_DEFAULT[profile.saving] || 2000;
  const banked = profile.banked || 0;
  const perWeekGoal = pay * plan.parts.find((p) => p[0] === 'goal')[1];
  const weeksLeft = perWeekGoal > 0 ? Math.ceil(Math.max(0, goalAmt - banked) / perWeekGoal) : null;
  const log = profile.hoursLog || [];
  const avg = log.length ? log.reduce((a, x) => a + x.h, 0) / log.length : hours;
  const workDays = [...new Set(week.filter((b) => b.type === 'work').map((b) => b.day))];
  const offDays = workDays.filter((d) => !profile.can[d]);
  const goalName = profile.saving && profile.saving !== 'none' ? SAVING_LABEL[profile.saving] : 'Your goal';
  const num = (v) => Math.max(0, parseInt(String(v).replace(/[^0-9]/g, ''), 10) || 0);

  const logWeek = () => {
    const ws = weekStart();
    const k = `${MONTHS[ws.getMonth()]} ${ws.getDate()}`;
    setProfile((p) => ({ hoursLog: [...(p.hoursLog || []).filter((x) => x.k !== k), { k, h: Math.round(hours * 4) / 4 }].slice(-8) }));
    yay(); toast(`Logged ${hours} hours for the week of ${k}.`);
  };

  return (
    <Screen>
      <TopBar title="Money & work" onBack={nav.pop} />
      <Pad gap={14}>
        <Row><IconBadge icon="dollar" color={wc.c} size={56} /><View style={{ flex: 1 }}><H1 size={28}>Money & hours</H1><Txt small muted>{hours} work hours on your week</Txt></View></Row>

        <Card tint={wc.t}>
          <Txt small bold color={wc.i}>THIS WEEK'S PAY (BEFORE TAXES)</Txt>
          <Text style={{ fontSize: 40, fontWeight: '900', color: wc.i }}>{money(pay)}</Text>
          <Row gap={8} wrap>
            <Txt small color={wc.i}>at</Txt>
            {[9, 11, 12, 14, 16, 18].map((n) => <Chip key={n} small label={`$${n}/hr`} on={wage === n} color={wc.c} onPress={() => setProfile({ wage: n })} />)}
          </Row>
        </Card>

        <Eyebrow>{goalName}</Eyebrow>
        <Card>
          <Row gap={10}>
            <View style={{ flex: 1 }}><Txt small muted>Goal</Txt>
              <TextInput keyboardType="number-pad" value={String(goalAmt)} onChangeText={(v) => setProfile({ goalAmt: num(v) })} style={{ fontSize: 22, fontWeight: '900', color: t.ink, borderBottomWidth: 1, borderColor: t.line, paddingVertical: 4 }} />
            </View>
            <View style={{ flex: 1 }}><Txt small muted>Saved so far</Txt>
              <TextInput keyboardType="number-pad" value={String(banked)} onChangeText={(v) => setProfile({ banked: num(v) })} style={{ fontSize: 22, fontWeight: '900', color: t.ink, borderBottomWidth: 1, borderColor: t.line, paddingVertical: 4 }} />
            </View>
          </Row>
          <Bar pct={goalAmt ? (banked / goalAmt) * 100 : 0} color={wc.c} height={12} />
          <Txt small bold>{banked >= goalAmt ? 'You hit your goal!' : weeksLeft ? `About ${weeksLeft} week${weeksLeft === 1 ? '' : 's'} to go at this pace (${money(perWeekGoal)}/week).` : 'Add work shifts to your week to see how fast you get there.'}</Txt>
          {banked < goalAmt && pay > 0 ? <Row><Btn kind="secondary" title={`I saved ${money(perWeekGoal)} this week`} onPress={() => { setProfile((p) => ({ banked: (p.banked || 0) + Math.round(perWeekGoal) })); yay(); }} /></Row> : null}
        </Card>

        <Eyebrow>Split your paycheck</Eyebrow>
        <Seg value={profile.plan in PLANS ? profile.plan : 'balanced'} onChange={(k) => setProfile({ plan: k })} options={Object.keys(PLANS).map((k) => [k, PLANS[k].name])} />
        <Txt small soft>{plan.why}</Txt>
        <Row gap={8}>
          {plan.parts.map(([k, f]) => (
            <Card key={k} style={{ flex: 1, alignItems: 'center', gap: 4 }}>
              <Icon name={PART[k][1]} color={wc.c} />
              <Text style={{ fontSize: 20, fontWeight: '900', color: t.ink }}>{money(pay * f)}</Text>
              <Txt small muted>{PART[k][0]} · {Math.round(f * 100)}%</Txt>
            </Card>
          ))}
        </Row>
        {profile.saving === 'car' ? <Txt small muted>Saving for a car? Budget for insurance too. For teens it's often $150–$300 a month. Get a quote before you buy.</Txt> : null}

        <Eyebrow>Days you can work</Eyebrow>
        <Row gap={6}>{DAYS.map((d, i) => <Chip key={d} small label={d} on={!!profile.can[i]} color={wc.c} onPress={() => setProfile((p) => { const can = [...p.can]; can[i] = !can[i]; return { can }; })} style={{ flex: 1, paddingHorizontal: 0 }} />)}</Row>
        {offDays.length ? <Card tint={t.warnT}><Txt small bold color={t.warnI}>You have shifts on {offDays.map((d) => DAYS_FULL[d]).join(' and ')}, which you marked as a day you can't work. Ask your manager about swapping.</Txt></Card> : null}

        <Eyebrow>Hours history</Eyebrow>
        <Card>
          {log.length ? (
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: 110, gap: 8 }}>
              {log.map((x) => (
                <View key={x.k} style={{ flex: 1, alignItems: 'center', gap: 4 }}>
                  <Txt small bold>{x.h}</Txt>
                  <View style={{ width: '100%', height: Math.max(4, (x.h / Math.max(...log.map((y) => y.h), 1)) * 64), backgroundColor: wc.c, borderRadius: 6 }} />
                  <Text style={{ fontSize: 10, color: t.muted }}>{x.k}</Text>
                </View>
              ))}
            </View>
          ) : <Txt small soft>Hours change week to week. Log each week and Baseline learns your normal.</Txt>}
          <Txt small muted>Average: {avg.toFixed(1)} hours a week · about {money(avg * wage)} a week</Txt>
          <Row><Btn kind="secondary" title="Log this week's hours" icon="check" onPress={logWeek} /></Row>
        </Card>
        {hours > 20 ? <Card tint={t.warnT}><Txt small bold color={t.warnI}>{hours} hours on a school week is a lot. Students who work more than about 15–20 hours often see grades slip. Protect your study time.</Txt></Card> : null}
        <Txt small muted>Under 18? Your state may limit how late and how many hours you can work on school nights.</Txt>
      </Pad>
    </Screen>
  );
}
