import * as eth from './eth';
import * as bsc from './bsc';
import * as base from './base';
import * as polygon from './polygon';
import * as sol from './sol';
import * as tron from './tron';
import * as ton from './ton';

export const chains = { eth, bsc, base, polygon, sol, tron, ton } as const;
export type ChainId = keyof typeof chains;
