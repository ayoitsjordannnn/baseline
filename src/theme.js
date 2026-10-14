import React, { createContext, useContext } from 'react';
import { useColorScheme } from 'react-native';

const light = {
  bg: '#F3F5F8', surface: '#FFFFFF', ink: '#14213D', soft: '#3B465C', muted: '#5A6478', line: '#DDE2EA', track: '#E3E7EE',
  btn: '#14213D', btnInk: '#FFFFFF', deep: '#0E172B', glow: '#6E9BFF', now: '#E5484D',
  types: {
    school: { c: '#2F5FD0', t: '#E4ECFB', i: '#2448A8' },
    practice: { c: '#E0782F', t: '#FCE9DC', i: '#A3470B' },
    work: { c: '#13795B', t: '#DDF2EA', i: '#0F6249' },
    study: { c: '#6141B8', t: '#ECE6FA', i: '#4E33A0' },
    gym: { c: '#0E8A8A', t: '#DDF3F3', i: '#0B5F5F' },
    free: { c: '#8A94A6', t: '#FFFFFF', i: '#4A5568' },
  },
  warnT: '#FFF4E5', warnI: '#7A3D00', okT: '#DDF2EA', okI: '#0F6249',
};
const dark = {
  bg: '#0F1626', surface: '#182238', ink: '#E8EDF6', soft: '#C3CCDD', muted: '#9AA6BC', line: '#2A3650', track: '#26324A',
  btn: '#E8EDF6', btnInk: '#0F1626', deep: '#0A101C', glow: '#6E9BFF', now: '#FF6B6E',
  types: {
    school: { c: '#5B86F0', t: '#1E2B4D', i: '#A9C0F7' },
    practice: { c: '#F08A45', t: '#3A2516', i: '#FFB27A' },
    work: { c: '#2FA37F', t: '#123A2F', i: '#7FDDB9' },
    study: { c: '#8E73DE', t: '#2A2248', i: '#C9BCF7' },
    gym: { c: '#2BB3B3', t: '#123536', i: '#86E3E3' },
    free: { c: '#7D89A0', t: '#182238', i: '#C3CCDD' },
  },
  warnT: '#3A2A12', warnI: '#FFD58A', okT: '#123A2F', okI: '#7FDDB9',
};

export const TYPE_LABEL = { school: 'School', practice: 'Practice', work: 'Work', study: 'Study', gym: 'Gym', free: 'Free' };

// Wrap a screen in <ForceTheme mode="dark"> to always draw it dark (the setup quiz does this).
const ForceCtx = createContext(null);
export function ForceTheme({ mode, children }) {
  return React.createElement(ForceCtx.Provider, { value: mode }, children);
}
export function useTheme() {
  const forced = useContext(ForceCtx);
  const scheme = useColorScheme();
  return (forced || scheme) === 'dark' ? dark : light;
}

export const font = {
  display: { fontWeight: '800', letterSpacing: -0.5 },
  eyebrow: { fontSize: 12, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' },
};
