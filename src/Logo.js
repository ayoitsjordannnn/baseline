import React from 'react';
import Svg, { Defs, LinearGradient, Stop, Rect, Path, Circle } from 'react-native-svg';

// "Rising start": a sun coming up over the baseline.
export default function Logo({ size = 72 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      <Defs>
        <LinearGradient id="lg-bg" x1="0" y1="0" x2="1" y2="1"><Stop offset="0" stopColor="#1B2A4E" /><Stop offset="1" stopColor="#0A101C" /></LinearGradient>
        <LinearGradient id="lg-sun" x1="0" y1="0" x2="0" y2="1"><Stop offset="0" stopColor="#FFD58A" /><Stop offset="1" stopColor="#E0782F" /></LinearGradient>
      </Defs>
      <Rect x="0" y="0" width="64" height="64" rx="16" fill="url(#lg-bg)" />
      <Circle cx="32" cy="40" r="22" fill="#6E9BFF" opacity="0.12" />
      <Path d="M16 40a16 16 0 0 1 32 0z" fill="url(#lg-sun)" />
      <Path d="M32 14v6M17 21l4 4M47 21l-4 4M10 33h5M49 33h5" stroke="#FFD58A" strokeWidth="2.6" strokeLinecap="round" />
      <Rect x="10" y="42" width="44" height="4" rx="2" fill="#FFFFFF" />
      <Rect x="18" y="50" width="28" height="3" rx="1.5" fill="#6E9BFF" opacity="0.7" />
    </Svg>
  );
}
