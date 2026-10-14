import React, { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { useTheme } from '../theme';
import { Row, Eyebrow, Txt, Chip, Seg, Icon, Sheet, tap } from '../ui';
import { STATES } from '../content/quiz';

function Stepper({ value, onChange, step, min, max, fmt, color }) {
  const t = useTheme();
  const btn = (d, icon) => (
    <Pressable onPress={() => { tap(); onChange(Math.min(max, Math.max(min, Math.round((value + d) * 100) / 100))); }} accessibilityLabel={d > 0 ? 'Increase' : 'Decrease'}
      style={({ pressed }) => ({ width: 52, height: 52, borderRadius: 16, backgroundColor: t.track, alignItems: 'center', justifyContent: 'center', transform: [{ scale: pressed ? 0.92 : 1 }] })}>
      <Text style={{ fontSize: 26, fontWeight: '800', color: t.ink }}>{icon}</Text>
    </Pressable>
  );
  return (
    <Row gap={12}>
      {btn(-step, '−')}
      <Text style={{ flex: 1, textAlign: 'center', fontSize: 36, fontWeight: '900', color: color || t.ink }}>{fmt(value)}</Text>
      {btn(step, '+')}
    </Row>
  );
}

export function StatePicker({ value, onChange }) {
  const t = useTheme();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const list = Object.keys(STATES).filter((k) => !q || STATES[k].toLowerCase().includes(q.toLowerCase()) || k.toLowerCase() === q.toLowerCase());
  return (
    <>
      <Pressable onPress={() => { tap(); setQ(''); setOpen(true); }} accessibilityRole="button"
        style={{ flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1, borderColor: t.line, backgroundColor: t.surface, borderRadius: 14, padding: 14 }}>
        <Icon name="map" color={t.muted} size={20} />
        <Text style={{ flex: 1, fontSize: 16, fontWeight: '700', color: t.ink }}>{STATES[value] || 'Pick your state'}</Text>
        <Icon name="chevron" color={t.muted} size={18} />
      </Pressable>
      <Sheet visible={open} onClose={() => setOpen(false)} title="Your state">
        <TextInput value={q} onChangeText={setQ} placeholder="Type to search" placeholderTextColor={t.muted} autoFocus
          style={{ borderWidth: 1, borderColor: t.line, borderRadius: 14, padding: 14, fontSize: 16, color: t.ink, backgroundColor: t.bg }} />
        <Row wrap gap={8}>
          {list.map((k) => <Chip key={k} label={STATES[k]} on={k === value} onPress={() => { onChange(k); setOpen(false); }} />)}
        </Row>
        {!list.length ? <Txt muted>No match. Try the full name.</Txt> : null}
      </Sheet>
    </>
  );
}

export function StatsFields({ p, set }) {
  const t = useTheme();
  return (
    <View style={{ gap: 12 }}>
      <Eyebrow>GPA (unweighted)</Eyebrow>
      {p.gpaUnsure ? <Txt soft>No problem. Baseline will assume about a 3.3 for now.</Txt> : <Stepper value={p.gpa} onChange={(v) => set({ gpa: v })} step={0.1} min={0} max={4} fmt={(v) => v.toFixed(1)} color={t.types.school.c} />}
      <Chip small label={p.gpaUnsure ? 'I know my GPA' : "I don't know my GPA"} on={p.gpaUnsure} onPress={() => set({ gpaUnsure: !p.gpaUnsure })} style={{ alignSelf: 'flex-start' }} />
      <Eyebrow>Test score</Eyebrow>
      <Seg value={p.scoreType || 'none'} onChange={(k) => set({ scoreType: k === 'none' ? null : k })} options={[['none', 'No score yet'], ['sat', 'SAT'], ['act', 'ACT']]} />
      {p.scoreType === 'sat' ? <Stepper value={p.sat} onChange={(v) => set({ sat: v })} step={10} min={400} max={1600} fmt={(v) => String(v)} color={t.types.study.c} /> : null}
      {p.scoreType === 'act' ? <Stepper value={p.act} onChange={(v) => set({ act: v })} step={1} min={1} max={36} fmt={(v) => String(v)} color={t.types.study.c} /> : null}
      <Eyebrow>Home state</Eyebrow>
      <StatePicker value={p.state} onChange={(s) => set({ state: s })} />
      <Txt small muted>Your state decides which public colleges count as in-state (much cheaper).</Txt>
    </View>
  );
}
