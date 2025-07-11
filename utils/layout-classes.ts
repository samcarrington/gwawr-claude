/**
 * Shared layout class utilities for consistent styling across components
 */

// Text alignment classes
export const ALIGN_CLASSES = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
} as const;

// Description alignment classes with responsive widths
export const DESCRIPTION_ALIGN_CLASSES = {
  left: 'text-left max-w-none',
  center: 'text-center max-w-3xl mx-auto',
  right: 'text-right max-w-none ml-auto',
} as const;

// Background classes
export const BACKGROUND_CLASSES = {
  white: 'bg-white',
  neutral: 'bg-neutral-50',
  primary: 'bg-primary-50',
  secondary: 'bg-secondary-50',
  tertiary: 'bg-tertiary-50',
  transparent: '',
} as const;

// Padding classes
export const PADDING_CLASSES = {
  none: '',
  sm: 'py-8',
  md: 'py-12',
  lg: 'py-20',
  xl: 'py-24',
} as const;

// Gap classes for grids
export const GAP_CLASSES = {
  xs: 'gap-2',
  sm: 'gap-4',
  md: 'gap-6',
  lg: 'gap-8',
  xl: 'gap-12',
} as const;

// Max width classes
export const MAX_WIDTH_CLASSES = {
  none: '',
  sm: 'max-w-sm mx-auto',
  md: 'max-w-md mx-auto',
  lg: 'max-w-lg mx-auto',
  xl: 'max-w-xl mx-auto',
  '2xl': 'max-w-2xl mx-auto',
  '3xl': 'max-w-3xl mx-auto',
  '4xl': 'max-w-4xl mx-auto',
  '5xl': 'max-w-5xl mx-auto',
  '6xl': 'max-w-6xl mx-auto',
} as const;

// Grid column classes with responsive breakpoints
export const GRID_COLUMN_CLASSES = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
  6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
} as const;

// Utility functions for getting classes with fallbacks
export const getAlignClass = (align: keyof typeof ALIGN_CLASSES, fallback: keyof typeof ALIGN_CLASSES = 'center') => {
  return align in ALIGN_CLASSES ? ALIGN_CLASSES[align] : ALIGN_CLASSES[fallback];
};

export const getDescriptionAlignClass = (align: keyof typeof DESCRIPTION_ALIGN_CLASSES, fallback: keyof typeof DESCRIPTION_ALIGN_CLASSES = 'center') => {
  return align in DESCRIPTION_ALIGN_CLASSES ? DESCRIPTION_ALIGN_CLASSES[align] : DESCRIPTION_ALIGN_CLASSES[fallback];
};

export const getBackgroundClass = (background: keyof typeof BACKGROUND_CLASSES, fallback: keyof typeof BACKGROUND_CLASSES = 'transparent') => {
  return background in BACKGROUND_CLASSES ? BACKGROUND_CLASSES[background] : BACKGROUND_CLASSES[fallback];
};

export const getPaddingClass = (padding: keyof typeof PADDING_CLASSES, fallback: keyof typeof PADDING_CLASSES = 'lg') => {
  return padding in PADDING_CLASSES ? PADDING_CLASSES[padding] : PADDING_CLASSES[fallback];
};

export const getGapClass = (gap: keyof typeof GAP_CLASSES, fallback: keyof typeof GAP_CLASSES = 'lg') => {
  return gap in GAP_CLASSES ? GAP_CLASSES[gap] : GAP_CLASSES[fallback];
};

export const getMaxWidthClass = (maxWidth: keyof typeof MAX_WIDTH_CLASSES, fallback: keyof typeof MAX_WIDTH_CLASSES = 'none') => {
  return maxWidth in MAX_WIDTH_CLASSES ? MAX_WIDTH_CLASSES[maxWidth] : MAX_WIDTH_CLASSES[fallback];
};

export const getGridColumnClass = (columns: keyof typeof GRID_COLUMN_CLASSES, fallback: keyof typeof GRID_COLUMN_CLASSES = 3) => {
  return columns in GRID_COLUMN_CLASSES ? GRID_COLUMN_CLASSES[columns] : GRID_COLUMN_CLASSES[fallback];
};