import { EvmChainConfig, getEvmProvider, getEvmNativeBalance, isValidEvmAddress, estimateEvmGasFee } from './_evm';

export const ethConfig: EvmChainConfig = {
  id: 'eth',
  label: 'Ethereum',
  rpcUrl: process.env.EXPO_PUBLIC_RPC_ETH ?? '',
  chainId: 1,
  nativeSymbol: 'ETH',
  decimals: 18,
};

export const getProvider = () => getEvmProvider(ethConfig);
export const getBalance = (address: string) => getEvmNativeBalance(ethConfig, address);
export const isValidAddress = isValidEvmAddress;
export const estimateGasFee = () => estimateEvmGasFee(ethConfig);
