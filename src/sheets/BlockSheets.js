import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { useTheme, TYPE_LABEL } from '../theme';
import { useStore } from '../store';
import { Sheet, Row, Chip, Btn, Txt, Eyebrow, Icon, tap, yay, useToast } from '../ui';
import { DAYS, DAYS_FULL, PRESETS, fmtTime, fmtRange, fmtDur, overlaps, parseQuick, newId, clamp } from '../logic';

const QUICK_TIMES = [5.75, 7, 15.5, 16, 18, 19, 20];
const DURS = [0.25, 0.5, 1, 1.5, 2, 3, 4, 5];
const TYPES = ['school', 'practice', 'work', 'study', 'gym', 'free'];

function Stepper({ value, onChange, t }) {
  return (
    <Row>
      <Pressable onPress={() => { tap(); onChange(clamp(value - 0.25, 0, 23.75)); }} accessibilityLabel="15 minutes earlier" style={{ width: 48, height: 48, borderRadius: 14, borderWidth: 1, borderColor: t.line, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 22, fontWeight: '700', color: t.ink }}>−</Text>
      </Pressable>
      <Text style={{ flex: 1, textAlign: 'center', fontSize: 26, fontWeight: '800', color: t.ink, fontVariant: ['tabular-nums'] }}>{fmtTime(value)}</Text>
      <Pressable onPress={() => { tap(); onChange(clamp(value + 0.25, 0, 23.75)); }} accessibilityLabel="15 minutes later" style={{ width: 48, height: 48, borderRadius: 14, borderWidth: 1, borderColor: t.line, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 22, fontWeight: '700', color: t.ink }}>+</Text>
      </Pressable>
    </Row>
  );
}

function Preview({ draft, week, t, excludeId }) {
  const type = draft.type || 'free';
  const c = t.types[type];
  const end = Math.min(24, draft.start + draft.dur);
  const days = [...draft.days].sort((a, b) => a - b);
  const hits = [];
  days.forEach((d) => overlaps(week, d, draft.start, end, excludeId).forEach((b) => hits.push(`${DAYS[d]}: ${b.title} (${fmtRange(b.start, b.end)})`)));
  return (
    <View style={{ backgroundColor: c.t, borderRadius: 16, padding: 14, gap: 4, borderWidth: type === 'free' ? 1 : 0, borderColor: t.line }}>
      <Eyebrow color={c.i}>{draft.type ? TYPE_LABEL[draft.type] : 'Preview'}</Eyebrow>
      <Text style={{ fontSize: 18, fontWeight: '800', color: t.ink }}>{draft.title || 'Name it below'}</Text>
      <Txt small soft>{days.length ? days.map((d) => DAYS[d]).join(', ') : 'Pick a day'} · {fmtRange(draft.start, end)}{draft.repeat ? ' · every week' : ''}</Txt>
      {hits.length ? (
        <Txt small bold color={t.warnI}>Overlaps {hits.slice(0, 3).join('; ')}{hits.length > 3 ? ` and ${hits.length - 3} more` : ''}</Txt>
      ) : days.length ? <Txt small bold color={t.okI}>No conflicts</Txt> : null}
    </View>
  );
}

