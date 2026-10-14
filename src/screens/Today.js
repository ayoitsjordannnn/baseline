import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, PanResponder, Pressable, Text, View } from 'react-native';
import { useTheme, TYPE_LABEL, font } from '../theme';
import { useStore } from '../store';
import { Screen, Pad, Row, H1, Eyebrow, Txt, Card, Ring, Icon, tap, thud, yay, useToast } from '../ui';
import { QuickAddSheet, EditSheet } from '../sheets/BlockSheets';
import {
  DAYS, DAYS_FULL, MONTHS, DAY_START, DAY_END, fmtTime, fmtShort, fmtDur, fmtRange, snap, clamp,
  weekStart, dateOf, todayIndex, nowHours, dayBlocks, gaps, bookedHours, loadLabel, nextUp, sleepWindow,
} from '../logic';
import { FafsaBanner } from './Fafsa';

const HOUR_H = 60;
const LOAD_COLORS = ['#2FA37F', '#2F5FD0', '#E0782F', '#E5484D'];

function DayStrip({ week, day, setDay, start, tIdx, t }) {
  return (
    <Row gap={6}>
      {DAYS.map((n, i) => {
        const bl = dayBlocks(week, i);
        const h = bookedHours(bl);
        const lv = loadLabel(h).level;
        const on = i === day;
        const dt = dateOf(start, i);
        return (
          <Pressable key={n} onPress={() => { tap(); setDay(i); }} accessibilityLabel={`${DAYS_FULL[i]}, ${loadLabel(h).label}`} accessibilityState={{ selected: on }}
            style={({ pressed }) => ({ flex: 1, borderRadius: 14, paddingVertical: 8, alignItems: 'center', gap: 4, backgroundColor: on ? t.btn : t.surface, borderWidth: 1, borderColor: on ? t.btn : t.line, transform: [{ scale: pressed ? 0.94 : 1 }] })}>
            <Text style={{ fontSize: 11, fontWeight: '700', color: on ? t.btnInk : t.muted }}>{n[0]}</Text>
            <Text style={{ fontSize: 17, fontWeight: '800', color: on ? t.btnInk : t.ink }}>{dt.getDate()}</Text>
            <View style={{ width: 22, height: 22, justifyContent: 'flex-end', alignItems: 'center' }}>
              <View style={{ width: 6, height: 4 + lv * 6, borderRadius: 3, backgroundColor: LOAD_COLORS[lv] }} />
            </View>
            {i === tIdx ? <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: on ? t.btnInk : t.now }} /> : <View style={{ height: 4 }} />}
          </Pressable>
        );
      })}
    </Row>
  );
}

