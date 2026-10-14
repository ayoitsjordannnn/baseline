import React, { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { useTheme } from '../theme';
import { useStore } from '../store';
import { Screen, Pad, Row, H1, Eyebrow, Txt, Card, Chip, Btn, Icon, Pill, Bar, Ring, TopBar, Sheet, tap, yay, useToast } from '../ui';
import { COLLEGE_LIST, fitFor, okFit } from '../content/colleges';

const PTS = { A: 4, B: 3, C: 2, D: 1, F: 0 };
const BUMP = { reg: 0, honors: 0.5, ap: 1 };
const LEVEL = [['reg', 'Regular'], ['honors', 'Honors'], ['ap', 'AP / IB / Dual']];
const PER_SEM = 7;

const EXAMPLE = [
  ['English I', 'A', 'honors', 1], ['Algebra I', 'B', 'reg', 1], ['Biology', 'A', 'honors', 1], ['World History', 'B', 'reg', 1], ['Spanish I', 'A', 'reg', 1], ['PE / Athletics', 'A', 'reg', 1], ['Art I', 'A', 'reg', 1],
  ['English I', 'A', 'honors', 2], ['Algebra I', 'C', 'reg', 2], ['Biology', 'B', 'honors', 2], ['World History', 'B', 'reg', 2], ['Spanish I', 'A', 'reg', 2], ['PE / Athletics', 'A', 'reg', 2], ['Art I', 'A', 'reg', 2],
].map(([name, grade, level, sem], i) => ({ id: 'ex' + i, name, grade, level, sem }));

export function gpaOf(classes, weighted) {
  if (!classes || !classes.length) return null;
  const s = classes.reduce((a, c) => a + PTS[c.grade] + (weighted && c.grade !== 'F' ? BUMP[c.level] : 0), 0);
  return s / classes.length;
}
function semestersDone(p, now = new Date()) {
  const base = { '9th': 0, '10th': 2, '11th': 4, '12th': 6 }[p.grade] ?? 2;
  const m = now.getMonth();
  return base + (m >= 0 && m <= 6 ? 1 : 0);
}

export default function Transcript({ nav }) {
  const t = useTheme();
  const { profile, setProfile } = useStore();
  const toast = useToast();
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({ name: '', grade: 'A', level: 'reg', sem: 1 });
  const classes = profile.transcript || [];
  const uw = gpaOf(classes, false);
  const w = gpaOf(classes, true);
  const done = Math.max(Math.ceil(classes.length / PER_SEM), semestersDone(profile));
  const left = Math.max(0, 8 - done);
  const futureN = left * PER_SEM;
  const target = profile.tScen;
  const project = (g) => (uw == null ? g : (uw * classes.length + g * futureN) / (classes.length + futureN));
  const best = project(4);
  const proj = project(target);
  const sc = t.types.school;
  const matchesAt = (g) => COLLEGE_LIST.filter((c) => okFit(fitFor(c, profile, g))).length;
  const lowest = classes.length ? [...classes].sort((a, b) => PTS[a.grade] - PTS[b.grade])[0] : null;
  const setT = (list) => setProfile({ transcript: list });

  return (
    <Screen footer={<Btn title="Add a class" icon="plus" onPress={() => { setDraft({ name: '', grade: 'A', level: 'reg', sem: Math.max(1, done) }); setAdding(true); }} />}>
      <TopBar title="Transcript & GPA" onBack={nav.pop} />
      <Pad gap={14}>
        <H1>Where your GPA can go</H1>
        <Txt soft>Add your classes and grades. Baseline shows your GPA now and how high it can still get before applications.</Txt>

        {!classes.length ? (
          <Card tint={sc.t}>
            <Txt bold color={sc.i}>No classes yet</Txt>
            <Txt small color={sc.i}>Grab your report card or your school's parent portal and add each class. Or load an example to see how it works.</Txt>
            <Row><Btn title="Load an example transcript" color={sc.c} textColor="#FFFFFF" onPress={() => { setT(EXAMPLE); yay(); }} /></Row>
          </Card>
        ) : (
          <>
            <Row gap={10}>
              <Card style={{ flex: 1, alignItems: 'center' }}>
                <Ring pct={uw / 4} size={86} stroke={10} color={sc.c}><Text style={{ fontWeight: '900', fontSize: 22, color: t.ink }}>{uw.toFixed(2)}</Text></Ring>
                <Txt small bold>Unweighted</Txt>
              </Card>
              <Card style={{ flex: 1, alignItems: 'center' }}>
                <Ring pct={w / 5} size={86} stroke={10} color={t.types.study.c}><Text style={{ fontWeight: '900', fontSize: 22, color: t.ink }}>{w.toFixed(2)}</Text></Ring>
                <Txt small bold>Weighted</Txt>
              </Card>
            </Row>
            <Row><Btn kind="secondary" title={`Use ${uw.toFixed(2)} as my GPA`} onPress={() => { setProfile({ gpa: Math.round(uw * 100) / 100, gpaUnsure: false }); yay(); toast('College fit now uses your transcript GPA.'); }} /></Row>

            <Eyebrow>What's still possible</Eyebrow>
            <Card tint={t.okT}>
              <Txt bold color={t.okI}>{left ? `${left} semester${left === 1 ? '' : 's'} left. Your best possible GPA is ${best.toFixed(2)}.` : 'Your grades are mostly set. Senior grades still matter for admission offers.'}</Txt>
              {left ? <Txt small color={t.okI}>That's with straight A's from here. Every semester you wait, the ceiling drops, so the earlier you lock in the more it moves.</Txt> : null}
            </Card>
            {left ? (
              <Card>
                <Txt bold>If you average this from now on</Txt>
                <Row gap={6} wrap>{[3.0, 3.3, 3.5, 3.7, 4.0].map((g) => <Chip key={g} small label={g.toFixed(1)} on={target === g} color={sc.c} onPress={() => setProfile({ tScen: g })} />)}</Row>
                <Row style={{ justifyContent: 'space-between', marginTop: 4 }}><Txt soft>You'd graduate with</Txt><Text style={{ fontSize: 26, fontWeight: '900', color: sc.c }}>{proj.toFixed(2)}</Text></Row>
                <Bar pct={(proj / 4) * 100} color={sc.c} />
                <Txt small muted>Good or likely-fit colleges: {matchesAt(uw)} now → {matchesAt(proj)} at {proj.toFixed(2)}</Txt>
              </Card>
            ) : null}
            {lowest && PTS[lowest.grade] < 3 ? (
              <Card tint={t.warnT}>
                <Txt bold color={t.warnI}>Focus: {lowest.name}</Txt>
                <Txt small color={t.warnI}>Your lowest grade ({lowest.grade}). Ask about tutoring or office hours, and add a weekly study block for it.</Txt>
              </Card>
            ) : null}

            <Eyebrow>Your classes ({classes.length})</Eyebrow>
            {[...new Set(classes.map((c) => c.sem))].sort((a, b) => a - b).map((s) => (
              <View key={s} style={{ gap: 8 }}>
                <Txt small bold muted>Semester {s}</Txt>
                {classes.filter((c) => c.sem === s).map((c) => (
                  <Card key={c.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 }}>
                    <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: PTS[c.grade] >= 3 ? t.okT : t.warnT, alignItems: 'center', justifyContent: 'center' }}>
                      <Text style={{ fontWeight: '900', fontSize: 18, color: PTS[c.grade] >= 3 ? t.okI : t.warnI }}>{c.grade}</Text>
                    </View>
                    <View style={{ flex: 1 }}><Txt bold>{c.name}</Txt>{c.level !== 'reg' ? <Txt small muted>{LEVEL.find((l) => l[0] === c.level)[1]}</Txt> : null}</View>
                    <Pressable onPress={() => { tap(); setT(classes.filter((x) => x.id !== c.id)); }} hitSlop={8} accessibilityLabel={`Remove ${c.name}`} style={{ padding: 8 }}><Icon name="trash" color={t.muted} size={18} /></Pressable>
                  </Card>
                ))}
              </View>
            ))}
            <Pressable onPress={() => { setT(null); toast('Transcript cleared.'); }}><Txt small bold muted>Clear transcript</Txt></Pressable>
          </>
        )}
        <Txt small muted>Coming later: snap a photo of your transcript and Baseline fills this in for you.</Txt>
      </Pad>

      <Sheet visible={adding} onClose={() => setAdding(false)} title="Add a class">
        <TextInput value={draft.name} onChangeText={(v) => setDraft({ ...draft, name: v })} placeholder="Class name (like Algebra II)" placeholderTextColor={t.muted} autoFocus
          style={{ borderWidth: 1, borderColor: t.line, borderRadius: 14, padding: 14, fontSize: 16, color: t.ink, backgroundColor: t.bg }} />
        <Eyebrow>Grade</Eyebrow>
        <Row gap={8}>{Object.keys(PTS).map((g) => <Chip key={g} label={g} on={draft.grade === g} onPress={() => setDraft({ ...draft, grade: g })} style={{ flex: 1 }} />)}</Row>
        <Eyebrow>Level</Eyebrow>
        <Row gap={8}>{LEVEL.map(([k, l]) => <Chip key={k} small label={l} on={draft.level === k} onPress={() => setDraft({ ...draft, level: k })} />)}</Row>
        <Eyebrow>Semester</Eyebrow>
        <Row gap={6} wrap>{[1, 2, 3, 4, 5, 6, 7, 8].map((s) => <Chip key={s} small label={String(s)} on={draft.sem === s} onPress={() => setDraft({ ...draft, sem: s })} />)}</Row>
        <Txt small muted>Semesters 1–2 are freshman year, 3–4 sophomore, 5–6 junior, 7–8 senior.</Txt>
        <Row><Btn title="Add class" disabled={!draft.name.trim()} onPress={() => {
          setT([...classes, { ...draft, name: draft.name.trim(), id: 'c' + Date.now() }]);
          yay(); toast(`Added ${draft.name.trim()}.`);
          setDraft({ ...draft, name: '' });
        }} /></Row>
      </Sheet>
    </Screen>
  );
}
