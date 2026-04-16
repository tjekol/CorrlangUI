'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { ICorrespondence } from '../interface/ICorrespondence';

export const useCorres = () => {
  const [loading, setLoading] = useState(true);
  const [corres, setCorres] = useState<ICorrespondence[]>([]);
  const [error, setError] = useState<string | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleAsync = async (fn: () => Promise<void>) => {
    setLoading(true);
    setError(null);
    try {
      await fn();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred';
      setError(message);
      console.error('Correspondence operation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCorres = useCallback(() => {
    return handleAsync(async () => {
      const res = await fetch('/api/correspondence');
      if (!res.ok) {
        throw new Error('Failed to fetch correspondence connections.');
      }
      const corresData: ICorrespondence[] = await res.json();
      setCorres(corresData)
    })
  }, []);

  useEffect(() => {
    fetchCorres();
  }, [fetchCorres]);

  useEffect(() => {
    if (error) {
      retryTimeoutRef.current = setTimeout(() => {
        console.log('Auto-retrying correspondence fetch...');
        fetchCorres();
      }, 1 * 60 * 1000);
    }

    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [error, fetchCorres]);

  return { corres, loading, error, retry: fetchCorres };
};
