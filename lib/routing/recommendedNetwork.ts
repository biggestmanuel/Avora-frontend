import { ChainId } from '../chains';

export interface NetworkQuote {
  network: ChainId;
  label: string;
  estimatedFeeUsd: number;
  estimatedSeconds: number;
}

// Picks the cheapest/fastest network among the ones that support the
// requested asset, weighting fee over speed by default (matches the
// "Recommended Network" behavior in the V1 send flow).
export function pickRecommendedNetwork(
  quotes: NetworkQuote[],
  weight: { fee: number; speed: number } = { fee: 0.7, speed: 0.3 }
): NetworkQuote | null {
  if (quotes.length === 0) return null;

  const maxFee = Math.max(...quotes.map((q) => q.estimatedFeeUsd));
  const maxSeconds = Math.max(...quotes.map((q) => q.estimatedSeconds));

  let best = quotes[0];
  let bestScore = Infinity;

  for (const q of quotes) {
    const feeScore = maxFee === 0 ? 0 : q.estimatedFeeUsd / maxFee;
    const speedScore = maxSeconds === 0 ? 0 : q.estimatedSeconds / maxSeconds;
    const score = feeScore * weight.fee + speedScore * weight.speed;
    if (score < bestScore) {
      bestScore = score;
      best = q;
    }
  }

  return best;
}
