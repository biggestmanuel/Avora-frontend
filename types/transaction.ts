import type { ChainId } from './chain';

export type TransactionStatus = 'Processing' | 'Complete' | 'Failed';
export type TransactionDirection = 'send' | 'receive' | 'deposit' | 'withdraw';

export interface Transaction {
  id: string;
  direction: TransactionDirection;
  status: TransactionStatus;
  chain: ChainId;
  asset: string;
  amount: string;
  usdValue?: number;
  counterpartyAccountId?: string;
  counterpartyAddress?: string;
  networkFee?: string;
  txHash?: string;
  createdAt: string;
  completedAt?: string;
}

export interface TransactionPage {
  transactions: Transaction[];
  nextCursor?: string;
  hasMore: boolean;
}
