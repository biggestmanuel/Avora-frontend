import { EvmChainConfig, getEvmProvider, getEvmNativeBalance, isValidEvmAddress, estimateEvmGasFee } from './_evm';

export const baseConfig: EvmChainConfig = {
  id: 'base',
  label: 'Base',
  rpcUrl: process.env.EXPO_PUBLIC_RPC_BASE ?? '',
  chainId: 8453,
  nativeSymbol: 'ETH',
  decimals: 18,
};

export const getProvider = () => getEvmProvider(baseConfig);
export const getBalance = (address: string) => getEvmNativeBalance(baseConfig, address);
export const isValidAddress = isValidEvmAddress;
export const estimateGasFee = () => estimateEvmGasFee(baseConfig);
