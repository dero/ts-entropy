export type ParseError = {
  message: string;
  name?: string;
  cause?: unknown;
  context?: Record<string, unknown>;
};

export type ParseResult<PD, PE> =
  | {
      success: true;
      data: PD;
    }
  | {
      success: false;
      error: PE;
    };

export type EntropyPipeline<
  RD,
  L2P extends Record<string, unknown> = Record<string, never>,
  L2R extends Record<string, unknown> = Record<string, never>
> = {
  assign: (<NewL extends string, NewR, NewFR, NewPD>(
    label: NewL,
    parser: (
      rawData: RD,
      renderedDataSoFar: L2R
    ) => NewPD | ParseResult<NewPD, ParseError>,
    renderer: (parsedData: NewPD) => NewR,
    fallbackRenderer: (parseError: ParseError) => NewFR
  ) => EntropyPipeline<
    RD,
    L2P & { [key in NewL]: ParseResult<NewPD, ParseError> },
    L2R & { [key in NewL]: NewR | NewFR }
  >) &
    (<NewL extends string, NewR, NewPD>(
      label: NewL,
      parser: (
        rawData: RD,
        renderedDataSoFar: L2R
      ) => NewPD | ParseResult<NewPD, ParseError>,
      renderer: (parsedData: NewPD) => NewR
    ) => EntropyPipeline<
      RD,
      L2P & { [key in NewL]: ParseResult<NewPD, ParseError> },
      L2R & { [key in NewL]: NewR | undefined }
    >);

  render: <RenderType>(renderer: (renderData: L2R) => RenderType) => RenderType;
};
