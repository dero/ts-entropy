import { isObject } from './typeGuards.js';
import { isParseError } from './typeGuards.js';
import { isParseResult } from './typeGuards.js';
import type { EntropyPipeline, ParseError, ParseResult } from './types.js';

function fromData<RD>(rawData: RD): EntropyPipeline<RD> {
  return createPipelineStep(rawData, {}, {});
}

function createPipelineStep<
  RD,
  L2P extends Record<string, unknown> = Record<string, never>,
  L2R extends Record<string, unknown> = Record<string, never>
>(
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
    let parseResult: ParseResult<NewPD, ParseError>;

    try {
      const parsedData = parser(rawData, labelToRendereds);

      if (isParseResult(parsedData)) {
        parseResult = parsedData;
      } else {
        parseResult = {
          success: true,
          data: parsedData,
        };
      }
    } catch (e) {
      if (isParseError(e)) {
        parseResult = {
          success: false,
          error: e,
        };
      } else if (typeof e === 'string') {
        parseResult = {
          success: false,
          error: {
            message: e,
          },
        };
      } else if (
        isObject(e) &&
        'message' in e &&
        typeof e.message === 'string'
      ) {
        parseResult = {
          success: false,
          error: {
            message: e.message,
            cause: e,
          },
        };
      } else {
        parseResult = {
          success: false,
          error: {
            message: 'Parse error',
            cause: e,
          },
        };
      }
    }

    const renderResult = parseResult.success
      ? renderer(parseResult.data)
      : fallbackRenderer
      ? fallbackRenderer(parseResult.error)
      : undefined;

    return createPipelineStep(
      rawData,
      { ...labelToParseds, [label]: parseResult },
      { ...labelToRendereds, [label]: renderResult }
    );
  }

  return {
    assign,
    render: function <RenderType>(
      renderer: (renderedData: L2R, parseds: L2P) => RenderType
    ) {
      return renderer(labelToRendereds, labelToParseds);
    },
  };
}

const userIdParser = (payload: unknown): ParseResult<number, ParseError> => {
  if (isObject(payload)) {
    if ('id' in payload && typeof payload.id === 'number' && payload.id > 0) {
      return {
        success: true,
        data: payload.id,
      };
    }
  }
  return {
    success: false,
    error: {
      message: 'No User Id',
    },
  };
};

const getUsername = (userId: number) => {
  if (userId === 1) return 'Dero';
  return 'Unknown';
};

const result = fromData({ id: 1 })
  .assign(
    'userAvatar',
    userIdParser,
    userId => `https://example.org/user.jpg?id=${userId}`,
    e => `<${e.message}>`
  )
  .assign('userId', userIdParser, userId => userId)
  .assign(
    'userName',
    data => {
      if (data.id === 1) throw new Error('Error: data.id = 1');
      return data.id;
    },
    userId => getUsername(userId),
    e => e.message
  )
  .render(
    ({ userAvatar, userName, userId }) =>
      `User ID: ${userId} -- User Avatar: ${userAvatar} -- User Name: ${userName}`
  );

const post = fromData({ id: 12, title: 'Test', description: 'Desc' })
  .assign(
    'title',
    r => ({ success: true, data: r.title }),
    title => `Title: ${title}`
  )
  .render(({ title }) => title);

console.log(result, post);
