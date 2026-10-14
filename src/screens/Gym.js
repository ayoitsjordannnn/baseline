import React, { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { useTheme } from '../theme';
import { useStore } from '../store';
import { Screen, Pad, Row, H1, Eyebrow, Txt, Card, Chip, Seg, Btn, Icon, IconBadge, Pill, TopBar, Sheet, tap, yay, useToast } from '../ui';
import { SPLITS, SPLIT_CATS, WORKOUT, OWN_LABELS, KINDS, gymDays, recSplit, curSplitKey, activeSplit, gymWarnings, shuffleSplit } from '../content/training';
import { DAYS, DAYS_FULL, newId, findSlot } from '../logic';

export default function Gym({ nav }) {
  const t = useTheme();
  const { profile, setProfile, week, dispatch } = useStore();
  const toast = useToast();
  const [pick, setPick] = useState(false);
  const [editDay, setEditDay] = useState(null);
  const [typed, setTyped] = useState('');
  const mode = profile.splitMode || 'rec';
  const plan = activeSplit(profile);
  const warnings = gymWarnings(plan, week, profile, DAYS, DAYS_FULL);
  const rec = recSplit(profile);
  const key = curSplitKey(profile);
  const gc = t.types.gym;

  const schedule = () => {
    dispatch({ type: 'removeWhere', fn: (b) => b.type === 'gym' && b.auto });
    const others = week.filter((b) => !(b.type === 'gym' && b.auto));
    const added = [];
    let missed = 0;
    plan.forEach((x) => {
      const s = findSlot([...others, ...added], x.d, 1, profile.protect);
      if (s == null) { missed++; return; }
      added.push({ id: newId(), day: x.d, type: 'gym', title: x.label === 'Workout' ? 'Workout' : `Gym · ${x.label}`, start: s, end: s + 1, done: false, auto: true, detail: (WORKOUT[x.label] || WORKOUT.Workout)[0] });
    });
    dispatch({ type: 'add', blocks: added });
    yay();
    toast(`Added ${added.length} workout${added.length === 1 ? '' : 's'} to your week${missed ? `. ${missed} day${missed === 1 ? ' was' : 's were'} full, so try another day.` : '.'}`);
  };

  return (
    <Screen footer={<Btn title="Put workouts on my week" icon="week" color={gc.c} textColor="#FFFFFF" onPress={schedule} />}>
      <TopBar title="Training" onBack={nav.pop} />
      <Pad gap={14}>
        <Row><IconBadge icon="dumbbell" color={gc.c} size={56} /><View style={{ flex: 1 }}><H1 size={28}>Your training plan</H1><Txt small muted>{plan.length} day{plan.length === 1 ? '' : 's'} a week{profile.acts.Sports ? ' · on top of practice' : ''}</Txt></View></Row>
        <Seg value={mode} onChange={(k) => setProfile({ splitMode: k })} options={[['rec', 'Recommended'], ['own', 'My own'], ['simple', 'Simple']]} />

        <Eyebrow>Days a week</Eyebrow>
        <Row gap={8}>{['2', '3', '4', '5', '6'].map((n) => <Chip key={n} label={n} on={String(gymDays(profile)) === n} color={gc.c} onPress={() => setProfile({ gym: n, splitKey: null })} style={{ flex: 1 }} />)}</Row>
        <Eyebrow>What kind of training</Eyebrow>
        <Row wrap gap={8}>{KINDS.map((k) => <Chip key={k} small label={k} on={!!profile.gymKinds[k]} color={gc.c} onPress={() => setProfile((p) => ({ gymKinds: { ...p.gymKinds, [k]: !p.gymKinds[k] }, splitKey: null }))} />)}</Row>

        {mode === 'rec' ? (
          <Card tint={gc.t}>
            <Row style={{ justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 20, fontWeight: '900', color: gc.i, flex: 1 }}>{SPLITS[key].name}</Text>
              {key === rec.key ? <Pill label="Recommended" bg={gc.c} fg="#FFFFFF" /> : null}
            </Row>
            <Txt small color={gc.i}>{key === rec.key ? rec.why : 'You picked this one. Tap "Use recommended" to go back.'}</Txt>
            <Row gap={8} style={{ marginTop: 6 }}>
              <Btn kind="secondary" color={gc.i} textColor={gc.i} title="Shuffle" icon="sparkle" onPress={() => { setProfile({ splitKey: shuffleSplit(profile) }); }} />
              <Btn kind="secondary" color={gc.i} textColor={gc.i} title="All splits" icon="list" onPress={() => setPick(true)} />
            </Row>
            {key !== rec.key ? <Pressable onPress={() => setProfile({ splitKey: null })}><Txt small bold color={gc.i}>Use recommended</Txt></Pressable> : null}
          </Card>
        ) : mode === 'simple' ? (
          <Card tint={gc.t}><Txt bold color={gc.i}>Keep it simple</Txt><Txt small color={gc.i}>Baseline just puts "Workout" on your calendar. Lift, run, play pickup, take a class. Anything that gets you moving counts.</Txt></Card>
        ) : (
          <Card><Txt bold>Build your own split</Txt><Txt small soft>Tap a day to pick a workout, or type your own name like "Glutes & abs".</Txt></Card>
        )}

        <Eyebrow>Your week</Eyebrow>
        {DAYS.map((d, i) => {
          const x = plan.find((p) => p.d === i);
          const label = x ? x.label : 'Rest';
          const info = x ? WORKOUT[label] : null;
          const editable = mode === 'own';
          return (
            <Card key={d} onPress={editable ? () => { setEditDay(i); setTyped(''); } : undefined} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, opacity: x ? 1 : 0.75 }}>
              <View style={{ width: 46, height: 46, borderRadius: 14, backgroundColor: x ? gc.c : t.track, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontWeight: '900', color: x ? '#FFFFFF' : t.muted, fontSize: 13 }}>{d}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Txt bold>{label}</Txt>
                {info ? <Txt small muted numberOfLines={2}>{info[0]} · {info[1].join(', ')}</Txt> : x ? <Txt small muted>Your own workout</Txt> : <Txt small muted>Recover, stretch, sleep</Txt>}
              </View>
              {editable ? <Icon name="chevron" color={t.muted} size={18} /> : null}
            </Card>
          );
        })}

        {warnings.length ? (
          <Card tint={t.warnT}>
            <Txt bold color={t.warnI}>Heads up</Txt>
            {warnings.map((w) => <Txt key={w} small color={t.warnI}>• {w}</Txt>)}
          </Card>
        ) : (
          <Card tint={t.okT}><Txt small bold color={t.okI}>Looks balanced. Muscles grow on rest days, so protect your sleep.</Txt></Card>
        )}
      </Pad>

      <Sheet visible={pick} onClose={() => setPick(false)} title="All splits">
        {SPLIT_CATS.map(([cat, name]) => (
          <View key={cat} style={{ gap: 8 }}>
            <Eyebrow>{name}</Eyebrow>
            {Object.keys(SPLITS).filter((k) => SPLITS[k].cat === cat).map((k) => (
              <Card key={k} onPress={() => { setProfile({ splitKey: k, splitMode: 'rec' }); setPick(false); }} border={k === key ? gc.c : undefined} style={k === key ? { borderWidth: 2 } : null}>
                <Row style={{ justifyContent: 'space-between' }}><Txt bold>{SPLITS[k].name}</Txt><Txt small muted>{SPLITS[k].days.length} days</Txt></Row>
                <Txt small soft>{SPLITS[k].days.join(' · ')}</Txt>
              </Card>
            ))}
          </View>
        ))}
      </Sheet>

      <Sheet visible={editDay != null} onClose={() => setEditDay(null)} title={editDay != null ? DAYS_FULL[editDay] : ''}>
        <TextInput value={typed} onChangeText={setTyped} placeholder="Type your own (like Glutes & abs)" placeholderTextColor={t.muted}
          style={{ borderWidth: 1, borderColor: t.line, borderRadius: 14, padding: 14, fontSize: 16, color: t.ink, backgroundColor: t.bg }} />
        {typed.trim() ? <Btn title={`Use "${typed.trim()}"`} color={gc.c} textColor="#FFFFFF" onPress={() => { const v = typed.trim(); setProfile((p) => { const own = [...p.own]; own[editDay] = v; return { own }; }); setEditDay(null); }} /> : null}
        <Row wrap gap={8}>
          {OWN_LABELS.map((l) => (
            <Chip key={l} label={l} small on={editDay != null && profile.own[editDay] === l} color={gc.c}
              onPress={() => { setProfile((p) => { const own = [...p.own]; own[editDay] = l; return { own }; }); setEditDay(null); }} />
          ))}
        </Row>
      </Sheet>
    </Screen>
  );
}