function TimelineBlock({ b, t, onOpen, onToggle, onMove, setScrollLock }) {
  const pan = useRef(new Animated.Value(0)).current;
  const lift = useRef(new Animated.Value(0)).current;
  const dragging = useRef(false);
  const bRef = useRef(b);
  bRef.current = b;
  const steps = useRef(0);
  const [preview, setPreview] = useState(null);

  const finish = (dy) => {
    if (!dragging.current) return;
    dragging.current = false;
    const cur = bRef.current;
    const dur = cur.end - cur.start;
    const ns = clamp(snap(cur.start + dy / HOUR_H, 0.25), DAY_START, DAY_END - dur);
    Animated.timing(lift, { toValue: 0, duration: 150, useNativeDriver: true }).start();
    pan.setValue(0);
    setPreview(null);
    setScrollLock(false);
    if (Math.abs(ns - cur.start) > 0.01) onMove(cur, ns);
  };
  const responder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: () => dragging.current,
      onMoveShouldSetPanResponderCapture: () => dragging.current,
      onPanResponderTerminationRequest: () => false,
      onPanResponderMove: (_, g) => {
        pan.setValue(g.dy);
        const s = Math.round(g.dy / (HOUR_H / 4));
        if (s !== steps.current) {
          steps.current = s;
          tap();
          const cur = bRef.current;
          setPreview(clamp(cur.start + s / 4, DAY_START, DAY_END - (cur.end - cur.start)));
        }
      },
      onPanResponderRelease: (_, g) => finish(g.dy),
      onPanResponderTerminate: (_, g) => finish(g.dy),
    })
  ).current;

  const c = t.types[b.type] || t.types.free;
  const dur = b.end - b.start;
  const h = Math.max(28, dur * HOUR_H - 4);
  const compact = h < 50;
  return (
    <Animated.View
      {...responder.panHandlers}
      style={{
        position: 'absolute', left: 58, right: 12, top: (b.start - DAY_START) * HOUR_H + 2, height: h, zIndex: preview != null ? 10 : 1,
        transform: [{ translateY: pan }, { scale: lift.interpolate({ inputRange: [0, 1], outputRange: [1, 1.03] }) }],
        shadowColor: '#000', shadowOpacity: preview != null ? 0.25 : 0, shadowRadius: 10, shadowOffset: { width: 0, height: 6 }, elevation: preview != null ? 8 : 0,
      }}
    >
      <Pressable
        onPress={() => { tap(); onOpen(b); }}
        onLongPress={() => {
          dragging.current = true; steps.current = 0; setScrollLock(true); thud(); setPreview(b.start);
          Animated.spring(lift, { toValue: 1, useNativeDriver: true }).start();
        }}
        delayLongPress={280}
        accessibilityRole="button"
        accessibilityLabel={`${b.title}, ${fmtRange(b.start, b.end)}. Long press and drag to move.`}
        style={{ flex: 1, borderRadius: 14, backgroundColor: c.t, borderWidth: b.type === 'free' ? 1 : 0, borderColor: t.line, paddingHorizontal: 12, paddingVertical: compact ? 4 : 10, flexDirection: 'row', gap: 10, opacity: b.done ? 0.55 : 1, overflow: 'hidden' }}
      >
        <View style={{ width: 4, borderRadius: 2, backgroundColor: c.c }} />
        <View style={{ flex: 1, justifyContent: compact ? 'center' : 'flex-start', gap: 2 }}>
          <Text numberOfLines={1} style={{ fontWeight: '800', fontSize: compact ? 13 : 15, color: t.ink, textDecorationLine: b.done ? 'line-through' : 'none' }}>
            {b.title}{compact ? `  ·  ${fmtShort(b.start)}` : ''}
          </Text>
          {!compact ? <Text numberOfLines={1} style={{ fontSize: 13, color: t.soft }}>{fmtRange(b.start, b.end)}{b.detail ? ` · ${b.detail}` : ''}</Text> : null}
          {!compact && h > 90 ? <Text style={{ fontSize: 11, fontWeight: '800', letterSpacing: 0.6, color: c.i, textTransform: 'uppercase' }}>{TYPE_LABEL[b.type]} · {fmtDur(dur)}</Text> : null}
        </View>
        {b.type !== 'free' ? (
          <Pressable onPress={() => { yay(); onToggle(b); }} hitSlop={8} accessibilityRole="checkbox" accessibilityState={{ checked: !!b.done }} accessibilityLabel={`Mark ${b.title} done`}
            style={{ width: compact ? 22 : 28, height: compact ? 22 : 28, borderRadius: 14, borderWidth: 2, borderColor: b.done ? c.c : c.i, backgroundColor: b.done ? c.c : 'transparent', alignItems: 'center', justifyContent: 'center', alignSelf: compact ? 'center' : 'flex-start' }}>
            {b.done ? <Icon name="check" color="#FFFFFF" size={compact ? 14 : 16} width={3} /> : null}
          </Pressable>
        ) : null}
      </Pressable>
      {preview != null ? (
        <View style={{ position: 'absolute', left: -56, top: -10, backgroundColor: c.c, borderRadius: 8, paddingHorizontal: 6, paddingVertical: 3 }}>
          <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 11 }}>{fmtShort(preview)}</Text>
        </View>
      ) : null}
    </Animated.View>
  );
}

