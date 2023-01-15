import { isParseResult } from './isParseResult.js';

describe('entropy', () => {
  describe('isParseResult', () => {
    it('should return `true` for `ParseResult` objects', () => {
      expect(isParseResult({ success: true, data: { a: 1 } })).toBe(true);
      expect(
        isParseResult({ success: false, error: { message: 'Error' } })
      ).toBe(true);
    });

    it('should return `false` for non-`ParseResult` objects', () => {
      expect(
        isParseResult({ success: true, data: { a: 1 }, extraProperty: true })
      ).toBe(false);
      expect(isParseResult('string')).toBe(false);
    });

    it('should return `false` when `success` is not defined', () => {
      expect(isParseResult({ data: { a: 1 } })).toBe(false);
    });
  });
});
