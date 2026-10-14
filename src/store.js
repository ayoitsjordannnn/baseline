import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { exampleWeek } from './data';
import { defaultProfile } from './content/quiz';

const KEY = 'baseline.state.v2';
const Ctx = createContext(null);
const initial = { ready: false, week: [], profile: defaultProfile() };

function reducer(state, a) {
  switch (a.type) {
    case 'load':
      return { ready: true, week: a.week, profile: { ...defaultProfile(), ...a.profile } };
    case 'add':
      return { ...state, week: [...state.week, ...a.blocks] };
    case 'update':
      return { ...state, week: state.week.map((b) => (b.id === a.id ? { ...b, ...a.patch } : b)) };
    case 'remove':
      return { ...state, week: state.week.filter((b) => b.id !== a.id) };
    case 'removeWhere':
      return { ...state, week: state.week.filter((b) => !a.fn(b)) };
    case 'toggleDone':
      return { ...state, week: state.week.map((b) => (b.id === a.id ? { ...b, done: !b.done } : b)) };
    case 'profile': {
      const patch = typeof a.patch === 'function' ? a.patch(state.profile) : a.patch;
      return { ...state, profile: { ...state.profile, ...patch } };
    }
    case 'reset':
      return { ready: true, week: exampleWeek(), profile: defaultProfile() };
    default:
      return state;
  }
}

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initial);
  const loaded = useRef(false);

  useEffect(() => {
    (async () => {
      let saved = null;
      try {
        const raw = await AsyncStorage.getItem(KEY);
        saved = raw ? JSON.parse(raw) : null;
      } catch (e) {
        saved = null;
      }
      if (saved && Array.isArray(saved.week)) dispatch({ type: 'load', week: saved.week, profile: saved.profile || {} });
      else dispatch({ type: 'load', week: exampleWeek(), profile: {} });
      loaded.current = true;
    })();
  }, []);

  useEffect(() => {
    if (!loaded.current || !state.ready) return undefined;
    const t = setTimeout(() => {
      AsyncStorage.setItem(KEY, JSON.stringify({ week: state.week, profile: state.profile })).catch(() => {});
    }, 300);
    return () => clearTimeout(t);
  }, [state.week, state.profile, state.ready]);

  const setProfile = useCallback((patch) => dispatch({ type: 'profile', patch }), []);
  const value = useMemo(() => ({ state, dispatch, profile: state.profile, week: state.week, setProfile }), [state, setProfile]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  return useContext(Ctx);
}
