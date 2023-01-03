import type { ParseError, ParseResult } from './types.js';

export const isObject = (input: unknown): input is Record<string, unknown> => {
  return typeof input === 'object' && input !== null && !Array.isArray(input);
};

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
