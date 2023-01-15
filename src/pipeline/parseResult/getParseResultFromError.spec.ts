import { getParseResultFromError } from './getParseResultFromError.js';

describe('entropy', () => {
  describe('getParseResultFromError', () => {
    it('should pass through valid `ParseError` objects', () => {
      expect(getParseResultFromError({ message: 'Error' })).toStrictEqual({
        success: false,
        error: { message: 'Error' },
      });
    });

    it('should convert strings to `ParseError` objects', () => {
      expect(getParseResultFromError('Error')).toStrictEqual({
        success: false,
        error: { message: 'Error' },
      });
    });

    it('should convert objects with a `message` property to `ParseError` objects', () => {
      expect(
        getParseResultFromError({ message: 'Error', irrelevantProperty: true })
      ).toStrictEqual({
        success: false,
        error: {
          message: 'Error',
          cause: { message: 'Error', irrelevantProperty: true },
        },
      });
    });

    it('should convert all other values to `ParseError` objects', () => {
      expect(getParseResultFromError(404)).toStrictEqual({
        success: false,
        error: {
          message: 'Parse error',
          cause: 404,
        },
      });
    });
  });
});
