import { isObject } from '../../utils/typeGuards/isObject.js';
import { isParseError } from '../../utils/typeGuards/isParseError.js';
import { ParseError, ParseResult } from './parseResult.types.js';

export function getParseResultFromError(
  e: unknown
): ParseResult<never, ParseError> {
  if (isParseError(e)) {
    return {
      success: false,
      error: e,
    };
  } else if (typeof e === 'string') {
    return {
      success: false,
      error: {
        message: e,
      },
    };
  } else if (isObject(e) && 'message' in e && typeof e.message === 'string') {
    return {
      success: false,
      error: {
        message: e.message,
        cause: e,
      },
    };
  } else {
    return {
      success: false,
      error: {
        message: 'Parse error',
        cause: e,
      },
    };
  }
}