function Timeline({ blocks, isToday, now, t, onOpen, onToggle, onMove, onAddGap, setScrollLock, freeFrom }) {
  const hours = [];
  for (let h = DAY_START; h <= DAY_END; h++) hours.push(h);
  const free = gaps(blocks, freeFrom, 22.5, 0.5);
  return (
    <View style={{ height: (DAY_END - DAY_START) * HOUR_H + 20, marginTop: 6 }}>
      {hours.map((h) => (
        <View key={h} style={{ position: 'absolute', left: 0, right: 0, top: (h - DAY_START) * HOUR_H, flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ width: 52, textAlign: 'right', fontSize: 11, color: t.muted, fontVariant: ['tabular-nums'] }}>{fmtShort(h)}</Text>
          <View style={{ flex: 1, height: 1, backgroundColor: t.line, marginLeft: 6, opacity: 0.6 }} />
        </View>
      ))}
      {free.map((g) => {
        const len = g.end - g.start;
        return (
          <Pressable key={`g${g.start}`} onPress={() => { tap(); onAddGap(g); }} accessibilityRole="button" accessibilityLabel={`${fmtDur(len)} free at ${fmtTime(g.start)}. Tap to add something.`}
            style={({ pressed }) => ({ position: 'absolute', left: 58, right: 12, top: (g.start - DAY_START) * HOUR_H + 4, height: Math.max(26, len * HOUR_H - 8), borderRadius: 14, borderWidth: 1.5, borderStyle: 'dashed', borderColor: t.line, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 6, opacity: pressed ? 0.6 : 1 })}>
            <Icon name="plus" color={t.muted} size={16} />
            <Text style={{ color: t.muted, fontWeight: '700', fontSize: 13 }}>{fmtDur(len)} free</Text>
          </Pressable>
        );
      })}
      {blocks.map((b) => <TimelineBlock key={b.id} b={b} t={t} onOpen={onOpen} onToggle={onToggle} onMove={onMove} setScrollLock={setScrollLock} />)}
      {isToday && now >= DAY_START && now <= DAY_END ? (
        <View pointerEvents="none" style={{ position: 'absolute', left: 50, right: 0, top: (now - DAY_START) * HOUR_H - 1, flexDirection: 'row', alignItems: 'center', zIndex: 20 }}>
          <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: t.now }} />
          <View style={{ flex: 1, height: 2, backgroundColor: t.now }} />
        </View>
      ) : null}
    </View>
  );
}

