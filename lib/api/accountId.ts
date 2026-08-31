import { apiClient } from './client';

export interface AccountIdProfile {
  accountId: string;
  name?: string;
  photoUri?: string;
  supportedWallets: string[];
}

// Resolve a 10-digit Account ID to its public profile.
// Returns null if no account exists with that ID (not an error state).
export async function resolveAccountId(accountId: string): Promise<AccountIdProfile | null> {
  try {
    const { data } = await apiClient.get<AccountIdProfile>(`/account-ids/${accountId}`);
    return data;
  } catch (err: any) {
    if (err?.status === 404) return null;
    throw err;
  }
}

export async function checkAccountIdAvailable(accountId: string): Promise<boolean> {
  const { data } = await apiClient.get<{ available: boolean }>(`/account-ids/${accountId}/available`);
  return data.available;
}

export async function claimAccountId(accountId: string): Promise<AccountIdProfile> {
  const { data } = await apiClient.post<AccountIdProfile>('/account-ids', { accountId });
  return data;
}

export async function updateAccountIdProfile(
  patch: Partial<Pick<AccountIdProfile, 'name' | 'photoUri'>>
): Promise<AccountIdProfile> {
  const { data } = await apiClient.patch<AccountIdProfile>('/account-ids/me', patch);
  return data;
}
