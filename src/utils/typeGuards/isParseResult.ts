import {
  ParseError,
  ParseResult,
} from '../../pipeline/parseResult/parseResult.types.js';
import { isObject } from './isObject.js';
import { isParseError } from './isParseError.js';

export const isParseResult = <PD, PE extends ParseError>(
  maybeParseResult: unknown
): maybeParseResult is ParseResult<PD, PE> => {
  if (!isObject(maybeParseResult)) return false;
  if (
    'success' in maybeParseResult &&
    typeof maybeParseResult.success === 'boolean'
  ) {
    return maybeParseResult.success === true
      ? 'data' in maybeParseResult
      : 'error' in maybeParseResult && isParseError(maybeParseResult.error);
  }
  return false;
};
