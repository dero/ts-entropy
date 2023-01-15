import type { ParseError } from '../../pipeline/parseResult/parseResult.types.js';
import { isObject } from './isObject.js';

export const isParseError = (
  maybeParseError: unknown
): maybeParseError is ParseError => {
  if (!isObject(maybeParseError)) return false;

  const ownPropertyNames = Object.getOwnPropertyNames(maybeParseError);
  const allowedPropertyNames = ['message', 'code', 'context', 'cause'];

  const hasMessageString =
    'message' in maybeParseError && typeof maybeParseError.message === 'string';
  const hasCodeStringOrNoCode =
    ('code' in maybeParseError && typeof maybeParseError.code === 'string') ||
    !('code' in maybeParseError);
  const hasContextObjectOrNoContext =
    ('context' in maybeParseError && isObject(maybeParseError.context)) ||
    !('context' in maybeParseError);
  const hasOnlyAllowedProperties = ownPropertyNames.every(propertyName =>
    allowedPropertyNames.includes(propertyName)
  );

  return (
    hasMessageString &&
    hasCodeStringOrNoCode &&
    hasContextObjectOrNoContext &&
    hasOnlyAllowedProperties
  );
};
