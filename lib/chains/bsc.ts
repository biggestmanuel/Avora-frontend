import { EvmChainConfig, getEvmProvider, getEvmNativeBalance, isValidEvmAddress, estimateEvmGasFee } from './_evm';

export const bscConfig: EvmChainConfig = {
  id: 'bsc',
  label: 'BNB Smart Chain',
  rpcUrl: process.env.EXPO_PUBLIC_RPC_BSC ?? '',
  chainId: 56,
  nativeSymbol: 'BNB',
  decimals: 18,
};

export const getProvider = () => getEvmProvider(bscConfig);
export const getBalance = (address: string) => getEvmNativeBalance(bscConfig, address);
export const isValidAddress = isValidEvmAddress;
export const estimateGasFee = () => estimateEvmGasFee(bscConfig);
