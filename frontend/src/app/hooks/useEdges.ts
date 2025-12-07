'use client';

import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { edgeAtom } from '../GlobalValues';
import { IEdge } from '../interface/IEdge';

export const useEdges = () => {
  const [edges, setEdges] = useAtom(edgeAtom)
  const [loading, setLoading] = useState(true);

  const handleAsync = async (fn: () => Promise<void>) => {
    setLoading(true);
    try {
      await fn();
    } catch (error) {
      console.error('Edge operation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEdges = () => handleAsync(async () => {
    const res = await fetch('/api/edges');
    if (!res.ok) {
      throw new Error('Failed to fetch edges');
    }
    const edgesData: IEdge[] = await res.json();
    setEdges(edgesData);
  })

  useEffect(() => { fetchEdges(); }, []);

  return { edges, edgeLoading: loading }
}
