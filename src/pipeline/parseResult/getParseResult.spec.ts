import { getParseResult } from './getParseResult.js';

describe('entropy', () => {
  describe('getParseResult', () => {
    it('should pass through valid `ParseResult` objects', () => {
      expect(
        getParseResult(() => ({
          success: true,
          data: { message: 'Data' },
        }))
      ).toStrictEqual({
        success: true,
        data: { message: 'Data' },
      });
    });

    it('should convert valid data to `ParseResult` objects', () => {
      expect(getParseResult(() => ({ message: 'Data' }))).toStrictEqual({
        success: true,
        data: { message: 'Data' },
      });
    });

    it('should convert thrown `ParseError` objects to `ParseResult` objects', () => {
      expect(
        getParseResult(() => {
          throw { message: 'Error' };
        })
      ).toStrictEqual({
        success: false,
        error: { message: 'Error' },
      });
    });

    it('should convert thrown strings to `ParseError` objects', () => {
      expect(
        getParseResult(() => {
          throw 'Error String';
        })
      ).toStrictEqual({
        success: false,
        error: { message: 'Error String' },
      });
    });
  });
});
