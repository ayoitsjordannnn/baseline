import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useTheme, TYPE_LABEL } from '../theme';
import { useStore } from '../store';
import { Screen, Pad, Row, H1, Eyebrow, Txt, Card, Ring, Bar, Btn, Icon, tap, yay, useToast } from '../ui';
import { QuickAddSheet } from '../sheets/BlockSheets';
import { DAYS, DAYS_FULL, MONTHS, fmtDur, fmtTime, fmtRange, weekStart, dateOf, todayIndex, dayBlocks, bookedHours, loadLabel, weekTotals, gaps, sleepWindow, newId } from '../logic';
import { gymDays } from '../content/training';
import { recHours } from '../content/quiz';

const LOAD_COLORS = ['#2FA37F', '#2F5FD0', '#E0782F', '#E5484D'];
const COL_H = 220;
const S0 = 5, S1 = 23;

export default function Week({ nav }) {
  const t = useTheme();
  const { week, profile, dispatch } = useStore();
  const toast = useToast();
  const start = useMemo(() => weekStart(), []);
  const tIdx = todayIndex();
  const [add, setAdd] = useState(null);
  const totals = weekTotals(week);
  const studyGoal = profile.hours || recHours(profile).h;
  const gymGoal = profile.acts['Gym / working out'] ? gymDays(profile) : 0;
  const gymCount = week.filter((b) => b.type === 'gym').length;
  const loads = DAYS.map((_, i) => bookedHours(dayBlocks(week, i)));
  const busiest = loads.indexOf(Math.max(...loads));
  const lightest = loads.indexOf(Math.min(...loads));
  const sleeps = DAYS.map((_, i) => sleepWindow(week, i));
  const avgSleep = sleeps.reduce((a, b) => a + b, 0) / 7;
  const end = dateOf(start, 6);
  const protectedDays = { 'Friday nights': [4, 18, 24], 'Saturday daytime': [5, 9, 17], 'Saturday nights': [5, 18, 24], 'Sunday mornings': [6, 6, 12], 'Sunday afternoons': [6, 12, 18], 'Weeknights after 9': [-1, 21, 24] };
  const isProtected = (d, s, e) => Object.keys(profile.protect || {}).some((k) => {
    if (!profile.protect[k]) return false;
    const [pd, ps, pe] = protectedDays[k];
    return (pd === d || (pd === -1 && d < 5)) && s < pe && ps < e;
  });
  const short = Math.max(0, studyGoal - totals.study);
  const slots = [];
  if (short > 0) {
    DAYS.forEach((_, d) => gaps(dayBlocks(week, d), d >= 5 ? 9 : 15.5, 21.5, 0.75).forEach((g) => {
      const s = g.start, e = Math.min(g.end, s + 1);
      if (!isProtected(d, s, e)) slots.push({ d, start: s, end: e });
    }));
  }
  slots.sort((a, b) => (b.end - b.start) - (a.end - a.start));
  const picks = slots.slice(0, 4);

  const rings = [
    { k: 'study', label: 'Study', val: fmtDur(totals.study), sub: studyGoal ? `of ${studyGoal}h goal` : 'no goal set', pct: studyGoal ? totals.study / studyGoal : 0, color: t.types.study.c },
    gymGoal ? { k: 'gym', label: 'Workouts', val: String(gymCount), sub: `of ${gymGoal} this week`, pct: gymCount / gymGoal, color: t.types.gym.c } : null,
    { k: 'work', label: 'Work', val: fmtDur(totals.work), sub: 'on the clock', pct: Math.min(1, totals.work / 30), color: t.types.work.c },
    { k: 'sleep', label: 'Sleep', val: fmtDur(avgSleep), sub: 'average window', pct: Math.min(1, avgSleep / 9), color: '#6E9BFF' },
  ].filter(Boolean);

  return (
    <Screen>
      <Pad gap={14}>
        <View style={{ gap: 2 }}>
          <Eyebrow>{MONTHS[start.getMonth()]} {start.getDate()} – {MONTHS[end.getMonth()]} {end.getDate()}</Eyebrow>
          <H1>Your week</H1>
        </View>
        <Card style={{ paddingHorizontal: 8, gap: 8 }}>
          <Row gap={4}>
            <View style={{ width: 26 }} />
            {DAYS.map((n, i) => (
              <View key={n} style={{ flex: 1, alignItems: 'center', gap: 2 }}>
                <Text style={{ fontSize: 11, fontWeight: '700', color: i === tIdx ? t.now : t.muted }}>{n.slice(0, 2)}</Text>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: LOAD_COLORS[loadLabel(loads[i]).level] }} />
              </View>
            ))}
          </Row>
          <Row gap={4} style={{ alignItems: 'flex-start' }}>
            <View style={{ width: 26, height: COL_H }}>
              {[6, 10, 14, 18, 22].map((h) => <Text key={h} style={{ position: 'absolute', right: 2, top: ((h - S0) / (S1 - S0)) * COL_H - 7, fontSize: 10, color: t.muted }}>{h > 12 ? h - 12 + 'p' : h + 'a'}</Text>)}
            </View>
            {DAYS.map((n, i) => (
              <Pressable key={n} onPress={() => { tap(); nav.tab('today', { day: i }); }} accessibilityLabel={`Open ${DAYS_FULL[i]}`}
                style={({ pressed }) => ({ flex: 1, height: COL_H, borderRadius: 8, backgroundColor: i === tIdx ? t.track : t.bg, overflow: 'hidden', opacity: pressed ? 0.7 : 1 })}>
                {dayBlocks(week, i).filter((b) => b.type !== 'free').map((b) => (
                  <View key={b.id} style={{ position: 'absolute', left: 2, right: 2, top: Math.max(0, ((b.start - S0) / (S1 - S0)) * COL_H), height: Math.max(3, ((b.end - b.start) / (S1 - S0)) * COL_H - 1), borderRadius: 4, backgroundColor: t.types[b.type].c, opacity: b.done ? 0.45 : 1 }} />
                ))}
              </Pressable>
            ))}
          </Row>
          <Row wrap gap={10} style={{ paddingHorizontal: 6 }}>
            {['school', 'work', 'practice', 'study', 'gym'].filter((k) => totals[k] > 0).map((k) => (
              <Row key={k} gap={4}><View style={{ width: 9, height: 9, borderRadius: 3, backgroundColor: t.types[k].c }} /><Txt small muted>{TYPE_LABEL[k]}</Txt></Row>
            ))}
          </Row>
        </Card>
      </Pad>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 10, paddingVertical: 14 }}>
        {rings.map((r) => (
          <Card key={r.k} style={{ width: 132, alignItems: 'center', gap: 8 }}>
            <Ring pct={r.pct} size={78} stroke={9} color={r.color}><Text style={{ fontWeight: '800', fontSize: 15, color: t.ink }}>{r.val}</Text></Ring>
            <View style={{ alignItems: 'center' }}><Txt bold>{r.label}</Txt><Txt small muted>{r.sub}</Txt></View>
          </Card>
        ))}
      </ScrollView>

      <Pad gap={12}>
        <Row gap={10}>
          <Card style={{ flex: 1 }} onPress={() => nav.tab('today', { day: busiest })}>
            <Eyebrow color={LOAD_COLORS[3]}>Busiest</Eyebrow>
            <Txt bold>{DAYS_FULL[busiest]}</Txt><Txt small muted>{fmtDur(loads[busiest])} booked</Txt>
          </Card>
          <Card style={{ flex: 1 }} onPress={() => nav.tab('today', { day: lightest })}>
            <Eyebrow color={LOAD_COLORS[0]}>Lightest</Eyebrow>
            <Txt bold>{DAYS_FULL[lightest]}</Txt><Txt small muted>{fmtDur(loads[lightest])} booked</Txt>
          </Card>
        </Row>

        {studyGoal > 0 ? (
          short > 0.01 ? (
            <View style={{ backgroundColor: t.types.study.c, borderRadius: 20, padding: 16, gap: 10 }}>
              <Text style={{ color: '#FFFFFF', fontWeight: '900', fontSize: 20 }}>You're {fmtDur(short)} short of your study goal</Text>
              <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 14 }}>Baseline found open time that skips your protected hours. Tap to add.</Text>
              {picks.length ? picks.map((s) => (
                <Pressable key={`${s.d}-${s.start}`} accessibilityRole="button"
                  onPress={() => { yay(); dispatch({ type: 'add', blocks: [{ id: newId(), day: s.d, type: 'study', title: 'Study session', start: s.start, end: s.end, done: false, detail: 'Added by Baseline' }] }); toast(`Added study on ${DAYS_FULL[s.d]} at ${fmtTime(s.start)}.`); }}
                  style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: 'rgba(255,255,255,0.16)', borderRadius: 14, padding: 12, opacity: pressed ? 0.7 : 1 })}>
                  <Text style={{ color: '#FFFFFF', fontWeight: '800', width: 40 }}>{DAYS[s.d]}</Text>
                  <Text style={{ color: '#FFFFFF', flex: 1 }}>{fmtRange(s.start, s.end)}</Text>
                  <View style={{ backgroundColor: '#FFFFFF', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6 }}><Text style={{ color: t.types.study.c, fontWeight: '800' }}>Add</Text></View>
                </Pressable>
              )) : <Text style={{ color: '#FFFFFF' }}>No open hour left this week. Try a 15-minute session on a break.</Text>}
            </View>
          ) : (
            <Card tint={t.okT}><Txt bold color={t.okI}>Study goal hit this week</Txt><Txt small soft>{fmtDur(totals.study)} of study planned around {fmtDur(totals.work)} of work.</Txt></Card>
          )
        ) : null}

        <Eyebrow>Hours by type</Eyebrow>
        {['school', 'work', 'practice', 'study', 'gym'].filter((k) => totals[k] > 0).map((k) => (
          <Row key={k} gap={10}>
            <Txt style={{ width: 70 }}>{TYPE_LABEL[k]}</Txt>
            <View style={{ flex: 1 }}><Bar pct={(totals[k] / Math.max(...Object.values(totals), 1)) * 100} color={t.types[k].c} /></View>
            <Txt bold style={{ width: 56, textAlign: 'right' }}>{fmtDur(totals[k])}</Txt>
          </Row>
        ))}
        <Row style={{ marginTop: 6 }}>
          <Btn kind="secondary" title="Add shifts" icon="briefcase" onPress={() => setAdd({ day: tIdx, preset: 'work', type: 'work', title: 'Shift', start: 16, dur: 5, days: [] })} />
          <Btn title="Add" icon="plus" onPress={() => setAdd({ day: tIdx })} />
        </Row>
      </Pad>
      <QuickAddSheet visible={!!add} initial={add} onClose={() => setAdd(null)} />
    </Screen>
  );
}
