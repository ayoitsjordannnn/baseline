// Bundles test/smoke.jsx with React Native swapped for tiny Node stand-ins, then runs it.
import { build } from 'esbuild';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const m = (f) => path.join(dir, 'mocks', f);
const alias = {
  name: 'mocks',
  setup(b) {
    b.onResolve({ filter: /^react-native$/ }, () => ({ path: m('react-native.js') }));
    b.onResolve({ filter: /^react-native-svg$/ }, () => ({ path: m('svg.js') }));
    b.onResolve({ filter: /^(expo-haptics|expo-status-bar|react-native-safe-area-context|@react-native-async-storage\/async-storage)$/ }, () => ({ path: m('misc.js') }));
    b.onResolve({ filter: /\/store$/ }, () => ({ path: m('store.js') }));
  },
};
const out = path.join(dir, '.smoke.cjs');
await build({ entryPoints: [path.join(dir, process.argv[2] || 'smoke.jsx')], bundle: true, platform: 'node', format: 'cjs', outfile: out, loader: { '.js': 'jsx' }, jsx: 'automatic', plugins: [alias], nodePaths: process.env.NODE_PATH ? process.env.NODE_PATH.split(':') : [], logLevel: 'warning' });
execFileSync(process.execPath, [out], { stdio: 'inherit' });
