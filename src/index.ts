import { createEntropyPipeline } from './pipeline/pipeline.js';
import { EntropyPipeline } from './pipeline/pipeline.types.js';
import { EntropyOptions } from './types.js';

function entropy<RD>(opts: EntropyOptions, rawData: RD): EntropyPipeline<RD> {
  return createEntropyPipeline(opts, rawData, {}, {});
}

export function createEntropy(opts: EntropyOptions = {}) {
  return entropy.bind(null, opts);
}
