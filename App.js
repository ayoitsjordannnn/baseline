import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { BackHandler, Pressable, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StoreProvider, useStore } from './src/store';
import { ToastProvider, Icon, tap } from './src/ui';
import { useTheme } from './src/theme';
import Logo from './src/Logo';
import Quiz from './src/onboarding/Quiz';
import Today from './src/screens/Today';
import Week from './src/screens/Week';
import PathsTab, { pathLabel } from './src/screens/Paths';
import Me from './src/screens/Me';
import { Discover, College, Visit } from './src/screens/Colleges';
import Fafsa, { FafsaModal } from './src/screens/Fafsa';
import Sat from './src/screens/Sat';
import Transcript from './src/screens/Transcript';
import Gym from './src/screens/Gym';
import Money from './src/screens/Money';
import Widgets from './src/screens/Widgets';

const SCREENS = { today: Today, week: Week, paths: PathsTab, me: Me, discover: Discover, college: College, visit: Visit, fafsa: Fafsa, sat: Sat, transcript: Transcript, gym: Gym, money: Money, widgets: Widgets };
const TABS = ['today', 'week', 'paths', 'me'];
const PATH_ICON = { military: 'shield', trade: 'wrench', work: 'briefcase', unsure: 'compass' };

function TabBar({ tab, onTab }) {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const { profile } = useStore();
  const items = [['today', 'today', 'Today'], ['week', 'week', 'Week'], ['paths', PATH_ICON[profile.after] || 'cap', pathLabel(profile)], ['me', 'user', 'You']];
  return (
    <View style={{ flexDirection: 'row', backgroundColor: t.surface, borderTopWidth: 1, borderTopColor: t.line, paddingBottom: insets.bottom, paddingTop: 6 }} accessibilityRole="tablist">
      {items.map(([k, icon, label]) => {
        const on = tab === k;
        return (
          <Pressable key={k} onPress={() => { tap(); onTab(k); }} accessibilityRole="tab" accessibilityState={{ selected: on }} accessibilityLabel={label}
            style={{ flex: 1, alignItems: 'center', gap: 3, paddingVertical: 6 }}>
            <View style={{ paddingHorizontal: 16, paddingVertical: 4, borderRadius: 999, backgroundColor: on ? t.track : 'transparent' }}>
              <Icon name={icon} color={on ? t.ink : t.muted} size={22} width={on ? 2.4 : 2} />
            </View>
            <Text style={{ fontSize: 11, fontWeight: on ? '800' : '600', color: on ? t.ink : t.muted }}>{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function Shell() {
  const t = useTheme();
  const { state } = useStore();
  const [tab, setTab] = useState('today');
  // One stack of screens per tab, so switching tabs keeps where you were.
  const [stacks, setStacks] = useState(() => Object.fromEntries(TABS.map((k) => [k, [{ name: k, params: {} }]])));

  const nav = useMemo(() => ({
    push: (name, params = {}) => setStacks((s) => ({ ...s, [tab]: [...s[tab], { name, params }] })),
    pop: () => setStacks((s) => (s[tab].length > 1 ? { ...s, [tab]: s[tab].slice(0, -1) } : s)),
    tab: (name, params = {}) => { setTab(name); setStacks((s) => ({ ...s, [name]: [{ name, params: { ...params, at: Date.now() } }] })); },
  }), [tab]);

  const onTab = useCallback((k) => {
    if (k === tab) setStacks((s) => ({ ...s, [k]: [s[k][0]] }));
    setTab(k);
  }, [tab]);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (stacks[tab].length > 1) { nav.pop(); return true; }
      if (tab !== 'today') { setTab('today'); return true; }
      return false;
    });
    return () => sub.remove();
  }, [stacks, tab, nav]);

  if (!state.ready) {
    return <View style={{ flex: 1, backgroundColor: '#0E172B', alignItems: 'center', justifyContent: 'center' }}><Logo size={96} /></View>;
  }
  if (!state.profile.onboarded) return <><StatusBar style="light" /><Quiz /></>;

  const top = stacks[tab][stacks[tab].length - 1];
  const Comp = SCREENS[top.name] || Today;
  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <StatusBar style="auto" />
      <View style={{ flex: 1 }}>
        <Comp key={`${tab}-${stacks[tab].length}-${top.name}`} nav={nav} params={top.params || {}} />
      </View>
      {stacks[tab].length === 1 ? <TabBar tab={tab} onTab={onTab} /> : null}
      <FafsaModal nav={nav} />
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StoreProvider>
        <ToastProvider>
          <Shell />
        </ToastProvider>
      </StoreProvider>
    </SafeAreaProvider>
  );
}
