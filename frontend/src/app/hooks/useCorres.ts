'use client';

import { useEffect, useState } from 'react';

interface Correspondence {
  id: number,
  title: string,
}

export const useCorres = () => {
  const [loading, setLoading] = useState(true);
  const [corres, setCorres] = useState<Correspondence[]>([]);

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
    const corresData: Correspondence[] = await res.json();
    setCorres(corresData)
  })

  useEffect(() => { fetchCorres() }, [])

  return { corres, loading };
};
