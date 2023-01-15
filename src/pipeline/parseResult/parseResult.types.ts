export type ParseError = {
  message: string;
  code?: string;
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
