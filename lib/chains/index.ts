export type ChainId = 'eth' | 'bsc' | 'base' | 'polygon' | 'sol' | 'tron' | 'ton';

const loaders = {
  eth: () => import('./eth'),
  bsc: () => import('./bsc'),
  base: () => import('./base'),
  polygon: () => import('./polygon'),
  sol: () => import('./sol'),
  tron: () => import('./tron'),
  ton: () => import('./ton'),
} as const;

type ChainModuleMap = { [K in ChainId]: Awaited<ReturnType<(typeof loaders)[K]>> };

const cache: Partial<ChainModuleMap> = {};

export async function getChainModule<K extends ChainId>(
  chain: K
): Promise<ChainModuleMap[K]> {
  if (cache[chain]) return cache[chain] as ChainModuleMap[K];
  const mod = await loaders[chain]();
  cache[chain] = mod as ChainModuleMap[K];
  return mod as ChainModuleMap[K];
}

export function isChainLoaded(chain: ChainId): boolean {
  return chain in cache;
}