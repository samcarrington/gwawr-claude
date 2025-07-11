/**
 * Design System Theme Configuration
 * Standardizes responsive breakpoints, spacing, and layout tokens
 */

export default {
  // Responsive breakpoints - standardized across all components
  screens: {
    'xs': '475px',   // Extra small devices
    'sm': '640px',   // Small devices (landscape phones)
    'md': '768px',   // Medium devices (tablets)
    'lg': '1024px',  // Large devices (desktops)
    'xl': '1280px',  // Extra large devices (large desktops)
    '2xl': '1536px', // 2X large devices (larger desktops)
  },

  // Spacing scale for consistent layout spacing
  spacing: {
    'section-xs': '2rem',    // 32px
    'section-sm': '3rem',    // 48px
    'section-md': '4rem',    // 64px
    'section-lg': '5rem',    // 80px
    'section-xl': '6rem',    // 96px
    'section-2xl': '8rem',   // 128px
  },

  // Layout constraints
  maxWidth: {
    'content': '65ch',       // Optimal reading width
    'container': '1280px',   // Max container width
    'hero': '1024px',        // Hero content max width
    'prose': '768px',        // Article/prose max width
  },

  // Grid system
  gridTemplateColumns: {
    'auto-fit-xs': 'repeat(auto-fit, minmax(250px, 1fr))',
    'auto-fit-sm': 'repeat(auto-fit, minmax(300px, 1fr))',
    'auto-fit-md': 'repeat(auto-fit, minmax(350px, 1fr))',
    'auto-fit-lg': 'repeat(auto-fit, minmax(400px, 1fr))',
  },

  // Layout aspect ratios
  aspectRatio: {
    'hero': '16/9',
    'card': '4/3',
    'portrait': '3/4',
    'square': '1/1',
  },

  // Design system colors (referencing existing theme)
  colors: {
    // Primary color palette
    primary: {
      50: '#fef7e0',
      100: '#fde9b3',
      200: '#fcd980',
      300: '#fac74d',
      400: '#f8b920',
      500: '#f6a800',  // Base primary color
      600: '#e09600',
      700: '#c7800',
      800: '#a6700',
      900: '#8b5a00',
      950: '#4d3100',
    },
    // Add other color definitions as needed
  },

  // Typography scale
  fontSize: {
    'hero': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
    'display': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
    'title': ['2rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
    'heading': ['1.5rem', { lineHeight: '1.4' }],
    'body': ['1rem', { lineHeight: '1.6' }],
    'caption': ['0.875rem', { lineHeight: '1.5' }],
  },

  // Animation durations
  transitionDuration: {
    'fast': '150ms',
    'normal': '200ms',
    'slow': '300ms',
  },

  // Border radius scale
  borderRadius: {
    'component': '0.5rem',  // 8px - standard component radius
    'card': '0.75rem',      // 12px - card radius
    'section': '1rem',      // 16px - section radius
  },

  // Shadows for depth
  boxShadow: {
    'component': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    'card': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    'section': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  },
};