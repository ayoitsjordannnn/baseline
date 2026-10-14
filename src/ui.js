import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Animated, Easing, Modal, Pressable, ScrollView, StyleSheet, Text, View, Platform } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Path, Rect, Stop } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, font } from './theme';

export const tap = () => { Haptics.selectionAsync().catch(() => {}); };
export const thud = () => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {}); };
export const yay = () => { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {}); };

/* ---------------- icons ---------------- */
const P = {
  plus: 'M12 5v14M5 12h14',
  back: 'M15 5l-7 7 7 7',
  chevron: 'M9 5l7 7-7 7',
  check: 'M5 12l5 5 9-10',
  close: 'M6 6l12 12M18 6L6 18',
  search: 'M11 5a6 6 0 1 0 0 12 6 6 0 0 0 0-12zM20 20l-4.5-4.5',
  scan: 'M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3M7 12h10',
  lock: 'M5 11h14v9H5zM8 11V8a4 4 0 0 1 8 0v3',
  today: 'M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16zM12 8v4l3 2',
  week: 'M4 5h16v15H4zM4 10h16M9 3v4M15 3v4',
  cap: 'M3 9l9-5 9 5-9 5zM7 11v5c3 2 7 2 10 0v-5',
  target: 'M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16zM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z',
  user: 'M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM4 21c1-4 4-6 8-6s7 2 8 6',
  star: 'M12 3l2.6 5.6 6 .7-4.4 4.1 1.2 6L12 16.5 6.6 19.4l1.2-6L3.4 9.3l6-.7z',
  anchor: 'M12 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM12 7v14M8 10h8M5 14c0 4 3 7 7 7s7-3 7-7',
  wings: 'M12 9l-9-3 3 6 6 2 6-2 3-6zM12 14v6',
  shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z',
  lifebuoy: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM5.6 5.6l3.6 3.6M14.8 14.8l3.6 3.6M18.4 5.6l-3.6 3.6M9.2 14.8l-3.6 3.6',
  orbit: 'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM3 12c0-2 4-4 9-4s9 2 9 4-4 4-9 4-9-2-9-4z',
  compass: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM15 9l-2 5-4 1 2-5z',
  flame: 'M12 3c1 4 5 5 5 10a5 5 0 0 1-10 0c0-3 2-4 2-6 1 1 2 2 3 2 0-2-1-4 0-6z',
  bolt: 'M13 2L4 14h7l-1 8 9-12h-7z',
  pipe: 'M4 8h8v8h8M4 5v6M20 13v6',
  spark: 'M12 2v5M12 17v5M2 12h5M17 12h5M5 5l3 3M16 16l3 3M19 5l-3 3M8 16l-3 3',
  wrench: 'M14 6a4 4 0 0 0 5 5l-9 9-3-3 9-9a4 4 0 0 0-2-2z',
  scissors: 'M6 6a3 3 0 1 0 0 .1zM6 18a3 3 0 1 0 0 .1zM8.5 7.5L20 18M8.5 16.5L20 6',
  cross: 'M9 3h6v6h6v6h-6v6H9v-6H3V9h6z',
  hammer: 'M14 4l6 6-3 3-6-6zM11 7l-8 8 3 3 8-8',
  briefcase: 'M3 8h18v12H3zM9 8V5h6v3M3 13h18',
  badge: 'M12 3l3 3h4v4l3 3-3 3v4h-4l-3 3-3-3H5v-4l-3-3 3-3V6h4z',
  door: 'M6 3h12v18H6zM14 12v.5',
  book: 'M4 5c3-1 6-1 8 1 2-2 5-2 8-1v14c-3-1-6-1-8 1-2-2-5-2-8-1zM12 6v14',
  play: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM10 8l6 4-6 4z',
  list: 'M9 6h11M9 12h11M9 18h11M4 6h.5M4 12h.5M4 18h.5',
  people: 'M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3 20c1-3 3-5 6-5s5 2 6 5M17 11a3 3 0 1 0 0-6M21 20c-.5-2-2-4-4-4.5',
  sun: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19',
  dumbbell: 'M3 10v4M6 8v8M18 8v8M21 10v4M6 12h12',
  doc: 'M6 3h9l4 4v14H6zM9 11h7M9 15h7M9 7h4',
  trash: 'M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13',
  clock: 'M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16zM12 8v4l3 2',
  dollar: 'M12 3v18M16 7c0-2-2-3-4-3s-4 1-4 3 2 3 4 3 4 1 4 3-2 3-4 3-4-1-4-3',
  flag: 'M5 21V4M5 4h11l-2 4 2 4H5',
  widget: 'M3 3h8v8H3zM13 3h8v8h-8zM3 13h18v8H3z',
  sparkle: 'M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2z',
  map: 'M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2zM9 4v14M15 6v14',
  car: 'M4 16v-4l2-5h12l2 5v4zM4 16v2M20 16v2M7 13h.5M16.5 13h.5',
  bed: 'M3 18V8M3 14h18v4M21 18v-4a3 3 0 0 0-3-3h-7v3M6 11a1.5 1.5 0 1 0 0 .1',
};
export function Icon({ name, size = 22, color = '#000', width = 2, fill = 'none' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d={P[name] || P.sparkle} stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" fill={fill} />
    </Svg>
  );
}

