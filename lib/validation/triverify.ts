import axios from 'axios';

const apiKey = process.env.EXPO_PUBLIC_TRIVERIFY_API_KEY ?? '';
const baseUrl = 'https://api.tribridge.tech/v1';

export type SupportedTriVerifyChain = 'ETH' | 'BTC' | 'SOL' | 'TRON' | 'SUI' | 'TON';

export interface AddressValidationResult {
  address: string;
  chain: SupportedTriVerifyChain;
  formatValid: boolean;
  exists: boolean | null; // null until existence-check rollout lands for this chain
}

const triVerifyClient = axios.create({
  baseURL: baseUrl,
  timeout: 8000,
  headers: { Authorization: `Bearer ${apiKey}` },
});

// Wraps TriVerify's format + (where available) on-chain existence validation.
// Falls back to format-only if the existence-check endpoint isn't live for a chain yet.
export async function validateExternalAddress(
  address: string,
  chain: SupportedTriVerifyChain
): Promise<AddressValidationResult> {
  const { data } = await triVerifyClient.post('/validate', { address, chain });
  return {
    address,
    chain,
    formatValid: data.formatValid,
    exists: data.exists ?? null,
  };
}
