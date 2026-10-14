import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Linking, Modal, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, font } from '../theme';
import { useStore } from '../store';
import { Screen, Pad, Row, H1, Eyebrow, Txt, Card, Bar, Btn, Icon, TopBar, tap, yay, useToast } from '../ui';
import { FAFSA_STEPS, FAFSA_URL } from '../content/paths';
import { fafsaRelevant, fafsaOpenDate } from '../content/quiz';
import { MONTHS } from '../logic';

export const fafsaDue = (p) => p.grade === '12th' && fafsaRelevant(p) && !p.fafsa.submitted;
const stepsDone = (p) => FAFSA_STEPS.filter((_, i) => p.fafsa.steps[i]).length;

function Pulse({ color, size = 12 }) {
  const a = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(Animated.timing(a, { toValue: 1, duration: 1500, easing: Easing.out(Easing.quad), useNativeDriver: true }));
    loop.start();
    return () => loop.stop();
  }, [a]);
  return (
    <View style={{ width: size * 2, height: size * 2, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View style={{ position: 'absolute', width: size, height: size, borderRadius: size / 2, backgroundColor: color, opacity: a.interpolate({ inputRange: [0, 1], outputRange: [0.6, 0] }), transform: [{ scale: a.interpolate({ inputRange: [0, 1], outputRange: [1, 2.6] }) }] }} />
      <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color }} />
    </View>
  );
}

export function FafsaBanner({ nav }) {
  const t = useTheme();
  const { profile } = useStore();
  if (fafsaDue(profile)) {
    return (
      <Pressable onPress={() => { tap(); nav.push('fafsa'); }} accessibilityRole="button"
        style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, borderRadius: 18, borderWidth: 2, borderColor: '#F2C48D', backgroundColor: t.warnT, transform: [{ scale: pressed ? 0.98 : 1 }] })}>
        <Pulse color="#E5484D" />
        <View style={{ flex: 1 }}>
          <Txt bold color={t.warnI}>The FAFSA is open. File it now.</Txt>
          <Txt small color={t.warnI}>{stepsDone(profile)} of {FAFSA_STEPS.length} steps done · grants and aid can run out</Txt>
        </View>
        <Icon name="chevron" color={t.warnI} size={18} />
      </Pressable>
    );
  }
  if (fafsaRelevant(profile) && profile.grade && profile.grade !== '12th') {
    const d = fafsaOpenDate(profile);
    const days = Math.ceil((d - new Date()) / 864e5);
    return (
      <Card onPress={() => nav.push('fafsa')} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: t.warnT, alignItems: 'center', justifyContent: 'center' }}><Icon name="dollar" color={t.warnI} /></View>
        <View style={{ flex: 1 }}>
          <Txt bold>Your FAFSA opens {MONTHS[d.getMonth()]} {d.getDate()}, {d.getFullYear()}</Txt>
          <Txt small muted>{days} days away · it's how you get grants and aid</Txt>
        </View>
        <Icon name="chevron" color={t.muted} size={18} />
      </Card>
    );
  }
  return null;
}

// Pops up every time the app opens until a senior files, unless snoozed for a day.
export function FafsaModal({ nav }) {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const { profile, setProfile } = useStore();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (fafsaDue(profile) && Date.now() > (profile.fafsa.snooze || 0)) {
      const id = setTimeout(() => setOpen(true), 900);
      return () => clearTimeout(id);
    }
    return undefined;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
      <View style={{ flex: 1, backgroundColor: 'rgba(8,12,24,0.6)', justifyContent: 'flex-end' }}>
        <View style={{ backgroundColor: t.surface, borderTopLeftRadius: 26, borderTopRightRadius: 26, padding: 22, paddingBottom: insets.bottom + 22, gap: 14 }}>
          <Row gap={6}><Pulse color="#E5484D" size={14} /><Eyebrow color={t.warnI}>Senior to-do</Eyebrow></Row>
          <H1 size={30}>The FAFSA is open. Don't leave money on the table.</H1>
          <Txt soft>It's the free form that unlocks grants, work-study and aid for college. Some state and college money is first come, first served, so filing early matters.</Txt>
          <Txt bold>{stepsDone(profile)} of {FAFSA_STEPS.length} steps done</Txt>
          <Row><Btn title="Start my FAFSA checklist" color={t.warnI} textColor={t.warnT} onPress={() => { setOpen(false); nav.push('fafsa'); }} /></Row>
          <Row><Btn kind="secondary" title="Remind me tomorrow" onPress={() => { setProfile((p) => ({ fafsa: { ...p.fafsa, snooze: Date.now() + 864e5 } })); setOpen(false); }} /></Row>
        </View>
      </View>
    </Modal>
  );
}

export default function Fafsa({ nav }) {
  const t = useTheme();
  const { profile, setProfile } = useStore();
  const toast = useToast();
  const senior = profile.grade === '12th';
  const done = stepsDone(profile);
  const d = fafsaOpenDate(profile);
  const toggle = (i) => { yay(); setProfile((p) => ({ fafsa: { ...p.fafsa, steps: { ...p.fafsa.steps, [i]: !p.fafsa.steps[i] } } })); };
  return (
    <Screen>
      <TopBar title="FAFSA" onBack={nav.pop} />
      <Pad gap={14}>
        <H1>{senior ? (profile.fafsa.submitted ? 'FAFSA submitted. Nice work.' : 'File your FAFSA now') : 'Your FAFSA countdown'}</H1>
        <Txt soft>The FAFSA is the free form that unlocks federal grants, work-study and student loans, and most state and college aid too. {senior ? 'The FAFSA for next school year is open right now.' : `Yours opens ${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}, the fall of your senior year.`}</Txt>
        {senior ? (
          <Card>
            <Row style={{ justifyContent: 'space-between' }}><Txt bold>Your progress</Txt><Txt bold>{done} of {FAFSA_STEPS.length}</Txt></Row>
            <Bar pct={(done / FAFSA_STEPS.length) * 100} color={t.warnI} />
          </Card>
        ) : null}
        {FAFSA_STEPS.map(([title, body], i) => {
          const on = !!profile.fafsa.steps[i];
          return (
            <Card key={title} onPress={() => toggle(i)} tint={on ? t.okT : undefined} style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor: on ? t.types.work.c : t.line, backgroundColor: on ? t.types.work.c : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
                {on ? <Icon name="check" color="#FFFFFF" size={16} width={3} /> : null}
              </View>
              <View style={{ flex: 1, gap: 2 }}>
                <Txt bold style={on ? { textDecorationLine: 'line-through', opacity: 0.7 } : null}>{i + 1}. {title}</Txt>
                <Txt small soft>{body}</Txt>
              </View>
            </Card>
          );
        })}
        <Row><Btn kind="secondary" title="Open StudentAid.gov" onPress={() => Linking.openURL(FAFSA_URL)} /></Row>
        {senior && !profile.fafsa.submitted ? (
          <Row><Btn title="I submitted my FAFSA" color={t.types.work.c} textColor="#FFFFFF" onPress={() => {
            const steps = {}; FAFSA_STEPS.forEach((_, i) => { steps[i] = true; });
            setProfile((p) => ({ fafsa: { ...p.fafsa, submitted: true, steps } })); yay(); toast('FAFSA submitted! Watch your email for your FAFSA Submission Summary.');
          }} /></Row>
        ) : null}
        <Txt small muted>Not eligible for federal aid? Some states have their own form (in Texas it's the TASFA). Ask your counselor.</Txt>
      </Pad>
    </Screen>
  );
}