/* ---------------- toast ---------------- */
const ToastCtx = createContext(() => {});
export function ToastProvider({ children }) {
  const t = useTheme();
  const [msg, setMsg] = useState(null);
  const anim = useRef(new Animated.Value(0)).current;
  const timer = useRef(null);
  const show = useCallback((m) => {
    setMsg(m);
    clearTimeout(timer.current);
    Animated.spring(anim, { toValue: 1, useNativeDriver: true, friction: 8 }).start();
    timer.current = setTimeout(() => {
      Animated.timing(anim, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => setMsg(null));
    }, 3000);
  }, [anim]);
  const insets = useSafeAreaInsets();
  return (
    <ToastCtx.Provider value={show}>
      {children}
      {msg ? (
        <Animated.View pointerEvents="none" style={[styles.toast, { bottom: insets.bottom + 90, backgroundColor: t.btn, opacity: anim, transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }]}>
          <Text style={{ color: t.btnInk, fontWeight: '700', fontSize: 15 }}>{msg}</Text>
        </Animated.View>
      ) : null}
    </ToastCtx.Provider>
  );
}
export const useToast = () => useContext(ToastCtx);

/* ---------------- layout ---------------- */
export function Screen({ children, footer, scroll = true, bg, padTop = true, scrollRef, scrollEnabled = true }) {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const Body = scroll ? ScrollView : View;
  return (
    <View style={{ flex: 1, backgroundColor: bg || t.bg }}>
      <Body
        ref={scrollRef}
        scrollEnabled={scrollEnabled}
        style={{ flex: 1 }}
        contentContainerStyle={scroll ? { paddingTop: padTop ? insets.top + 8 : 0, paddingBottom: 32 } : undefined}
        keyboardShouldPersistTaps="handled"
      >
        {!scroll && padTop ? <View style={{ height: insets.top + 8 }} /> : null}
        {children}
      </Body>
      {footer ? <View style={[styles.footer, { backgroundColor: t.surface, borderTopColor: t.line, paddingBottom: insets.bottom + 12 }]}>{footer}</View> : null}
    </View>
  );
}
export function Pad({ children, style, gap = 12 }) {
  return <View style={[{ paddingHorizontal: 20, gap }, style]}>{children}</View>;
}
export function Row({ children, style, gap = 10, wrap }) {
  return <View style={[{ flexDirection: 'row', alignItems: 'center', gap, flexWrap: wrap ? 'wrap' : 'nowrap' }, style]}>{children}</View>;
}
export function TopBar({ title, onBack, right }) {
  const t = useTheme();
  return (
    <Row style={{ paddingHorizontal: 12, minHeight: 48 }} gap={4}>
      {onBack ? (
        <Pressable onPress={() => { tap(); onBack(); }} hitSlop={10} accessibilityRole="button" accessibilityLabel="Back" style={styles.iconHit}>
          <Icon name="back" color={t.ink} />
        </Pressable>
      ) : null}
      <Text style={[font.eyebrow, { color: t.muted, flex: 1 }]} numberOfLines={1}>{title}</Text>
      {right}
    </Row>
  );
}
export function H1({ children, style, size = 32, color }) {
  const t = useTheme();
  return <Text accessibilityRole="header" style={[font.display, { fontSize: size, lineHeight: size * 1.05, color: color || t.ink }, style]}>{children}</Text>;
}
export function Eyebrow({ children, color, style }) {
  const t = useTheme();
  return <Text style={[font.eyebrow, { color: color || t.muted }, style]}>{children}</Text>;
}
export function Txt({ children, style, soft, muted, small, bold, color, numberOfLines }) {
  const t = useTheme();
  return (
    <Text numberOfLines={numberOfLines} style={[{ color: color || (muted ? t.muted : soft ? t.soft : t.ink), fontSize: small ? 13 : 15, lineHeight: small ? 18 : 21, fontWeight: bold ? '700' : '400' }, style]}>
      {children}
    </Text>
  );
}
export function Card({ children, style, onPress, tint, border, accessibilityLabel }) {
  const t = useTheme();
  const s = [styles.card, { backgroundColor: tint || t.surface, borderColor: border || (tint ? 'transparent' : t.line) }, style];
  if (!onPress) return <View style={s}>{children}</View>;
  return (
    <Pressable onPress={() => { tap(); onPress(); }} accessibilityRole="button" accessibilityLabel={accessibilityLabel} style={({ pressed }) => [s, pressed && { transform: [{ scale: 0.98 }], opacity: 0.92 }]}>
      {children}
    </Pressable>
  );
}
export function Btn({ title, onPress, kind = 'primary', color, textColor, disabled, icon, style }) {
  const t = useTheme();
  const bg = kind === 'primary' ? color || t.btn : 'transparent';
  const fg = kind === 'primary' ? textColor || t.btnInk : textColor || t.ink;
  return (
    <Pressable
      disabled={disabled}
      onPress={() => { tap(); onPress && onPress(); }}
      accessibilityRole="button"
      style={({ pressed }) => [styles.btn, { backgroundColor: bg, borderColor: kind === 'primary' ? bg : color || t.ink, opacity: disabled ? 0.45 : 1 }, pressed && { transform: [{ scale: 0.97 }] }, style]}
    >
      {icon ? <Icon name={icon} color={fg} size={18} /> : null}
      <Text style={{ color: fg, fontWeight: '700', fontSize: 16 }}>{title}</Text>
    </Pressable>
  );
}
export function Chip({ label, on, onPress, color, style, small }) {
  const t = useTheme();
  const c = color || t.btn;
  return (
    <Pressable
      onPress={() => { tap(); onPress && onPress(); }}
      accessibilityRole="button"
      accessibilityState={{ selected: !!on }}
      style={({ pressed }) => [styles.chip, small && { minHeight: 34, paddingHorizontal: 10 }, { backgroundColor: on ? c : t.surface, borderColor: on ? c : t.line }, pressed && { transform: [{ scale: 0.95 }] }, style]}
    >
      <Text style={{ color: on ? (color ? '#FFFFFF' : t.btnInk) : t.ink, fontWeight: '700', fontSize: small ? 12 : 13 }}>{label}</Text>
    </Pressable>
  );
}
export function Seg({ options, value, onChange }) {
  const t = useTheme();
  return (
    <View style={[styles.seg, { backgroundColor: t.track }]} accessibilityRole="tablist">
      {options.map(([k, l]) => {
        const on = k === value;
        return (
          <Pressable key={k} onPress={() => { tap(); onChange(k); }} accessibilityRole="tab" accessibilityState={{ selected: on }} style={[styles.segBtn, on && { backgroundColor: t.surface, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 3, shadowOffset: { width: 0, height: 1 }, elevation: 2 }]}>
            <Text numberOfLines={1} style={{ fontWeight: '700', fontSize: 13, color: on ? t.ink : t.muted }}>{l}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
export function Pill({ label, bg, fg }) {
  return (
    <View style={{ backgroundColor: bg, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start' }}>
      <Text style={{ color: fg, fontSize: 11, fontWeight: '800', letterSpacing: 0.6, textTransform: 'uppercase' }}>{label}</Text>
    </View>
  );
}
export function FitPill({ fit }) {
  const t = useTheme();
  const m = { 'Far reach': t.types.practice, Reach: t.types.study, Target: t.types.school, Likely: t.types.work }[fit] || t.types.free;
  return <Pill label={fit} bg={m.t} fg={m.i} />;
}

/* ---------------- data viz ---------------- */
export function Bar({ pct, color, height = 10, track }) {
  const t = useTheme();
  const w = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(w, { toValue: Math.max(0, Math.min(100, pct)), duration: 600, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();
  }, [pct, w]);
  return (
    <View style={{ height, borderRadius: height / 2, backgroundColor: track || t.track, overflow: 'hidden' }}>
      <Animated.View style={{ height, borderRadius: height / 2, backgroundColor: color, width: w.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }) }} />
    </View>
  );
}
const ACircle = Animated.createAnimatedComponent(Circle);
export function Ring({ pct, size = 64, stroke = 8, color, track, children }) {
  const t = useTheme();
  const r = (size - stroke) / 2;
  const C = 2 * Math.PI * r;
  const a = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(a, { toValue: Math.max(0, Math.min(1, pct)), duration: 700, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();
  }, [pct, a]);
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={track || t.track} strokeWidth={stroke} fill="none" />
        <ACircle
          cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={stroke} fill="none" strokeLinecap="round"
          strokeDasharray={`${C} ${C}`}
          strokeDashoffset={a.interpolate({ inputRange: [0, 1], outputRange: [C, 0] })}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      {children}
    </View>
  );
}

/* ---------------- school imagery ---------------- */
export function Emblem({ c, size = 44, ring }) {
  const fs = size * (c.mono.length > 3 ? 0.25 : c.mono.length > 2 ? 0.3 : 0.36);
  return (
    <View accessibilityElementsHidden importantForAccessibility="no" style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: c.color, alignItems: 'center', justifyContent: 'center', borderWidth: ring ? 3 : 0, borderColor: '#FFFFFF' }}>
      <Text style={{ color: '#FFFFFF', fontWeight: '900', fontSize: fs, letterSpacing: 0.3 }}>{c.mono}</Text>
    </View>
  );
}
function hash(s) { let h = 7; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; }
function shade(hex, f) {
  const n = parseInt(hex.slice(1), 16);
  let r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  r = Math.round(Math.min(255, Math.max(0, r + (f > 0 ? (255 - r) * f : r * f))));
  g = Math.round(Math.min(255, Math.max(0, g + (f > 0 ? (255 - g) * f : g * f))));
  b = Math.round(Math.min(255, Math.max(0, b + (f > 0 ? (255 - b) * f : b * f))));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}
// A colorful, generated campus skyline in the school's color. Each school gets its own layout.
export function CampusArt({ c, height = 120, radius = 0 }) {
  const h = hash(c.id);
  const W = 360;
  const base = c.color;
  const sky1 = shade(base, 0.55), sky2 = shade(base, 0.15), bld = shade(base, -0.35), bld2 = shade(base, -0.15), win = shade(base, 0.75);
  const blds = [];
  let x = 0, i = 0;
  while (x < W) {
    const r = (h >> (i % 24)) & 15;
    const w = 26 + (r % 5) * 10;
    const bh = height * (0.28 + ((r * 7) % 10) / 22);
    const tower = (r % 6) === 0;
    blds.push({ x, w, bh, tower, back: i % 2 === 0 });
    x += w + 4;
    i++;
  }
  return (
    <View style={{ height, borderRadius: radius, overflow: 'hidden' }} accessibilityRole="image" accessibilityLabel={`Illustration of ${c.name}'s campus`}>
      <Svg width="100%" height={height} viewBox={`0 0 ${W} ${height}`} preserveAspectRatio="xMidYMax slice">
        <Defs>
          <LinearGradient id={`g${c.id}`} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={sky1} />
            <Stop offset="1" stopColor={sky2} />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width={W} height={height} fill={`url(#g${c.id})`} />
        <Circle cx={40 + (h % 260)} cy={height * 0.28} r={height * 0.12} fill={win} opacity={0.7} />
        {blds.filter((b) => b.back).map((b, k) => <Rect key={'b' + k} x={b.x + 8} y={height - b.bh - 10} width={b.w} height={b.bh + 10} fill={bld2} opacity={0.6} />)}
        {blds.filter((b) => !b.back).map((b, k) => (
          <React.Fragment key={'f' + k}>
            <Rect x={b.x} y={height - b.bh} width={b.w} height={b.bh} fill={bld} />
            {b.tower ? <Path d={`M${b.x} ${height - b.bh} L${b.x + b.w / 2} ${height - b.bh - 18} L${b.x + b.w} ${height - b.bh} Z`} fill={bld} /> : null}
            {[0, 1, 2].map((row) => [0, 1].map((col) => (
              <Rect key={`${row}-${col}`} x={b.x + 6 + col * (b.w / 2 - 4)} y={height - b.bh + 8 + row * 14} width={5} height={7} fill={win} opacity={0.85} />
            )))}
          </React.Fragment>
        ))}
        <Rect x="0" y={height - 6} width={W} height="6" fill={bld} />
      </Svg>
    </View>
  );
}
// Branch/trade badge built from a simple icon (not an official logo).
export function IconBadge({ icon, color, size = 52 }) {
  return (
    <View style={{ width: size, height: size, borderRadius: size * 0.3, backgroundColor: color, alignItems: 'center', justifyContent: 'center' }}>
      <Icon name={icon} color="#FFFFFF" size={size * 0.55} />
    </View>
  );
}

/* ---------------- bottom sheet ---------------- */
export function Sheet({ visible, onClose, children, title }) {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Close" />
      <View style={[styles.sheet, { backgroundColor: t.surface, paddingBottom: insets.bottom + 16, maxHeight: '88%' }]}>
        <View style={[styles.handle, { backgroundColor: t.line }]} />
        {title ? (
          <Row style={{ paddingHorizontal: 20, paddingBottom: 6 }}>
            <Text style={[font.display, { fontSize: 24, color: t.ink, flex: 1 }]}>{title}</Text>
            <Pressable onPress={onClose} hitSlop={10} accessibilityLabel="Close" style={styles.iconHit}><Icon name="close" color={t.muted} /></Pressable>
          </Row>
        ) : null}
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingHorizontal: 20, gap: 14, paddingBottom: 8 }}>{children}</ScrollView>
      </View>
    </Modal>
  );
}

export const styles = StyleSheet.create({
  card: { borderRadius: 16, borderWidth: 1, padding: 14, gap: 6 },
  btn: { minHeight: 52, borderRadius: 14, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8, paddingHorizontal: 16, flex: 1 },
  chip: { minHeight: 40, paddingHorizontal: 13, borderRadius: 999, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  seg: { flexDirection: 'row', borderRadius: 12, padding: 4, gap: 4 },
  segBtn: { flex: 1, minHeight: 42, borderRadius: 9, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  footer: { borderTopWidth: StyleSheet.hairlineWidth, paddingHorizontal: 20, paddingTop: 12, flexDirection: 'row', gap: 8 },
  iconHit: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  toast: { position: 'absolute', left: 16, right: 16, borderRadius: 14, paddingVertical: 14, paddingHorizontal: 16, shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 6 },
  backdrop: { flex: 1, backgroundColor: 'rgba(8,12,24,0.55)' },
  sheet: { position: 'absolute', left: 0, right: 0, bottom: 0, borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingTop: 8, ...Platform.select({ android: { elevation: 12 }, default: {} }) },
  handle: { width: 40, height: 5, borderRadius: 3, alignSelf: 'center', marginBottom: 10 },
});
