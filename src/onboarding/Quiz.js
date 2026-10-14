import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ForceTheme, useTheme, font } from '../theme';
import { useStore } from '../store';
import { Btn, Chip, Icon, Row, Txt, Eyebrow, Bar, tap, yay } from '../ui';
import Logo from '../Logo';
import { StatsFields } from '../sheets/StatsEditor';
import { Q, ACTS, PROTECT, GRADE_NAME, AFTER_LABEL, SAVING_LABEL, STEPS, QUESTION_STEPS, questionVisible, recHours, collegeBound, hasJob, schoolWeek, fafsaOpenDate } from '../content/quiz';
import { KINDS, SPLITS, activeSplit, curSplitKey } from '../content/training';
import { MAJOR_NAME } from '../content/colleges';
import { BRANCHES, TRADES } from '../content/paths';
import { MONTHS } from '../logic';
import { starterWeek } from '../starter';

const SPLIT_MODE = { own: 'own', help: 'rec', simple: 'simple' };

function Opt({ title, sub, on, onPress, grid }) {
  const t = useTheme();
  return (
    <Pressable onPress={() => { tap(); onPress(); }} accessibilityRole="button" accessibilityState={{ selected: !!on }}
      style={({ pressed }) => ({ width: grid ? '48%' : '100%', minHeight: grid ? 84 : 60, borderRadius: 18, borderWidth: 2, borderColor: on ? t.glow : t.line, backgroundColor: on ? '#1E2B4D' : t.surface, padding: 14, justifyContent: 'center', gap: 2, transform: [{ scale: pressed ? 0.97 : 1 }] })}>
      <Row style={{ justifyContent: 'space-between' }}>
        <Text style={{ color: t.ink, fontSize: grid ? 22 : 17, fontWeight: '800', flex: 1 }}>{title}</Text>
        {on ? <Icon name="check" color={t.glow} size={20} width={3} /> : null}
      </Row>
      {sub ? <Text style={{ color: t.muted, fontSize: 13 }}>{sub}</Text> : null}
    </Pressable>
  );
}

function Title({ children, sub }) {
  const t = useTheme();
  return (
    <View style={{ gap: 8, marginBottom: 8 }}>
      <Text accessibilityRole="header" style={[font.display, { color: t.ink, fontSize: 30, lineHeight: 33 }]}>{children}</Text>
      {sub ? <Text style={{ color: t.soft, fontSize: 15, lineHeight: 21 }}>{sub}</Text> : null}
    </View>
  );
}

function Loading({ p, onDone }) {
  const t = useTheme();
  const lines = useMemo(() => [
    `Setting up your ${GRADE_NAME[p.grade] ? GRADE_NAME[p.grade].toLowerCase() : ''} year`,
    p.acts.Sports && 'Fitting in practice and games',
    hasJob(p) && 'Making room for work shifts',
    p.acts['Gym / working out'] && 'Placing your workouts',
    collegeBound(p) ? 'Matching colleges to your stats' : p.after === 'military' ? 'Loading your military path' : p.after === 'trade' ? 'Finding trade programs' : 'Mapping your options',
    'Protecting your free time',
  ].filter(Boolean), [p]);
  const [n, setN] = useState(0);
  const spin = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(Animated.timing(spin, { toValue: 1, duration: 1400, easing: Easing.linear, useNativeDriver: true }));
    loop.start();
    const ids = lines.map((_, i) => setTimeout(() => { setN(i + 1); tap(); }, 450 * (i + 1)));
    const done = setTimeout(onDone, 450 * lines.length + 700);
    return () => { loop.stop(); ids.forEach(clearTimeout); clearTimeout(done); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <View style={{ flex: 1, justifyContent: 'center', gap: 22 }}>
      <Animated.View style={{ alignSelf: 'center', transform: [{ rotate: spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) }] }}>
        <View style={{ width: 64, height: 64, borderRadius: 32, borderWidth: 6, borderColor: t.track, borderTopColor: t.glow }} />
      </Animated.View>
      <Text style={[font.display, { color: t.ink, fontSize: 26, textAlign: 'center' }]}>Adapting Baseline to you…</Text>
      <View style={{ gap: 10, alignSelf: 'center' }}>
        {lines.map((l, i) => (
          <Row key={l} gap={10} style={{ opacity: i < n ? 1 : 0.25 }}>
            <Icon name={i < n ? 'check' : 'clock'} color={i < n ? '#7FDDB9' : t.muted} size={18} width={2.6} />
            <Text style={{ color: t.ink, fontSize: 15 }}>{l}</Text>
          </Row>
        ))}
      </View>
    </View>
  );
}

