import { apiClient } from './client';

export type TransactionDirection = 'sent' | 'received';
export type TransactionStatus = 'processing' | 'complete' | 'failed';

export interface Transaction {
  id: string;
  direction: TransactionDirection;
  status: TransactionStatus;
  amount: string;
  symbol: string;
  network: string;
  counterpartyAccountId: string;
  fee: string;
  txHash: string | null;
  createdAt: string;
}

export interface SendPayload {
  recipientAccountId: string;
  amount: string;
  symbol: string;
  network: string;
}

export interface SendResult {
  transaction: Transaction;
}

export async function sendPayment(payload: SendPayload): Promise<SendResult> {
  const { data } = await apiClient.post<SendResult>('/transactions/send', payload);
  return data;
}

export async function fetchTransactions(params?: { cursor?: string; limit?: number }) {
  const { data } = await apiClient.get<{ items: Transaction[]; nextCursor: string | null }>(
    '/transactions',
    { params }
  );
  return data;
}

export async function fetchTransactionById(id: string): Promise<Transaction> {
  const { data } = await apiClient.get<Transaction>(`/transactions/${id}`);
  return data;
}

export interface PaymentRequestPayload {
  amount?: string;
  symbol?: string;
  note?: string;
}

export interface PaymentRequestResult {
  requestId: string;
  link: string;
}

export async function createPaymentRequest(
  payload: PaymentRequestPayload
): Promise<PaymentRequestResult> {
  const { data } = await apiClient.post<PaymentRequestResult>('/payment-requests', payload);
  return data;
}
