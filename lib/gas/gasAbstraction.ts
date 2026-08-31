import { apiClient } from '../api/client';

// Client-side entry point for gas abstraction. The actual sponsor-wallet
// signing happens server-side (GAS_SPONSOR_PRIVATE_KEY never ships to the app).
// This just requests a sponsored tx and gets back what will be deducted
// from the user's balance in-kind.

export interface GasSponsorQuote {
  network: string;
  nativeFeeEstimate: string;
  equivalentDeductionAsset: string;
  equivalentDeductionAmount: string;
}

export async function getGasSponsorQuote(params: {
  network: string;
  fromAddress: string;
  toAddress: string;
  amount: string;
  asset: string;
}): Promise<GasSponsorQuote> {
  const { data } = await apiClient.post<GasSponsorQuote>('/gas/quote', params);
  return data;
}

export interface SponsoredTxResult {
  txHash: string;
  status: 'submitted' | 'failed';
}

export async function submitSponsoredTransaction(params: {
  network: string;
  signedPayload: string;
}): Promise<SponsoredTxResult> {
  const { data } = await apiClient.post<SponsoredTxResult>('/gas/submit', params);
  return data;
}
