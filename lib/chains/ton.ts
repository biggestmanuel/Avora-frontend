import { TonClient, Address, fromNano } from '@ton/ton';

const rpcUrl = process.env.EXPO_PUBLIC_RPC_TON ?? '';

export const tonConfig = {
  id: 'ton',
  label: 'TON',
  nativeSymbol: 'TON',
  decimals: 9,
};

let client: TonClient | null = null;
export function getClient(): TonClient {
  if (!client) client = new TonClient({ endpoint: rpcUrl });
  return client;
}

export async function getBalance(address: string): Promise<string> {
  const tonClient = getClient();
  const balance = await tonClient.getBalance(Address.parse(address));
  return fromNano(balance);
}

export function isValidAddress(address: string): boolean {
  try {
    Address.parse(address);
    return true;
  } catch {
    return false;
  }
}

export async function estimateGasFee(): Promise<string> {
  return '0.01'; // placeholder flat estimate for a standard wallet transfer
}
