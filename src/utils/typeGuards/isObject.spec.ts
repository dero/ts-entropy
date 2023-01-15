import { isObject } from './isObject.js';

describe('entropy', () => {
  describe('isObject', () => {
    it('should return `true` for objects', () => {
      expect(isObject({})).toBe(true);
      expect(isObject({ a: 1 })).toBe(true);
      expect(isObject({ a: 1, b: 2 })).toBe(true);
    });

    it('should return `false` for non-objects', () => {
      expect(isObject(null)).toBe(false);
      expect(isObject(undefined)).toBe(false);
      expect(isObject(0)).toBe(false);
      expect(isObject(1)).toBe(false);
      expect(isObject('')).toBe(false);
      expect(isObject('a')).toBe(false);
      expect(isObject([])).toBe(false);
      expect(isObject([1])).toBe(false);
      expect(isObject([1, 2])).toBe(false);
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      expect(isObject(() => {})).toBe(false);
      expect(isObject(() => 1)).toBe(false);
      expect(isObject(() => 'a')).toBe(false);
      expect(isObject(() => [])).toBe(false);
      expect(isObject(() => [1])).toBe(false);
      expect(isObject(() => [1, 2])).toBe(false);
    });
  });
});
