'use client';

import { useEffect, useState } from 'react';
import { IMultiEdge } from '../interface/Connection/IMultiEdge';
import { useAtom } from 'jotai';
import { multiEdgeAtom } from '../GlobalValues';

export const useMultiCon = () => {
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
    const res = await fetch('/api/multi-con');
    if (!res.ok) {
      throw new Error('Failed to fetch multi edges');
    }
    const edgesData: IMultiEdge[] = await res.json();
    setMultiEdges(edgesData)
  })

  const createMultiEdge = (nodeIDs: number[]) => handleAsync(async () => {
    const res = await fetch('/api/multi-con', {
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

  const updateMultiCon = (nodeID: number) => handleAsync(async () => {
    const res = await fetch('/api/multi-con', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nodeID }),
    })

    if (!res.ok) {
      console.log('Failed to create multi edge:', res);
      return;
    }

    const edgeData: IMultiEdge = await res.json();
    console.log(`Updated multi connection ${edgeData.id} with nodes: ${multiEdges.find(c => c.id === edgeData.id)} ${nodeID}`);
    setMultiEdges(prev => [...prev, edgeData]);
  })

  const deleteMultiCon = (id: number) => handleAsync(async () => {
    const res = await fetch('/api/multi-con', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })

    if (!res.ok) {
      throw new Error('Failed to delete edges');
    }
    console.log(`Removed edges with id: ${id}`);
    setMultiEdges(prev => prev.filter(edge => edge.id !== id));
  })

  useEffect(() => { fetchMultiEdges() }, [])

  return { multiEdges, loading, createMultiEdge, updateMultiCon, deleteMultiCon };
};
