import axios from 'axios';

// Bachs is scoped narrowly here to NGN fiat deposits/withdrawals only —
// none of its subscription/billing features are used.

const apiKey = process.env.EXPO_PUBLIC_BACHS_API_KEY ?? '';
const env = process.env.EXPO_PUBLIC_BACHS_ENV ?? 'sandbox';
const baseUrl = env === 'production' ? 'https://api.bachs.io/v1' : 'https://sandbox.bachs.io/v1';

const bachsClient = axios.create({
  baseURL: baseUrl,
  timeout: 15000,
  headers: { Authorization: `Bearer ${apiKey}` },
});

export interface NgnDepositRequest {
  amountNgn: string;
  accountId: string;
}

export interface NgnDepositResult {
  reference: string;
  virtualAccountNumber: string;
  bankName: string;
  expiresAt: string;
}

export async function initiateNgnDeposit(payload: NgnDepositRequest): Promise<NgnDepositResult> {
  const { data } = await bachsClient.post('/deposits/ngn', payload);
  return data;
}

export interface NgnWithdrawalRequest {
  amountNgn: string;
  accountId: string;
  bankCode: string;
  accountNumber: string;
}

export interface NgnWithdrawalResult {
  reference: string;
  status: 'pending' | 'processing' | 'complete' | 'failed';
}

export async function initiateNgnWithdrawal(
  payload: NgnWithdrawalRequest
): Promise<NgnWithdrawalResult> {
  const { data } = await bachsClient.post('/withdrawals/ngn', payload);
  return data;
}

export async function getNgnTransactionStatus(reference: string) {
  const { data } = await bachsClient.get(`/transactions/${reference}`);
  return data;
}