export function QuickAddSheet({ visible, onClose, initial }) {
  const t = useTheme();
  const { week, dispatch } = useStore();
  const toast = useToast();
  const blank = useMemo(() => ({ preset: null, type: null, title: '', days: [0], start: 16, dur: 1, repeat: false, text: '' }), []);
  const [d, setD] = useState(blank);
  useEffect(() => {
    if (visible) setD({ ...blank, ...(initial || {}), days: initial && initial.days ? initial.days : [initial && initial.day != null ? initial.day : 0] });
  }, [visible]); // eslint-disable-line react-hooks/exhaustive-deps

  const set = (patch) => setD((x) => ({ ...x, ...patch }));
  const ok = d.days.length && (d.type || d.title.trim());

  function save() {
    const title = d.title.trim() || (d.preset ? PRESETS.find((p) => p.k === d.preset).title : 'Event');
    const end = Math.min(24, d.start + d.dur);
    const blocks = d.days.map((day) => ({ id: newId(), day, type: d.type || 'free', title, start: d.start, end, done: false, detail: d.repeat ? 'Every week' : undefined }));
    const conflicts = d.days.filter((day) => overlaps(week, day, d.start, end).length).length;
    dispatch({ type: 'add', blocks });
    yay();
    toast(`Added ${title} to ${d.days.length === 1 ? DAYS_FULL[d.days[0]] : d.days.length + ' days'}.${conflicts ? ` ${conflicts} overlap${conflicts > 1 ? '' : 's'} something.` : ''}`);
    onClose(d.days[0]);
  }

  return (
    <Sheet visible={visible} onClose={() => onClose()} title="Add something">
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: t.types.study.t, borderRadius: 14, paddingHorizontal: 12 }}>
        <Icon name="sparkle" color={t.types.study.i} size={18} />
        <TextInput
          value={d.text}
          onChangeText={(text) => setD((x) => ({ ...x, text, ...parseQuick(text, x.days[0] || 0) }))}
          placeholder='Type it: "practice mon wed 4-6"'
          placeholderTextColor={t.muted}
          style={{ flex: 1, minHeight: 50, fontSize: 16, color: t.ink }}
          accessibilityLabel="Type what to add"
          autoCorrect={false}
        />
      </View>
      <Eyebrow>Or tap what it is</Eyebrow>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {PRESETS.map((p) => {
          const on = d.preset === p.k;
          const c = t.types[p.type];
          return (
            <Pressable key={p.k} onPress={() => { tap(); set({ preset: p.k, type: p.type, start: p.start, dur: p.dur, title: p.title }); }} accessibilityRole="button" accessibilityState={{ selected: on }}
              style={({ pressed }) => ({ width: '31.3%', minHeight: 72, borderRadius: 16, borderWidth: 1.5, borderColor: on ? c.c : t.line, backgroundColor: on ? c.t : t.surface, alignItems: 'center', justifyContent: 'center', gap: 6, transform: [{ scale: pressed ? 0.95 : 1 }] })}>
              <View style={{ width: 16, height: 16, borderRadius: 6, backgroundColor: c.c }} />
              <Text style={{ fontWeight: '700', fontSize: 13, color: t.ink }}>{p.label}</Text>
            </Pressable>
          );
        })}
      </View>
      <Row style={{ justifyContent: 'space-between' }}>
        <Eyebrow>Which days</Eyebrow>
        <Row gap={6}><Chip small label="Weekdays" onPress={() => set({ days: [0, 1, 2, 3, 4] })} /><Chip small label="Clear" onPress={() => set({ days: [] })} /></Row>
      </Row>
      <Row gap={6}>
        {DAYS.map((n, i) => {
          const on = d.days.includes(i);
          return (
            <Pressable key={n} onPress={() => { tap(); set({ days: on ? d.days.filter((x) => x !== i) : [...d.days, i] }); }} accessibilityLabel={DAYS_FULL[i]} accessibilityState={{ selected: on }}
              style={{ flex: 1, minHeight: 48, borderRadius: 12, borderWidth: 1, borderColor: on ? t.btn : t.line, backgroundColor: on ? t.btn : t.surface, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontWeight: '700', fontSize: 13, color: on ? t.btnInk : t.ink }}>{n.slice(0, 2)}</Text>
            </Pressable>
          );
        })}
      </Row>
      <Eyebrow>Starts</Eyebrow>
      <Stepper value={d.start} onChange={(start) => set({ start })} t={t} />
      <Row wrap gap={6}>{QUICK_TIMES.map((q) => <Chip key={q} small label={fmtTime(q).replace(':00', '')} on={Math.abs(q - d.start) < 0.01} onPress={() => set({ start: q })} />)}</Row>
      <Eyebrow>How long</Eyebrow>
      <Row wrap gap={6}>{DURS.map((q) => <Chip key={q} small label={fmtDur(q)} on={Math.abs(q - d.dur) < 0.01} onPress={() => set({ dur: q })} />)}</Row>
      <Chip label="Repeat every week" on={d.repeat} onPress={() => set({ repeat: !d.repeat })} style={{ alignSelf: 'flex-start' }} />
      <TextInput value={d.title} onChangeText={(title) => set({ title })} placeholder="Name it (optional)" placeholderTextColor={t.muted} style={{ minHeight: 48, borderRadius: 12, borderWidth: 1, borderColor: t.line, paddingHorizontal: 12, fontSize: 16, color: t.ink }} accessibilityLabel="Name" />
      <Preview draft={d} week={week} t={t} />
      <Row><Btn title={!d.days.length ? 'Pick a day' : !ok ? 'Pick what it is' : `Add to ${d.days.length === 1 ? DAYS_FULL[d.days[0]] : d.days.length + ' days'}`} disabled={!ok} onPress={save} /></Row>
    </Sheet>
  );
}

