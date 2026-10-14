const React = require('react');
module.exports = {
  __esModule: true,
  // expo-haptics
  selectionAsync: () => Promise.resolve(), impactAsync: () => Promise.resolve(), notificationAsync: () => Promise.resolve(),
  ImpactFeedbackStyle: { Medium: 1, Light: 0, Heavy: 2 }, NotificationFeedbackType: { Success: 0, Warning: 1, Error: 2 },
  // safe-area-context
  useSafeAreaInsets: () => ({ top: 47, bottom: 34, left: 0, right: 0 }),
  SafeAreaProvider: ({ children }) => children,
  // expo-status-bar
  StatusBar: () => null,
  // async-storage
  default: { getItem: async () => null, setItem: async () => {} },
};
