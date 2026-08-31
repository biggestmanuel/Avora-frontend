import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

const rpcUrl = process.env.EXPO_PUBLIC_RPC_SOL ?? '';

export const solConfig = {
  id: 'sol',
  label: 'Solana',
  nativeSymbol: 'SOL',
  decimals: 9,
};

let connection: Connection | null = null;
export function getConnection(): Connection {
  if (!connection) connection = new Connection(rpcUrl, 'confirmed');
  return connection;
}

export async function getBalance(address: string): Promise<string> {
  const conn = getConnection();
  const pubkey = new PublicKey(address);
  const lamports = await conn.getBalance(pubkey);
  return (lamports / LAMPORTS_PER_SOL).toString();
}

export function isValidAddress(address: string): boolean {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
}

export async function estimateGasFee(): Promise<string> {
  const conn = getConnection();
  const { feeCalculator } = await conn.getRecentBlockhash();
  const lamports = feeCalculator.lamportsPerSignature;
  return (lamports / LAMPORTS_PER_SOL).toString();
}
