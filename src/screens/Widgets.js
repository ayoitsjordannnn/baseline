import React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '../theme';
import { useStore } from '../store';
import { Screen, Pad, Row, H1, Eyebrow, Txt, Card, Ring, TopBar } from '../ui';
import { dayBlocks, nextUp, todayIndex, nowHours, fmtTime, fmtRange, weekTotals, DAYS } from '../logic';
import { recHours } from '../content/quiz';

function Small({ children, bg }) {
  return <View style={{ width: 158, height: 158, borderRadius: 26, backgroundColor: bg, padding: 14, justifyContent: 'space-between', shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 4 }}>{children}</View>;
}

export default function Widgets({ nav }) {
  const t = useTheme();
  const { week, profile } = useStore();
  const d = todayIndex();
  const blocks = dayBlocks(week, d).filter((b) => b.type !== 'free');
  const next = nextUp(blocks, nowHours());
  const tot = weekTotals(week);
  const goal = profile.hours || recHours(profile).h;
  const ty = next ? t.types[next.type] : t.types.school;
  return (
    <Screen>
      <TopBar title="Widgets" onBack={nav.pop} />
      <Pad gap={16}>
        <H1>Home screen widgets</H1>
        <Txt soft>A preview of what Baseline puts on your home screen: what's next, today at a glance, and your study streak.</Txt>
        <View style={{ backgroundColor: '#0E172B', borderRadius: 30, padding: 18, gap: 16 }}>
          <Row gap={14} style={{ justifyContent: 'center' }}>
            <Small bg={ty.c}>
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 11, fontWeight: '800' }}>UP NEXT</Text>
              <View>
                <Text numberOfLines={2} style={{ color: '#FFFFFF', fontSize: 18, fontWeight: '900' }}>{next ? next.title : 'Nothing left'}</Text>
                <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, marginTop: 2 }}>{next ? fmtTime(next.start) : 'Enjoy your night'}</Text>
              </View>
            </Small>
            <Small bg="#182238">
              <Text style={{ color: '#9AA6BC', fontSize: 11, fontWeight: '800' }}>STUDY THIS WEEK</Text>
              <Ring pct={tot.study / goal} size={78} stroke={9} color="#8E73DE" track="#26324A">
                <Text style={{ color: '#FFFFFF', fontWeight: '900', fontSize: 16 }}>{tot.study.toFixed(1).replace('.0', '')}/{goal}</Text>
              </Ring>
            </Small>
          </Row>
          <View style={{ borderRadius: 26, backgroundColor: '#FFFFFF', padding: 14, gap: 8 }}>
            <Text style={{ color: '#5A6478', fontSize: 11, fontWeight: '800' }}>{DAYS[d].toUpperCase()} · TODAY</Text>
            {blocks.slice(0, 4).map((b) => (
              <Row key={b.id} gap={8}>
                <View style={{ width: 4, height: 28, borderRadius: 2, backgroundColor: t.types[b.type].c }} />
                <View style={{ flex: 1 }}>
                  <Text numberOfLines={1} style={{ color: '#14213D', fontWeight: '800' }}>{b.title}</Text>
                  <Text style={{ color: '#5A6478', fontSize: 12 }}>{fmtRange(b.start, b.end)}</Text>
                </View>
              </Row>
            ))}
            {!blocks.length ? <Text style={{ color: '#14213D', fontWeight: '700' }}>A free day. Rest up.</Text> : null}
          </View>
        </View>
        <Card>
          <Eyebrow>Coming soon</Eyebrow>
          <Txt small soft>Real home screen widgets need the installed version of Baseline (not Expo Go). They're on the roadmap for the App Store build.</Txt>
        </Card>
      </Pad>
    </Screen>
  );
}
