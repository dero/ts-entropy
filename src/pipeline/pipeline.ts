import type { EntropyOptions } from '../types.js';
import { getParseResult } from './parseResult/getParseResult.js';
import type {
  ParseError,
  ParseResult,
} from './parseResult/parseResult.types.js';
import type { EntropyPipeline } from './pipeline.types.js';

export function createEntropyPipeline<
  RD,
  L2P extends Record<string, unknown> = Record<string, never>,
  L2R extends Record<string, unknown> = Record<string, never>
>(
  opts: EntropyOptions,
  rawData: RD,
  labelToParseds: L2P,
  labelToRendereds: L2R
): EntropyPipeline<RD, L2P, L2R> {
  function assign<NewL extends string, NewR, NewPD, NewFR>(
    label: NewL,
    parser: (
      rawData: RD,
      renderedDataSoFar: L2R
    ) => NewPD | ParseResult<NewPD, ParseError>,
    renderer: (parsedData: NewPD) => NewR,
    fallbackRenderer: (parseError: ParseError) => NewFR
  ): EntropyPipeline<
    RD,
    L2P & { [key in NewL]: ParseResult<NewPD, ParseError> },
    L2R & { [key in NewL]: NewR | NewFR }
  >;
  function assign<NewL extends string, NewR, NewPD>(
    label: NewL,
    parser: (
      rawData: RD,
      renderedDataSoFar: L2R
    ) => NewPD | ParseResult<NewPD, ParseError>,
    renderer: (parsedData: NewPD) => NewR
  ): EntropyPipeline<
    RD,
    L2P & { [key in NewL]: ParseResult<NewPD, ParseError> },
    L2R & { [key in NewL]: NewR | undefined }
  >;
  function assign<NewL extends string, NewR, NewPD, NewFR>(
    label: NewL,
    parser: (
      rawData: RD,
      renderedDataSoFar: L2R
    ) => NewPD | ParseResult<NewPD, ParseError>,
    renderer: (parsedData: NewPD) => NewR,
    fallbackRenderer?: (parseError: ParseError) => NewFR
  ) {
    const parseResult = getParseResult(() => parser(rawData, labelToRendereds));

    let renderResult;

    if (parseResult.success) {
      renderResult = renderer(parseResult.data);
      opts.onRender?.(renderResult);
    } else {
      if (fallbackRenderer) {
        renderResult = fallbackRenderer(parseResult.error);
        opts.onFallbackRender?.(renderResult, parseResult.error);
      } else {
        opts.onFallbackMiss?.(parseResult.error);
      }
      opts.onParseError?.(parseResult.error);
    }

    return createEntropyPipeline(
      opts,
      rawData,
      { ...labelToParseds, [label]: parseResult },
      { ...labelToRendereds, [label]: renderResult }
    );
  }

  function render(): L2R;
  function render<RenderType>(
    renderer: (renderedData: L2R, parseds: L2P) => RenderType
  ): RenderType;
  function render<RenderType>(
    renderer?: (renderedData: L2R, parseds: L2P) => RenderType
  ): RenderType | L2R {
    return renderer
      ? renderer(labelToRendereds, labelToParseds)
      : labelToRendereds;
  }

  return {
    assign,
    render,
  };
}
