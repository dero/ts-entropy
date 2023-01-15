import type {
  ParseError,
  ParseResult,
} from '../../pipeline/parseResult/parseResult.types.js';
import { isObject } from './isObject.js';
import { isParseError } from './isParseError.js';

export const isParseResult = <PD, PE extends ParseError>(
  maybeParseResult: unknown
): maybeParseResult is ParseResult<PD, PE> => {
  if (!isObject(maybeParseResult)) return false;

  const ownPropertyNames = Object.getOwnPropertyNames(maybeParseResult);
  const allowedPropertyNames = ['success', 'data', 'error'];

  /**
   * If there are properties other than 'success', 'data', and 'error', return false.
   */
  if (
    !ownPropertyNames.every(propertyName =>
      allowedPropertyNames.includes(propertyName)
    )
  )
    return false;

  /**
   * If 'success' is true, return true if 'data' is present and false otherwise.
   * If 'success' is false, return true if 'error' is present and false otherwise.
   */
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
