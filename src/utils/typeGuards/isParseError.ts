import { ParseError } from '../../pipeline/parseResult/parseResult.types.js';
import { isObject } from './isObject.js';

export const isParseError = (
  maybeParseError: unknown
): maybeParseError is ParseError => {
  if (!isObject(maybeParseError)) return false;

  const hasMessageString =
    'message' in maybeParseError && typeof maybeParseError === 'string';
  const hasCodeStringOrNoCode =
    ('code' in maybeParseError && typeof maybeParseError === 'string') ||
    !('code' in maybeParseError);
  const hasContextObjectOrNoContext =
    ('context' in maybeParseError && isObject(maybeParseError.context)) ||
    !('context' in maybeParseError);

  return (
    hasMessageString && hasCodeStringOrNoCode && hasContextObjectOrNoContext
  );
};
