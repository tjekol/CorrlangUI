'use client';

import { useEffect, useState } from 'react';
import { IMultiEdge } from '../interface/IMultiEdge';
import { useAtom } from 'jotai';
import { multiEdgeAtom } from '../GlobalValues';

export const useMultiEdges = () => {
  const [loading, setLoading] = useState(true);
  const [multiEdges, setMultiEdges] = useAtom(multiEdgeAtom);

  const handleAsync = async (fn: () => Promise<void>) => {
    setLoading(true);
    try {
      await fn();
    } catch (error) {
      console.error('Multi edge operation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMultiEdges = () => handleAsync(async () => {
    const res = await fetch('/api/multiEdges');
    if (!res.ok) {
      throw new Error('Failed to fetch multi edges');
    }
    const edgesData: IMultiEdge[] = await res.json();
    setMultiEdges(edgesData)
  })

  const createMultiEdge = (nodeIDs: number[]) => handleAsync(async () => {
    const res = await fetch('/api/multiEdges', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nodeIDs }),
    })

    if (!res.ok) {
      console.log('Failed to create multi edge:', res);
      return;
    }
    const edgeData: IMultiEdge = await res.json();
    console.log(`Added multi edge: ${edgeData.id} between nodes ${nodeIDs}`);
    setMultiEdges(prev => [...prev, edgeData]);
  })

  // const deleteMultiEdges = (id: number) => handleAsync(async () => {
  //   const res = await fetch('/api/edges', {
  //     method: 'DELETE',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ id }),
  //   })

  //   if (!res.ok) {
  //     throw new Error('Failed to delete edges');
  //   }
  //   console.log(`Removed edges with id: ${id}`);
  //   setMultiEdges(prev => prev.filter(edge => edge.id !== id));
  // })

  useEffect(() => { fetchMultiEdges() }, [])

  return { multiEdges, loading, createMultiEdge };
};
