const tintColorLight = '#007AFF'; // A brighter, more modern blue
const tintColorDark = '#FFFFFF';

export default {
  light: {
    text: '#000000', // Standard black for readability
    background: '#F2F2F7', // A light gray for a softer background
    tint: tintColorLight,
    tabIconDefault: '#8E8E93', // A neutral gray for inactive tabs
    tabIconSelected: tintColorLight,
    card: '#FFFFFF', // White cards for a clean look
    cardBorder: '#E5E5EA', // A light border for subtle separation
    primary: '#007AFF', // A strong blue for primary actions
    secondary: '#FF9500', // A vibrant orange for secondary actions
    accent: '#34C759', // A bright green for accents and success states
    danger: '#FF3B30', // A clear red for warnings and errors
    active: '#007AFF',
    inactive: '#8E8E93',
    borderTop: '#E5E5EA',
  },
  dark: {
    text: '#FFFFFF', // White text for high contrast
    background: '#000000', // True black for a deep dark mode
    tint: tintColorDark,
    tabIconDefault: '#8E8E93',
    tabIconSelected: tintColorDark,
    card: '#1C1C1E', // A dark gray for cards
    cardBorder: '#38383A', // A subtle border for dark mode cards
    primary: '#0B84FF', // A slightly brighter blue for dark mode
    secondary: '#FF9F0A', // A vibrant orange for dark mode
    accent: '#30D158', // A bright green for dark mode
    danger: '#FF453A', // A clear red for dark mode
    active: '#FFFFFF',
    inactive: '#8E8E93',
    borderTop: '#38383A',
  },
};
