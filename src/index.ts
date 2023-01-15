import { createEntropyPipeline } from './pipeline/pipeline.js';
import type { EntropyPipeline } from './pipeline/pipeline.types.js';
import type { EntropyOptions } from './types.js';

export function createEntropy(opts: EntropyOptions = {}) {
  return function entropy<RD>(rawData: RD): EntropyPipeline<RD> {
    return createEntropyPipeline(opts, rawData, {}, {});
  };
}
