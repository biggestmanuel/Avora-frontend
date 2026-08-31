import { ethers } from 'ethers';

// Shared helper for all EVM chains (ETH, BSC, Base, Polygon).
// Each chain file below just supplies its own RPC URL + chain metadata.

export interface EvmChainConfig {
  id: string;
  label: string;
  rpcUrl: string;
  chainId: number;
  nativeSymbol: string;
  decimals: number;
}

export function getEvmProvider(config: EvmChainConfig): ethers.JsonRpcProvider {
  return new ethers.JsonRpcProvider(config.rpcUrl, config.chainId);
}

export async function getEvmNativeBalance(
  config: EvmChainConfig,
  address: string
): Promise<string> {
  const provider = getEvmProvider(config);
  const balanceWei = await provider.getBalance(address);
  return ethers.formatUnits(balanceWei, config.decimals);
}

export function isValidEvmAddress(address: string): boolean {
  return ethers.isAddress(address);
}

export async function estimateEvmGasFee(config: EvmChainConfig): Promise<string> {
  const provider = getEvmProvider(config);
  const feeData = await provider.getFeeData();
  const gasPrice = feeData.gasPrice ?? 0n;
  const estimatedGasLimit = 21000n; // native transfer baseline
  return ethers.formatUnits(gasPrice * estimatedGasLimit, config.decimals);
}
