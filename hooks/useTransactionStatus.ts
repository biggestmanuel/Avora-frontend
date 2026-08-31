import { useEffect, useRef, useState } from 'react';
import { useTxStore } from '@/stores/txStore';
import { getTransactionById } from '@/lib/api/transactions';

// Assumes txStore exposes: transactions, upsertTransaction(tx)
// Polls the API while a tx is in a non-final state (Processing)

type TxStatus = 'Processing' | 'Complete' | 'Failed';

const POLL_INTERVAL_MS = 4000;

export function useTransactionStatus(txId: string) {
  const cached = useTxStore((s) => s.transactions.find((t) => t.id === txId));
  const upsertTransaction = useTxStore((s) => s.upsertTransaction);

  const [status, setStatus] = useState<TxStatus | undefined>(cached?.status);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!txId) return;

    const poll = async () => {
      try {
        const tx = await getTransactionById(txId);
        upsertTransaction(tx);
        setStatus(tx.status);
        if (tx.status !== 'Processing' && intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      } catch {
        // keep last known status on transient failure
      }
    };

    poll();

    if (cached?.status !== 'Complete' && cached?.status !== 'Failed') {
      intervalRef.current = setInterval(poll, POLL_INTERVAL_MS);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [txId]);

  return {
    transaction: cached,
    status,
    isPending: status === 'Processing',
  };
}
