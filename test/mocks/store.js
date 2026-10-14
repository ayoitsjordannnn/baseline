// Test store: a real reducer-free stand-in fed from globalThis.__state.
const React = require('react');
module.exports = {
  StoreProvider: ({ children }) => children,
  useStore: () => {
    const s = globalThis.__state;
    return { state: s, week: s.week, profile: s.profile, dispatch: (a) => { globalThis.__dispatched.push(a); }, setProfile: (p) => { globalThis.__dispatched.push({ type: 'profile', patch: p }); } };
  },
};
