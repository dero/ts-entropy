import { isParseError } from './isParseError.js';

describe('entropy', () => {
  describe('isParseError', () => {
    it('should return `true` for `ParseError` objects', () => {
      expect(isParseError({ message: 'Error' })).toBe(true);
      expect(isParseError({ message: 'Error', context: { a: 1 } })).toBe(true);
      expect(isParseError({ message: 'Error', code: '404' })).toBe(true);
      expect(
        isParseError({ message: 'Error', cause: new SyntaxError('Error') })
      ).toBe(true);
    });

    it('should return `false` for non-`ParseError` objects', () => {
      expect(isParseError({ message: 'Error', extraProperty: true })).toBe(
        false
      );
      expect(isParseError(404)).toBe(false);
    });
  });
});