export default function Today({ nav, params }) {
  const t = useTheme();
  const { week, dispatch, profile } = useStore();
  const toast = useToast();
  const start = useMemo(() => weekStart(), []);
  const tIdx = todayIndex();
  const [day, setDay] = useState(params && params.day != null ? params.day : tIdx);
  const [now, setNow] = useState(nowHours());
  const [lock, setLock] = useState(false);
  const [add, setAdd] = useState(null);
  const [edit, setEdit] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => { if (params && params.day != null) setDay(params.day); }, [params]);
  useEffect(() => { const i = setInterval(() => setNow(nowHours()), 30000); return () => clearInterval(i); }, []);
  useEffect(() => {
    const target = day === tIdx ? Math.max(DAY_START, now - 1.5) : 7;
    const id = setTimeout(() => scrollRef.current && scrollRef.current.scrollTo({ y: 330 + (target - DAY_START) * HOUR_H, animated: true }), 350);
    return () => clearTimeout(id);
  }, [day]); // eslint-disable-line react-hooks/exhaustive-deps

  const blocks = dayBlocks(week, day);
  const isToday = day === tIdx;
  const booked = bookedHours(blocks);
  const load = loadLabel(booked);
  const tasks = blocks.filter((b) => b.type !== 'free');
  const done = tasks.filter((b) => b.done).length;
  const freeFrom = isToday ? Math.max(6, Math.ceil(now * 4) / 4) : 6;
  const freeHrs = gaps(blocks, freeFrom, 22.5, 0.5).reduce((a, g) => a + g.end - g.start, 0);
  const nu = isToday ? nextUp(blocks, now) : null;
  const sleep = sleepWindow(week, day);
  const dt = dateOf(start, day);
  const title = isToday ? { Chill: 'Easy day today', Steady: 'Steady day', Busy: 'Busy day', Packed: 'Long day today' }[load.label] : `${DAYS_FULL[day]} is ${load.label.toLowerCase()}`;

  const onMove = (b, ns) => {
    const dur = b.end - b.start;
    dispatch({ type: 'update', id: b.id, patch: { start: ns, end: ns + dur } });
    toast(`Moved ${b.title} to ${fmtTime(ns)}.`);
  };
  const onToggle = (b) => {
    dispatch({ type: 'toggleDone', id: b.id });
    if (!b.done && done + 1 === tasks.length) toast('Everything done today. Nice work!');
  };

  return (
    <Screen scrollRef={scrollRef} scrollEnabled={!lock}>
      <Pad gap={14}>
        <Row style={{ justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <View style={{ flex: 1, gap: 2 }}>
            <Eyebrow>{DAYS_FULL[day]} · {MONTHS[dt.getMonth()]} {dt.getDate()}{isToday ? ' · Today' : ''}</Eyebrow>
            <H1>{title}</H1>
          </View>
          <Pressable onPress={() => { tap(); setAdd({ day }); }} accessibilityRole="button" accessibilityLabel="Add to schedule"
            style={({ pressed }) => ({ width: 52, height: 52, borderRadius: 16, backgroundColor: t.btn, alignItems: 'center', justifyContent: 'center', transform: [{ scale: pressed ? 0.92 : 1 }] })}>
            <Icon name="plus" color={t.btnInk} size={24} width={2.6} />
          </Pressable>
        </Row>
        <DayStrip week={week} day={day} setDay={setDay} start={start} tIdx={tIdx} t={t} />

        <Card style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <Ring pct={tasks.length ? done / tasks.length : 0} size={70} stroke={9} color={LOAD_COLORS[load.level]}>
            <Text style={{ fontWeight: '800', fontSize: 16, color: t.ink }}>{done}/{tasks.length}</Text>
          </Ring>
          <View style={{ flex: 1, gap: 4 }}>
            <Row gap={8}>
              <View style={{ backgroundColor: LOAD_COLORS[load.level], borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3 }}><Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 12 }}>{load.label.toUpperCase()}</Text></View>
              <Txt small muted>{fmtDur(booked)} booked</Txt>
            </Row>
            <Txt small soft>{freeHrs ? `${fmtDur(freeHrs)} free${isToday ? ' left' : ''} · ` : 'No free time · '}about {fmtDur(sleep)} of sleep tonight</Txt>
          </View>
        </Card>

        {isToday ? <FafsaBanner nav={nav} /> : null}

        {nu ? (
          <Pressable onPress={() => { tap(); setEdit(nu); }} accessibilityRole="button"
            style={({ pressed }) => ({ backgroundColor: t.types[nu.type].c, borderRadius: 20, padding: 18, gap: 6, transform: [{ scale: pressed ? 0.98 : 1 }] })}>
            <Row style={{ justifyContent: 'space-between' }}>
              <Text style={[font.eyebrow, { color: 'rgba(255,255,255,0.85)' }]}>{nu.start <= now ? 'Happening now' : 'Next up'}</Text>
              <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 13 }}>
                {nu.start <= now ? `${fmtDur(Math.max(0.0167, nu.end - now))} left` : `in ${fmtDur(Math.max(0.0167, nu.start - now))}`}
              </Text>
            </Row>
            <Text style={{ color: '#FFFFFF', fontWeight: '900', fontSize: 26, letterSpacing: -0.5 }} numberOfLines={1}>{nu.title}</Text>
            <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 15 }}>{fmtRange(nu.start, nu.end)}{nu.detail ? ` · ${nu.detail}` : ''}</Text>
            {nu.start <= now ? <View style={{ marginTop: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.3)', overflow: 'hidden' }}><View style={{ height: 6, width: `${Math.min(100, ((now - nu.start) / (nu.end - nu.start)) * 100)}%`, backgroundColor: '#FFFFFF' }} /></View> : null}
          </Pressable>
        ) : null}

        <Row style={{ justifyContent: 'space-between' }}>
          <Eyebrow>Timeline</Eyebrow>
          <Txt small muted>Hold and drag to move</Txt>
        </Row>
      </Pad>
      <Timeline
        blocks={blocks} isToday={isToday} now={now} t={t} freeFrom={freeFrom}
        onOpen={(b) => setEdit(b)} onToggle={onToggle} onMove={onMove} setScrollLock={setLock}
        onAddGap={(g) => setAdd({ day, start: g.start, dur: Math.min(1, g.end - g.start) })}
      />
      <Pad>
        <Card onPress={() => nav.push('widgets')} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Icon name="widget" color={t.ink} />
          <View style={{ flex: 1 }}><Txt bold>Home screen widgets</Txt><Txt small muted>See what's next without opening the app</Txt></View>
          <Icon name="chevron" color={t.muted} size={18} />
        </Card>
      </Pad>
      <QuickAddSheet visible={!!add} initial={add} onClose={(d) => { setAdd(null); if (d != null) setDay(d); }} />
      <EditSheet visible={!!edit} block={edit} onClose={() => setEdit(null)} />
    </Screen>
  );
}