export function EditSheet({ visible, onClose, block }) {
  const t = useTheme();
  const { week, dispatch } = useStore();
  const toast = useToast();
  const [d, setD] = useState(null);
  const [confirm, setConfirm] = useState(false);
  useEffect(() => {
    if (visible && block) { setD({ ...block, days: [block.day], dur: block.end - block.start }); setConfirm(false); }
  }, [visible, block]);
  if (!d) return null;
  const set = (patch) => setD((x) => ({ ...x, ...patch }));
  function save() {
    dispatch({ type: 'update', id: block.id, patch: { title: d.title.trim() || block.title, type: d.type, day: d.days[0], start: d.start, end: Math.min(24, d.start + d.dur) } });
    yay();
    toast('Saved.');
    onClose();
  }
  return (
    <Sheet visible={visible} onClose={onClose} title="Edit">
      <TextInput value={d.title} onChangeText={(title) => set({ title })} placeholder="Name" placeholderTextColor={t.muted} style={{ minHeight: 50, borderRadius: 12, borderWidth: 1, borderColor: t.line, paddingHorizontal: 12, fontSize: 18, fontWeight: '700', color: t.ink }} accessibilityLabel="Name" />
      <Eyebrow>Type</Eyebrow>
      <Row wrap gap={6}>{TYPES.map((k) => <Chip key={k} small label={TYPE_LABEL[k]} on={d.type === k} color={t.types[k].c} onPress={() => set({ type: k })} />)}</Row>
      <Eyebrow>Day</Eyebrow>
      <Row gap={6}>
        {DAYS.map((n, i) => {
          const on = d.days[0] === i;
          return (
            <Pressable key={n} onPress={() => { tap(); set({ days: [i] }); }} accessibilityLabel={DAYS_FULL[i]} accessibilityState={{ selected: on }}
              style={{ flex: 1, minHeight: 46, borderRadius: 12, borderWidth: 1, borderColor: on ? t.btn : t.line, backgroundColor: on ? t.btn : t.surface, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontWeight: '700', fontSize: 13, color: on ? t.btnInk : t.ink }}>{n.slice(0, 2)}</Text>
            </Pressable>
          );
        })}
      </Row>
      <Eyebrow>Starts</Eyebrow>
      <Stepper value={d.start} onChange={(start) => set({ start })} t={t} />
      <Eyebrow>How long</Eyebrow>
      <Row wrap gap={6}>{DURS.map((q) => <Chip key={q} small label={fmtDur(q)} on={Math.abs(q - d.dur) < 0.01} onPress={() => set({ dur: q })} />)}</Row>
      <Preview draft={d} week={week} t={t} excludeId={block.id} />
      <Row>
        <Btn kind="secondary" title={block.done ? 'Mark not done' : 'Mark done'} icon="check" onPress={() => { dispatch({ type: 'toggleDone', id: block.id }); yay(); onClose(); }} />
        <Btn title="Save" onPress={save} />
      </Row>
      {confirm ? (
        <Row>
          <Btn kind="secondary" title="Keep it" onPress={() => setConfirm(false)} />
          <Btn title="Delete for good" color={t.now} textColor="#FFFFFF" onPress={() => { dispatch({ type: 'remove', id: block.id }); toast(`Deleted ${block.title}.`); onClose(); }} />
        </Row>
      ) : (
        <Pressable onPress={() => { tap(); setConfirm(true); }} style={{ alignSelf: 'center', padding: 10 }} accessibilityRole="button">
          <Text style={{ color: t.now, fontWeight: '700' }}>Delete</Text>
        </Pressable>
      )}
    </Sheet>
  );
}
