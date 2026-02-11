'use client';

import { useEffect, useState } from 'react';
import { ICorrespondence } from '../interface/ICorrespondence';

export const useCorres = () => {
  const [loading, setLoading] = useState(true);
  const [corres, setCorres] = useState<ICorrespondence[]>([]);

  const handleAsync = async (fn: () => Promise<void>) => {
    setLoading(true);
    try {
      await fn();
    } catch (error) {
      console.error('Correspondence operation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCorres = () => handleAsync(async () => {
    const res = await fetch('/api/correspondence');
    if (!res.ok) {
      throw new Error('Failed to fetch correspondence connections.');
    }
    const corresData: ICorrespondence[] = await res.json();
    setCorres(corresData)
  })

  useEffect(() => { fetchCorres() }, [])

  return { corres, loading };
};
