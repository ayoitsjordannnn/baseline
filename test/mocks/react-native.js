// Minimal stand-ins so screens can be rendered in Node for smoke tests.
const React = require('react');
const h = (tag) => {
  const C = React.forwardRef(({ children, style, onPress, ...rest }, ref) => React.createElement(tag, { 'data-press': onPress ? '1' : undefined }, typeof children === 'function' ? children({ pressed: false }) : children));
  C.displayName = tag;
  return C;
};
const fnStyle = (tag) => React.forwardRef(({ children, style }, ref) => {
  if (typeof style === 'function') style({ pressed: false });
  return React.createElement(tag, null, typeof children === 'function' ? children({ pressed: false }) : children);
});
class Value {
  constructor(v) { this.v = v; }
  setValue(v) { this.v = v; }
  interpolate() { return this; }
  addListener() { return 1; }
  removeListener() {}
  stopAnimation() {}
}
const anim = () => ({ start: (cb) => cb && cb({ finished: true }), stop() {} });
const Animated = {
  Value, View: h('div'), ScrollView: h('div'), Text: h('span'),
  createAnimatedComponent: (C) => C,
  timing: anim, spring: anim, loop: anim, sequence: anim, parallel: anim, delay: anim,
  event: () => () => {},
};
module.exports = {
  View: h('div'), Text: h('span'), ScrollView: h('div'), Pressable: fnStyle('button'), TextInput: h('input'),
  Modal: ({ visible, children }) => (visible ? React.createElement('dialog', null, children) : null),
  Animated, Easing: new Proxy({}, { get: () => (x) => x }),
  StyleSheet: { create: (o) => o, absoluteFill: {}, hairlineWidth: 1, flatten: (s) => s },
  Platform: { OS: 'ios', select: (o) => o.ios ?? o.default },
  useColorScheme: () => globalThis.__scheme || 'light',
  Linking: { openURL: () => Promise.resolve() },
  Alert: { alert: () => {} },
  BackHandler: { addEventListener: () => ({ remove() {} }) },
  PanResponder: { create: () => ({ panHandlers: {} }) },
  Dimensions: { get: () => ({ width: 390, height: 844 }) },
  useWindowDimensions: () => ({ width: 390, height: 844 }),
};
