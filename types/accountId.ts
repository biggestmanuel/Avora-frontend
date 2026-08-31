export interface AccountIdProfile {
  accountId: string;
  displayName: string;
  photoUrl?: string;
  supportedChains: string[];
}

export interface AccountIdResolutionResult {
  found: boolean;
  profile?: AccountIdProfile;
}
