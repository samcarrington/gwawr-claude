import { describe, it, expect } from 'vitest';
import {
  getAlignClass,
  getDescriptionAlignClass,
  getBackgroundClass,
  getPaddingClass,
  getGapClass,
  getMaxWidthClass,
  getGridColumnClass,
  ALIGN_CLASSES,
  DESCRIPTION_ALIGN_CLASSES,
  BACKGROUND_CLASSES,
  PADDING_CLASSES,
  GAP_CLASSES,
  MAX_WIDTH_CLASSES,
  GRID_COLUMN_CLASSES,
} from './layout-classes';

describe('layout-classes utilities', () => {
  describe('getAlignClass', () => {
    it('should return correct alignment class', () => {
      expect(getAlignClass('left')).toBe('text-left');
      expect(getAlignClass('center')).toBe('text-center');
      expect(getAlignClass('right')).toBe('text-right');
    });

    it('should return fallback when invalid alignment provided', () => {
      expect(getAlignClass('invalid' as any)).toBe('text-center');
      expect(getAlignClass('invalid' as any, 'left')).toBe('text-left');
    });
  });

  describe('getDescriptionAlignClass', () => {
    it('should return correct description alignment class', () => {
      expect(getDescriptionAlignClass('left')).toBe('text-left max-w-none');
      expect(getDescriptionAlignClass('center')).toBe(
        'text-center max-w-3xl mx-auto'
      );
      expect(getDescriptionAlignClass('right')).toBe(
        'text-right max-w-none ml-auto'
      );
    });

    it('should return fallback when invalid alignment provided', () => {
      expect(getDescriptionAlignClass('invalid' as any)).toBe(
        'text-center max-w-3xl mx-auto'
      );
    });
  });

  describe('getBackgroundClass', () => {
    it('should return correct background class', () => {
      expect(getBackgroundClass('white')).toBe('bg-white');
      expect(getBackgroundClass('neutral')).toBe('bg-neutral-50');
      expect(getBackgroundClass('primary')).toBe('bg-primary-50');
      expect(getBackgroundClass('transparent')).toBe('');
    });

    it('should return fallback when invalid background provided', () => {
      expect(getBackgroundClass('invalid' as any)).toBe('');
    });
  });

  describe('getPaddingClass', () => {
    it('should return correct padding class', () => {
      expect(getPaddingClass('none')).toBe('');
      expect(getPaddingClass('sm')).toBe('py-8');
      expect(getPaddingClass('md')).toBe('py-12');
      expect(getPaddingClass('lg')).toBe('py-20');
      expect(getPaddingClass('xl')).toBe('py-24');
    });

    it('should return fallback when invalid padding provided', () => {
      expect(getPaddingClass('invalid' as any)).toBe('py-20');
    });
  });

  describe('getGapClass', () => {
    it('should return correct gap class', () => {
      expect(getGapClass('xs')).toBe('gap-2');
      expect(getGapClass('sm')).toBe('gap-4');
      expect(getGapClass('md')).toBe('gap-6');
      expect(getGapClass('lg')).toBe('gap-8');
      expect(getGapClass('xl')).toBe('gap-12');
    });

    it('should return fallback when invalid gap provided', () => {
      expect(getGapClass('invalid' as any)).toBe('gap-8');
    });
  });

  describe('getMaxWidthClass', () => {
    it('should return correct max width class', () => {
      expect(getMaxWidthClass('none')).toBe('');
      expect(getMaxWidthClass('sm')).toBe('max-w-sm mx-auto');
      expect(getMaxWidthClass('md')).toBe('max-w-md mx-auto');
      expect(getMaxWidthClass('2xl')).toBe('max-w-2xl mx-auto');
    });

    it('should return fallback when invalid max width provided', () => {
      expect(getMaxWidthClass('invalid' as any)).toBe('');
    });
  });

  describe('getGridColumnClass', () => {
    it('should return correct grid column class', () => {
      expect(getGridColumnClass(1)).toBe('grid-cols-1');
      expect(getGridColumnClass(2)).toBe('grid-cols-1 md:grid-cols-2');
      expect(getGridColumnClass(3)).toBe(
        'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      );
      expect(getGridColumnClass(4)).toBe(
        'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
      );
    });

    it('should return fallback when invalid columns provided', () => {
      expect(getGridColumnClass(99 as any)).toBe(
        'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      );
    });
  });

  describe('constants', () => {
    it('should have all alignment classes defined', () => {
      expect(ALIGN_CLASSES).toEqual({
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
      });
    });

    it('should have all description alignment classes defined', () => {
      expect(DESCRIPTION_ALIGN_CLASSES).toEqual({
        left: 'text-left max-w-none',
        center: 'text-center max-w-3xl mx-auto',
        right: 'text-right max-w-none ml-auto',
      });
    });

    it('should have all background classes defined', () => {
      expect(BACKGROUND_CLASSES.white).toBe('bg-white');
      expect(BACKGROUND_CLASSES.transparent).toBe('');
      expect(BACKGROUND_CLASSES.primary).toBe('bg-primary-50');
    });

    it('should have all padding classes defined', () => {
      expect(PADDING_CLASSES.none).toBe('');
      expect(PADDING_CLASSES.lg).toBe('py-20');
    });

    it('should have all gap classes defined', () => {
      expect(GAP_CLASSES.xs).toBe('gap-2');
      expect(GAP_CLASSES.xl).toBe('gap-12');
    });

    it('should have all max width classes defined', () => {
      expect(MAX_WIDTH_CLASSES.none).toBe('');
      expect(MAX_WIDTH_CLASSES['2xl']).toBe('max-w-2xl mx-auto');
    });

    it('should have all grid column classes defined', () => {
      expect(GRID_COLUMN_CLASSES[1]).toBe('grid-cols-1');
      expect(GRID_COLUMN_CLASSES[6]).toBe(
        'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'
      );
    });
  });
});
