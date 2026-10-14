import React, { useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import { useTheme, font } from '../theme';
import { useStore } from '../store';
import { Screen, Pad, Row, Eyebrow, Txt, Card, Chip, Icon, IconBadge, Sheet, Btn, Ring, tap, useToast } from '../ui';
import { GRADE_NAME, AFTER_LABEL, SAVING_LABEL, STATES, PROTECT, recHours, collegeBound, hasJob, schoolWeek } from '../content/quiz';
import { MAJOR_NAME, satEq } from '../content/colleges';
import { activeSplit } from '../content/training';
import { weekTotals } from '../logic';
import { StatsFields } from '../sheets/StatsEditor';

function Tile({ icon, color, title, sub, onPress }) {
  const t = useTheme();
  return (
    <Card onPress={onPress} style={{ width: '48%', gap: 10, minHeight: 128 }}>
      <IconBadge icon={icon} color={color} size={44} />
      <View><Txt bold>{title}</Txt><Txt small muted numberOfLines={2}>{sub}</Txt></View>
    </Card>
  );
}

export default function Me({ nav }) {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const { profile, setProfile, week, dispatch } = useStore();
  const toast = useToast();
  const [edit, setEdit] = useState(false);
  const tot = weekTotals(week);
  const goal = profile.hours || recHours(profile).h;
  const sw = schoolWeek();
  const sat = satEq(profile);
  const gymPlan = activeSplit(profile);

  const tiles = [
    collegeBound(profile) && ['sat', 'book', t.types.study.c, 'SAT study hub', 'Free official prep'],
    ['transcript', 'doc', t.types.school.c, 'Transcript & GPA', profile.transcript ? `${profile.transcript.length} classes` : 'See where your GPA can go'],
    profile.acts['Gym / working out'] && ['gym', 'dumbbell', t.types.gym.c, 'Training', `${gymPlan.length} days a week`],
    hasJob(profile) && ['money', 'dollar', t.types.work.c, 'Money & hours', profile.saving && profile.saving !== 'none' ? SAVING_LABEL[profile.saving] : 'Track pay and goals'],
    ['fafsa', 'flag', '#B85A12', 'FAFSA', profile.fafsa.submitted ? 'Submitted' : 'Free money for school'],
    ['widgets', 'widget', '#3B465C', 'Widgets', 'Home screen preview'],
  ].filter(Boolean);
  // Everyone can open every tool, even if it doesn't match their answers.
  const extra = [
    !collegeBound(profile) && ['sat', 'book', t.types.study.c, 'SAT study hub', 'Free official prep'],
    !profile.acts['Gym / working out'] && ['gym', 'dumbbell', t.types.gym.c, 'Training', 'Build a workout plan'],
    !hasJob(profile) && ['money', 'dollar', t.types.work.c, 'Money & hours', 'Track pay and goals'],
  ].filter(Boolean);

  return (
    <Screen padTop={false}>
      <View style={{ backgroundColor: t.deep, paddingTop: insets.top + 18, paddingHorizontal: 20, paddingBottom: 22, overflow: 'hidden' }}>
        <Svg style={{ position: 'absolute', right: -50, top: -30 }} width={240} height={240}><Circle cx="130" cy="110" r="100" fill={t.glow} opacity="0.18" /><Circle cx="60" cy="40" r="26" fill="#F2C48D" opacity="0.35" /></Svg>
        <Text style={[font.eyebrow, { color: '#9AA6BC' }]}>{GRADE_NAME[profile.grade] || 'Student'}{sw.summer ? ' · summer' : ` · ${sw.sem}, week ${sw.week}`}</Text>
        <Text style={[font.display, { color: '#FFFFFF', fontSize: 32 }]}>You</Text>
        <Text style={{ color: '#C3CCDD', marginTop: 4 }}>{AFTER_LABEL[profile.after] || 'Exploring'}{profile.major && collegeBound(profile) ? ` · ${MAJOR_NAME[profile.major]}` : ''} · {STATES[profile.state]}</Text>
        <Row gap={10} style={{ marginTop: 16 }}>
          {[['GPA', profile.gpaUnsure ? '?' : profile.gpa.toFixed(1)], [profile.scoreType === 'act' ? 'ACT' : 'SAT', sat == null ? '—' : profile.scoreType === 'act' ? profile.act : sat], ['Study', `${tot.study.toFixed(1).replace('.0', '')}/${goal}h`]].map(([k, v]) => (
            <Pressable key={k} onPress={() => setEdit(true)} style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 16, padding: 12 }}>
              <Text style={{ color: '#9AA6BC', fontSize: 11, fontWeight: '800' }}>{k}</Text>
              <Text style={{ color: '#FFFFFF', fontSize: 22, fontWeight: '900' }}>{v}</Text>
            </Pressable>
          ))}
        </Row>
        <Pressable onPress={() => setEdit(true)} style={{ marginTop: 10 }}><Text style={{ color: '#A9C0F7', fontWeight: '700' }}>Edit grades, scores and state →</Text></Pressable>
      </View>

      <Pad gap={12} style={{ marginTop: 18 }}>
        <Eyebrow>Your tools</Eyebrow>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 12 }}>
          {tiles.map(([k, icon, color, title, sub]) => <Tile key={k} icon={icon} color={color} title={title} sub={sub} onPress={() => nav.push(k)} />)}
        </View>
        {extra.length ? (
          <>
            <Eyebrow>More tools</Eyebrow>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 12 }}>
              {extra.map(([k, icon, color, title, sub]) => <Tile key={k} icon={icon} color={color} title={title} sub={sub} onPress={() => nav.push(k)} />)}
            </View>
          </>
        ) : null}

        <Eyebrow>Study goal</Eyebrow>
        <Card>
          <Row style={{ justifyContent: 'space-between' }}>
            <Txt bold>{goal} hours a week</Txt>
            <Row gap={6}>
              <Chip small label="−" onPress={() => setProfile({ hours: Math.max(1, goal - 1), hoursTouched: true })} />
              <Chip small label="+" onPress={() => setProfile({ hours: Math.min(15, goal + 1), hoursTouched: true })} />
            </Row>
          </Row>
          <Txt small muted>Recommended: {recHours(profile).h}. {recHours(profile).why}</Txt>
          {goal >= 9 ? <Txt small bold color={t.warnI}>That's a lot on top of school. Keep time to rest so you don't burn out.</Txt> : null}
        </Card>

        <Eyebrow>Protected time</Eyebrow>
        <Row wrap gap={8}>{PROTECT.map((x) => <Chip key={x} small label={x} on={!!profile.protect[x]} color={t.types.work.c} onPress={() => setProfile((p) => ({ protect: { ...p.protect, [x]: !p.protect[x] } }))} />)}</Row>
        <Txt small muted>Baseline won't suggest study sessions during these times.</Txt>

        <Eyebrow style={{ marginTop: 8 }}>Settings</Eyebrow>
        <Card onPress={() => setProfile({ onboarded: false })} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Icon name="sparkle" color={t.ink} /><Txt bold style={{ flex: 1 }}>Retake the setup quiz</Txt><Icon name="chevron" color={t.muted} size={18} />
        </Card>
        <Card onPress={() => Alert.alert('Clear my week?', 'This removes every block on your week. Your profile stays.', [{ text: 'Cancel', style: 'cancel' }, { text: 'Clear', style: 'destructive', onPress: () => { dispatch({ type: 'removeWhere', fn: () => true }); toast('Week cleared.'); } }])} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Icon name="trash" color={t.ink} /><Txt bold style={{ flex: 1 }}>Clear my week</Txt>
        </Card>
        <Card onPress={() => Alert.alert('Start over?', 'This erases everything and restarts setup.', [{ text: 'Cancel', style: 'cancel' }, { text: 'Start over', style: 'destructive', onPress: () => dispatch({ type: 'reset' }) }])} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Icon name="close" color={t.now} /><Txt bold color={t.now} style={{ flex: 1 }}>Start over</Txt>
        </Card>
        <Txt small muted style={{ textAlign: 'center', marginTop: 8 }}>Baseline · your data stays on this phone</Txt>
      </Pad>

      <Sheet visible={edit} onClose={() => setEdit(false)} title="Grades & scores">
        <StatsFields p={profile} set={setProfile} />
        <Row><Btn title="Done" onPress={() => setEdit(false)} /></Row>
      </Sheet>
    </Screen>
  );
}
