import { getParseResultFromError } from './getParseResultFromError.js';
import { isParseResult } from '../../utils/typeGuards/isParseResult.js';
import type { ParseError, ParseResult } from './parseResult.types.js';

export function getParseResult<NewPD>(
  parseFunction: () => NewPD | ParseResult<NewPD, ParseError>
): ParseResult<NewPD, ParseError> {
  let parseResult: ParseResult<NewPD, ParseError>;

  try {
    const parsedData = parseFunction();

    if (isParseResult(parsedData)) {
      parseResult = parsedData;
    } else {
      parseResult = {
        success: true,
        data: parsedData,
      };
    }
  } catch (e) {
    parseResult = getParseResultFromError(e);
  }

  return parseResult;
}
