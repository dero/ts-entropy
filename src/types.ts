import type { ParseError } from './pipeline/parseResult/parseResult.types.js';

export type EntropyOptions = {
  onParseError?: (error: ParseError) => void;
  onRender?: (renderedData: unknown) => void;
  onSlotRender?: (renderedData: unknown) => void;
  onFallbackRender?: (renderedData: unknown, error: ParseError) => void;
  onFallbackMiss?: (error: ParseError) => void;
};