function pep(p) {
  const sw = schoolWeek();
  const mid = !sw.summer && sw.week > 2 ? ` You're joining in week ${sw.week} of the ${sw.sem.toLowerCase()}, and that's fine.` : '';
  switch (p.grade) {
    case '9th': return ['You\'re starting at the perfect time.', `Freshman grades count toward your GPA, and every habit you build now makes junior year easier. Most people figure this out too late. You won't.${mid}`];
    case '10th': return ['It\'s not too late. Not even close.', `You still have five semesters of grades ahead, which is plenty of room to raise your GPA. Starting SAT practice this year puts you way ahead.${mid}`];
    case '11th': return ['Junior year is the big one, and you\'re on it.', `This is the year that counts most for grades and test scores. A few focused hours a week now beats panicking next fall.${mid}`];
    case '12th': return ['Let\'s lock in.', `Applications, the FAFSA and deadlines are all happening now. Baseline keeps it on one screen so nothing slips.${mid}`];
    default: return ['Let\'s build your week.', mid.trim()];
  }
}

function QuizBody({ initialStep }) {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const { profile: p, setProfile, dispatch } = useStore();
  const [step, setStep] = useState(initialStep || 'intro');
  const fade = useRef(new Animated.Value(1)).current;
  const pRef = useRef(p);
  const stepRef = useRef(step);
  pRef.current = p;
  stepRef.current = step;
  const qVisible = QUESTION_STEPS.filter((s) => questionVisible(s, p));
  const qi = qVisible.indexOf(step);
  const pct = qi >= 0 ? ((qi + 1) / qVisible.length) * 100 : step === 'intro' ? 0 : 100;

  const go = (dir) => {
    // Read the latest answers: a one-tap answer can change which questions come next.
    const list = STEPS.filter((s) => questionVisible(s, pRef.current));
    const i = list.indexOf(stepRef.current);
    const next = list[Math.max(0, Math.min(list.length - 1, i + dir))];
    Animated.timing(fade, { toValue: 0, duration: 120, useNativeDriver: true }).start(() => {
      setStep(next);
      Animated.timing(fade, { toValue: 1, duration: 220, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
    });
  };
  // Answer a one-tap question, then move on after a beat so the tap is visible.
  const pick = (patch) => { setProfile(patch); setTimeout(() => go(1), 220); };
  const recH = recHours(p);
  const hours = p.hoursTouched && p.hours ? p.hours : recH.h;

  const finish = (build) => {
    yay();
    if (build) dispatch({ type: 'load', week: starterWeek({ ...p, hours }), profile: { ...p, hours, onboarded: true } });
    else setProfile({ hours, onboarded: true });
  };

  let body = null;
  let footer = null;
  const q = Q[step];
  if (step === 'intro') {
    body = (
      <View style={{ flex: 1, justifyContent: 'center', gap: 18 }}>
        <Logo size={88} />
        <Text style={[font.display, { color: t.ink, fontSize: 42, lineHeight: 44 }]}>Baseline</Text>
        <Text style={{ color: t.soft, fontSize: 19, lineHeight: 26 }}>Practice, school, work, the SAT and a life. One week that actually fits.</Text>
        <Text style={{ color: t.muted, fontSize: 15 }}>A few quick questions and Baseline builds your week. About 1 minute.</Text>
      </View>
    );
    footer = <Btn title="Let's go" color={t.glow} textColor="#0A101C" onPress={() => go(1)} />;
  } else if (q && !['acts'].includes(step)) {
    const val = p[step];
    body = (
      <>
        <Title sub={q.sub}>{q.title}</Title>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 10 }}>
          {q.opts.map(([k, title, sub]) => (
            <Opt key={k} grid={q.grid} title={q.grid && step === 'gym' && k !== '?' ? k : title} sub={q.grid && step === 'gym' ? (k === '?' ? '' : title) : sub} on={val === k}
              onPress={() => {
                const patch = { [step]: k };
                if (step === 'gymplan') patch.splitMode = SPLIT_MODE[k];
                if (step === 'gym') patch.splitKey = null;
                if (step === 'after') { patch.explore = false; patch.pathView = { trade: 'trade', military: 'military', work: 'work' }[k] || 'college'; }
                if (step === 'test') patch.scoreType = k === 'taken' || k === 'done' ? p.scoreType || 'sat' : p.scoreType;
                pick(patch);
              }} />
          ))}
        </View>
      </>
    );
  } else if (step === 'acts' || step === 'gymkind' || step === 'protect') {
    const conf = {
      acts: ['What fills your week?', 'Pick everything that applies.', ACTS, p.acts, 'acts'],
      gymkind: ['What kind of training?', 'Pick all that you do or want to do.', KINDS, p.gymKinds, 'gymKinds'],
      protect: ['What time is off-limits?', 'Baseline won\'t put study sessions here. Friends and rest matter too.', PROTECT, p.protect, 'protect'],
    }[step];
    const [title, sub, list, state, key] = conf;
    const any = list.some((x) => state[x]);
    body = (
      <>
        <Title sub={sub}>{title}</Title>
        <Row wrap gap={10}>
          {list.map((x) => (
            <Chip key={x} label={x} on={!!state[x]} color={t.glow}
              onPress={() => setProfile((pp) => {
                const cur = { ...pp[key], [x]: !pp[key][x] };
                if (key === 'acts' && x === 'Nothing yet' && cur[x]) Object.keys(cur).forEach((k) => { if (k !== x) cur[k] = false; });
                if (key === 'acts' && x !== 'Nothing yet' && cur[x]) cur['Nothing yet'] = false;
                return { [key]: cur };
              })} style={{ minHeight: 48 }} />
          ))}
        </Row>
      </>
    );
    footer = <Btn title={any || step === 'protect' ? 'Next' : step === 'gymkind' ? 'Skip' : 'Pick at least one'} disabled={step === 'acts' && !any} color={t.glow} textColor="#0A101C" onPress={() => go(1)} />;
  } else if (step === 'stats') {
    body = (
      <>
        <Title sub="Rough is fine. You can change these anytime. They power your college matches and GPA tools.">Your numbers</Title>
        <StatsFields p={p} set={setProfile} />
      </>
    );
    footer = <Btn title="Next" color={t.glow} textColor="#0A101C" onPress={() => go(1)} />;
  } else if (step === 'hours') {
    const set = (h) => setProfile({ hours: Math.max(1, Math.min(15, h)), hoursTouched: true });
    body = (
      <>
        <Title sub={recH.why}>How many hours a week for studying?</Title>
        <View style={{ alignItems: 'center', gap: 6, paddingVertical: 10 }}>
          <Row gap={24}>
            <Pressable onPress={() => { tap(); set(hours - 1); }} accessibilityLabel="Fewer hours" style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: t.track, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: t.ink, fontSize: 30, fontWeight: '800' }}>−</Text></Pressable>
            <Text style={{ color: t.ink, fontSize: 72, fontWeight: '900', minWidth: 90, textAlign: 'center' }}>{hours}</Text>
            <Pressable onPress={() => { tap(); set(hours + 1); }} accessibilityLabel="More hours" style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: t.track, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: t.ink, fontSize: 30, fontWeight: '800' }}>+</Text></Pressable>
          </Row>
          <Text style={{ color: t.muted }}>hours a week · recommended {recH.h}</Text>
        </View>
        {hours >= 9 ? <View style={{ backgroundColor: t.warnT, borderRadius: 16, padding: 14 }}><Txt bold color={t.warnI}>That's a lot on top of school{p.acts.Sports ? ' and practice' : ''}. Rest is part of the plan, so don't burn out.</Txt></View> : null}
        {hours < recH.h ? <Txt small muted>Less than recommended is okay. Baseline will nudge you when you have open time.</Txt> : null}
      </>
    );
    footer = <Btn title="Next" color={t.glow} textColor="#0A101C" onPress={() => { if (!p.hoursTouched) setProfile({ hours: recH.h }); go(1); }} />;
  } else if (step === 'pep') {
    const [h, b] = pep(p);
    body = (
      <View style={{ flex: 1, justifyContent: 'center', gap: 16 }}>
        <Icon name="flame" color="#F2C48D" size={56} />
        <Text style={[font.display, { color: t.ink, fontSize: 36, lineHeight: 39 }]}>{h}</Text>
        <Text style={{ color: t.soft, fontSize: 17, lineHeight: 24 }}>{b}</Text>
      </View>
    );
    footer = <Btn title="Build my plan" color={t.glow} textColor="#0A101C" onPress={() => go(1)} />;
  } else if (step === 'loading') {
    body = <Loading p={p} onDone={() => go(1)} />;
  } else if (step === 'summary') {
    const d = fafsaOpenDate(p);
    const rows = [
      ['cap', `${GRADE_NAME[p.grade] || 'Student'} · ${AFTER_LABEL[p.after] || 'Exploring'}`],
      ['book', `${hours} hours of studying a week`],
      p.acts.Sports && ['flag', 'Practice and games on your week'],
      hasJob(p) && ['dollar', `Work shifts${p.saving && p.saving !== 'none' ? ` · saving for ${SAVING_LABEL[p.saving].toLowerCase()}` : ''}`],
      p.acts['Gym / working out'] && ['dumbbell', p.splitMode === 'own' ? 'Your own split (set it up in Training)' : p.splitMode === 'simple' ? `"Workout" ${activeSplit(p).length} days a week` : `${SPLITS[curSplitKey(p)].name}, ${activeSplit(p).length} days`],
      collegeBound(p) && p.major && ['target', `College matches for ${MAJOR_NAME[p.major].toLowerCase()}`],
      p.after === 'military' && ['shield', `${(BRANCHES[p.branch || 'unsure'] || {}).name || 'Military'} path and enlistment steps`],
      p.after === 'trade' && ['wrench', `${(TRADES[p.trade || 'unsure'] || {}).name || 'Trade'} training options`],
      collegeBound(p) && ['dollar', p.grade === '12th' ? 'FAFSA reminders (it\'s open now)' : `FAFSA countdown to ${MONTHS[d.getMonth()]} ${d.getFullYear()}`],
    ].filter(Boolean);
    body = (
      <>
        <Title sub="Here's what Baseline set up. Change anything later from the You tab.">You're all set</Title>
        <View style={{ gap: 10 }}>
          {rows.map(([icon, label]) => (
            <Row key={label} gap={12} style={{ backgroundColor: t.surface, borderRadius: 16, padding: 14 }}>
              <View style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: '#1E2B4D', alignItems: 'center', justifyContent: 'center' }}><Icon name={icon} color={t.glow} size={20} /></View>
              <Text style={{ color: t.ink, fontSize: 15, fontWeight: '700', flex: 1 }}>{label}</Text>
            </Row>
          ))}
        </View>
      </>
    );
    footer = (
      <View style={{ flex: 1, gap: 10 }}>
        <Row><Btn title="Build my week" color={t.glow} textColor="#0A101C" onPress={() => finish(true)} /></Row>
        <Row><Btn kind="secondary" color={t.line} title="Show me an example week first" onPress={() => finish(false)} /></Row>
      </View>
    );
  }

  const showBack = step !== 'intro' && step !== 'loading';
  return (
    <View style={{ flex: 1, backgroundColor: t.bg, paddingTop: insets.top + 8 }}>
      <Row style={{ paddingHorizontal: 12, minHeight: 48 }} gap={8}>
        {showBack ? (
          <Pressable onPress={() => { tap(); go(-1); }} accessibilityLabel="Back" style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}><Icon name="back" color={t.ink} /></Pressable>
        ) : <View style={{ width: 44 }} />}
        <View style={{ flex: 1 }}>{step !== 'intro' ? <Bar pct={pct} color={t.glow} height={8} /> : null}</View>
        <View style={{ width: 44 }} />
      </Row>
      <Animated.ScrollView style={{ flex: 1, opacity: fade, transform: [{ translateY: fade.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }] }}
        contentContainerStyle={{ flexGrow: 1, padding: 20, gap: 14 }} keyboardShouldPersistTaps="handled">
        {body}
      </Animated.ScrollView>
      {footer ? <View style={{ paddingHorizontal: 20, paddingTop: 10, paddingBottom: insets.bottom + 14, flexDirection: 'row' }}>{footer}</View> : null}
    </View>
  );
}

export default function Quiz({ initialStep }) {
  return <ForceTheme mode="dark"><QuizBody initialStep={initialStep} /></ForceTheme>;
}
