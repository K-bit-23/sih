const tintColorLight = '#2C9D4B'; // A deep, eco-friendly green
const tintColorDark = '#FFFFFF'; // White for high contrast on dark backgrounds

export default {
  light: {
    text: '#000000',
    background: '#F0F4F0', // A very light, minty green for a fresh background
    tint: tintColorLight,
    tabIconDefault: '#8E8E93',
    tabIconSelected: tintColorLight,
    card: '#FFFFFF',
    cardBorder: '#D8E0D8', // A soft green border
    primary: '#2C9D4B', // Deep, trustworthy green
    secondary: '#5DBB63', // A brighter, more vibrant green
    accent: '#87D37C', // A light, friendly green for accents
    danger: '#FF3B30',
    active: '#2C9D4B',
    inactive: '#8E8E93',
    borderTop: '#D8E0D8',
  },
  dark: {
    text: '#FFFFFF',
    background: '#001A08', // A very dark, forest green for a deep dark mode
    tint: tintColorDark,
    tabIconDefault: '#8E8E93',
    tabIconSelected: tintColorDark,
    card: '#002A10', // A dark, saturated green for cards
    cardBorder: '#004D20', // A subtle green border for dark mode cards
    primary: '#34C759', // A bright, vibrant green for dark mode
    secondary: '#5DBB63', // A medium green that works well on dark backgrounds
    accent: '#87D37C', // A lighter green for accents
    danger: '#FF453A',
    active: '#FFFFFF',
    inactive: '#8E8E93',
    borderTop: '#004D20',
  },
};
